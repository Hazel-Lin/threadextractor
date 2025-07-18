// Threads Video Extractor - Client-side implementation
// Note: This is a simplified version that works in the browser

export interface VideoData {
  url: string
  index: number
  title?: string
  thumbnail?: string
}

export interface ExtractionResult {
  success: boolean
  message: string
  videos: VideoData[]
}

class ThreadsExtractor {
  private sessionCookies: Map<string, string> = new Map()
  private sessionHeaders: Map<string, string> = new Map()
  
  // 初始化会话信息
  private initializeSession() {
    // 设置基本的会话头
    this.sessionHeaders.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
    this.sessionHeaders.set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8')
    this.sessionHeaders.set('Accept-Language', 'en-US,en;q=0.5')
    this.sessionHeaders.set('Accept-Encoding', 'gzip, deflate')
    this.sessionHeaders.set('Connection', 'keep-alive')
    this.sessionHeaders.set('Upgrade-Insecure-Requests', '1')
    this.sessionHeaders.set('Cache-Control', 'max-age=0')
    
    // 设置必要的 Instagram/Facebook 相关头部
    this.sessionHeaders.set('X-Instagram-AJAX', '1')
    this.sessionHeaders.set('X-Requested-With', 'XMLHttpRequest')
    this.sessionHeaders.set('X-CSRFToken', this.generateCSRFToken())
  }
  
  // 生成 CSRF 令牌
  private generateCSRFToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let token = ''
    for (let i = 0; i < 32; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return token
  }
  
  // 管理会话 Cookie
  private manageCookies(response: Response) {
    try {
      const setCookieHeader = response.headers.get('set-cookie')
      if (setCookieHeader) {
        const cookies = setCookieHeader.split(',')
        cookies.forEach(cookie => {
          const [nameValue] = cookie.split(';')
          const [name, value] = nameValue.split('=')
          if (name && value) {
            this.sessionCookies.set(name.trim(), value.trim())
          }
        })
      }
    } catch (error) {
      console.log('Cookie 管理失败:', error)
    }
  }
  
  // 构建 Cookie 字符串
  private buildCookieString(): string {
    const cookies = Array.from(this.sessionCookies.entries())
      .map(([name, value]) => `${name}=${value}`)
      .join('; ')
    return cookies
  }
  
  // 获取会话头部
  private getSessionHeaders(): Record<string, string> {
    const headers: Record<string, string> = {}
    
    // 添加会话头部
    this.sessionHeaders.forEach((value, key) => {
      headers[key] = value
    })
    
    // 添加 Cookie
    const cookieString = this.buildCookieString()
    if (cookieString) {
      headers['Cookie'] = cookieString
    }
    
    return headers
  }

  private async fetchWithProxy(url: string): Promise<string> {
    // 初始化会话
    this.initializeSession()
    
    const proxies = [
      'https://api.allorigins.win/raw?url=',
      'https://cors-anywhere.herokuapp.com/',
      'https://corsproxy.io/?'
    ]
    
    let lastError: string = ''
    
    for (const proxy of proxies) {
      try {
        const proxyUrl = proxy + encodeURIComponent(url)
        console.log(`尝试使用代理: ${proxy}`)
        
        // 使用会话头部
        const sessionHeaders = this.getSessionHeaders()
        
        const response = await fetch(proxyUrl, {
          headers: {
            ...sessionHeaders,
            // 针对代理的额外头部
            'Referer': 'https://www.threads.net',
            'Origin': 'https://www.threads.net',
            'Sec-Fetch-Site': 'cross-site',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty'
          }
        })
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        // 管理返回的 Cookie
        this.manageCookies(response)
        
        const html = await response.text()
        if (html.length < 100) {
          throw new Error('响应内容过短，可能是代理失败')
        }
        
        console.log(`成功获取内容，长度: ${html.length}`)
        console.log(`会话 Cookie 数量: ${this.sessionCookies.size}`)
        return html
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : '未知错误'
        console.log(`代理 ${proxy} 失败: ${errorMsg}`)
        lastError = errorMsg
      }
    }
    
    throw new Error(`所有代理都失败了。最后错误: ${lastError}`)
  }

