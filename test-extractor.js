#!/usr/bin/env node

// Direct test of ThreadsExtractor functionality
const testUrl = 'https://www.threads.com/@rahulchauh_n/post/DMNShzDN9y0?xmt=AQF0QCNcWmLeAhvj7CKJeyrzmpLaxdqGLlZWHdr2L358nQ';

console.log('🔍 ThreadsExtractor Direct Test');
console.log('===============================');
console.log(`Testing URL: ${testUrl}`);
console.log('');

// Test URL validation
function validateThreadsUrl(url) {
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

console.log('1. URL Validation');
console.log('-----------------');
const isValid = validateThreadsUrl(testUrl);
console.log(`Result: ${isValid ? 'VALID' : 'INVALID'}`);
console.log('');

// Test URL structure analysis
console.log('2. URL Structure Analysis');
console.log('------------------------');
try {
  const urlObj = new URL(testUrl);
  console.log(`Protocol: ${urlObj.protocol}`);
  console.log(`Hostname: ${urlObj.hostname}`);
  console.log(`Pathname: ${urlObj.pathname}`);
  console.log(`Search: ${urlObj.search}`);
  
  const pathSegments = urlObj.pathname.split('/').filter(Boolean);
  console.log(`Path segments: ${pathSegments.join(' -> ')}`);
  
  const params = new URLSearchParams(urlObj.search);
  console.log('Query parameters:');
  for (const [key, value] of params.entries()) {
    console.log(`  ${key}: ${value}`);
  }
  
  // Check for signature parameters
  const signatureParams = ['oh', 'oe', 'ts', 'sig', '__gda__', 'xmt'];
  const foundSignatureParams = signatureParams.filter(param => params.has(param));
  console.log(`Signature parameters found: ${foundSignatureParams.join(', ') || 'none'}`);
} catch (error) {
  console.log(`Error analyzing URL: ${error.message}`);
}
console.log('');

// Test proxy access
console.log('3. Proxy Access Test');
console.log('-------------------');

async function testProxyAccess() {
  const proxies = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?'
  ];
  
  for (const proxy of proxies) {
    try {
      console.log(`Testing proxy: ${proxy}`);
      const proxyUrl = proxy + encodeURIComponent(testUrl);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(proxyUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const text = await response.text();
        console.log(`✓ Success: ${response.status} - ${text.length} characters`);
        console.log(`✓ Sample: ${text.substring(0, 100)}...`);
        
        // Test for video-related content
        const videoIndicators = [
          'video',
          '.mp4',
          'cdninstagram.com',
          'fbcdn.net',
          'playback_url',
          'video_url'
        ];
        
        const foundIndicators = videoIndicators.filter(indicator => 
          text.toLowerCase().includes(indicator.toLowerCase())
        );
        
        console.log(`✓ Video indicators found: ${foundIndicators.join(', ') || 'none'}`);
        
        return { success: true, content: text, proxy };
      } else {
        console.log(`✗ Failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.log(`✗ Error: ${error.message}`);
    }
  }
  
  return { success: false };
}

// Test pattern matching
function testPatternMatching(html) {
  console.log('4. Pattern Matching Test');
  console.log('------------------------');
  
  const patterns = [
    { name: 'video_url', regex: /"video_url":"(https:[^"]*\.mp4[^"]*)"/g },
    { name: 'playback_url', regex: /"playback_url":"(https:[^"]*\.mp4[^"]*)"/g },
    { name: 'src', regex: /"src":"(https:[^"]*\.mp4[^"]*)"/g },
    { name: 'general_mp4', regex: /(https:\/\/[^"\s]*\.mp4[^"\s]*)/g },
    { name: 'instagram_cdn', regex: /(https:\/\/[^"\s]*\.cdninstagram\.com[^"\s]*)/g },
    { name: 'facebook_cdn', regex: /(https:\/\/[^"\s]*\.fbcdn\.net[^"\s]*)/g }
  ];
  
  let totalMatches = 0;
  
  patterns.forEach(pattern => {
    const matches = [];
    let match;
    
    pattern.regex.lastIndex = 0;
    
    while ((match = pattern.regex.exec(html)) !== null) {
      matches.push(match[1]);
      if (matches.length >= 10) break; // Limit to prevent infinite loops
    }
    
    console.log(`${pattern.name}: ${matches.length} matches`);
    matches.forEach((url, index) => {
      if (index < 3) { // Show first 3 matches
        console.log(`  ${index + 1}: ${url.substring(0, 80)}...`);
      }
    });
    
    totalMatches += matches.length;
  });
  
  console.log(`Total matches found: ${totalMatches}`);
  console.log('');
}

// Test signature analysis
function testSignatureAnalysis() {
  console.log('5. Signature Analysis');
  console.log('---------------------');
  
  try {
    const urlObj = new URL(testUrl);
    const params = new URLSearchParams(urlObj.search);
    
    // Check for signature parameters
    const signatureParams = ['oh', 'oe', 'ts', 'sig', '__gda__', 'xmt'];
    const foundParams = [];
    
    signatureParams.forEach(param => {
      if (params.has(param)) {
        const value = params.get(param);
        foundParams.push({ param, value });
        console.log(`✓ ${param}: ${value.substring(0, 20)}...`);
      }
    });
    
    if (foundParams.length === 0) {
      console.log('✗ No signature parameters found');
    } else {
      console.log(`✓ Found ${foundParams.length} signature parameters`);
    }
    
    // Check if xmt parameter exists (Instagram/Meta authentication token)
    if (params.has('xmt')) {
      console.log('✓ XMT parameter found - this is a Meta authentication token');
    }
    
    // Check for timestamp-based parameters
    const timestamp = Date.now() / 1000;
    if (params.has('ts')) {
      const urlTimestamp = parseInt(params.get('ts'));
      const timeDiff = timestamp - urlTimestamp;
      console.log(`Timestamp difference: ${timeDiff} seconds`);
      
      if (timeDiff > 3600) {
        console.log('⚠️  Timestamp may be expired (>1 hour old)');
      }
    }
    
  } catch (error) {
    console.log(`Error analyzing signature: ${error.message}`);
  }
  
  console.log('');
}

// Main test function
async function runTests() {
  console.log('Starting tests...\n');
  
  // Test signature analysis
  testSignatureAnalysis();
  
  // Test proxy access
  const proxyResult = await testProxyAccess();
  console.log('');
  
  // Test pattern matching if content was retrieved
  if (proxyResult.success) {
    testPatternMatching(proxyResult.content);
  }
  
  // Generate recommendations
  console.log('6. Recommendations');
  console.log('------------------');
  
  if (isValid) {
    console.log('✅ URL format is valid for Threads');
  } else {
    console.log('❌ URL format is not valid for Threads');
  }
  
  if (proxyResult.success) {
    console.log('✅ Page is accessible via proxy');
    console.log('✅ Content extraction is possible');
  } else {
    console.log('❌ Page is not accessible via tested proxies');
    console.log('   → May need to try different proxies or methods');
  }
  
  const urlObj = new URL(testUrl);
  const params = new URLSearchParams(urlObj.search);
  
  if (params.has('xmt')) {
    console.log('✅ XMT parameter present - authentication token available');
  } else {
    console.log('❌ No XMT parameter - may need authentication');
  }
  
  console.log('\nNext steps:');
  console.log('1. Run the actual ThreadsExtractor.extractVideos() method');
  console.log('2. Check if the page contains actual video content');
  console.log('3. Verify video URLs are extractable and accessible');
  console.log('4. Test signature validation for any found video URLs');
}

// Run tests
runTests().catch(console.error);