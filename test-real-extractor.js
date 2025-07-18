#!/usr/bin/env node

// Test the actual ThreadsExtractor class functionality
const testUrl = 'https://www.threads.com/@rahulchauh_n/post/DMNShzDN9y0?xmt=AQF0QCNcWmLeAhvj7CKJeyrzmpLaxdqGLlZWHdr2L358nQ';

console.log('🎯 Real ThreadsExtractor Test');
console.log('=============================');
console.log(`Testing URL: ${testUrl}`);
console.log('');

// Simulate the ThreadsExtractor class
class ThreadsExtractor {
  constructor() {
    this.sessionCookies = new Map();
    this.sessionHeaders = new Map();
  }
  
  initializeSession() {
    this.sessionHeaders.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    this.sessionHeaders.set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8');
    this.sessionHeaders.set('Accept-Language', 'en-US,en;q=0.5');
    this.sessionHeaders.set('Accept-Encoding', 'gzip, deflate');
    this.sessionHeaders.set('Connection', 'keep-alive');
    this.sessionHeaders.set('Upgrade-Insecure-Requests', '1');
    this.sessionHeaders.set('Cache-Control', 'max-age=0');
    this.sessionHeaders.set('X-Instagram-AJAX', '1');
    this.sessionHeaders.set('X-Requested-With', 'XMLHttpRequest');
    this.sessionHeaders.set('X-CSRFToken', this.generateCSRFToken());
  }
  
