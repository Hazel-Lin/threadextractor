import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()

    if (!url) {
      return NextResponse.json(
        { success: false, message: '请输入有效的 Threads 链接' },
        { status: 400 }
      )
    }

    // 调用 Python 后端
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080'
    const response = await fetch(`${backendUrl}/extract`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    })

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: '后端服务请求失败' },
        { status: 500 }
      )
    }

    const data = await response.json()
    
    // 转换后端返回的数据格式以匹配前端期望的格式
    if (data.success && data.videos) {
      const formattedVideos = data.videos.map((url: string, index: number) => ({
        index: index + 1,
        url: url
      }))
      
      return NextResponse.json({
        success: true,
        message: data.message,
        videos: formattedVideos
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { success: false, message: '服务器内部错误' },
      { status: 500 }
    )
  }
}