import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  console.log('🎬 收到视频下载请求')
  try {
    const { searchParams } = new URL(request.url)
    let videoUrl = searchParams.get('url')

    if (!videoUrl) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      )
    }

    // 清理和解码URL
    videoUrl = decodeURIComponent(videoUrl)
                .replace(/\\u0026/g, '&')
                .replace(/\\\//g, '/')
                .replace(/\\/g, '')

    // 验证URL是否为视频链接
    if (!videoUrl.includes('.mp4') && !videoUrl.includes('video')) {
      return NextResponse.json(
        { error: 'Invalid video URL' },
        { status: 400 }
      )
    }

    // 验证URL域名安全性
    try {
      const url = new URL(videoUrl)
      const allowedDomains = [
        'cdninstagram.com',
        'scontent-sjc3-1.cdninstagram.com',
        'scontent.cdninstagram.com',
        'instagram.com',
        'threads.net'
      ]
      
      if (!allowedDomains.some(domain => url.hostname.includes(domain))) {
        return NextResponse.json(
          { error: 'Video domain not allowed' },
          { status: 403 }
        )
      }
    } catch {
      return NextResponse.json(
        { error: 'Invalid video URL format' },
        { status: 400 }
      )
    }

    console.log('🎥 下载视频请求:', videoUrl.substring(0, 60) + '...')

    // 获取视频 - 使用更完善的请求策略
    console.log('🎯 开始获取视频，URL长度:', videoUrl.length)
    
    let response
    try {
      // 使用更完善的请求头模拟真实浏览器
      const headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Fetch-Dest': 'video',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site'
      }
      
      console.log('🚀 发送视频获取请求...')
      response = await fetch(videoUrl, {
        method: 'GET',
        headers,
        signal: AbortSignal.timeout(30000) // 30秒超时
      })
      
      console.log(`📊 视频响应状态: ${response.status}`)
      console.log(`📄 响应Content-Type: ${response.headers.get('content-type')}`)
      
    } catch (fetchError) {
      console.error('❌ 视频获取失败:', fetchError.message)
      
      // 对于Instagram/Threads的签名问题，直接重定向是最好的解决方案
      console.log('🔄 获取失败，重定向到原始URL让浏览器直接处理')
      return NextResponse.redirect(videoUrl, 302)
    }

    if (!response.ok) {
      console.error('❌ 视频下载失败:', response.status, response.statusText)
      
      // 对于任何非成功状态，都重定向到原始URL让浏览器处理
      // 这样可以避免签名验证等问题
      console.log('🔄 HTTP错误，重定向到原始URL让浏览器处理')
      return NextResponse.redirect(videoUrl, 302)
    }

    const contentType = response.headers.get('content-type') || 'video/mp4'
    const contentLength = response.headers.get('content-length')
    
    console.log('✅ 视频下载成功:', {
      contentType,
      contentLength: contentLength ? `${(parseInt(contentLength) / 1024 / 1024).toFixed(2)}MB` : 'unknown'
    })

    // 生成文件名
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    const filename = `threads_video_${timestamp}.mp4`

    // 设置适当的响应头用于文件下载
    const responseHeaders: Record<string, string> = {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
    
    if (contentLength) {
      responseHeaders['Content-Length'] = contentLength
    }
    
    console.log('✅ 开始流式传输视频数据')
    
    return new NextResponse(response.body, {
      status: 200,
      headers: responseHeaders
    })

  } catch (error) {
    console.error('❌ 下载过程中发生错误:', error)
    
    // 作为最后的备选方案，重定向到原始URL
    const { searchParams } = new URL(request.url)
    const fallbackUrl = searchParams.get('url')
    
    if (fallbackUrl) {
      console.log('🔄 使用重定向备选方案')
      const decodedUrl = decodeURIComponent(fallbackUrl)
        .replace(/\\u0026/g, '&')
        .replace(/\\\//g, '/')
        .replace(/\\/g, '')
      
      return NextResponse.redirect(decodedUrl, 302)
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