  generateCSRFToken() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 32; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }
  
  getSessionHeaders() {
    const headers = {};
    this.sessionHeaders.forEach((value, key) => {
      headers[key] = value;
    });
    return headers;
  }
  
  async fetchWithProxy(url) {
    this.initializeSession();
    
    const proxies = [
      'https://api.allorigins.win/raw?url=',
      'https://cors-anywhere.herokuapp.com/',
      'https://corsproxy.io/?'
    ];
    
    let lastError = '';
    
    for (const proxy of proxies) {
      try {
        const proxyUrl = proxy + encodeURIComponent(url);
        console.log(`尝试使用代理: ${proxy}`);
        
        const sessionHeaders = this.getSessionHeaders();
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(proxyUrl, {
          signal: controller.signal,
          headers: {
            ...sessionHeaders,
            'Referer': 'https://www.threads.net',
            'Origin': 'https://www.threads.net',
            'Sec-Fetch-Site': 'cross-site',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const html = await response.text();
        if (html.length < 100) {
          throw new Error('响应内容过短，可能是代理失败');
        }
        
        console.log(`成功获取内容，长度: ${html.length}`);
        return html;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : '未知错误';
        console.log(`代理 ${proxy} 失败: ${errorMsg}`);
        lastError = errorMsg;
      }
    }
    
    throw new Error(`所有代理都失败了。最后错误: ${lastError}`);
  }
  
  extractVideoUrls(html) {
    const videos = [];
    console.log('开始提取视频链接...');
    
    const patterns = [
      /"video_url":"(https:[^"]*\.mp4[^"]*)"/g,
      /"playback_url":"(https:[^"]*\.mp4[^"]*)"/g,
      /"src":"(https:[^"]*\.mp4[^"]*)"/g,
      /<video[^>]*src="([^"]*\.mp4[^"]*)"/g,
      /"videoUrl":"(https:[^"]*\.mp4[^"]*)"/g,
      /"url":"(https:[^"]*\.mp4[^"]*)"/g,
      /(https:\/\/[^"\s]*\.mp4[^"\s]*)/g,
      /"src":"(https:\/\/video[^"]*\.cdninstagram\.com[^"]*\.mp4[^"]*)"/g,
      /"video_url":"(https:\/\/video[^"]*\.cdninstagram\.com[^"]*\.mp4[^"]*)"/g,
      /"playback_url":"(https:\/\/video[^"]*\.cdninstagram\.com[^"]*\.mp4[^"]*)"/g,
      /"src":"(https:\/\/video[^"]*\.fbcdn\.net[^"]*\.mp4[^"]*)"/g,
      /"video_url":"(https:\/\/video[^"]*\.fbcdn\.net[^"]*\.mp4[^"]*)"/g,
      /(https:\/\/video[^"\s]*\.cdninstagram\.com[^"\s]*\.mp4[^"\s]*)/g,
      /(https:\/\/video[^"\s]*\.fbcdn\.net[^"\s]*\.mp4[^"\s]*)/g,
    ];

    const foundUrls = new Set();
    
    patterns.forEach((pattern, patternIndex) => {
      console.log(`尝试模式 ${patternIndex + 1}/${patterns.length}`);
      let match;
      let matchCount = 0;
      
      pattern.lastIndex = 0;
      
      while ((match = pattern.exec(html)) !== null) {
        let url = match[1];
        
        url = url.replace(/\\\//g, '/');
        url = url.replace(/\\"/g, '"');
        url = url.replace(/\\/g, '');
        
        if (url && this.isValidVideoUrl(url) && !foundUrls.has(url)) {
          foundUrls.add(url);
          matchCount++;
          console.log(`找到视频链接 ${matchCount}: ${url.substring(0, 50)}...`);
        }
      }
      
      console.log(`模式 ${patternIndex + 1} 找到 ${matchCount} 个链接`);
    });

    // Convert to VideoData objects
    Array.from(foundUrls).forEach((url, index) => {
      const fixedUrl = this.fixUrlSignature(url);
      videos.push({
        url: fixedUrl,
        index: index + 1,
        title: `Threads Video ${index + 1}`
      });
    });

    console.log(`总共提取到 ${videos.length} 个视频链接`);
    return videos;
  }
  
  fixUrlSignature(url) {
    try {
      console.log(`🔧 修复 URL 签名: ${url.substring(0, 50)}...`);
      
      let fixedUrl = url;
      
      if (fixedUrl.includes('&amp;')) {
        console.log('保持 &amp; 格式以确保签名有效性');
      }
      
      if (fixedUrl.includes('?') && fixedUrl.includes('&')) {
        fixedUrl = this.sortUrlParameters(fixedUrl);
      }
      
      fixedUrl = this.removeProblematicParameters(fixedUrl);
      
      if (!this.hasRequiredSignatureParams(fixedUrl)) {
        console.log('⚠️ 缺少必要的签名参数');
        return url;
      }
      
      console.log(`✅ URL 签名修复完成`);
      return fixedUrl;
    } catch (error) {
      console.log(`❌ URL 签名修复失败: ${error}`);
      return url;
    }
  }
  
  sortUrlParameters(url) {
    try {
      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);
      const sortedParams = new URLSearchParams();
      
      const priorityParams = ['oh', 'oe', 'ts', 'sig', '__gda__'];
      
      priorityParams.forEach(param => {
        if (params.has(param)) {
          sortedParams.set(param, params.get(param));
        }
      });
      
      const otherParams = Array.from(params.entries())
        .filter(([key]) => !priorityParams.includes(key))
        .sort(([a], [b]) => a.localeCompare(b));
      
      otherParams.forEach(([key, value]) => {
        sortedParams.set(key, value);
      });
      
      urlObj.search = sortedParams.toString();
      return urlObj.toString();
    } catch (error) {
      console.log(`参数排序失败: ${error}`);
      return url;
    }
  }
  
  removeProblematicParameters(url) {
    try {
      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);
      
      const problematicParams = [
        'cache_bust',
        'random',
        'timestamp',
        '_nc_ht',
        '_nc_ohc'
      ];
      
      problematicParams.forEach(param => {
        if (params.has(param)) {
          params.delete(param);
          console.log(`移除问题参数: ${param}`);
        }
      });
      
      urlObj.search = params.toString();
      return urlObj.toString();
    } catch (error) {
      console.log(`移除问题参数失败: ${error}`);
      return url;
    }
  }
  
  hasRequiredSignatureParams(url) {
    try {
      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);
      
      const requiredParams = ['oh', 'oe'];
      const hasBasicParams = requiredParams.some(param => params.has(param));
      
      if (!hasBasicParams) {
        console.log('缺少基本签名参数');
        return false;
      }
      
      return true;
    } catch (error) {
      console.log(`签名参数检查失败: ${error}`);
      return false;
    }
  }
  
  isValidVideoUrl(url) {
    try {
      const urlObj = new URL(url);
      
      const validDomains = [
        'cdninstagram.com',
        'fbcdn.net',
        'threads.net',
        'threads.com',
        'facebook.com',
        'instagram.com'
      ];
      
      const isValidDomain = validDomains.some(domain => url.includes(domain));
      const isHttps = urlObj.protocol === 'https:';
      const hasVideoContent = url.includes('.mp4') || url.includes('video');
      
      return isHttps && hasVideoContent && isValidDomain;
    } catch {
      return false;
    }
  }
  
  validateThreadsUrl(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname === 'www.threads.net' || 
             urlObj.hostname === 'threads.net' ||
             urlObj.hostname === 'www.threads.com' ||
             urlObj.hostname === 'threads.com';
    } catch {
      return false;
    }
  }
  
  async extractVideos(threadsUrl) {
    console.log(`开始提取视频: ${threadsUrl}`);
    
    if (!this.validateThreadsUrl(threadsUrl)) {
      return {
        success: false,
        message: '请输入有效的 Threads 链接 (threads.net 或 threads.com)',
        videos: []
      };
    }

    try {
      console.log('正在获取页面内容...');
      const html = await this.fetchWithProxy(threadsUrl);
      
      console.log(`页面内容前500字符: ${html.substring(0, 500)}`);
      
      const videos = this.extractVideoUrls(html);
      
      if (videos.length === 0) {
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
        };
      }

      return {
        success: true,
        message: `成功提取到 ${videos.length} 个视频链接`,
        videos: videos
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '提取过程中出现错误';
      console.error('提取失败:', errorMessage);
      
      return {
        success: false,
        message: `提取失败: ${errorMessage}

请尝试：
1. 检查网络连接
2. 确认链接格式正确
3. 稍后重试
4. 如果问题持续，请使用手动提取方法`,
        videos: []
      };
    }
  }
  
  async quickTest(threadsUrl) {
    console.log('🧪 开始快速测试...');
    
    try {
      const html = await this.fetchWithProxy(threadsUrl);
      console.log(`📄 页面内容长度: ${html.length}`);
      
      const patterns = [
        '"video_url"',
        '"playback_url"',
        '"src"',
        'cdninstagram.com',
        'fbcdn.net',
        '.mp4'
      ];
      
      const foundPatterns = patterns.filter(pattern => html.includes(pattern));
      console.log(`🔍 找到的模式: ${foundPatterns.join(', ')}`);
      
      const videos = this.extractVideoUrls(html);
      const extractedUrls = videos.map(v => v.url);
      console.log(`📹 提取的链接数量: ${extractedUrls.length}`);
      
      const validUrls = [];
      for (const url of extractedUrls) {
        if (this.isValidVideoUrl(url)) {
          validUrls.push(url);
        }
      }
      console.log(`✅ 有效链接数量: ${validUrls.length}`);
      
      return {
        proxy: 'success',
        htmlLength: html.length,
        foundPatterns,
        extractedUrls,
        validUrls
      };
    } catch (error) {
      console.log(`❌ 测试失败: ${error}`);
      throw error;
    }
  }
  
  async diagnoseSignatureIssues(threadsUrl) {
    console.log('🔍 开始诊断 URL 签名问题...');
    
    const issues = [];
    const recommendations = [];
    const urlAnalysis = [];
    
    try {
      const html = await this.fetchWithProxy(threadsUrl);
      const videos = this.extractVideoUrls(html);
      
      if (videos.length === 0) {
        issues.push('未找到任何视频链接');
        recommendations.push('检查链接是否正确，视频是否为公开状态');
        return {
          success: false,
          issues,
          recommendations,
          urlAnalysis
        };
      }
      
      for (const video of videos) {
        const analysis = {
          url: video.url.substring(0, 100) + '...',
          hasSignature: false,
          signatureParams: [],
          issues: []
        };
        
        try {
          const urlObj = new URL(video.url);
          const params = new URLSearchParams(urlObj.search);
          
          const signatureParams = ['oh', 'oe', 'ts', 'sig', '__gda__'];
          const foundSignatureParams = signatureParams.filter(param => params.has(param));
          
          analysis.signatureParams = foundSignatureParams;
          analysis.hasSignature = foundSignatureParams.length > 0;
          
          if (!analysis.hasSignature) {
            analysis.issues.push('缺少签名参数');
          }
          
          if (video.url.includes('&amp;')) {
            analysis.issues.push('包含 HTML 实体编码 - 可能影响签名');
          }
          
          if (params.has('ts')) {
            const timestamp = parseInt(params.get('ts'));
            const now = Date.now() / 1000;
            if (timestamp < now - 3600) {
              analysis.issues.push('时间戳可能已过期');
            }
          }
          
          if (!['cdninstagram.com', 'fbcdn.net'].some(domain => video.url.includes(domain))) {
            analysis.issues.push('非标准 CDN 域名');
          }
          
        } catch (error) {
          analysis.issues.push(`URL 格式错误: ${error}`);
        }
        
        urlAnalysis.push(analysis);
      }
      
      const urlsWithoutSignature = urlAnalysis.filter(u => !u.hasSignature);
      const urlsWithExpiredTimestamp = urlAnalysis.filter(u => u.issues.includes('时间戳可能已过期'));
      
      if (urlsWithoutSignature.length > 0) {
        issues.push(`${urlsWithoutSignature.length} 个链接缺少签名参数`);
        recommendations.push('尝试重新获取页面以获取新的签名参数');
      }
      
      if (urlsWithExpiredTimestamp.length > 0) {
        issues.push(`${urlsWithExpiredTimestamp.length} 个链接的时间戳可能已过期`);
        recommendations.push('立即使用链接，或重新提取获取新的时间戳');
      }
      
      const success = issues.length === 0;
      
      return {
        success,
        issues,
        recommendations,
        urlAnalysis
      };
      
    } catch (error) {
      issues.push(`诊断过程中出错: ${error}`);
      return {
        success: false,
        issues,
        recommendations,
        urlAnalysis
      };
    }
  }
}

