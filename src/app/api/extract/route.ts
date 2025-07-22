import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, validateThreadsUrl } from '@/lib/rate-limiter'
import { extractThreadsData } from '@/lib/extractor'
import type { ApiResponse } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 收到视频提取请求')
    
    // 应用限流
    const rateLimitResult = await rateLimit(request)
    if (rateLimitResult) {
      console.log('⚠️ 请求被限流')
      return rateLimitResult
    }

    // 解析请求体
    const body = await request.json()
    const { url } = body

    console.log('🔗 请求URL:', url)

    // 验证URL
    if (!validateThreadsUrl(url)) {
      console.log('❌ URL验证失败:', url)
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid Threads URL. Please provide a valid Threads or Instagram link.' 
        },
        { status: 400 }
      )
    }

    console.log('✅ URL验证通过，开始提取...')

    // 提取视频数据
    const result = await extractThreadsData(url)
    
    // 构建响应
    const response: ApiResponse = {
      success: true,
      message: 'Video extraction successful',
      videos: result.videos,
      user_profile: result.user_profile,
      video_metadata: result.video_metadata
    }

    console.log('✅ 提取成功，返回结果')
    console.log('📊 结果统计:', {
      videoCount: result.videos.length,
      hasUserProfile: !!result.user_profile.username,
      hasMetadata: !!result.video_metadata.title || !!result.video_metadata.post_content
    })
    
    return NextResponse.json(response)

  } catch (error) {
    console.error('❌ 提取过程中发生错误:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Threads Video Extractor API - POST to /api/extract with {"url": "threads_url"}',
    version: '2.0.0',
    powered_by: 'Next.js + Puppeteer'
  })
}
