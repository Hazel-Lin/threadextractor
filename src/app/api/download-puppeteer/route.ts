import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
import chromium from '@sparticuz/chromium'
import {
  isAllowedThreadPageUrl,
  isAllowedVideoUrl,
  isLikelyVideoUrl,
  redirectToVideo,
  sanitizeMediaUrl,
  streamVideoResponse,
} from '@/lib/video-download'

async function getPuppeteerConfig() {
  const isProduction = process.env.NODE_ENV === 'production'

  if (isProduction) {
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
        height: 1080,
      },
      headless: true as const,
    }
  }

  return {
    headless: true as const,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--no-first-run',
      '--single-process',
    ],
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  }
}

async function extractVideoUrlFromThread(threadUrl: string): Promise<string | null> {
  const config = await getPuppeteerConfig()
  const browser = await puppeteer.launch(config)

  try {
    const page = await browser.newPage()
    let networkCapturedVideoUrl: string | null = null

    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    )
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
    })

    page.on('response', async (response) => {
      if (networkCapturedVideoUrl) {
        return
      }

      const responseUrl = response.url()
      const contentType = response.headers()['content-type'] || ''

      if (contentType.includes('video/') || isLikelyVideoUrl(responseUrl)) {
        networkCapturedVideoUrl = sanitizeMediaUrl(responseUrl)
      }
    })

    await page.goto(threadUrl, { waitUntil: 'networkidle2', timeout: 30000 })
    await new Promise((resolve) => setTimeout(resolve, 5000))

    if (networkCapturedVideoUrl) {
      return networkCapturedVideoUrl
    }

    const extractedUrl = await page.evaluate(() => {
      const patterns = [
        /"video_url":"(https:[^"]+)"/,
        /"playback_url":"(https:[^"]+)"/,
        /"src":"(https:[^"]+)"/,
      ]

      const html = document.documentElement.outerHTML
      for (const pattern of patterns) {
        const match = html.match(pattern)
        if (match) {
          return match[1].replace(/\\\//g, '/').replace(/\\u0026/g, '&').replace(/&amp;/g, '&')
        }
      }

      const videoElements = document.querySelectorAll('video')
      for (const video of videoElements) {
        const src = video.src || video.getAttribute('src')
        if (src) {
          return src
        }
      }

      return null
    })

    return sanitizeMediaUrl(extractedUrl)
  } finally {
    await browser.close()
  }
}

export async function GET(request: NextRequest) {
  console.log('🎬 收到 Puppeteer 视频下载请求')

  try {
    const { searchParams } = new URL(request.url)
    const threadUrl = sanitizeMediaUrl(searchParams.get('threadUrl'))
    const videoUrl = sanitizeMediaUrl(searchParams.get('videoUrl'))

    if (!threadUrl && !videoUrl) {
      return NextResponse.json(
        { error: 'threadUrl or videoUrl parameter is required' },
        { status: 400 }
      )
    }

    if (videoUrl && !isAllowedVideoUrl(videoUrl)) {
      return NextResponse.json(
        { error: 'Video domain not allowed' },
        { status: 403 }
      )
    }

    if (threadUrl && !isAllowedThreadPageUrl(threadUrl)) {
      return NextResponse.json(
        { error: 'Thread page domain not allowed' },
        { status: 403 }
      )
    }

    console.log('🎯 下载参数:', { threadUrl: threadUrl?.substring(0, 50), videoUrl: videoUrl?.substring(0, 50) })

    if (videoUrl) {
      const streamedResponse = await streamVideoResponse(videoUrl, threadUrl)
      if (streamedResponse) {
        return streamedResponse
      }
    }

    if (!threadUrl) {
      throw new Error('No valid thread URL available for Puppeteer fallback')
    }

    const extractedVideoUrl = await extractVideoUrlFromThread(threadUrl)

    if (!extractedVideoUrl || !isAllowedVideoUrl(extractedVideoUrl)) {
      throw new Error('No valid video URL found')
    }

    const streamedResponse = await streamVideoResponse(extractedVideoUrl, threadUrl)
    if (streamedResponse) {
      return streamedResponse
    }

    console.log('🔄 流式代理失败，降级到视频URL重定向')
    return redirectToVideo(extractedVideoUrl)
  } catch (error) {
    console.error('❌ Puppeteer下载失败:', error)

    const { searchParams } = new URL(request.url)
    const fallbackVideoUrl = sanitizeMediaUrl(searchParams.get('videoUrl'))

    if (fallbackVideoUrl) {
      console.log('🔄 使用降级重定向')
      return redirectToVideo(fallbackVideoUrl)
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
