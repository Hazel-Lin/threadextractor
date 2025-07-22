import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

export async function GET(request: NextRequest) {
  console.log('🎬 收到 Puppeteer 视频下载请求')
  
  try {
    const { searchParams } = new URL(request.url)
    const threadUrl = searchParams.get('threadUrl')
    const videoUrl = searchParams.get('videoUrl')

    if (!threadUrl && !videoUrl) {
      return NextResponse.json(
        { error: 'threadUrl or videoUrl parameter is required' },
        { status: 400 }
      )
    }

    console.log('🎯 下载参数:', { threadUrl: threadUrl?.substring(0, 50), videoUrl: videoUrl?.substring(0, 50) })

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    })

    try {
      const page = await browser.newPage()
      
      // 设置用户代理
      await page.setUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      )

      let finalVideoUrl = videoUrl

      // 如果没有直接视频URL，需要先访问Threads页面提取
      if (!videoUrl && threadUrl) {
        console.log('🌐 访问 Threads 页面提取视频URL...')
        await page.goto(threadUrl, { waitUntil: 'networkidle2', timeout: 30000 })
        await new Promise(resolve => setTimeout(resolve, 5000))

        // 提取视频URL
        finalVideoUrl = await page.evaluate(() => {
          const patterns = [
            /"video_url":"(https:[^"]*\.mp4[^"]*)"/,
            /"playback_url":"(https:[^"]*\.mp4[^"]*)"/,
            /"src":"(https:[^"]*\.mp4[^"]*)"/
          ]
          
          const html = document.documentElement.outerHTML
          for (const pattern of patterns) {
            const match = html.match(pattern)
            if (match) {
              return match[1].replace(/\\\//g, '/').replace(/\\u0026/g, '&')
            }
          }
          
          // 尝试从video元素获取
          const videoElements = document.querySelectorAll('video')
          for (const video of videoElements) {
            const src = video.src || video.getAttribute('src')
            if (src && src.includes('.mp4')) {
              return src
            }
          }
          
          return null
        })

        if (!finalVideoUrl) {
          throw new Error('Video URL not found on the page')
        }
        
        console.log('✅ 提取到视频URL:', finalVideoUrl.substring(0, 100) + '...')
      }

      if (!finalVideoUrl) {
        throw new Error('No valid video URL found')
      }

      // 清理URL
      finalVideoUrl = finalVideoUrl
        .replace(/\\u0026/g, '&')
        .replace(/\\\//g, '/')
        .replace(/\\/g, '')

      console.log('🎥 开始使用 Puppeteer 拦截网络请求下载视频...')

      // 方案1: 使用 Puppeteer 网络拦截下载（最可靠）
      let videoBuffer: Buffer | null = null
      let responseHeaders: Record<string, string> = {}

      // 启用请求拦截
      await page.setRequestInterception(true)
      
      // 拦截视频请求
      page.on('response', async (response) => {
        const url = response.url()
        if (url.includes(finalVideoUrl) || (url.includes('cdninstagram.com') && url.includes('.mp4'))) {
          console.log('🎯 拦截到视频响应:', url.substring(0, 80) + '...')
          console.log('📊 响应状态:', response.status())
          
          if (response.ok()) {
            try {
              const buffer = await response.buffer()
              const headers = response.headers()
              
              videoBuffer = buffer
              responseHeaders = {
                'content-type': headers['content-type'] || 'video/mp4',
                'content-length': headers['content-length'] || buffer.length.toString()
              }
              
              console.log('✅ 视频数据拦截成功:', {
                size: `${(buffer.length / 1024 / 1024).toFixed(2)}MB`,
                contentType: headers['content-type']
              })
            } catch (bufferError) {
              console.error('❌ 获取响应数据失败:', bufferError)
            }
          }
        }
      })

      // 处理请求拦截
      page.on('request', (request) => {
        // 允许所有请求继续
        request.continue()
      })

      // 导航到视频URL触发下载
      try {
        console.log('🌐 导航到视频URL触发网络请求...')
        await page.goto(finalVideoUrl, { 
          waitUntil: 'networkidle0', 
          timeout: 30000 
        })
        
        // 等待一段时间确保视频加载
        await new Promise(resolve => setTimeout(resolve, 3000))
        
      } catch {
        console.log('⚠️ 直接导航失败，尝试在页面中触发请求...')
        
        // 方案2: 在页面上下文中使用XMLHttpRequest
        try {
          interface DownloadResult {
            data: number[]
            contentType: string
            size: number
          }
          
          const downloadResult = await page.evaluate(async (url): Promise<DownloadResult> => {
            return new Promise((resolve, reject) => {
              const xhr = new XMLHttpRequest()
              xhr.open('GET', url, true)
              xhr.responseType = 'arraybuffer'
              
              xhr.onload = function() {
                if (xhr.status === 200) {
                  const arrayBuffer = xhr.response
                  const contentType = xhr.getResponseHeader('content-type') || 'video/mp4'
                  resolve({
                    data: Array.from(new Uint8Array(arrayBuffer)),
                    contentType: contentType,
                    size: arrayBuffer.byteLength
                  })
                } else {
                  reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`))
                }
              }
              
              xhr.onerror = function() {
                reject(new Error('Network error'))
              }
              
              xhr.send()
            })
          }, finalVideoUrl)

          if (downloadResult && downloadResult.data) {
            videoBuffer = Buffer.from(downloadResult.data)
            responseHeaders = {
              'content-type': downloadResult.contentType,
              'content-length': downloadResult.size.toString()
            }
            console.log('✅ XMLHttpRequest 下载成功:', {
              size: `${(downloadResult.size / 1024 / 1024).toFixed(2)}MB`,
              contentType: downloadResult.contentType
            })
          }
        } catch (xhrError) {
          console.error('❌ XMLHttpRequest 下载也失败:', xhrError)
        }
      }

      if (!videoBuffer) {
        throw new Error('无法通过任何方式下载视频数据')
      }

      console.log('✅ 视频下载成功:', {
        size: `${(videoBuffer.length / 1024 / 1024).toFixed(2)}MB`,
        contentType: responseHeaders['content-type']
      })

      // 生成文件名
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
      const filename = `threads_video_${timestamp}.mp4`

      // 设置响应头
      const finalResponseHeaders: Record<string, string> = {
        'Content-Type': responseHeaders['content-type'] || 'video/mp4',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': videoBuffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      }

      console.log('✅ 开始流式传输视频数据')
      
      return new NextResponse(videoBuffer, {
        status: 200,
        headers: finalResponseHeaders
      })

    } finally {
      await browser.close()
      console.log('🔒 浏览器已关闭')
    }

  } catch (error) {
    console.error('❌ Puppeteer下载失败:', error)
    
    // 错误情况下的降级处理
    const { searchParams } = new URL(request.url)
    const fallbackVideoUrl = searchParams.get('videoUrl')
    
    if (fallbackVideoUrl) {
      console.log('🔄 使用降级重定向')
      const cleanUrl = decodeURIComponent(fallbackVideoUrl)
        .replace(/\\u0026/g, '&')
        .replace(/\\\//g, '/')
        .replace(/\\/g, '')
      
      return NextResponse.redirect(cleanUrl, 302)
    }
    
    return NextResponse.json(
      { 
        error: 'Download failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
