// 数据类型定义
export interface VideoData {
  url: string
  index: number
}

export interface UserProfile {
  username: string | null
  display_name: string | null
  avatar_url: string | null
  followers_count: number | null
  bio: string | null
}

export interface VideoMetadata {
  title: string | null
  thumbnail_url: string | null
  post_content: string | null
}

export interface ApiResponse {
  success: boolean
  message: string
  videos?: VideoData[]
  user_profile?: UserProfile
  video_metadata?: VideoMetadata
}

export interface LoadingStep {
  id: string
  label: string
  status: 'pending' | 'active' | 'completed' | 'error'
  description?: string
}

export interface ExtractResult {
  videos: VideoData[]
  user_profile: UserProfile
  video_metadata: VideoMetadata
}
