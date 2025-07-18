#!/usr/bin/env node

// Test script for ThreadsExtractor functionality
// This script will test the provided URL comprehensively

const testUrl = 'https://www.threads.com/@rahulchauh_n/post/DMNShzDN9y0?xmt=AQF0QCNcWmLeAhvj7CKJeyrzmpLaxdqGLlZWHdr2L358nQ';

console.log('🧪 ThreadsExtractor Test Suite');
console.log('==============================');
console.log(`Testing URL: ${testUrl}`);
console.log('');

// Test 1: URL Validation
console.log('1. URL Validation Test');
console.log('----------------------');

function validateThreadsUrl(url) {
  try {
    const urlObj = new URL(url);
    const isValidDomain = urlObj.hostname === 'www.threads.net' || 
                         urlObj.hostname === 'threads.net' ||
                         urlObj.hostname === 'www.threads.com' ||
                         urlObj.hostname === 'threads.com';
    
    console.log(`✓ URL can be parsed: ${url}`);
    console.log(`✓ Protocol: ${urlObj.protocol}`);
    console.log(`✓ Hostname: ${urlObj.hostname}`);
    console.log(`✓ Pathname: ${urlObj.pathname}`);
    console.log(`✓ Search params: ${urlObj.search}`);
    console.log(`✓ Valid domain: ${isValidDomain ? 'YES' : 'NO'}`);
    
    return isValidDomain;
  } catch (error) {
    console.log(`✗ URL validation failed: ${error.message}`);
    return false;
  }
}

const isValidUrl = validateThreadsUrl(testUrl);
console.log(`Result: ${isValidUrl ? 'VALID' : 'INVALID'}`);
console.log('');

// Test 2: URL Structure Analysis
console.log('2. URL Structure Analysis');
console.log('-------------------------');

function analyzeUrlStructure(url) {
  try {
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/').filter(Boolean);
    const params = new URLSearchParams(urlObj.search);
    
    console.log('Path segments:');
    pathSegments.forEach((segment, index) => {
      console.log(`  ${index}: ${segment}`);
    });
    
    console.log('Query parameters:');
    for (const [key, value] of params.entries()) {
      console.log(`  ${key}: ${value}`);
    }
    
    // Check for signature-related parameters
    const signatureParams = ['oh', 'oe', 'ts', 'sig', '__gda__', 'xmt'];
    const foundSignatureParams = signatureParams.filter(param => params.has(param));
    
    console.log('Signature-related parameters:');
    foundSignatureParams.forEach(param => {
      console.log(`  ${param}: ${params.get(param)}`);
    });
    
    return {
      pathSegments,
      params,
      signatureParams: foundSignatureParams
    };
  } catch (error) {
    console.log(`✗ URL structure analysis failed: ${error.message}`);
    return null;
  }
}

const urlStructure = analyzeUrlStructure(testUrl);
console.log('');

// Test 3: Proxy Accessibility Test
console.log('3. Proxy Accessibility Test');
console.log('---------------------------');

async function testProxyAccess(url) {
  const proxies = [
    'https://api.allorigins.win/raw?url=',
    'https://cors-anywhere.herokuapp.com/',
    'https://corsproxy.io/?'
  ];
  
  const results = [];
  
  for (const proxy of proxies) {
    try {
      const proxyUrl = proxy + encodeURIComponent(url);
      console.log(`Testing proxy: ${proxy}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(proxyUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Cache-Control': 'max-age=0'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const contentLength = response.headers.get('content-length');
        const contentType = response.headers.get('content-type');
        
        console.log(`  ✓ Status: ${response.status}`);
        console.log(`  ✓ Content-Type: ${contentType || 'Not specified'}`);
        console.log(`  ✓ Content-Length: ${contentLength || 'Not specified'}`);
        
        // Get a small sample of content
        const text = await response.text();
        console.log(`  ✓ Response length: ${text.length} characters`);
        console.log(`  ✓ First 100 chars: ${text.substring(0, 100)}...`);
        
        results.push({
          proxy,
          success: true,
          responseLength: text.length,
          contentType,
          sample: text.substring(0, 500)
        });
      } else {
        console.log(`  ✗ HTTP Error: ${response.status} ${response.statusText}`);
        results.push({
          proxy,
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`
        });
      }
    } catch (error) {
      console.log(`  ✗ Error: ${error.message}`);
      results.push({
        proxy,
        success: false,
        error: error.message
      });
    }
    console.log('');
  }
  
  return results;
}

// Test 4: Pattern Matching Test
console.log('4. Pattern Matching Test');
console.log('------------------------');

function testPatternMatching(html) {
  const patterns = [
    { name: 'video_url', regex: /"video_url":"(https:[^"]*\.mp4[^"]*)"/g },
    { name: 'playback_url', regex: /"playback_url":"(https:[^"]*\.mp4[^"]*)"/g },
    { name: 'src', regex: /"src":"(https:[^"]*\.mp4[^"]*)"/g },
    { name: 'video_tag', regex: /<video[^>]*src="([^"]*\.mp4[^"]*)"/g },
    { name: 'videoUrl', regex: /"videoUrl":"(https:[^"]*\.mp4[^"]*)"/g },
    { name: 'url', regex: /"url":"(https:[^"]*\.mp4[^"]*)"/g },
    { name: 'general_mp4', regex: /(https:\/\/[^"\s]*\.mp4[^"\s]*)/g },
    { name: 'instagram_cdn', regex: /"src":"(https:\/\/video[^"]*\.cdninstagram\.com[^"]*\.mp4[^"]*)"/g },
    { name: 'facebook_cdn', regex: /"src":"(https:\/\/video[^"]*\.fbcdn\.net[^"]*\.mp4[^"]*)"/g }
  ];
  
  const results = [];
  
  patterns.forEach(pattern => {
    const matches = [];
    let match;
    
    // Reset regex lastIndex
    pattern.regex.lastIndex = 0;
    
    while ((match = pattern.regex.exec(html)) !== null) {
      matches.push(match[1]);
    }
    
    console.log(`${pattern.name}: ${matches.length} matches`);
    if (matches.length > 0) {
      matches.forEach((url, index) => {
        console.log(`  ${index + 1}: ${url.substring(0, 80)}...`);
      });
    }
    
    results.push({
      pattern: pattern.name,
      matches: matches.length,
      urls: matches
    });
  });
  
  return results;
}