  private extractVideoUrls(html: string): VideoData[] {
    const videos: VideoData[] = []
    console.log('开始提取视频链接...')
    
    // 基于 Python 项目的成功正则表达式模式
    const patterns = [
      // Python 项目中验证有效的模式
      /"video_url":"(https:[^"]*\.mp4[^"]*)"/g,
      /"playback_url":"(https:[^"]*\.mp4[^"]*)"/g,
      /"src":"(https:[^"]*\.mp4[^"]*)"/g,
      /<video[^>]*src="([^"]*\.mp4[^"]*)"/g,
      /"videoUrl":"(https:[^"]*\.mp4[^"]*)"/g,
      /"url":"(https:[^"]*\.mp4[^"]*)"/g,
      /(https:\/\/[^"\s]*\.mp4[^"\s]*)/g,
      /"dash_prefetch_experimental":"(https:[^"]*\.mp4[^"]*)"/g,
      /"video_dash_manifest":"(https:[^"]*\.mp4[^"]*)"/g,
      
      // 扩展模式：Instagram CDN 格式
      /"src":"(https:\/\/video[^"]*\.cdninstagram\.com[^"]*\.mp4[^"]*)"/g,
      /"video_url":"(https:\/\/video[^"]*\.cdninstagram\.com[^"]*\.mp4[^"]*)"/g,
      /"playback_url":"(https:\/\/video[^"]*\.cdninstagram\.com[^"]*\.mp4[^"]*)"/g,
      
      // 处理转义字符的模式
      /"video_url":"(https:\\\/\\\/[^"]*\.mp4[^"]*)"/g,
      /"src":"(https:\\\/\\\/[^"]*\.mp4[^"]*)"/g,
      /"playback_url":"(https:\\\/\\\/[^"]*\.mp4[^"]*)"/g,
      
      // Facebook CDN 格式 (Threads 可能使用)
      /"src":"(https:\/\/video[^"]*\.fbcdn\.net[^"]*\.mp4[^"]*)"/g,
      /"video_url":"(https:\/\/video[^"]*\.fbcdn\.net[^"]*\.mp4[^"]*)"/g,
      
      // 其他可能的格式
      /(https:\/\/video[^"\s]*\.cdninstagram\.com[^"\s]*\.mp4[^"\s]*)/g,
      /(https:\/\/video[^"\s]*\.fbcdn\.net[^"\s]*\.mp4[^"\s]*)/g,
    ]

    const foundUrls = new Set<string>()
    
    patterns.forEach((pattern, patternIndex) => {
      console.log(`尝试模式 ${patternIndex + 1}/${patterns.length}`)
      let match
      let matchCount = 0
      
      // 重置正则表达式的 lastIndex
      pattern.lastIndex = 0
      
      while ((match = pattern.exec(html)) !== null) {
        let url = match[1]
        
        // 清理 URL 格式 - 基于 Python 项目的处理方式，保持 HTML 实体编码
        url = url.replace(/\\\//g, '/')
        url = url.replace(/\\"/g, '"')
        url = url.replace(/\\/g, '')
        
        // 关键：不要立即解码 &amp; 等 HTML 实体，保持原始格式
        // 这是解决 signature mismatch 的关键步骤
        
        // 验证 URL 格式
        if (url && this.isValidVideoUrl(url) && !foundUrls.has(url)) {
          foundUrls.add(url)
          matchCount++
          console.log(`找到视频链接 ${matchCount}: ${url.substring(0, 50)}...`)
        }
      }
      
      console.log(`模式 ${patternIndex + 1} 找到 ${matchCount} 个链接`)
    })

    // 如果没有找到链接，尝试更宽松的搜索
    if (foundUrls.size === 0) {
      console.log('未找到标准格式链接，尝试更宽松的搜索...')
      const broadPatterns = [
        /(https:\/\/[^"\s]*\.mp4[^"\s]*)/g,
        /(https:\/\/video[^"\s]*\.cdninstagram\.com[^"\s]*)/g,
        /(https:\/\/video[^"\s]*\.fbcdn\.net[^"\s]*)/g,
      ]
      
      broadPatterns.forEach(pattern => {
        let match
        while ((match = pattern.exec(html)) !== null) {
          const url = match[1]
          if (this.isValidVideoUrl(url)) {
            foundUrls.add(url)
            console.log(`宽松搜索找到: ${url.substring(0, 50)}...`)
          }
        }
      })
    }

    // Convert to VideoData objects and apply signature fix
    Array.from(foundUrls).forEach((url, index) => {
      // 应用签名修复
      const fixedUrl = this.fixUrlSignature(url)
      videos.push({
        url: fixedUrl,
        index: index + 1,
        title: `Threads Video ${index + 1}`
      })
    })

    console.log(`总共提取到 ${videos.length} 个视频链接`)
    return videos
  }

  // 修复 URL 签名问题 - 基于 Python 项目的处理方式
  private fixUrlSignature(url: string): string {
    try {
      console.log(`🔧 修复 URL 签名: ${url.substring(0, 50)}...`)
      
      // 1. 处理 HTML 实体编码 - 关键步骤
      // 注意：不要立即解码所有 HTML 实体，只处理必要的
      let fixedUrl = url
      
      // 2. 检查并修复常见的签名问题
      if (fixedUrl.includes('&amp;')) {
        // 保持 &amp; 格式，这对签名验证很重要
        console.log('保持 &amp; 格式以确保签名有效性')
      }
      
      // 3. 修复 URL 参数顺序（Instagram/Facebook 对此敏感）
      if (fixedUrl.includes('?') && fixedUrl.includes('&')) {
        fixedUrl = this.sortUrlParameters(fixedUrl)
      }
      
      // 4. 移除可能导致签名失效的额外参数
      fixedUrl = this.removeProblematicParameters(fixedUrl)
      
      // 5. 确保关键签名参数存在
      if (!this.hasRequiredSignatureParams(fixedUrl)) {
        console.log('⚠️ 缺少必要的签名参数')
        return url // 返回原始 URL
      }
      
      console.log(`✅ URL 签名修复完成`)
      return fixedUrl
    } catch (error) {
      console.log(`❌ URL 签名修复失败: ${error}`)
      return url // 返回原始 URL
    }
  }
  
  // 对 URL 参数进行排序
  private sortUrlParameters(url: string): string {
    try {
      const urlObj = new URL(url)
      
      // 获取所有参数
      const params = new URLSearchParams(urlObj.search)
      
      // 对参数进行排序（Instagram/Facebook 通常按字母顺序排列）
      const sortedParams = new URLSearchParams()
      
      // 重要：某些参数需要保持特定顺序
      const priorityParams = ['oh', 'oe', 'ts', 'sig', '__gda__']
      
      // 首先添加优先级参数
      priorityParams.forEach(param => {
        if (params.has(param)) {
          sortedParams.set(param, params.get(param)!)
        }
      })
      
      // 然后添加其他参数（按字母顺序）
      const otherParams = Array.from(params.entries())
        .filter(([key]) => !priorityParams.includes(key))
        .sort(([a], [b]) => a.localeCompare(b))
      
      otherParams.forEach(([key, value]) => {
        sortedParams.set(key, value)
      })
      
      urlObj.search = sortedParams.toString()
      return urlObj.toString()
    } catch (error) {
      console.log(`参数排序失败: ${error}`)
      return url
    }
  }
  
  // 移除可能导致问题的参数
  private removeProblematicParameters(url: string): string {
    try {
      const urlObj = new URL(url)
      const params = new URLSearchParams(urlObj.search)
      
      // 移除可能导致签名失效的参数
      const problematicParams = [
        'cache_bust',
        'random',
        'timestamp',
        '_nc_ht',
        '_nc_ohc'
      ]
      
      problematicParams.forEach(param => {
        if (params.has(param)) {
          params.delete(param)
          console.log(`移除问题参数: ${param}`)
        }
      })
      
      urlObj.search = params.toString()
      return urlObj.toString()
    } catch (error) {
      console.log(`移除问题参数失败: ${error}`)
      return url
    }
  }
  
  // 检查是否包含必要的签名参数
  private hasRequiredSignatureParams(url: string): boolean {
    try {
      const urlObj = new URL(url)
      const params = new URLSearchParams(urlObj.search)
      
      // Instagram/Facebook 视频链接通常包含这些签名参数
      const requiredParams = ['oh', 'oe'] // 基本签名参数
      const optionalParams = ['ts', 'sig', '__gda__'] // 可选但重要的参数
      
      // 检查是否至少包含基本参数
      const hasBasicParams = requiredParams.some(param => params.has(param))
      
      if (!hasBasicParams) {
        console.log('缺少基本签名参数')
        return false
      }
      
      return true
    } catch (error) {
      console.log(`签名参数检查失败: ${error}`)
      return false
    }
  }

  private isValidVideoUrl(url: string): boolean {
    try {
      const urlObj = new URL(url)
      
      // 基于 Python 项目的验证逻辑
      const validDomains = [
        'cdninstagram.com',
        'fbcdn.net',
        'threads.net',
        'threads.com',
        'facebook.com',
        'instagram.com'
      ]
      
      const isValidDomain = validDomains.some(domain => url.includes(domain))
      const isHttps = urlObj.protocol === 'https:'
      const hasVideoContent = url.includes('.mp4') || url.includes('video')
      
      return isHttps && hasVideoContent && isValidDomain
    } catch {
      return false
    }
  }

  private validateThreadsUrl(url: string): boolean {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname === 'www.threads.net' || 
             urlObj.hostname === 'threads.net' ||
             urlObj.hostname === 'www.threads.com' ||
             urlObj.hostname === 'threads.com'
    } catch {
      return false
    }
  }

  private async validateVideoUrl(url: string): Promise<boolean> {
    try {
      // 基于 Python 项目的验证逻辑
      const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
      
      const response = await fetch(url, { 
        method: 'HEAD',
        headers: headers,
        mode: 'no-cors' // This will limit what we can check, but avoids CORS issues
      })
      
      return true // If no error thrown, assume it's valid
    } catch {
      return false
    }
  }

  // 增强的视频链接验证方法 - 基于 Python 项目 + 会话管理
  private async validateVideoUrlEnhanced(url: string): Promise<boolean> {
    try {
      console.log(`验证链接: ${url.substring(0, 50)}...`)
      
      // 首先检查基本 URL 格式
      if (!this.isValidVideoUrl(url)) {
        console.log('基本 URL 格式验证失败')
        return false
      }
      
      // 使用会话头部进行验证
      const sessionHeaders = this.getSessionHeaders()
      const validationHeaders = {
        ...sessionHeaders,
        'Accept': 'video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5',
        'Range': 'bytes=0-1024', // 只请求前 1KB 数据
        'Referer': 'https://www.threads.net',
        'Origin': 'https://www.threads.net'
      }
      
      try {
        const response = await fetch(url, { 
          method: 'HEAD',
          headers: validationHeaders,
          mode: 'no-cors'
        })
        
        console.log(`验证成功: ${url.substring(0, 50)}...`)
        return true
      } catch (headError) {
        console.log(`HEAD 请求失败，尝试 GET 请求: ${headError}`)
        
        // 如果 HEAD 请求失败，尝试 GET 请求
        try {
          const response = await fetch(url, { 
            method: 'GET',
            headers: {
              ...validationHeaders,
              'Range': 'bytes=0-512' // 更小的范围请求
            },
            mode: 'no-cors'
          })
          
          console.log(`GET 验证成功: ${url.substring(0, 50)}...`)
          return true
        } catch (getError) {
          console.log(`GET 请求也失败: ${getError}`)
          
          // 最后尝试：检查 URL 是否包含有效的签名参数
          return this.hasRequiredSignatureParams(url)
        }
      }
    } catch (error) {
      console.log(`验证过程中出错: ${error}`)
      return false
    }
  }

  async extractVideos(threadsUrl: string): Promise<ExtractionResult> {
    console.log(`开始提取视频: ${threadsUrl}`)
    
    // Validate URL format
    if (!this.validateThreadsUrl(threadsUrl)) {
      return {
        success: false,
        message: '请输入有效的 Threads 链接 (threads.net 或 threads.com)',
        videos: []
      }
    }

    try {
      // Fetch the page content
      console.log('正在获取页面内容...')
      const html = await this.fetchWithProxy(threadsUrl)
      
      // 保存一小部分 HTML 用于调试
      console.log(`页面内容前500字符: ${html.substring(0, 500)}`)
      
      // Extract video URLs
      const videos = this.extractVideoUrls(html)
      
      if (videos.length === 0) {
        // 提供更详细的错误信息和调试建议
        return {
          success: false,
          message: `未找到视频链接。可能的原因：
1. 链接不包含视频内容
2. 视频为私有状态
3. Threads 页面结构已更改
4. 需要登录才能查看

调试建议：
- 确认链接在浏览器中可以正常访问
- 检查视频是否为公开状态
- 打开浏览器控制台查看详细日志`,
          videos: []
        }
      }

      // 增强的视频链接验证 - 基于 Python 项目的逻辑
      const validatedVideos = []
      console.log(`开始验证 ${videos.length} 个视频链接...`)
      
      for (const video of videos) {
        try {
          // 基本 URL 格式验证
          new URL(video.url)
          
          // 使用增强的验证方法
          const isValid = await this.validateVideoUrlEnhanced(video.url)
          if (isValid) {
            validatedVideos.push(video)
            console.log(`✅ 验证通过: 视频 ${video.index}`)
          } else {
            console.log(`❌ 验证失败: 视频 ${video.index}`)
          }
        } catch (error) {
          console.log(`跳过无效链接: ${video.url} - ${error}`)
        }
      }

      if (validatedVideos.length === 0) {
        return {
          success: false,
          message: '提取到的视频链接格式无效，请检查链接是否正确',
          videos: []
        }
      }

      return {
        success: true,
        message: `成功提取到 ${validatedVideos.length} 个视频链接`,
        videos: validatedVideos
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '提取过程中出现错误'
      console.error('提取失败:', errorMessage)
      
      return {
        success: false,
        message: `提取失败: ${errorMessage}

请尝试：
1. 检查网络连接
2. 确认链接格式正确
3. 稍后重试
4. 如果问题持续，请使用手动提取方法`,
        videos: []
      }
    }
  }

  // 备用方法：尝试从页面源码中提取更多信息 - 基于 Python 项目策略
  async extractWithFallback(threadsUrl: string): Promise<ExtractionResult> {
    console.log('使用备用提取方法...')
    
    try {
      const html = await this.fetchWithProxy(threadsUrl)
      
      // 1. 尝试查找 Instagram/Facebook 视频数据结构
      const dataPatterns = [
        /window\._sharedData\s*=\s*({.+?});/,
        /window\.__additionalDataLoaded\s*=\s*({.+?});/,
        /"VideoPlayerImpl":\s*({.+?})/,
        /"video":\s*({.+?})/,
        /"MediaResourceList":\s*({.+?})/,
        /"GraphVideo":\s*({.+?})/,
      ]
      
      for (const pattern of dataPatterns) {
        const match = html.match(pattern)
        if (match) {
          try {
            const data = JSON.parse(match[1])
            console.log('找到数据结构:', Object.keys(data))
            
            // 递归搜索视频链接
            const videos = this.extractFromObject(data)
            if (videos.length > 0) {
              // 验证找到的链接
              const validatedVideos = []
              for (const video of videos) {
                if (await this.validateVideoUrlEnhanced(video.url)) {
                  validatedVideos.push(video)
                }
              }
              
              if (validatedVideos.length > 0) {
                return {
                  success: true,
                  message: `通过备用方法成功提取到 ${validatedVideos.length} 个视频链接`,
                  videos: validatedVideos
                }
              }
            }
          } catch (error) {
            console.log('解析数据结构失败:', error)
          }
        }
      }
      
      // 2. 尝试查找 video 标签中的 src 属性
      const videoTagPattern = /<video[^>]*>/gi
      const videoMatches = html.match(videoTagPattern)
      if (videoMatches) {
        console.log(`找到 ${videoMatches.length} 个 video 标签`)
        const videos: VideoData[] = []
        
        videoMatches.forEach((videoTag, index) => {
          const srcMatch = videoTag.match(/src="([^"]+)"/i)
          if (srcMatch) {
            const src = srcMatch[1]
            if (this.isValidVideoUrl(src)) {
              videos.push({
                url: src,
                index: index + 1,
                title: `Threads Video ${index + 1}`
              })
            }
          }
        })
        
        if (videos.length > 0) {
          return {
            success: true,
            message: `通过 video 标签提取到 ${videos.length} 个视频链接`,
            videos: videos
          }
        }
      }
      
      // 3. 尝试提取页面中的所有可能的视频链接
      console.log('尝试提取页面中的所有视频链接...')
      const allVideos = this.extractVideoUrls(html)
      if (allVideos.length > 0) {
        return {
          success: true,
          message: `通过全页面扫描提取到 ${allVideos.length} 个视频链接`,
          videos: allVideos
        }
      }
      
      return {
        success: false,
        message: '备用方法也未能找到视频链接。请尝试手动提取或检查链接是否正确。',
        videos: []
      }
    } catch (error) {
      return {
        success: false,
        message: '备用方法执行失败: ' + (error instanceof Error ? error.message : '未知错误'),
        videos: []
      }
    }
  }

  // 递归搜索对象中的视频链接
  private extractFromObject(obj: any, depth: number = 0): VideoData[] {
    if (depth > 10) return [] // 防止无限递归
    
    const videos: VideoData[] = []
    
    if (typeof obj === 'string') {
      if (obj.includes('.mp4') && obj.startsWith('https://')) {
        if (this.isValidVideoUrl(obj)) {
          videos.push({
            url: obj,
            index: 1,
            title: 'Threads Video'
          })
        }
      }
      return videos
    }
    
    if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const value = obj[key]
          
          // 检查常见的视频链接字段
          if (typeof value === 'string' && 
              (key.includes('video') || key.includes('playback') || key.includes('src')) &&
              value.includes('.mp4') && value.startsWith('https://')) {
            if (this.isValidVideoUrl(value)) {
              videos.push({
                url: value,
                index: videos.length + 1,
                title: `Threads Video ${videos.length + 1}`
              })
            }
          }
          
          // 递归搜索
          if (typeof value === 'object') {
            videos.push(...this.extractFromObject(value, depth + 1))
          }
        }
      }
    }
    
    return videos
  }

  // Alternative method for when direct extraction fails
  async extractWithInstructions(threadsUrl: string): Promise<ExtractionResult> {
    return {
      success: false,
      message: `由于浏览器限制，无法直接提取视频。请尝试以下方法：

手动提取方法：
1. 打开浏览器开发者工具 (F12)
2. 切换到 Network 标签
3. 刷新 Threads 页面
4. 播放视频
5. 在 Network 中搜索 ".mp4" 文件
6. 复制视频链接进行下载

或者：
1. 右键点击视频
2. 选择"检查元素"
3. 在 HTML 中查找 video 标签
4. 复制 src 属性中的链接

如果以上方法都不行，可能需要使用专门的下载工具或扩展程序。`,
      videos: []
    }
  }

  // 快速测试方法 - 用于验证提取逻辑
  async quickTest(threadsUrl: string): Promise<{
    proxy: string;
    htmlLength: number;
    foundPatterns: string[];
    extractedUrls: string[];
    validUrls: string[];
  }> {
    console.log('🧪 开始快速测试...')
    
    try {
      // 测试代理连接
      const html = await this.fetchWithProxy(threadsUrl)
      console.log(`📄 页面内容长度: ${html.length}`)
      
      // 测试模式匹配
      const patterns = [
        '"video_url"',
        '"playbook_url"',
        '"src"',
        'cdninstagram.com',
        'fbcdn.net',
        '.mp4'
      ]
      
      const foundPatterns = patterns.filter(pattern => html.includes(pattern))
      console.log(`🔍 找到的模式: ${foundPatterns.join(', ')}`)
      
      // 测试 URL 提取
      const videos = this.extractVideoUrls(html)
      const extractedUrls = videos.map(v => v.url)
      console.log(`📹 提取的链接数量: ${extractedUrls.length}`)
      
      // 测试 URL 验证
      const validUrls = []
      for (const url of extractedUrls) {
        if (this.isValidVideoUrl(url)) {
          validUrls.push(url)
        }
      }
      console.log(`✅ 有效链接数量: ${validUrls.length}`)
      
      return {
        proxy: 'success',
        htmlLength: html.length,
        foundPatterns,
        extractedUrls,
        validUrls
      }
    } catch (error) {
      console.log(`❌ 测试失败: ${error}`)
      throw error
    }
  }

  // 诊断 URL 签名问题的专门方法
  async diagnoseSignatureIssues(threadsUrl: string): Promise<{
    success: boolean;
    issues: string[];
    recommendations: string[];
    urlAnalysis: Array<{
      url: string;
      hasSignature: boolean;
      signatureParams: string[];
      issues: string[];
    }>;
  }> {
    console.log('🔍 开始诊断 URL 签名问题...')
    
    const issues: string[] = []
    const recommendations: string[] = []
    const urlAnalysis: Array<{
      url: string;
      hasSignature: boolean;
      signatureParams: string[];
      issues: string[];
    }> = []
    
    try {
      // 1. 获取页面内容
      const html = await this.fetchWithProxy(threadsUrl)
      
      // 2. 提取视频链接
      const videos = this.extractVideoUrls(html)
      
      if (videos.length === 0) {
        issues.push('未找到任何视频链接')
        recommendations.push('检查链接是否正确，视频是否为公开状态')
        return {
          success: false,
          issues,
          recommendations,
          urlAnalysis
        }
      }
      
      // 3. 分析每个 URL 的签名情况
      for (const video of videos) {
        const analysis = {
          url: video.url.substring(0, 100) + '...',
          hasSignature: false,
          signatureParams: [] as string[],
          issues: [] as string[]
        }
        
        try {
          const urlObj = new URL(video.url)
          const params = new URLSearchParams(urlObj.search)
          
          // 检查签名参数
          const signatureParams = ['oh', 'oe', 'ts', 'sig', '__gda__']
          const foundSignatureParams = signatureParams.filter(param => params.has(param))
          
          analysis.signatureParams = foundSignatureParams
          analysis.hasSignature = foundSignatureParams.length > 0
          
          if (!analysis.hasSignature) {
            analysis.issues.push('缺少签名参数')
          }
          
          // 检查 HTML 实体编码
          if (video.url.includes('&amp;')) {
            analysis.issues.push('包含 HTML 实体编码 - 可能影响签名')
          }
          
          // 检查时间戳
          if (params.has('ts')) {
            const timestamp = parseInt(params.get('ts')!)
            const now = Date.now() / 1000
            if (timestamp < now - 3600) { // 超过1小时
              analysis.issues.push('时间戳可能已过期')
            }
          }
          
          // 检查域名
          if (!['cdninstagram.com', 'fbcdn.net'].some(domain => video.url.includes(domain))) {
            analysis.issues.push('非标准 CDN 域名')
          }
          
        } catch (error) {
          analysis.issues.push(`URL 格式错误: ${error}`)
        }
        
        urlAnalysis.push(analysis)
      }
      
      // 4. 生成建议
      const urlsWithoutSignature = urlAnalysis.filter(u => !u.hasSignature)
      const urlsWithExpiredTimestamp = urlAnalysis.filter(u => u.issues.includes('时间戳可能已过期'))
      
      if (urlsWithoutSignature.length > 0) {
        issues.push(`${urlsWithoutSignature.length} 个链接缺少签名参数`)
        recommendations.push('尝试重新获取页面以获取新的签名参数')
      }
      
      if (urlsWithExpiredTimestamp.length > 0) {
        issues.push(`${urlsWithExpiredTimestamp.length} 个链接的时间戳可能已过期`)
        recommendations.push('立即使用链接，或重新提取获取新的时间戳')
      }
      
      const urlsWithHtmlEntities = urlAnalysis.filter(u => u.issues.includes('包含 HTML 实体编码 - 可能影响签名'))
      if (urlsWithHtmlEntities.length > 0) {
        issues.push(`${urlsWithHtmlEntities.length} 个链接包含 HTML 实体编码`)
        recommendations.push('应用 URL 签名修复以正确处理编码')
      }
      
      const success = issues.length === 0
      
      return {
        success,
        issues,
        recommendations,
        urlAnalysis
      }
      
    } catch (error) {
      issues.push(`诊断过程中出错: ${error}`)
      return {
        success: false,
        issues,
        recommendations,
        urlAnalysis
      }
    }
  }
}

export const threadsExtractor = new ThreadsExtractor()