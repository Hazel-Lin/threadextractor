import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const videoUrl = searchParams.get('url')
    const index = searchParams.get('index') || '1'

    if (!videoUrl) {
      return NextResponse.json(
        { error: '缺少视频链接' },
        { status: 400 }
      )
    }

    // 调用 Python 后端下载代理
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080'
    const response = await fetch(`${backendUrl}/download?url=${encodeURIComponent(videoUrl)}&index=${index}`, {
      method: 'GET',
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: '下载失败' },
        { status: response.status }
      )
    }

    // 获取文件流并转发给客户端
    const contentType = response.headers.get('content-type') || 'video/mp4'
    const contentLength = response.headers.get('content-length')
    const contentDisposition = response.headers.get('content-disposition') || `attachment; filename="threads_video_${index}.mp4"`

    const stream = new ReadableStream({
      start(controller) {
        const reader = response.body?.getReader()
        
        function pump(): Promise<void> {
          return reader!.read().then(({ done, value }) => {
            if (done) {
              controller.close()
              return
            }
            controller.enqueue(value)
            return pump()
          })
        }
        
        return pump()
      }
    })

    return new NextResponse(stream, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': contentDisposition,
        ...(contentLength && { 'Content-Length': contentLength }),
      },
    })
  } catch (error) {
    console.error('Download API Error:', error)
    return NextResponse.json(
      { error: '下载过程中出现错误' },
      { status: 500 }
    )
  }
}