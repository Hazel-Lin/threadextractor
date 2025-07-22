import puppeteer from 'puppeteer'
import type { VideoData, UserProfile, VideoMetadata, ExtractResult } from './types'

// Puppeteer 配置
const PUPPETEER_CONFIG = {
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--disable-web-security',
    '--disable-features=VizDisplayCompositor',
    '--no-first-run',
    '--single-process'
  ],
  defaultViewport: {
    width: 1920,
    height: 1080
  }
}

// 用户代理
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

export async function extractThreadsData(threadUrl: string): Promise<ExtractResult> {
  console.log('🚀 开始提取 Threads 数据:', threadUrl)
  
  let browser = null
  
  try {
    // 启动浏览器
    browser = await puppeteer.launch(PUPPETEER_CONFIG)
    console.log('✅ 浏览器启动成功')
    
    const page = await browser.newPage()
    
    // 设置用户代理
    await page.setUserAgent(USER_AGENT)
    
    // 设置额外的请求头
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
    })
    
    // 导航到页面
    console.log('🌐 正在访问页面...')
    await page.goto(threadUrl, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    })
    
    // 等待页面加载
    await new Promise(resolve => setTimeout(resolve, 5000))
    console.log('⏳ 页面加载完成，开始解析...')
    
    // 获取页面内容
    const pageContent = await page.content()
    
    // 尝试直接获取video元素的src属性
    const directVideoUrls = await page.evaluate(() => {
      const videos = Array.from(document.querySelectorAll('video'))
      return videos.map(video => video.src).filter(src => src && src.includes('.mp4'))
    })
    
    console.log('🎥 直接从video元素获取到的URL数量:', directVideoUrls.length)
    
    // 提取数据
    const videos = await extractVideoUrls(pageContent)
    
    // 合并直接获取的视频URL
    if (directVideoUrls.length > 0) {
      for (const directUrl of directVideoUrls) {
        const exists = videos.some(v => v.url.replace(/\\u0026/g, '&') === directUrl)
        if (!exists && await validateVideoUrl(directUrl)) {
          videos.push({ url: directUrl, index: videos.length + 1 })
          console.log(`✅ 添加直接提取的视频: ${directUrl.substring(0, 60)}...`)
        }
      }
    }
    
    const userProfile = await extractUserProfile(pageContent)
    const videoMetadata = await extractVideoMetadata(pageContent)
    
    console.log('✅ 数据提取完成')
    console.log('📹 找到视频数量:', videos.length)
    console.log('👤 用户信息:', userProfile?.username || 'N/A')
    
    return {
      videos,
      user_profile: userProfile,
      video_metadata: videoMetadata
    }
    
  } catch (error) {
    console.error('❌ 提取过程中发生错误:', error)
    throw new Error(`视频提取失败: ${error instanceof Error ? error.message : '未知错误'}`)
  } finally {
    if (browser) {
      await browser.close()
      console.log('🔒 浏览器已关闭')
    }
  }
}

