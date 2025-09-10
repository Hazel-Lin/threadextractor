import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
import chromium from '@sparticuz/chromium'

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

    // 检测是否为 Vercel 环境
    const isProduction = process.env.NODE_ENV === 'production'
    
    // Puppeteer 配置 - 与 extractor.ts 保持一致
    const getPuppeteerConfig = async () => {
      if (isProduction) {
        // Vercel 环境配置
        return {
          executablePath: await chromium.executablePath(),
          args: [
            ...chromium.args,
            '--hide-scrollbars',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
          ],
          defaultViewport: {
            width: 1920,
            height: 1080
          },
          headless: true,
        }
      } else {
        // 本地开发环境配置
        return {
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--no-first-run',
            '--single-process'
          ],
          defaultViewport: {
            width: 1920,
            height: 1080
          }
        }
      }
    }

    const config = await getPuppeteerConfig()
    const browser = await puppeteer.launch(config)

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

      console.log('🎥 开始智能下载策略...')

      // 优化下载策略：避免签名验证问题
      let videoBuffer: Buffer | null = null
      let responseHeaders: Record<string, string> = {}

      // 方案1: 首先尝试直接在页面上下文中下载（避免跨域和签名问题）
      try {
        console.log('🚀 尝试页面内下载策略...')
        
        interface DownloadResult {
          success: boolean
          data?: number[]
          contentType?: string
          size?: number
          error?: string
        }
        
        const downloadResult = await page.evaluate(async (url): Promise<DownloadResult> => {
          try {
            console.log('🎯 在页面内发送请求:', url.substring(0, 80))
            
            const response = await fetch(url, {
              method: 'GET',
              headers: {
                'Accept': 'video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Sec-Fetch-Dest': 'video',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'cross-site'
              }
            })
            
            if (response.ok) {
              const arrayBuffer = await response.arrayBuffer()
              const contentType = response.headers.get('content-type') || 'video/mp4'
              
              return {
                success: true,
                data: Array.from(new Uint8Array(arrayBuffer)),
                contentType: contentType,
                size: arrayBuffer.byteLength
              }
            } else {
              return {
                success: false,
                error: `HTTP ${response.status}: ${response.statusText}`
              }
            }
          } catch (error) {
            return {
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error'
            }
          }
        }, finalVideoUrl)

        if (downloadResult.success && downloadResult.data) {
          videoBuffer = Buffer.from(downloadResult.data)
          responseHeaders = {
            'content-type': downloadResult.contentType || 'video/mp4',
            'content-length': downloadResult.size?.toString() || videoBuffer.length.toString()
          }
          console.log('✅ 页面内下载成功:', {
            size: `${(videoBuffer.length / 1024 / 1024).toFixed(2)}MB`,
            contentType: downloadResult.contentType
          })
        } else {
          console.log('⚠️ 页面内下载失败:', downloadResult.error)
          throw new Error(downloadResult.error || 'Page download failed')
        }
        
      } catch (pageDownloadError) {
        console.log('⚠️ 页面内下载失败，尝试网络拦截方案...', pageDownloadError)
        
        // 方案2: 使用 Puppeteer 网络拦截下载（备用方案）
        try {
          // 启用请求拦截
          await page.setRequestInterception(true)
          
          // 拦截视频请求
          page.on('response', async (response) => {
            const url = response.url()
            if (url.includes('cdninstagram.com') && url.includes('.mp4')) {
              console.log('🎯 拦截到视频响应:', url.substring(0, 80) + '...')
              console.log('📊 响应状态:', response.status())
              
              if (response.ok() && !videoBuffer) {
                try {
                  const buffer = await response.buffer()
                  const headers = response.headers()
                  
                  videoBuffer = buffer
                  responseHeaders = {
                    'content-type': headers['content-type'] || 'video/mp4',
                    'content-length': headers['content-length'] || buffer.length.toString()
                  }
                  
                  console.log('✅ 网络拦截成功:', {
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
            request.continue()
          })

          // 如果有 threadUrl，重新访问原始页面触发请求
          if (threadUrl) {
            console.log('🌐 重新访问原始页面触发视频请求...')
            await page.goto(threadUrl, { waitUntil: 'networkidle2', timeout: 30000 })
            await new Promise(resolve => setTimeout(resolve, 5000))
          } else {
            // 直接访问视频URL
            console.log('🌐 直接访问视频URL...')
            await page.goto(finalVideoUrl, { waitUntil: 'networkidle0', timeout: 30000 })
            await new Promise(resolve => setTimeout(resolve, 3000))
          }
          
          if (!videoBuffer) {
            throw new Error('网络拦截未获取到视频数据')
          }
          
        } catch (interceptError) {
          console.error('❌ 网络拦截方案也失败:', interceptError)
          throw new Error('所有下载方案都失败')
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
