"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, Loader2 } from "lucide-react"

interface VideoData {
  url: string
  index: number
}

interface UserProfile {
  username: string | null
  display_name: string | null
  avatar_url: string | null
  followers_count: number | null
  bio: string | null
}

interface VideoMetadata {
  title: string | null
  thumbnail_url: string | null
  post_content: string | null
}

interface ApiResponse {
  success: boolean
  message: string
  videos?: string[]
  user_profile?: UserProfile
  video_metadata?: VideoMetadata
}

export default function ThreadsExtractor() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [videos, setVideos] = useState<VideoData[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [useMockData] = useState(false)

  // Get backend URL from environment variable
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'

  // Mock data for testing
  const mockVideoData: VideoData[] = [{
    url: "https://video.threads.net/v/example_video_thread_12345.mp4",
    index: 1,
  }]

  const mockUserProfile: UserProfile = {
    username: "example_user",
    display_name: "Example User",
    avatar_url: "https://example.com/avatar.jpg",
    followers_count: 1234,
    bio: "This is an example bio for testing purposes."
  }

  const mockVideoMetadata: VideoMetadata = {
    title: "Check out this amazing video from Threads! 🎥✨",
    thumbnail_url: "https://example.com/thumbnail.jpg",
    post_content: "Just sharing this incredible moment! Can't believe how beautiful this sunset looks. What do you think? 🌅 #sunset #nature #beautiful"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url.trim()) {
      setError("Please enter a valid Threads link")
      return
    }

    if (!url.includes('threads.net') && !url.includes('instagram.com/p/')) {
      setError("Please enter a valid Threads link")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess("")
    setVideos([])
    setUserProfile(null)
    setVideoMetadata(null)

    // Use mock data if enabled
    if (useMockData) {
      setTimeout(() => {
        setVideos(mockVideoData)
        setUserProfile(mockUserProfile)
        setVideoMetadata(mockVideoMetadata)
        setSuccess("Video extracted successfully!")
        setIsLoading(false)
      }, 1500) // Simulate loading time
      return
    }

    try {
      const response = await fetch(`${backendUrl}/extract`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      const data: ApiResponse = await response.json()

      if (data.success) {
        // Set user profile if available
        if (data.user_profile) {
          setUserProfile(data.user_profile)
        }
        
        // Set video metadata if available
        if (data.video_metadata) {
          setVideoMetadata(data.video_metadata)
        }
        
        // Set videos if available
        if (data.videos && data.videos.length > 0) {
          // Only show the first video as it's typically the most accurate
          const videoData = [{
            url: data.videos[0],
            index: 1,
          }]
          setVideos(videoData)
        }
        
        setSuccess(data.message)
      } else {
        setError(data.message)
      }
    } catch {
      setError("Network error, please try again")
    } finally {
      setIsLoading(false)
    }
  }


  const getProxiedImageUrl = (originalUrl: string) => {
    // Use proxy for external images to avoid CORS issues
    if (originalUrl && (originalUrl.includes('cdninstagram.com') || originalUrl.includes('threads.net'))) {
      return `${backendUrl}/proxy-image?url=${encodeURIComponent(originalUrl)}`
    }
    return originalUrl
  }

  const downloadVideo = async (video: VideoData) => {
    const encodedUrl = encodeURIComponent(video.url)
    const downloadUrl = `${backendUrl}/download?url=${encodedUrl}`

    const link = document.createElement("a")
    link.href = downloadUrl
    link.target = "_blank"
    link.download = `threads-video-${video.index}.mp4`
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    setSuccess(`Video ${video.index} download started...`)
    setTimeout(() => setSuccess(""), 3000)
  }

  return (
    <div className="bg-background w-full flex items-center justify-center py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              <span className="text-primary">Threads</span> Video Downloader
            </h1>
            <p className="text-base text-muted-foreground">
              Easily download videos from Threads platform.
            </p>
          </div>

          {/* Main Form */}
          <div className="max-w-2xl mx-auto space-y-4">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter a Threads link..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                disabled={isLoading}
                className="sm:w-auto w-full"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span className="font-bold">Extract</span>
                )}
              </Button>
            </form>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-700 dark:text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Success message */}
            {success && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-green-700 dark:text-green-300 text-sm">
                {success}
              </div>
            )}
          </div>

          {/* Video Result Card */}
          {videos.length > 0 && (
            <div className="max-w-2xl mx-auto">
              <div className="border border-border rounded-lg overflow-hidden bg-card">
                {/* Video Thumbnail */}
                {videoMetadata?.thumbnail_url && (
                  <div className="relative aspect-video bg-muted">
                    <Image
                      src={getProxiedImageUrl(videoMetadata.thumbnail_url)}
                      alt="Video thumbnail"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onError={() => {
                        console.log('Image failed to load:', videoMetadata.thumbnail_url);
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', videoMetadata.thumbnail_url);
                      }}
                    />
                  </div>
                )}
                
                <div className="p-6 space-y-4">
                  {/* Post Content or Video Title */}
                  {(videoMetadata?.post_content || videoMetadata?.title) && (
                    <div className="space-y-2">
                      <h3 className="font-medium text-foreground text-lg leading-snug">
                        {videoMetadata.post_content || videoMetadata.title}
                      </h3>
                    </div>
                  )}
                  
                  {/* Author Information */}
                  {userProfile && (
                    <div className="flex items-center gap-3">
                      {userProfile.avatar_url && (
                        <div className="relative w-10 h-10">
                          <Image
                            src={getProxiedImageUrl(userProfile.avatar_url)}
                            alt="Author"
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                            sizes="40px"
                            onError={() => {
                              console.log('Avatar failed to load:', userProfile.avatar_url);
                            }}
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {userProfile.display_name && (
                            <span className="font-medium text-foreground text-sm">
                              {userProfile.display_name}
                            </span>
                          )}
                          {userProfile.username && (
                            <span className="text-muted-foreground text-sm">
                              @{userProfile.username}
                            </span>
                          )}
                        </div>
                        {userProfile.followers_count && (
                          <span className="text-muted-foreground text-xs">
                            {userProfile.followers_count.toLocaleString()} followers
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Download Button */}
                  <Button
                    onClick={() => downloadVideo(videos[0])}
                    className="w-full"
                    size="lg"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    <span className="font-bold">Download Video</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}