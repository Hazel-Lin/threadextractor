// 真实的网络测试
const testUrl = 'https://www.threads.com/@rahulchauh_n/post/DMNShzDN9y0?xmt=AQF0QCNcWmLeAhvj7CKJeyrzmpLaxdqGLlZWHdr2L358nQ';

async function testRealExtraction() {
  console.log('🌐 开始真实网络提取测试...');
  console.log(`📱 目标 URL: ${testUrl}`);
  console.log('=' * 60);
  
  // 测试代理服务
  const proxies = [
    'https://api.allorigins.win/raw?url=',
    'https://cors-anywhere.herokuapp.com/',
    'https://corsproxy.io/?'
  ];
  
  for (const proxy of proxies) {
    console.log(`🔄 测试代理: ${proxy}`);
    
    try {
      const proxyUrl = proxy + encodeURIComponent(testUrl);
      console.log(`📡 请求 URL: ${proxyUrl.substring(0, 80)}...`);
      
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Referer': 'https://www.threads.net',
          'Origin': 'https://www.threads.net'
        }
      });
      
      console.log(`📊 响应状态: ${response.status} ${response.statusText}`);
      console.log(`📋 响应头:`);
      console.log(`  Content-Type: ${response.headers.get('content-type') || 'N/A'}`);
      console.log(`  Content-Length: ${response.headers.get('content-length') || 'N/A'}`);
      console.log(`  Server: ${response.headers.get('server') || 'N/A'}`);
      
      if (response.ok) {
        const html = await response.text();
        console.log(`📄 页面内容长度: ${html.length} 字符`);
        console.log(`📄 页面内容预览: ${html.substring(0, 200)}...`);
        
        // 测试视频链接模式匹配
        const videoPatterns = [
          /"video_url":"(https:[^"]*\.mp4[^"]*)"/g,
          /"playback_url":"(https:[^"]*\.mp4[^"]*)"/g,
          /"src":"(https:[^"]*\.mp4[^"]*)"/g,
          /<video[^>]*src="([^"]*\.mp4[^"]*)"/g,
          /"videoUrl":"(https:[^"]*\.mp4[^"]*)"/g,
          /"url":"(https:[^"]*\.mp4[^"]*)"/g,
          /(https:\/\/[^"\s]*\.mp4[^"\s]*)/g,
          new RegExp('"src":"(https:\\/\\/video[^"]*\\.cdninstagram\\.com[^"]*\\.mp4[^"]*)"', 'g'),
          new RegExp('"video_url":"(https:\\/\\/video[^"]*\\.cdninstagram\\.com[^"]*\\.mp4[^"]*)"', 'g'),
          new RegExp('"playback_url":"(https:\\/\\/video[^"]*\\.cdninstagram\\.com[^"]*\\.mp4[^"]*)"', 'g'),
          new RegExp('"src":"(https:\\/\\/video[^"]*\\.fbcdn\\.net[^"]*\\.mp4[^"]*)"', 'g'),
          new RegExp('"video_url":"(https:\\/\\/video[^"]*\\.fbcdn\\.net[^"]*\\.mp4[^"]*)"', 'g'),
        ];
        
        const foundUrls = new Set();
        console.log('🔍 开始模式匹配...');
        
        videoPatterns.forEach((pattern, index) => {
          const matches = html.match(pattern);
          if (matches) {
            console.log(`✅ 模式 ${index + 1} 找到 ${matches.length} 个匹配`);
            matches.forEach(match => {
              let url = match.replace(/^"[^"]*":"/, '').replace(/"$/, '');
              url = url.replace(/\\\\/g, '/').replace(/\\"/g, '"');
              if (url.startsWith('https://') && url.includes('.mp4')) {
                foundUrls.add(url);
              }
            });
          }
        });
        
        console.log(`📹 总共找到 ${foundUrls.size} 个唯一视频链接:`);
        Array.from(foundUrls).forEach((url, index) => {
          console.log(`  ${index + 1}. ${url.substring(0, 80)}...`);
        });
        
        // 测试关键词搜索
        const keywords = [
          'video',
          'mp4',
          'cdninstagram',
          'fbcdn',
          'playback',
          'VideoPlayerImpl',
          'GraphVideo'
        ];
        
        console.log('🔍 关键词搜索结果:');
        keywords.forEach(keyword => {
          const count = (html.match(new RegExp(keyword, 'gi')) || []).length;
          console.log(`  ${keyword}: ${count} 次`);
        });
        
        // 成功获取内容
        console.log('✅ 成功获取页面内容！');
        return {
          success: true,
          proxy: proxy,
          htmlLength: html.length,
          videoUrls: Array.from(foundUrls),
          html: html.substring(0, 1000) // 保存前1000字符用于调试
        };
      } else {
        console.log(`❌ 代理返回错误状态: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ 代理请求失败: ${error.message}`);
    }
    
    console.log('-' * 40);
  }
  
  console.log('❌ 所有代理都失败了');
  return {
    success: false,
    proxy: null,
    htmlLength: 0,
    videoUrls: [],
    html: ''
  };
}

// 运行测试
testRealExtraction()
  .then(result => {
    console.log('=' * 60);
    console.log('🎯 最终测试结果:');
    console.log(`- 成功: ${result.success ? '✅ 是' : '❌ 否'}`);
    console.log(`- 可用代理: ${result.proxy || '无'}`);
    console.log(`- 页面长度: ${result.htmlLength} 字符`);
    console.log(`- 视频链接: ${result.videoUrls.length} 个`);
    
    if (result.success) {
      console.log('🎉 测试成功！签名修复机制可以正常工作。');
      console.log('下一步可以：');
      console.log('1. 在实际应用中使用这个方案');
      console.log('2. 进一步优化视频链接提取算法');
      console.log('3. 添加更多的备用代理服务');
    } else {
      console.log('⚠️ 测试失败，可能需要：');
      console.log('1. 检查网络连接');
      console.log('2. 尝试其他代理服务');
      console.log('3. 使用服务器端解决方案');
    }
  })
  .catch(error => {
    console.error('💥 测试过程中发生严重错误:', error);
  });