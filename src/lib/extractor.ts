import puppeteer, { Page } from 'puppeteer'
import chromium from '@sparticuz/chromium'
import type { VideoData, UserProfile, VideoMetadata, ExtractResult } from './types'

// 检测是否为 Vercel 环境
const isProduction = process.env.NODE_ENV === 'production'

// Puppeteer 配置
const getPuppeteerConfig = async () => {
  if (isProduction) {
    // Vercel 环境配置
    return {
      executablePath: await chromium.executablePath(),
      args: [
        ...chromium.args,
        '--hide-scrollbars',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
      ],
      defaultViewport: {
        width: 1920,
        height: 1080
      },
      headless: true,
    }
  } else {
    // 本地开发环境配置
    return {
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
  }
}

// 用户代理
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

export async function extractThreadsData(threadUrl: string): Promise<ExtractResult> {
  console.log('🚀 开始提取 Threads 数据:', threadUrl)
  
  let browser = null
  
  try {
    // 启动浏览器
    const config = await getPuppeteerConfig()
    browser = await puppeteer.launch(config)
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
    
    // 提取数据 - 参考Python版本的逻辑
    const videos = await extractVideoUrls(pageContent, page)
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

// 提取视频URL - 智能优先级选择与验证
async function extractVideoUrls(html: string, page: Page): Promise<VideoData[]> {
  console.log('🎥 正在提取视频URL...')
  
  // 按优先级排序的正则表达式模式 - 视频相关关键词优先
  const patterns = [
    // 高优先级：明确的视频URL模式
    /"video_url":"(https:[^"]*\.mp4[^"]*)"/g,
    /"playback_url":"(https:[^"]*\.mp4[^"]*)"/g,
    /"dash_prefetch_experimental":"(https:[^"]*\.mp4[^"]*)"/g,
    /"video_dash_manifest":"(https:[^"]*\.mp4[^"]*)"/g,
    
    // 中优先级：通用视频模式
    /"videoUrl":"(https:[^"]*\.mp4[^"]*)"/g,
    /<video[^>]*src="([^"]*\.mp4[^"]*)"/g,
    
    // 低优先级：通用URL模式
    /"src":"(https:[^"]*\.mp4[^"]*)"/g,
    /"url":"(https:[^"]*\.mp4[^"]*)"/g,
    /(https:\/\/[^"\s]*\.mp4[^"\s]*)/g
  ]

  const videoUrls: string[] = []
  
  // 第一步：使用正则表达式收集URL
  for (const pattern of patterns) {
    pattern.lastIndex = 0
    let match
    while ((match = pattern.exec(html)) !== null) {
      const url = match[1] || match[0]
      
      // 清理URL格式
      const cleanUrl = url.replace(/\\\//g, '/')
      
      if (cleanUrl && !videoUrls.includes(cleanUrl)) {
        videoUrls.push(cleanUrl)
        console.log(`🔍 正则匹配找到URL: ${cleanUrl.substring(0, 80)}...`)
      }
    }
  }
  
  // 第二步：直接从video元素获取src属性
  try {
    const directVideoUrls = await page.evaluate(() => {
      const videos = Array.from(document.querySelectorAll('video'))
      return videos.map(video => {
        const src = video.getAttribute('src')
        return src && src.includes('.mp4') ? src : null
      }).filter(Boolean)
    })
    
    for (const src of directVideoUrls) {
      if (src && !videoUrls.includes(src)) {
        videoUrls.push(src)
        console.log(`🎬 从video元素找到URL: ${src.substring(0, 80)}...`)
      }
    }
  } catch (error) {
    console.warn('获取video元素src失败:', error)
  }
  
  console.log(`🔍 总共收集到 ${videoUrls.length} 个候选URL，开始智能评分...`)
  
  if (videoUrls.length === 0) {
    console.log('❌ 没有找到任何视频URL')
    return []
  }
  
  // 第三步：智能URL评分系统
  const scoredUrls = videoUrls.map(url => ({
    url,
    score: calculateUrlScore(url)
  })).sort((a, b) => b.score - a.score) // 按分数降序排序
  
  console.log('📊 URL评分结果:')
  scoredUrls.forEach(({ url, score }, index) => {
    console.log(`  ${index + 1}. 分数: ${score} - ${url.substring(0, 100)}...`)
  })
  
  // 第四步：尝试验证最高分的URL，失败则尝试备选
  for (let i = 0; i < Math.min(scoredUrls.length, 3); i++) {
    const { url: candidateUrl, score } = scoredUrls[i]
    
    // 修复HTML实体编码问题
    const cleanedUrl = candidateUrl
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
    
    console.log(`🧪 测试候选URL ${i + 1} (分数: ${score}): ${cleanedUrl.substring(0, 100)}...`)
    
    // 基本格式验证
    if (isValidVideoUrl(cleanedUrl)) {
      console.log(`✅ URL ${i + 1} 通过基本验证`)
      
      // 可选的HEAD请求验证（仅在生产环境启用以避免过多请求）
      if (process.env.ENABLE_URL_VALIDATION === 'true') {
        const isValid = await validateUrlWithHeadRequest(cleanedUrl)
        if (isValid) {
          console.log(`✅ URL ${i + 1} 通过网络验证`)
          return [{ url: cleanedUrl, index: 1 }]
        } else {
          console.log(`❌ URL ${i + 1} 网络验证失败，尝试下一个...`)
          continue
        }
      } else {
        // 跳过网络验证，直接返回最高分的URL
        return [{ url: cleanedUrl, index: 1 }]
      }
    } else {
      console.log(`❌ URL ${i + 1} 格式验证失败，尝试下一个...`)
    }
  }
  
  // 如果所有URL都验证失败，返回最高分的URL作为最后尝试
  const fallbackUrl = scoredUrls[0].url
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
  
  console.log('⚠️ 所有URL验证都有问题，返回最高分URL作为备选')
  return [{ url: fallbackUrl, index: 1 }]
}

// URL评分函数 - 根据多种因素计算分数
function calculateUrlScore(url: string): number {
  let score = 0
  
  // 1. Instagram CDN 域名优先（+20分）
  if (url.includes('cdninstagram.com')) {
    score += 20
  } else if (url.includes('instagram.com')) {
    score += 15
  }
  
  // 2. 视频相关关键词加分
  const videoKeywords = ['video', 'playback', 'media', 'stream', 'play']
  for (const keyword of videoKeywords) {
    if (url.toLowerCase().includes(keyword)) {
      score += 10
      break // 只加一次分
    }
  }
  
  // 3. 排除明显的缩略图URL（-15分）
  const thumbnailKeywords = ['thumbnail', 'preview', 'thumb', 'cover', 'poster']
  for (const keyword of thumbnailKeywords) {
    if (url.toLowerCase().includes(keyword)) {
      score -= 15
      break
    }
  }
  
  // 4. URL长度和参数完整性（更长的URL通常包含更多参数）
  if (url.length > 200) {
    score += 8
  } else if (url.length > 150) {
    score += 5
  } else if (url.length > 100) {
    score += 3
  }
  
  // 5. 查询参数数量（更多参数通常意味着更完整的URL）
  const paramCount = (url.match(/[?&]/g) || []).length
  score += Math.min(paramCount * 2, 10) // 最多加10分
  
  // 6. 高质量指标
  const qualityIndicators = ['hd', '1080', '720', 'high', 'quality']
  for (const indicator of qualityIndicators) {
    if (url.toLowerCase().includes(indicator)) {
      score += 5
      break
    }
  }
  
  // 7. 协议安全性
  if (url.startsWith('https://')) {
    score += 3
  }
  
  // 8. MP4格式确认
  if (url.includes('.mp4')) {
    score += 5
  }
  
  return score
}

// 基本URL格式验证
function isValidVideoUrl(url: string): boolean {
  try {
    // 基本URL格式检查
    new URL(url)
    
    // 必须是HTTPS
    if (!url.startsWith('https://')) {
      return false
    }
    
    // 必须包含.mp4
    if (!url.includes('.mp4')) {
      return false
    }
    
    // 不能包含明显的错误指标
    const invalidIndicators = ['error', 'null', 'undefined', 'missing']
    if (invalidIndicators.some(indicator => url.toLowerCase().includes(indicator))) {
      return false
    }
    
    return true
  } catch {
    return false
  }
}

// 可选的HEAD请求验证（检查URL是否可访问）
async function validateUrlWithHeadRequest(url: string): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5秒超时
    
    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    })
    
    clearTimeout(timeoutId)
    
    // 检查状态码和Content-Type
    const contentType = response.headers.get('content-type') || ''
    const isVideo = contentType.includes('video/') || contentType.includes('application/octet-stream')
    
    return response.ok && (isVideo || response.status === 200)
  } catch (error) {
    console.warn('URL验证失败:', error)
    return false
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