import { NextResponse } from 'next/server'
import type { ApiResponse, ExtractResult } from '@/lib/types'

export function buildExtractResponse(result: ExtractResult): NextResponse {
  if (!result.videos.length) {
    return NextResponse.json(
      {
        success: false,
        message: 'No downloadable video was found for this post. Try another public Threads link.',
        user_profile: result.user_profile,
        video_metadata: result.video_metadata
      },
      { status: 404 }
    )
  }

  const response: ApiResponse = {
    success: true,
    message: 'Video extraction successful',
    videos: result.videos,
    user_profile: result.user_profile,
    video_metadata: result.video_metadata
  }

  return NextResponse.json(response)
}
