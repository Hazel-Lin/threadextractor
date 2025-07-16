"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Copy, Loader2, ExternalLink } from "lucide-react"

interface VideoData {
  url: string
  index: number
}

interface ApiResponse {
  success: boolean
  message: string
  videos?: string[]
}

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

    if (!url.includes("threads.com")) {
      setError("请输入有效的 Threads 链接")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess("")
    setVideos([])

    try {
      const response = await fetch("http://localhost:8080/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      const data: ApiResponse = await response.json()

      if (data.success && data.videos) {
        const videoData = data.videos.map((videoUrl, index) => ({
          url: videoUrl,
          index: index + 1,
        }))
        setVideos(videoData)
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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setSuccess("链接已复制到剪贴板")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("复制失败，请手动复制")
    }
  }

  const downloadVideo = (videoUrl: string, index: number) => {
    const encodedUrl = encodeURIComponent(videoUrl)
    const downloadUrl = `http://localhost:8080/download?url=${encodedUrl}&index=${index}`
    
    const link = document.createElement("a")
    link.href = downloadUrl
    link.download = `threads_video_${index}.mp4`
    link.style.display = "none"
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    setSuccess(`视频 ${index} 开始下载...`)
    setTimeout(() => setSuccess(""), 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🎬 Threads 视频提取器
          </CardTitle>
          <CardDescription className="text-lg">
            输入 Threads 贴文链接，一键提取视频下载地址
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="url" className="text-sm font-medium">
                Threads 贴文链接:
              </label>
              <Input
                id="url"
                type="url"
                placeholder="https://www.threads.com/@username/post/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  处理中...
                </>
              ) : (
                <>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  提取视频链接
                </>
              )}
            </Button>
          </form>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-red-800 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
              <p className="text-green-800 dark:text-green-300 text-sm">{success}</p>
            </div>
          )}

          {videos.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">提取到的视频:</h3>
              {videos.map((video) => (
                <div
                  key={video.index}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        视频 {video.index}: {video.url.substring(0, 80)}...
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
                        onClick={() => downloadVideo(video.url, video.index)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        下载
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              支持提取 Threads 平台的视频内容 • 请遵守平台使用条款
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}