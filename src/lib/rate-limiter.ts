import { NextRequest, NextResponse } from 'next/server'
import { RateLimiterMemory } from 'rate-limiter-flexible'

// 创建限流器实例
const rateLimiter = new RateLimiterMemory({
  points: 20, // 每个时间窗口允许的请求数
  duration: 60, // 时间窗口（秒）
  blockDuration: 60, // 被阻止的时间（秒）
})

// 获取客户端 IP 地址
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const connectingIP = request.headers.get('cf-connecting-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (connectingIP) {
    return connectingIP
  }

  if (realIP) {
    return realIP
  }
  
  // 使用请求特征作为后备，避免所有无IP流量共享一个限流桶
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const acceptLanguage = request.headers.get('accept-language') || 'unknown'
  return `${userAgent}:${acceptLanguage}`.slice(0, 200)
}

// 限流中间件
export async function rateLimit(request: NextRequest): Promise<NextResponse | null> {
  try {
    const clientIP = getClientIP(request)
    
    // 消费一个点数
    await rateLimiter.consume(clientIP)
    
    // 如果成功，返回 null 表示没有被限流
    return null
  } catch (error: unknown) {
    // 如果被限流，返回 429 状态
    const rateLimiterRes = error as { msBeforeNext: number }
    const secs = Math.round(rateLimiterRes.msBeforeNext / 1000) || 1
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Rate limit exceeded. Try again in ${secs} seconds.`,
        retryAfter: secs
      },
      { 
        status: 429,
        headers: {
          'Retry-After': secs.toString()
        }
      }
    )
  }
}

// 验证 Threads URL
export function validateThreadsUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false
  }
  
  const threadsUrlPattern = /^https:\/\/(www\.)?threads\.com\/@[\w.-]+\/post\/[\w.-]+/
  const instagramUrlPattern = /^https:\/\/(www\.)?instagram\.com\/p\/[\w.-]+/
  
  return threadsUrlPattern.test(url) || instagramUrlPattern.test(url)
}
