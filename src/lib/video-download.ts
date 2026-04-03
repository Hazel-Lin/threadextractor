import { NextResponse } from "next/server"

const VIDEO_HOST_SUFFIXES = [
  "cdninstagram.com",
  "instagram.com",
  "threads.net",
  "threads.com",
  "fbcdn.net",
]

export function sanitizeMediaUrl(rawUrl: string | null | undefined): string | null {
  if (!rawUrl) {
    return null
  }

  const trimmed = rawUrl.trim()
  if (!trimmed) {
    return null
  }

  try {
    return decodeURIComponent(trimmed)
      .replace(/\\u0026/g, "&")
      .replace(/\\\//g, "/")
      .replace(/\\/g, "")
      .replace(/&amp;/g, "&")
  } catch {
    return trimmed
      .replace(/\\u0026/g, "&")
      .replace(/\\\//g, "/")
      .replace(/\\/g, "")
      .replace(/&amp;/g, "&")
  }
}

export function isAllowedMediaHost(hostname: string): boolean {
  return VIDEO_HOST_SUFFIXES.some((suffix) => hostname === suffix || hostname.endsWith(`.${suffix}`))
}

export function isAllowedVideoUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === "https:" && isAllowedMediaHost(parsed.hostname)
  } catch {
    return false
  }
}

export function isAllowedThreadPageUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === "https:" && isAllowedMediaHost(parsed.hostname)
  } catch {
    return false
  }
}

export function isLikelyVideoUrl(url: string): boolean {
  const lowered = url.toLowerCase()

  return isAllowedVideoUrl(url) && (
    lowered.includes(".mp4") ||
    lowered.includes("video") ||
    lowered.includes("playback") ||
    lowered.includes("mime_type=video") ||
    lowered.includes("bytestart")
  )
}

function buildVideoRequestHeaders(threadUrl?: string | null): HeadersInit {
  const headers: Record<string, string> = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5",
    "Accept-Language": "en-US,en;q=0.9",
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
    "Sec-Fetch-Dest": "video",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "cross-site",
  }

  if (threadUrl) {
    headers.Referer = threadUrl
    try {
      headers.Origin = new URL(threadUrl).origin
    } catch {
      // ignore origin construction failure
    }
  }

  return headers
}

export async function streamVideoResponse(videoUrl: string, threadUrl?: string | null): Promise<NextResponse | null> {
  if (!isAllowedVideoUrl(videoUrl)) {
    return null
  }

  let upstream: Response

  try {
    upstream = await fetch(videoUrl, {
      method: "GET",
      headers: buildVideoRequestHeaders(threadUrl),
      redirect: "follow",
      signal: AbortSignal.timeout(45000),
    })
  } catch (error) {
    console.error("Video fetch failed:", error)
    return null
  }

  if (!upstream.ok || !upstream.body) {
    return null
  }

  const contentType = upstream.headers.get("content-type") || "video/mp4"
  const contentLength = upstream.headers.get("content-length")
  const extension = contentType.includes("webm") ? "webm" : "mp4"
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-")
  const filename = `threads_video_${timestamp}.${extension}`
  const headers = new Headers({
    "Content-Type": contentType,
    "Content-Disposition": `attachment; filename="${filename}"`,
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET",
    "Access-Control-Allow-Headers": "Content-Type",
  })

  if (contentLength) {
    headers.set("Content-Length", contentLength)
  }

  return new NextResponse(upstream.body, {
    status: 200,
    headers,
  })
}

export function redirectToVideo(videoUrl: string): NextResponse {
  return NextResponse.redirect(videoUrl, 302)
}
