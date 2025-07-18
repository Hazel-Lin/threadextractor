"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, Copy, Loader2 } from "lucide-react"
import { threadsExtractor, type VideoData } from "@/lib/threads-extractor"

export default function ThreadsExtractor() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [videos, setVideos] = useState<VideoData[]>([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) {
      setError("请输入有效的 Threads 链接")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess("")
    setVideos([])

    try {
      const result = await threadsExtractor.extractVideos(url)
      
      if (result.success) {
        setVideos(result.videos)
        setSuccess(result.message)
      } else {
        setError(result.message)
      }
    } catch {
      setError("提取过程中出现错误，请重试")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setSuccess("链接已复制到剪贴板")
      setTimeout(() => setSuccess(""), 3000)
    } catch {
      setError("复制失败，请手动复制")
    }
  }

  const downloadVideo = (video: VideoData) => {
    const link = document.createElement("a")
    link.href = video.url
    link.download = `threads_video_${video.index}.mp4`
    link.target = "_blank"
    link.style.display = "none"
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    setSuccess(`视频 ${video.index} 开始下载...`)
    setTimeout(() => setSuccess(""), 3000)
  }

  return (
    <div className="bg-background w-full h-full flex items-center justify-center">
      <div className="max-w-6xl mx-auto px-4 w-full">
        <div className="text-center space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              <span className="text-primary">Threads</span> Video Downloader
            </h1>
            <p className="text-base text-muted-foreground">
              Easily download videos from Threads platform.
            </p>
          </div>

          {/* Main Form */}
          <div className="max-w-2xl mx-auto space-y-3">
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
                  <span className="font-bold">Download</span>
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

          {/* Results */}
          {videos.length > 0 && (
            <div className="max-w-2xl mx-auto space-y-4">
              <h3 className="text-xl font-semibold text-foreground">
                找到 {videos.length} 个视频
              </h3>
              <div className="space-y-3">
                {videos.map((video) => (
                  <div 
                    key={video.index} 
                    className="border border-border rounded-lg p-4 bg-card"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-card-foreground mb-1">
                          视频 {video.index}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {video.url}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(video.url)}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          复制
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => downloadVideo(video)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          下载
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}