// Run the tests
async function runTests() {
  const extractor = new ThreadsExtractor();
  
  console.log('1. Testing extractVideos method');
  console.log('-------------------------------');
  
  try {
    const result = await extractor.extractVideos(testUrl);
    console.log(`Success: ${result.success}`);
    console.log(`Message: ${result.message}`);
    console.log(`Videos found: ${result.videos.length}`);
    
    if (result.videos.length > 0) {
      result.videos.forEach((video, index) => {
        console.log(`Video ${index + 1}: ${video.url.substring(0, 80)}...`);
      });
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
  
  console.log('');
  
  console.log('2. Testing quickTest method');
  console.log('---------------------------');
  
  try {
    const result = await extractor.quickTest(testUrl);
    console.log(`HTML Length: ${result.htmlLength}`);
    console.log(`Patterns found: ${result.foundPatterns.join(', ')}`);
    console.log(`Extracted URLs: ${result.extractedUrls.length}`);
    console.log(`Valid URLs: ${result.validUrls.length}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
  
  console.log('');
  
  console.log('3. Testing diagnoseSignatureIssues method');
  console.log('------------------------------------------');
  
  try {
    const result = await extractor.diagnoseSignatureIssues(testUrl);
    console.log(`Success: ${result.success}`);
    console.log(`Issues: ${result.issues.join(', ')}`);
    console.log(`Recommendations: ${result.recommendations.join(', ')}`);
    console.log(`URL Analysis: ${result.urlAnalysis.length} entries`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}

runTests().catch(console.error);