// Test 5: Direct URL Test
console.log('5. Direct URL Access Test');
console.log('-------------------------');

async function testDirectAccess(url) {
  try {
    console.log(`Testing direct access to: ${url}`);
    
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
    });
    
    console.log(`✓ Status: ${response.status}`);
    console.log(`✓ Headers available: ${response.headers ? 'YES' : 'NO'}`);
    
    if (response.ok) {
      return { success: true, status: response.status };
    } else {
      return { success: false, status: response.status, error: response.statusText };
    }
  } catch (error) {
    console.log(`✗ Direct access failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Main test runner
async function runTests() {
  console.log('Starting comprehensive tests...\n');
  
  const testResults = {
    urlValidation: isValidUrl,
    urlStructure: urlStructure,
    proxyAccess: null,
    patternMatching: null,
    directAccess: null
  };
  
  // Test direct access
  testResults.directAccess = await testDirectAccess(testUrl);
  console.log('');
  
  // Test proxy access
  testResults.proxyAccess = await testProxyAccess(testUrl);
  
  // Test pattern matching if we got content
  const successfulProxy = testResults.proxyAccess.find(result => result.success);
  if (successfulProxy) {
    console.log('Testing pattern matching on retrieved content...');
    testResults.patternMatching = testPatternMatching(successfulProxy.sample);
  } else {
    console.log('No successful proxy access - skipping pattern matching test');
  }
  
  // Generate summary report
  console.log('\n📋 Test Summary Report');
  console.log('======================');
  console.log(`URL Validation: ${testResults.urlValidation ? 'PASS' : 'FAIL'}`);
  console.log(`Direct Access: ${testResults.directAccess.success ? 'PASS' : 'FAIL'}`);
  console.log(`Proxy Access: ${testResults.proxyAccess.some(r => r.success) ? 'PASS' : 'FAIL'}`);
  
  if (testResults.patternMatching) {
    const totalMatches = testResults.patternMatching.reduce((sum, pattern) => sum + pattern.matches, 0);
    console.log(`Pattern Matching: ${totalMatches > 0 ? 'FOUND MATCHES' : 'NO MATCHES'} (${totalMatches} total)`);
  }
  
  console.log('\n🔍 Detailed Analysis');
  console.log('====================');
  
  // URL Structure Analysis
  if (testResults.urlStructure) {
    console.log('URL Structure:');
    console.log(`- Path segments: ${testResults.urlStructure.pathSegments.length}`);
    console.log(`- Query parameters: ${testResults.urlStructure.params.size}`);
    console.log(`- Signature parameters: ${testResults.urlStructure.signatureParams.length}`);
    
    if (testResults.urlStructure.signatureParams.length > 0) {
      console.log('  Found signature params:', testResults.urlStructure.signatureParams.join(', '));
    }
  }
  
  // Proxy Results
  console.log('\nProxy Results:');
  testResults.proxyAccess.forEach(result => {
    console.log(`- ${result.proxy}: ${result.success ? 'SUCCESS' : 'FAILED'}`);
    if (result.success) {
      console.log(`  Response length: ${result.responseLength} chars`);
    } else {
      console.log(`  Error: ${result.error}`);
    }
  });
  
  // Pattern Matching Results
  if (testResults.patternMatching) {
    console.log('\nPattern Matching Results:');
    testResults.patternMatching.forEach(pattern => {
      if (pattern.matches > 0) {
        console.log(`- ${pattern.pattern}: ${pattern.matches} matches`);
      }
    });
  }
  
  // Recommendations
  console.log('\n💡 Recommendations');
  console.log('==================');
  
  if (!testResults.urlValidation) {
    console.log('❌ URL validation failed - check if the URL format is correct');
  }
  
  if (!testResults.directAccess.success) {
    console.log('❌ Direct access failed - this is expected due to CORS restrictions');
  }
  
  if (!testResults.proxyAccess.some(r => r.success)) {
    console.log('❌ All proxy access failed - may need to try different proxies or methods');
  } else {
    console.log('✅ At least one proxy works - extraction should be possible');
  }
  
  if (testResults.patternMatching) {
    const totalMatches = testResults.patternMatching.reduce((sum, pattern) => sum + pattern.matches, 0);
    if (totalMatches === 0) {
      console.log('❌ No video patterns found - page structure may have changed');
    } else {
      console.log(`✅ Found ${totalMatches} potential video URLs - extraction looks promising`);
    }
  }
  
  console.log('\n🎯 Next Steps');
  console.log('=============');
  console.log('1. Run the actual ThreadsExtractor.extractVideos() method');
  console.log('2. Test signature validation and URL fixing');
  console.log('3. Verify extracted URLs are accessible');
  console.log('4. Test fallback extraction methods if needed');
  
  return testResults;
}

// Run the tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runTests, testUrl };
} else {
  runTests().catch(console.error);
}