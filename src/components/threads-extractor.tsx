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
  videos?: VideoData[]
  user_profile?: UserProfile
  video_metadata?: VideoMetadata
}

interface LoadingStep {
  id: string
  label: string
  status: 'pending' | 'active' | 'completed' | 'error'
  description?: string
}

interface ThreadsExtractorProps {
  title?: string
  description?: string
  placeholder?: string
  submitLabel?: string
}

const INITIAL_LOADING_STEPS: LoadingStep[] = [
  { id: "validate", label: "Validate", status: "pending" },
  { id: "connect", label: "Connect", status: "pending" },
  { id: "parse", label: "Parse", status: "pending" },
  { id: "extract", label: "Extract", status: "pending" },
  { id: "process", label: "Process", status: "pending" },
]

export default function ThreadsExtractor({
  title = "Download Public Threads Videos Online",
  description = "Paste a public Threads post URL to start the downloader, then save the returned media file in your browser.",
  placeholder = "Enter a Threads Link",
  submitLabel = "Load",
}: ThreadsExtractorProps) {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [videos, setVideos] = useState<VideoData[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loadingSteps, setLoadingSteps] = useState<LoadingStep[]>(INITIAL_LOADING_STEPS)
  const [currentProgress, setCurrentProgress] = useState(0)

  // Get backend URL from environment variable or use internal API
  const backendUrl =  ''
  // const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || ''


  const updateStepStatus = (stepId: string, status: LoadingStep['status']) => {
    setLoadingSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status } : step
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url.trim()) {
      setError("Please enter a valid Threads link")
      return
    }

    if (!url.includes('threads.com') && !url.includes('threads.net') && !url.includes('instagram.com/p/')) {
      setError("Please enter a valid Threads link")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess("")
    setVideos([])
    setUserProfile(null)
    setVideoMetadata(null)
    setCurrentProgress(0)
    setLoadingSteps(INITIAL_LOADING_STEPS)


    try {
      // Step 1: Validate URL
      updateStepStatus('validate', 'active')
      await new Promise(resolve => setTimeout(resolve, 500))
      updateStepStatus('validate', 'completed')
      setCurrentProgress(20)

      // Step 2: Connect to server
      updateStepStatus('connect', 'active')
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // 使用内部 API 或外部后端
      const apiUrl = backendUrl ? `${backendUrl}/extract` : '/api/extract'
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      updateStepStatus('connect', 'completed')
      setCurrentProgress(40)

      // Step 3: Parse page
      updateStepStatus('parse', 'active')
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const data: ApiResponse = await response.json()
      
      updateStepStatus('parse', 'completed')
      setCurrentProgress(70)

      // Step 4: Extract video
      updateStepStatus('extract', 'active')
      await new Promise(resolve => setTimeout(resolve, 600))

      if (response.ok && data.success && data.videos && data.videos.length > 0) {
        updateStepStatus('extract', 'completed')
        setCurrentProgress(90)

        // Step 5: Process data
        updateStepStatus('process', 'active')
        await new Promise(resolve => setTimeout(resolve, 400))

        // Set user profile if available
        console.log("🚀 ~ handleSubmit ~ data.user_profile:", data.user_profile)
        if (data.user_profile) {
          setUserProfile(data.user_profile)
        }
        
        // Set video metadata if available
        if (data.video_metadata) {
          setVideoMetadata(data.video_metadata)
        }
        
        // Set videos if available
        if (data.videos && data.videos.length > 0) {
          setVideos(data.videos)
        }
        
        updateStepStatus('process', 'completed')
        setCurrentProgress(100)
        setSuccess(data.message)
      } else {
        updateStepStatus('extract', 'error')
        setError(data.message || "No downloadable video was found.")
      }
    } catch {
      // Find the currently active step and mark it as error
      const activeStep = loadingSteps.find(step => step.status === 'active')
      if (activeStep) {
        updateStepStatus(activeStep.id, 'error')
      }
      setError("Network error, please try again.")
    } finally {
      setIsLoading(false)
    }
  }


  const downloadVideo = async (video: VideoData) => {
    try {
      setIsLoading(true)
      setSuccess("Initiating download...")

      console.log("🚀 Starting download:", video.url.substring(0, 60) + '...')

      const downloadUrl = `/api/download-puppeteer?videoUrl=${encodeURIComponent(video.url)}&threadUrl=${encodeURIComponent(url)}`

      console.log('🎯 Preparing for download')

      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = `threads_video_${Date.now()}.mp4`
      link.style.display = "none"

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setSuccess("Your download has started! This method preserves your browser session for improved compatibility.")
      setTimeout(() => setSuccess(""), 8000)
      setTimeout(() => setIsLoading(false), 8000)

    } catch (error) {
      console.error("Download error:", error)
      setError("Download failed. The video will open in a new tab as a fallback.")

      try {
        window.open(video.url.replace(/\\u0026/g, '&').replace(/\\\//g, '/'), '_blank')
        setSuccess("The video has been opened in a new tab. Right-click to save it.")
        setTimeout(() => setIsLoading(false), 8000)
      } catch (fallbackError) {
        console.error("Fallback error:", fallbackError)
        setTimeout(() => setIsLoading(false), 8000)
      }
    }
  }

  return (
    <div className="bg-background w-full flex items-center justify-center py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              {title}
            </h1>
            <p className="text-base text-muted-foreground">
              {description}
            </p>
          </div>

          {/* Main Form */}
          <div className="max-w-2xl mx-auto space-y-4">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="url"
                  placeholder={placeholder}
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
                  <span className="font-bold">{submitLabel}</span>
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

            {/* Loading Progress */}
            {isLoading && (
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground">Extraction Progress</span>
                    <span className="text-sm text-muted-foreground">{Math.round(currentProgress)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${currentProgress}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Loading Tips */}
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground text-center">
                    💡 Tip: Video extraction may take a few moments, please be patient.
                    </p>
                </div>
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
                      src={videoMetadata.thumbnail_url}
                      alt="Video thumbnail"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                          src={userProfile.avatar_url}
                          alt="Author"
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                          sizes="40px"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {userProfile.username && (
                          <span className="text-muted-foreground text-sm">
                            from @{userProfile.username}
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
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  <span className="font-bold">{isLoading ? 'Downloading...' : 'Download Video'}</span>
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
