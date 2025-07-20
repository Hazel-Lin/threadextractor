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
  const [useMockData, setUseMockData] = useState(false)

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
      setError("请输入有效的 Threads 链接")
      return
    }

    if (!url.includes("threads.com")) {
      setError("请输入有效的 Threads 链接")
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
        setSuccess("视频提取成功（Mock 数据）")
        setIsLoading(false)
      }, 1500) // Simulate loading time
      return
    }

    try {
      const response = await fetch("http://localhost:8080/extract", {
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
    } catch (err) {
      setError("网络错误，请重试")
    } finally {
      setIsLoading(false)
    }
  }


  const getProxiedImageUrl = (originalUrl: string) => {
    // Use proxy for external images to avoid CORS issues
    if (originalUrl && (originalUrl.includes('cdninstagram.com') || originalUrl.includes('threads.net'))) {
      return `http://localhost:8080/proxy-image?url=${encodeURIComponent(originalUrl)}`
    }
    return originalUrl
  }

  const downloadVideo = async (video: VideoData) => {
    const encodedUrl = encodeURIComponent(video.url)
    const downloadUrl = `http://localhost:8080/download?url=${encodedUrl}`


    const link = document.createElement("a")
    link.href = downloadUrl
    link.download = `threads_video.mp4`
    link.style.display = "none"
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setTimeout(() => setSuccess(""), 3000)
    setSuccess(`视频下载成功`)
  }

  return (
    <div className="bg-background w-full flex items-center justify-center py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              Easily download any <span className="text-primary">Threads</span> Video
            </h1>
            <p className="text-base text-muted-foreground">
              Just paste the link to download videos with one click, completely free of charge.
            </p>
          </div>

          {/* Main Form */}
          <div className="max-w-2xl mx-auto space-y-4">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="url"
                placeholder="Enter a Threads Link"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
                className="flex-1 h-12 px-4 text-base border-2 border-border focus:border-primary text-foreground placeholder:text-placeholder"
              />
                <Button 
                type="submit" 
                className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold sm:flex-shrink-0" 
                disabled={isLoading}
                >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span className="font-bold">Load</span>
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
            <div className="max-w-2xl mx-auto mb-8">
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
                        {userProfile.username && (
                          <span className="text-muted-foreground text-sm">
                            来自 @{userProfile.username}
                          </span>
                        )}
                      </div>
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