// 完整的端到端测试 - 使用真实的提取器
import { threadsExtractor } from './src/lib/threads-extractor.js';

const testUrl = 'https://www.threads.com/@rahulchauh_n/post/DMNShzDN9y0?xmt=AQF0QCNcWmLeAhvj7CKJeyrzmpLaxdqGLlZWHdr2L358nQ';

async function testFullExtraction() {
  console.log('🔄 开始完整提取测试...');
  console.log(`📱 目标 URL: ${testUrl}`);
  console.log('=' * 60);
  
  try {
    // 1. 测试基本提取
    console.log('1️⃣ 测试基本提取功能...');
    const extractResult = await threadsExtractor.extractVideos(testUrl);
    
    console.log('📊 基本提取结果:');
    console.log(`- 成功状态: ${extractResult.success ? '✅ 成功' : '❌ 失败'}`);
    console.log(`- 消息: ${extractResult.message}`);
    console.log(`- 视频数量: ${extractResult.videos.length}`);
    
    if (extractResult.videos.length > 0) {
      console.log('📹 提取的视频:');
      extractResult.videos.forEach((video, index) => {
        console.log(`  ${index + 1}. ${video.title}`);
        console.log(`     URL: ${video.url.substring(0, 80)}...`);
      });
    }
    
    console.log('=' * 60);
    
    // 2. 测试签名诊断
    console.log('2️⃣ 测试签名诊断功能...');
    const diagnosisResult = await threadsExtractor.diagnoseSignatureIssues(testUrl);
    
    console.log('🔍 签名诊断结果:');
    console.log(`- 成功状态: ${diagnosisResult.success ? '✅ 成功' : '❌ 失败'}`);
    
    if (diagnosisResult.issues.length > 0) {
      console.log('❌ 发现的问题:');
      diagnosisResult.issues.forEach((issue, index) => {
        console.log(`  ${index + 1}. ${issue}`);
      });
    }
    
    if (diagnosisResult.recommendations.length > 0) {
      console.log('💡 建议:');
      diagnosisResult.recommendations.forEach((rec, index) => {
        console.log(`  ${index + 1}. ${rec}`);
      });
    }
    
    if (diagnosisResult.urlAnalysis.length > 0) {
      console.log('🔗 URL 分析:');
      diagnosisResult.urlAnalysis.forEach((analysis, index) => {
        console.log(`  ${index + 1}. ${analysis.url}`);
        console.log(`     签名参数: ${analysis.signatureParams.join(', ') || '无'}`);
        console.log(`     问题: ${analysis.issues.join(', ') || '无'}`);
      });
    }
    
    console.log('=' * 60);
    
    // 3. 测试备用提取方法
    console.log('3️⃣ 测试备用提取方法...');
    const fallbackResult = await threadsExtractor.extractWithFallback(testUrl);
    
    console.log('🔄 备用提取结果:');
    console.log(`- 成功状态: ${fallbackResult.success ? '✅ 成功' : '❌ 失败'}`);
    console.log(`- 消息: ${fallbackResult.message}`);
    console.log(`- 视频数量: ${fallbackResult.videos.length}`);
    
    console.log('=' * 60);
    
    // 4. 测试快速测试功能
    console.log('4️⃣ 测试快速测试功能...');
    const quickTestResult = await threadsExtractor.quickTest(testUrl);
    
    console.log('⚡ 快速测试结果:');
    console.log(`- 代理状态: ${quickTestResult.proxy}`);
    console.log(`- 页面长度: ${quickTestResult.htmlLength}`);
    console.log(`- 找到的模式: ${quickTestResult.foundPatterns.join(', ')}`);
    console.log(`- 提取的链接: ${quickTestResult.extractedUrls.length}`);
    console.log(`- 有效链接: ${quickTestResult.validUrls.length}`);
    
    console.log('=' * 60);
    
    // 5. 总结测试结果
    console.log('📊 测试总结:');
    
    const allTests = [
      { name: '基本提取', success: extractResult.success, videos: extractResult.videos.length },
      { name: '签名诊断', success: diagnosisResult.success, videos: 0 },
      { name: '备用提取', success: fallbackResult.success, videos: fallbackResult.videos.length },
      { name: '快速测试', success: quickTestResult.validUrls.length > 0, videos: quickTestResult.validUrls.length }
    ];
    
    const successfulTests = allTests.filter(test => test.success);
    const totalVideos = Math.max(...allTests.map(test => test.videos));
    
    console.log(`✅ 成功测试: ${successfulTests.length}/${allTests.length}`);
    console.log(`📹 最多发现视频: ${totalVideos} 个`);
    
    if (successfulTests.length > 0) {
      console.log('🎉 部分或全部功能工作正常！');
      console.log('建议：');
      if (totalVideos > 0) {
        console.log('- 视频提取功能正常，可以投入使用');
      } else {
        console.log('- 链接可能不包含视频，或需要进一步优化');
      }
    } else {
      console.log('⚠️ 所有测试都失败了');
      console.log('建议：');
      console.log('- 检查网络连接');
      console.log('- 验证 URL 是否正确');
      console.log('- 考虑使用替代方案');
    }
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
    console.log('可能的原因：');
    console.log('- 网络连接问题');
    console.log('- 代理服务不可用');
    console.log('- Threads 服务变更');
  }
}

// 运行完整测试
testFullExtraction();