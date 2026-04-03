import { NextRequest, NextResponse } from 'next/server'
import { redirectToVideo, sanitizeMediaUrl, streamVideoResponse } from '@/lib/video-download'

export async function GET(request: NextRequest) {
  console.log('🎬 收到视频下载请求')

  try {
    const { searchParams } = new URL(request.url)
    const videoUrl = sanitizeMediaUrl(searchParams.get('url'))
    const threadUrl = sanitizeMediaUrl(searchParams.get('threadUrl'))

    if (!videoUrl) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      )
    }

    console.log('🎥 下载视频请求:', videoUrl.substring(0, 60) + '...')

    const streamedResponse = await streamVideoResponse(videoUrl, threadUrl)
    if (streamedResponse) {
      return streamedResponse
    }

    console.log('🔄 流式代理失败，重定向到原始URL让浏览器直接处理')
    return redirectToVideo(videoUrl)
  } catch (error) {
    console.error('❌ 下载过程中发生错误:', error)

    const { searchParams } = new URL(request.url)
    const fallbackUrl = sanitizeMediaUrl(searchParams.get('url'))

    if (fallbackUrl) {
      console.log('🔄 使用重定向备选方案')
      return redirectToVideo(fallbackUrl)
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
