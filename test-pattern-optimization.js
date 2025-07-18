// 优化模式匹配测试
const testUrl = 'https://www.threads.com/@rahulchauh_n/post/DMNShzDN9y0?xmt=AQF0QCNcWmLeAhvj7CKJeyrzmpLaxdqGLlZWHdr2L358nQ';

async function testPatternOptimization() {
  console.log('🔍 开始模式匹配优化测试...');
  
  try {
    // 获取页面内容
    const proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(testUrl);
    const response = await fetch(proxyUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const html = await response.text();
    console.log(`📄 页面内容长度: ${html.length} 字符`);
    
    // 分析页面结构
    console.log('🔍 分析页面结构...');
    
    // 1. 查找 JSON 数据结构
    const jsonPatterns = [
      /window\._sharedData\s*=\s*(\{.+?\});/,
      /window\.__additionalDataLoaded\s*=\s*(\{.+?\});/,
      /"VideoPlayerImpl":\s*(\{.+?\})/,
      /"video":\s*(\{.+?\})/,
      /"GraphVideo":\s*(\{.+?\})/,
      /"MediaResourceList":\s*(\{.+?\})/,
    ];
    
    console.log('🔍 搜索 JSON 数据结构...');
    jsonPatterns.forEach((pattern, index) => {
      const match = html.match(pattern);
      if (match) {
        console.log(`✅ 找到 JSON 结构 ${index + 1}: ${match[1].substring(0, 100)}...`);
      }
    });
    
    // 2. 查找视频相关的脚本标签
    console.log('🔍 搜索脚本标签...');
    const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
    const scripts = html.match(scriptRegex) || [];
    
    console.log(`📜 找到 ${scripts.length} 个脚本标签`);
    
    let videoLinksFound = 0;
    const foundVideoUrls = new Set();
    
    scripts.forEach((script, index) => {
      // 只处理包含视频相关关键词的脚本
      if (script.includes('video') || script.includes('mp4') || script.includes('cdninstagram')) {
        console.log(`🔍 分析脚本 ${index + 1}/${scripts.length} (长度: ${script.length})`);
        
        // 更精准的视频链接提取
        const videoPatterns = [
          // 基础模式
          /"video_url":"(https:[^"]*\.mp4[^"]*)"/g,
          /"playback_url":"(https:[^"]*\.mp4[^"]*)"/g,
          /"src":"(https:[^"]*\.mp4[^"]*)"/g,
          
          // Instagram CDN 模式
          /"video_url":"(https:\\\/\\\/video[^"]*\.cdninstagram\.com[^"]*\.mp4[^"]*)"/g,
          /"playback_url":"(https:\\\/\\\/video[^"]*\.cdninstagram\.com[^"]*\.mp4[^"]*)"/g,
          /"src":"(https:\\\/\\\/video[^"]*\.cdninstagram\.com[^"]*\.mp4[^"]*)"/g,
          
          // Facebook CDN 模式
          /"video_url":"(https:\\\/\\\/video[^"]*\.fbcdn\.net[^"]*\.mp4[^"]*)"/g,
          /"src":"(https:\\\/\\\/video[^"]*\.fbcdn\.net[^"]*\.mp4[^"]*)"/g,
          
          // 通用模式
          /(https:\\\/\\\/video[^"]*\.cdninstagram\.com[^"]*\.mp4[^"]*)/g,
          /(https:\\\/\\\/video[^"]*\.fbcdn\.net[^"]*\.mp4[^"]*)/g,
          
          // 无转义模式
          /(https:\/\/video[^"]*\.cdninstagram\.com[^"]*\.mp4[^"]*)/g,
          /(https:\/\/video[^"]*\.fbcdn\.net[^"]*\.mp4[^"]*)/g,
        ];
        
        videoPatterns.forEach((pattern, patternIndex) => {
          let match;
          while ((match = pattern.exec(script)) !== null) {
            let url = match[1];
            
            // 清理 URL
            url = url.replace(/\\\//g, '/');
            url = url.replace(/\\"/g, '"');
            url = url.replace(/\\/g, '');
            
            // 验证 URL 格式
            if (url.startsWith('https://') && url.includes('.mp4')) {
              foundVideoUrls.add(url);
              console.log(`✅ 模式 ${patternIndex + 1} 找到视频: ${url.substring(0, 80)}...`);
              videoLinksFound++;
            }
          }
        });
      }
    });
    
    console.log('=' * 60);
    console.log(`📊 模式匹配结果:`);
    console.log(`- 总匹配数: ${videoLinksFound}`);
    console.log(`- 唯一链接: ${foundVideoUrls.size}`);
    
    if (foundVideoUrls.size > 0) {
      console.log('📹 找到的视频链接:');
      Array.from(foundVideoUrls).forEach((url, index) => {
        console.log(`  ${index + 1}. ${url}`);
        
        // 验证链接格式
        try {
          const urlObj = new URL(url);
          console.log(`     - 域名: ${urlObj.hostname}`);
          console.log(`     - 路径: ${urlObj.pathname}`);
          console.log(`     - 参数: ${urlObj.search ? '存在' : '无'}`);
        } catch (error) {
          console.log(`     - ❌ URL 格式错误: ${error.message}`);
        }
      });
    } else {
      console.log('❌ 未找到视频链接');
      
      // 调试信息
      console.log('🔍 调试信息:');
      console.log(`- 包含 'video' 的脚本: ${scripts.filter(s => s.includes('video')).length}`);
      console.log(`- 包含 'mp4' 的脚本: ${scripts.filter(s => s.includes('mp4')).length}`);
      console.log(`- 包含 'cdninstagram' 的脚本: ${scripts.filter(s => s.includes('cdninstagram')).length}`);
      
      // 查看是否有其他格式的媒体文件
      const mediaPatterns = [
        /(https:\/\/[^"]*\.m4v[^"]*)/g,
        /(https:\/\/[^"]*\.webm[^"]*)/g,
        /(https:\/\/[^"]*\.mov[^"]*)/g,
        /(https:\/\/[^"]*\.avi[^"]*)/g,
      ];
      
      const mediaFiles = new Set();
      mediaPatterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(html)) !== null) {
          mediaFiles.add(match[1]);
        }
      });
      
      if (mediaFiles.size > 0) {
        console.log(`📱 找到其他媒体文件: ${mediaFiles.size} 个`);
        Array.from(mediaFiles).forEach((file, index) => {
          console.log(`  ${index + 1}. ${file}`);
        });
      }
    }
    
    // 3. 查找 video 标签
    console.log('🔍 搜索 video 标签...');
    const videoTags = html.match(/<video[^>]*>/gi) || [];
    console.log(`📺 找到 ${videoTags.length} 个 video 标签`);
    
    videoTags.forEach((tag, index) => {
      console.log(`  ${index + 1}. ${tag}`);
      
      // 提取 src 属性
      const srcMatch = tag.match(/src="([^"]+)"/);
      if (srcMatch) {
        console.log(`     - src: ${srcMatch[1]}`);
      }
      
      // 提取 poster 属性
      const posterMatch = tag.match(/poster="([^"]+)"/);
      if (posterMatch) {
        console.log(`     - poster: ${posterMatch[1]}`);
      }
    });
    
    return {
      success: foundVideoUrls.size > 0,
      videoUrls: Array.from(foundVideoUrls),
      totalMatches: videoLinksFound,
      scriptsAnalyzed: scripts.length,
      videoTags: videoTags.length
    };
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    return {
      success: false,
      videoUrls: [],
      totalMatches: 0,
      scriptsAnalyzed: 0,
      videoTags: 0
    };
  }
}

// 运行测试
testPatternOptimization()
  .then(result => {
    console.log('=' * 60);
    console.log('🎯 最终结果:');
    console.log(`- 成功: ${result.success ? '✅' : '❌'}`);
    console.log(`- 视频链接: ${result.videoUrls.length} 个`);
    console.log(`- 总匹配: ${result.totalMatches} 次`);
    console.log(`- 脚本分析: ${result.scriptsAnalyzed} 个`);
    console.log(`- Video 标签: ${result.videoTags} 个`);
    
    if (result.success) {
      console.log('✅ 模式匹配优化成功！');
    } else {
      console.log('⚠️ 可能需要进一步优化模式或该页面不包含视频');
    }
  });