// 提取视频URL - 参考Python实现优化
async function extractVideoUrls(html: string): Promise<VideoData[]> {
  console.log('🎥 正在提取视频URL...')
  
  // 使用更精确的模式来获取完整的视频URL，包括查询参数
  const videoPatterns = [
    /"video_url":"(https:[^"]+\.mp4[^"]*)"/g,
    /"playback_url":"(https:[^"]+\.mp4[^"]*)"/g, 
    /"src":"(https:[^"]+\.mp4[^"]*)"/g,
    /<video[^>]*src="([^"]+\.mp4[^"]*)"[^>]*>/g,
    /"videoUrl":"(https:[^"]+\.mp4[^"]*)"/g,
    /"url":"(https:[^"]+\.mp4[^"]*)"/g,
    /(https:\/\/[^\s"]*\.mp4[^\s"]*)/g,
    /"dash_prefetch_experimental":"(https:[^"]+\.mp4[^"]*)"/g,
    /"video_dash_manifest":"(https:[^"]+\.mp4[^"]*)"/g,
    // 额外的宽泛模式用于Instagram/CDN URL
    /(https:\/\/scontent[^"]*\.mp4[^"]*)/g,
    /(https:\/\/[^"]*cdninstagram\.com[^"]*\.mp4[^"]*)/g
  ]

  const videos: VideoData[] = []
  const foundUrls = new Set<string>()
  let index = 1

  for (const pattern of videoPatterns) {
    let match
    pattern.lastIndex = 0 // 重置正则表达式索引
    while ((match = pattern.exec(html)) !== null) {
      let url = match[1] || match[0]
      
      // 清理URL格式 - 参考Python实现
      url = url.replace(/\\\//g, '/')
      // 保持HTML实体编码，不立即解码&amp;
      
      // 检查URL有效性 - 只处理mp4视频链接
      if (url && url.startsWith('https://') && !foundUrls.has(url)) {
        // 只保留包含mp4的URL
        if (url.includes('.mp4')) {
          // 验证URL不是重复的
          const cleanUrl = url.replace(/\\u0026/g, '&') // 用于比较的清理版本
          const isDuplicate = Array.from(foundUrls).some(existingUrl => 
            existingUrl.replace(/\\u0026/g, '&') === cleanUrl
          )
          
          if (!isDuplicate) {
            foundUrls.add(url)
            videos.push({ url, index: index++ })
            console.log(`✅ 找到视频 ${index - 1}: ${url.substring(0, 80)}...`)
          }
        }
      }
    }
  }

  console.log(`🎬 总共找到 ${videos.length} 个有效视频`)
  return videos
}

// 验证视频URL有效性
async function validateVideoUrl(url: string): Promise<boolean> {
  try {
    // 清理URL中的转义字符
    const cleanUrl = url.replace(/\\u0026/g, '&')
                        .replace(/\\\//g, '/')
    
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5',
      'Accept-Language': 'en-US,en;q=0.5',
      'Connection': 'keep-alive'
    }
    
    // 发送HEAD请求检查视频是否可访问
    const response = await fetch(cleanUrl, {
      method: 'HEAD',
      headers,
      signal: AbortSignal.timeout(5000) // 5秒超时
    })
    
    if (response.ok) {
      const contentType = response.headers.get('content-type') || ''
      return contentType.includes('video') || contentType.includes('mp4')
    }
    
    return false
  } catch (error) {
    console.warn('视频URL验证失败:', error)
    return true // 验证失败时默认为有效，避免过度过滤
  }
}

// 提取用户信息 - 参考Python实现优化
async function extractUserProfile(html: string): Promise<UserProfile> {
  console.log('👤 正在提取用户信息...')
  
  const userInfo: UserProfile = {
    username: null,
    display_name: null,
    avatar_url: null,
    followers_count: null,
    bio: null
  }
  
  // Extract username - multiple patterns to try (参考Python模式)
  const usernamePatterns = [
    /"username":"([^"]+)"/,
    /"handle":"([^"]+)"/,
    /"user_name":"([^"]+)"/,
    /@([a-zA-Z0-9_\.]+)/,
    /"pk":"(\d+)".*?"username":"([^"]+)"/,
    /username&quot;:&quot;([^&]+)&quot;/
  ]
  
  for (const pattern of usernamePatterns) {
    const matches = html.match(pattern)
    if (matches) {
      // Handle tuple results from groups
      userInfo.username = matches.length > 2 ? matches[matches.length - 1] : matches[1]
      break
    }
  }
  
  // Extract display name (参考Python模式)
  const displayNamePatterns = [
    /"full_name":"([^"]+)"/,
    /"display_name":"([^"]+)"/,
    /"name":"([^"]+)"/,
    /full_name&quot;:&quot;([^&]+)&quot;/,
    /"title":"([^"]+)"/
  ]
  
  for (const pattern of displayNamePatterns) {
    const matches = html.match(pattern)
    if (matches) {
      userInfo.display_name = matches[1]
      break
    }
  }
  
  // Extract avatar URL (参考Python模式)
  const avatarPatterns = [
    /"profile_pic_url":"([^"]+)"/,
    /"avatar_url":"([^"]+)"/,
    /"profile_picture":"([^"]+)"/,
    /profile_pic_url&quot;:&quot;([^&]+)&quot;/,
    /"hd_profile_pic_url_info":[^}]*"url":"([^"]+)"/
  ]
  
  for (const pattern of avatarPatterns) {
    const matches = html.match(pattern)
    if (matches) {
      // Clean URL format
      const avatarUrl = matches[1].replace(/\\\//g, '/')
                                .replace(/\\u0026/g, '&')
      userInfo.avatar_url = avatarUrl
      break
    }
  }
  
  // Extract followers count (参考Python模式)
  const followersPatterns = [
    /"follower_count":(\d+)/,
    /"followers_count":(\d+)/,
    /follower_count&quot;:(\d+)/,
    /"edge_followed_by":[^}]*"count":(\d+)/,
    /(\d+(?:,\d+)*)\s*followers?/i,
    /(\d+(?:\.\d+)?[KMB]?)\s*followers?/i
  ]
  
  for (const pattern of followersPatterns) {
    const matches = html.match(pattern)
    if (matches) {
      const followersText = matches[1]
      // Convert K, M, B to numbers
      if (followersText.toUpperCase().includes('K')) {
        userInfo.followers_count = Math.floor(parseFloat(followersText.replace(/[Kk]/g, '')) * 1000)
      } else if (followersText.toUpperCase().includes('M')) {
        userInfo.followers_count = Math.floor(parseFloat(followersText.replace(/[Mm]/g, '')) * 1000000)
      } else if (followersText.toUpperCase().includes('B')) {
        userInfo.followers_count = Math.floor(parseFloat(followersText.replace(/[Bb]/g, '')) * 1000000000)
      } else {
        userInfo.followers_count = parseInt(followersText.replace(/,/g, ''))
      }
      break
    }
  }
  
  // Extract bio/description (参考Python模式)
  const bioPatterns = [
    /"biography":"([^"]+)"/,
    /"bio":"([^"]+)"/,
    /"description":"([^"]+)"/,
    /biography&quot;:&quot;([^&]+)&quot;/,
    /"edge_owner_to_timeline_media":[^}]*"biography":"([^"]+)"/
  ]
  
  for (const pattern of bioPatterns) {
    const matches = html.match(pattern)
    if (matches) {
      // Clean bio text
      const bio = matches[1].replace(/\\n/g, '\n')
                            .replace(/\\"/g, '"')
                            .replace(/\\\//g, '/')
      userInfo.bio = bio
      break
    }
  }
  
  console.log('👤 用户信息提取完成:', {
    username: userInfo.username,
    displayName: userInfo.display_name,
    hasAvatar: !!userInfo.avatar_url,
    followers: userInfo.followers_count
  })
  
  return userInfo
}

// 提取视频元数据 - 参考Python实现优化
async function extractVideoMetadata(html: string): Promise<VideoMetadata> {
  console.log('📄 正在提取视频元数据...')
  
  const metadata: VideoMetadata = {
    title: null,
    thumbnail_url: null,
    post_content: null
  }
  
  // Priority 1: OpenGraph meta tags (most reliable for Threads)
  const ogPatterns = {
    post_content: [
      /<meta\s+property="og:description"\s+content="([^"]+)"/i,
      /<meta\s+name="description"\s+content="([^"]+)"/i,
      /<meta\s+property="description"\s+content="([^"]+)"/i
    ],
    thumbnail_url: [
      /<meta\s+property="og:image"\s+content="([^"]+)"/i,
      /<meta\s+name="image"\s+content="([^"]+)"/i,
      /<meta\s+property="twitter:image"\s+content="([^"]+)"/i
    ],
    title: [
      /<meta\s+property="og:title"\s+content="([^"]+)"/i,
      /<meta\s+name="title"\s+content="([^"]+)"/i,
      /<title>([^<]+)<\/title>/i
    ]
  }
  
  // Extract from OpenGraph meta tags first (highest priority)
  for (const [field, patterns] of Object.entries(ogPatterns)) {
    for (const pattern of patterns) {
      const matches = html.match(pattern)
      if (matches) {
        let content = matches[1].trim()
        // Clean HTML entities and decode
        content = content.replace(/&quot;/g, '"')
                        .replace(/&amp;/g, '&')
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
        if (content.length > 5) { // Valid content
          metadata[field as keyof VideoMetadata] = content
          break
        }
      }
    }
  }
  
  // Priority 2: Enhanced post text content extraction (fallback)
  if (!metadata.post_content) {
    const postContentPatterns = [
      // Main caption patterns
      /"caption":{"text":"([^"]+)"/,
      /"caption":"([^"]+)"/,
      /"text":"([^"]*)"(?=.*video)/,
      /"body":"([^"]+)"/,
      /"content":"([^"]+)"/,
      
      // Threads-specific patterns
      /"thread_items":[^}]*"post":[^}]*"text":"([^"]+)"/,
      /"post_content":"([^"]+)"/,
      /"message":"([^"]+)"/,
      
      // HTML entity encoded patterns
      /caption&quot;:&quot;([^&]+)&quot;/,
      /text&quot;:&quot;([^&]+)&quot;/,
      
      // Alternative text patterns
      /"accessibility_caption":"([^"]+)"/,
      /"alt_text":"([^"]+)"/,
      /"description":"([^"]+)"/,
      
      // Media caption patterns
      /"edge_media_to_caption":[^}]*"text":"([^"]+)"/,
      /"media_preview":[^}]*"text":"([^"]+)"/
    ]
    
    let bestContent = ""
    for (const pattern of postContentPatterns) {
      const matches = html.match(pattern)
      if (matches) {
        for (const match of matches.slice(1)) {
          // Clean and validate content
          const content = match.replace(/\\n/g, '\n')
                              .replace(/\\"/g, '"')
                              .replace(/\\\//g, '/')
                              .replace(/\\t/g, ' ')
                              .trim()
          
          // Filter out system messages and very short content
          const skipWords = ['loading', 'error', 'undefined', 'null']
          if (content.length > 10 && !skipWords.some(skip => content.toLowerCase().includes(skip))) {
            if (content.length > bestContent.length) {
              bestContent = content
            }
          }
        }
      }
    }
    
    if (bestContent) {
      metadata.post_content = bestContent
    }
  }
  
  // Enhanced video title/caption extraction (fallback if post_content not found)
  if (!metadata.post_content && !metadata.title) {
    const titlePatterns = [
      /"title":"([^"]+)"/,
      /"headline":"([^"]+)"/,
      /"summary":"([^"]+)"/
    ]
    
    for (const pattern of titlePatterns) {
      const matches = html.match(pattern)
      if (matches) {
        const title = matches[1].replace(/\\n/g, ' ')
                               .replace(/\\"/g, '"')
                               .replace(/\\\//g, '/')
                               .trim()
        if (title.length > 10) {
          metadata.title = title
          break
        }
      }
    }
  }
  
  // Priority 3: Enhanced video thumbnail extraction (fallback if og:image not found)
  if (!metadata.thumbnail_url) {
    const thumbnailPatterns = [
      // CDN Instagram patterns (as seen in screenshot)
      /https:\/\/scontent-[^\.]+\.cdninstagram\.com\/[^"]*\.(?:jpg|jpeg|png|webp)[^"]*/g,
      
      // Direct thumbnail URLs
      /"thumbnail_url":"([^"]+)"/,
      /"preview_url":"([^"]+)"/,
      /"poster_url":"([^"]+)"/,
      /"cover_url":"([^"]+)"/,
      /"image_url":"([^"]+)"/,
      
      // HTML video poster
      /<video[^>]*poster="([^"]+)"/,
      /"poster":"([^"]+)"/,
      
      // Threads-specific patterns
      /"video_thumbnail":"([^"]+)"/,
      /"preview_image":"([^"]+)"/,
      /"cover_image":"([^"]+)"/,
      
      // HTML entity encoded patterns
      /thumbnail_url&quot;:&quot;([^&]+)&quot;/,
      /poster&quot;:&quot;([^&]+)&quot;/,
      
      // Display resources patterns
      /"display_resources":[^}]*"src":"([^"]+)"/,
      /"thumbnail_resources":[^}]*"src":"([^"]+)"/,
      /"image_versions2":[^}]*"url":"([^"]+)"/,
      
      // Preview image patterns
      /"preview_image_url":"([^"]+)"/,
      /"first_frame":"([^"]+)"/,
      /"video_preview":"([^"]+)"/,
      
      // Generic image patterns for video content
      /"images":[^}]*"url":"([^"]+)"/,
      /"media":[^}]*"url":"([^"]*\.(?:jpg|jpeg|png|webp)[^"]*)"/
    ]
    
    let bestThumbnail: string | null = null
    let highestQualityScore = 0
    
    for (const pattern of thumbnailPatterns) {
      const matches = Array.from(html.matchAll(pattern))
      for (const match of matches) {
        // Handle single match or group match
        let thumbnailUrl = match[1] || match[0]
        if (!thumbnailUrl) continue
        
        // Clean thumbnail URL
        thumbnailUrl = thumbnailUrl.replace(/\\\//g, '/')
                                  .replace(/\\u0026/g, '&')
                                  .trim()
        
        // Validate image URL
        const imageExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
        if (imageExts.some(ext => thumbnailUrl.toLowerCase().includes(ext))) {
          // Score based on URL quality indicators
          let qualityScore = 0
          
          // Higher score for CDN Instagram URLs (as seen in screenshot)
          if (thumbnailUrl.includes('cdninstagram.com')) {
            qualityScore += 5
          }
          if (thumbnailUrl.toLowerCase().includes('hd') || thumbnailUrl.toLowerCase().includes('high')) {
            qualityScore += 3
          }
          if (['1080', '720', '480'].some(size => thumbnailUrl.includes(size))) {
            qualityScore += 2
          }
          if (thumbnailUrl.toLowerCase().includes('thumbnail') || thumbnailUrl.toLowerCase().includes('preview')) {
            qualityScore += 1
          }
          
          if (qualityScore > highestQualityScore || !bestThumbnail) {
            bestThumbnail = thumbnailUrl
            highestQualityScore = qualityScore
          }
        }
      }
    }
    
    if (bestThumbnail) {
      metadata.thumbnail_url = bestThumbnail
    }
  }
  
  console.log('📄 视频元数据提取完成:', {
    hasTitle: !!metadata.title,
    hasThumbnail: !!metadata.thumbnail_url,
    hasContent: !!metadata.post_content,
    contentLength: metadata.post_content?.length || 0
  })
  
  return metadata
}
