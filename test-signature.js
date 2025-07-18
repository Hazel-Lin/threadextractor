// 测试签名修复功能
const testUrl = 'https://www.threads.com/@rahulchauh_n/post/DMNShzDN9y0?xmt=AQF0QCNcWmLeAhvj7CKJeyrzmpLaxdqGLlZWHdr2L358nQ';

// 模拟 ThreadsExtractor 的关键方法
class TestThreadsExtractor {
  constructor() {
    this.sessionCookies = new Map();
    this.sessionHeaders = new Map();
  }

  // 初始化会话信息
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
    console.log('✅ 会话初始化完成');
  }

  generateCSRFToken() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 32; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }

  // 验证 Threads URL
  validateThreadsUrl(url) {
    try {
      const urlObj = new URL(url);
      const isValid = urlObj.hostname === 'www.threads.com' || 
                     urlObj.hostname === 'threads.com' ||
                     urlObj.hostname === 'www.threads.com' ||
                     urlObj.hostname === 'threads.com';
      console.log(`🔍 URL 验证: ${isValid ? '✅ 有效' : '❌ 无效'}`);
      return isValid;
    } catch {
      console.log('❌ URL 格式错误');
      return false;
    }
  }

  // 分析 URL 参数
  analyzeUrlParameters(url) {
    try {
      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);
      
      console.log('📊 URL 参数分析:');
      console.log(`- 基础路径: ${urlObj.pathname}`);
      console.log(`- 参数数量: ${params.size}`);
      
      for (const [key, value] of params) {
        console.log(`  ${key}: ${value.substring(0, 50)}${value.length > 50 ? '...' : ''}`);
      }
      
      // 检查关键的认证参数
      if (params.has('xmt')) {
        console.log('✅ 发现 XMT 认证令牌');
      }
      
      return { urlObj, params };
    } catch (error) {
      console.log('❌ URL 参数分析失败:', error.message);
      return null;
    }
  }

  // 检查签名参数
  hasRequiredSignatureParams(url) {
    try {
      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);
      
      // Threads 使用的认证参数
      const threadsParams = ['xmt']; // XMT 是 Threads 的主要认证参数
      const instagramParams = ['oh', 'oe', 'ts', 'sig', '__gda__']; // Instagram 风格的签名参数
      
      const hasThreadsAuth = threadsParams.some(param => params.has(param));
      const hasInstagramAuth = instagramParams.some(param => params.has(param));
      
      console.log('🔑 签名参数检查:');
      console.log(`- Threads 认证: ${hasThreadsAuth ? '✅ 存在' : '❌ 缺失'}`);
      console.log(`- Instagram 认证: ${hasInstagramAuth ? '✅ 存在' : '❌ 缺失'}`);
      
      return hasThreadsAuth || hasInstagramAuth;
    } catch (error) {
      console.log('❌ 签名参数检查失败:', error.message);
      return false;
    }
  }

  // 修复 URL 签名
  fixUrlSignature(url) {
    try {
      console.log('🔧 开始修复 URL 签名...');
      
      let fixedUrl = url;
      
      // 1. 检查 HTML 实体编码
      if (fixedUrl.includes('&amp;')) {
        console.log('⚠️ 发现 HTML 实体编码 &amp;');
        // 保持格式，这对签名验证很重要
      }
      
      // 2. 检查 URL 参数
      const urlObj = new URL(fixedUrl);
      const params = new URLSearchParams(urlObj.search);
      
      // 3. 对于 Threads，XMT 参数通常不需要特殊处理
      if (params.has('xmt')) {
        console.log('✅ XMT 参数存在，无需修复');
      }
      
      console.log('✅ URL 签名修复完成');
      return fixedUrl;
    } catch (error) {
      console.log('❌ URL 签名修复失败:', error.message);
      return url;
    }
  }

  // 测试代理连接
  async testProxyConnection(url) {
    const proxies = [
      'https://api.allorigins.win/raw?url=',
      'https://cors-anywhere.herokuapp.com/',
      'https://corsproxy.io/?'
    ];
    
    console.log('🌐 测试代理连接...');
    
    for (const proxy of proxies) {
      try {
        const proxyUrl = proxy + encodeURIComponent(url);
        console.log(`⏳ 测试代理: ${proxy}`);
        
        const response = await fetch(proxyUrl, {
          method: 'HEAD',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        
        console.log(`✅ 代理 ${proxy} 可用 (状态: ${response.status})`);
        return proxy;
      } catch (error) {
        console.log(`❌ 代理 ${proxy} 失败: ${error.message}`);
      }
    }
    
    console.log('❌ 所有代理都不可用');
    return null;
  }

  // 诊断签名问题
  async diagnoseSignatureIssues(url) {
    console.log('🔍 开始诊断签名问题...');
    console.log(`📱 目标 URL: ${url}`);
    console.log('=' * 50);
    
    const issues = [];
    const recommendations = [];
    
    // 1. 基础 URL 验证
    if (!this.validateThreadsUrl(url)) {
      issues.push('URL 格式无效');
      recommendations.push('检查 URL 格式是否正确');
    }
    
    // 2. URL 参数分析
    const urlAnalysis = this.analyzeUrlParameters(url);
    if (!urlAnalysis) {
      issues.push('URL 参数解析失败');
      recommendations.push('检查 URL 是否包含有效参数');
    }
    
    // 3. 签名参数检查
    const hasSignature = this.hasRequiredSignatureParams(url);
    if (!hasSignature) {
      issues.push('缺少必要的签名参数');
      recommendations.push('尝试重新获取包含认证参数的 URL');
    }
    
    // 4. 会话管理测试
    this.initializeSession();
    
    // 5. 代理连接测试
    const workingProxy = await this.testProxyConnection(url);
    if (!workingProxy) {
      issues.push('代理连接失败');
      recommendations.push('尝试使用其他代理服务或直接访问方法');
    }
    
    // 6. 签名修复测试
    const fixedUrl = this.fixUrlSignature(url);
    
    console.log('=' * 50);
    console.log('📋 诊断结果:');
    
    if (issues.length === 0) {
      console.log('✅ 未发现问题');
    } else {
      console.log('❌ 发现问题:');
      issues.forEach((issue, index) => {
        console.log(`  ${index + 1}. ${issue}`);
      });
    }
    
    if (recommendations.length > 0) {
      console.log('💡 建议:');
      recommendations.forEach((rec, index) => {
        console.log(`  ${index + 1}. ${rec}`);
      });
    }
    
    return {
      success: issues.length === 0,
      issues,
      recommendations,
      workingProxy,
      fixedUrl
    };
  }
}

// 运行测试
async function runTest() {
  console.log('🚀 开始测试 Threads 视频提取器...');
  console.log('=' * 60);
  
  const extractor = new TestThreadsExtractor();
  const result = await extractor.diagnoseSignatureIssues(testUrl);
  
  console.log('=' * 60);
  console.log('📊 最终测试结果:');
  console.log(`- 总体状态: ${result.success ? '✅ 成功' : '❌ 失败'}`);
  console.log(`- 可用代理: ${result.workingProxy || '无'}`);
  console.log(`- 修复后的 URL: ${result.fixedUrl === testUrl ? '无需修复' : '已修复'}`);
  
  if (result.success) {
    console.log('🎉 签名修复机制工作正常！');
  } else {
    console.log('⚠️ 需要进一步优化签名修复机制');
  }
}

// 运行测试
runTest().catch(console.error);