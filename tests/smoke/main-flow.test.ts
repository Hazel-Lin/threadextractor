import test from "node:test"
import assert from "node:assert/strict"
import { NextRequest } from "next/server"

import { GET as downloadRoute } from "@/app/api/download/route"
import { GET as downloadPuppeteerRoute } from "@/app/api/download-puppeteer/route"
import { buildExtractResponse } from "@/lib/extract-response"
import { getClientIP, validateThreadsUrl } from "@/lib/rate-limiter"
import {
  isAllowedThreadPageUrl,
  isAllowedVideoUrl,
  isLikelyVideoUrl,
  sanitizeMediaUrl,
  streamVideoResponse,
} from "@/lib/video-download"
import type { ExtractResult } from "@/lib/types"

function makeRequest(url: string, headers?: HeadersInit) {
  return new NextRequest(url, { headers })
}

function makeExtractResult(videos: ExtractResult["videos"]): ExtractResult {
  return {
    videos,
    user_profile: {
      username: "demo_user",
      display_name: "Demo User",
      avatar_url: null,
      followers_count: null,
      bio: null,
    },
    video_metadata: {
      title: "Demo Title",
      thumbnail_url: null,
      post_content: "Demo content",
    },
  }
}

test("sanitizeMediaUrl normalizes escaped video URLs", () => {
  const raw = "https%3A%2F%2Fvideo.cdninstagram.com%2Fv%2Ffoo.mp4%3Fa%3D1%5Cu0026b%3D2"
  assert.equal(
    sanitizeMediaUrl(raw),
    "https://video.cdninstagram.com/v/foo.mp4?a=1&b=2"
  )
})

test("video URL guards accept supported hosts and reject invalid domains", () => {
  assert.equal(isAllowedVideoUrl("https://video.cdninstagram.com/v/t1/f1.mp4"), true)
  assert.equal(isAllowedThreadPageUrl("https://www.threads.net/@demo/post/abc"), true)
  assert.equal(isAllowedVideoUrl("https://evil.example.com/video.mp4"), false)
  assert.equal(isLikelyVideoUrl("https://video.cdninstagram.com/v/t1/f1?mime_type=video_mp4"), true)
})

test("streamVideoResponse returns attachment response when upstream video is available", async () => {
  const originalFetch = global.fetch
  global.fetch = async () =>
    new Response("video-data", {
      status: 200,
      headers: {
        "content-type": "video/mp4",
        "content-length": "10",
      },
    })

  try {
    const response = await streamVideoResponse(
      "https://video.cdninstagram.com/v/t1/f1.mp4",
      "https://www.threads.net/@demo/post/abc"
    )

    assert.ok(response)
    assert.equal(response?.status, 200)
    assert.match(response?.headers.get("content-disposition") || "", /attachment; filename="threads_video_/)
    assert.equal(await response?.text(), "video-data")
  } finally {
    global.fetch = originalFetch
  }
})

test("download route falls back to redirect when upstream fetch fails", async () => {
  const originalFetch = global.fetch
  global.fetch = async () => {
    throw new Error("network down")
  }

  try {
    const request = makeRequest(
      "https://threadsextractor.com/api/download?url=https%3A%2F%2Fvideo.cdninstagram.com%2Fv%2Ft1%2Ff1.mp4"
    )
    const response = await downloadRoute(request)

    assert.equal(response.status, 302)
    assert.equal(
      response.headers.get("location"),
      "https://video.cdninstagram.com/v/t1/f1.mp4"
    )
  } finally {
    global.fetch = originalFetch
  }
})

test("download puppeteer route rejects disallowed video domains before launching browser", async () => {
  const request = makeRequest(
    "https://threadsextractor.com/api/download-puppeteer?videoUrl=https%3A%2F%2Fevil.example.com%2Fbad.mp4"
  )
  const response = await downloadPuppeteerRoute(request)
  const body = await response.json()

  assert.equal(response.status, 403)
  assert.equal(body.error, "Video domain not allowed")
})

test("extract response returns 404 when no videos were found", async () => {
  const response = buildExtractResponse(makeExtractResult([]))
  const body = await response.json()

  assert.equal(response.status, 404)
  assert.equal(body.success, false)
  assert.match(body.message, /No downloadable video/)
})

test("extract response returns success payload when videos exist", async () => {
  const response = buildExtractResponse(
    makeExtractResult([{ url: "https://video.cdninstagram.com/v/t1/f1.mp4", index: 1 }])
  )
  const body = await response.json()

  assert.equal(response.status, 200)
  assert.equal(body.success, true)
  assert.equal(body.videos.length, 1)
})

test("rate limiter client key prefers forwarded IP and falls back to request fingerprint", () => {
  const forwarded = makeRequest("https://threadsextractor.com/api/extract", {
    "x-forwarded-for": "1.2.3.4, 5.6.7.8",
  })
  assert.equal(getClientIP(forwarded), "1.2.3.4")

  const fallback = makeRequest("https://threadsextractor.com/api/extract", {
    "user-agent": "SmokeAgent/1.0",
    "accept-language": "en-US",
  })
  assert.equal(getClientIP(fallback), "SmokeAgent/1.0:en-US")
})

test("Threads URL validation covers supported public post formats", () => {
  assert.equal(validateThreadsUrl("https://www.threads.com/@demo/post/abc123"), true)
  assert.equal(validateThreadsUrl("https://www.instagram.com/p/abc123"), true)
  assert.equal(validateThreadsUrl("https://example.com/not-supported"), false)
})
