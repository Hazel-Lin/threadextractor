#!/usr/bin/env node

// Test pattern matching with mock HTML content
console.log('🔍 Pattern Matching Test');
console.log('========================');

// Mock HTML content simulating what might be in a Threads page
const mockHtml = `
<html>
<head>
    <script>
        window.__initialData = {
            "video_url": "https://video.cdninstagram.com/v/t50.2886-16/10000000_123456789_1234567890123456789_n.mp4?_nc_ht=video.cdninstagram.com&_nc_cat=111&_nc_ohc=abcdefghijklmnop&edm=APs17CUBAAAA&ccb=7-5&oh=00_AT_abcdefghijklmnopqrstuvwxyz&oe=64ABCDEF&_nc_sid=10d13b",
            "playback_url": "https://video.fbcdn.net/v/t42.1790-2/10000000_123456789_1234567890123456789_n.mp4?_nc_cat=111&ccb=1-7&_nc_sid=985c63&efg=eyJybHMiOjE1MDB9&_nc_ohc=abcdefghijklmnop&_nc_ht=video.fbcdn.net&oh=00_AT_abcdefghijklmnopqrstuvwxyz&oe=64ABCDEF"
        };
    </script>
    <video src="https://video.cdninstagram.com/v/t50.2886-16/10000000_123456789_1234567890123456789_n.mp4?_nc_ht=video.cdninstagram.com&_nc_cat=111&_nc_ohc=abcdefghijklmnop&edm=APs17CUBAAAA&ccb=7-5&oh=00_AT_abcdefghijklmnopqrstuvwxyz&oe=64ABCDEF&_nc_sid=10d13b"></video>
    <script>
        var videoData = {
            "src": "https://video.fbcdn.net/v/t42.1790-2/10000000_123456789_1234567890123456789_n.mp4?_nc_cat=111&ccb=1-7&_nc_sid=985c63&efg=eyJybHMiOjE1MDB9&_nc_ohc=abcdefghijklmnop&_nc_ht=video.fbcdn.net&oh=00_AT_abcdefghijklmnopqrstuvwxyz&oe=64ABCDEF",
            "videoUrl": "https://video.cdninstagram.com/v/t50.2886-16/10000000_123456789_1234567890123456789_n.mp4?_nc_ht=video.cdninstagram.com&_nc_cat=111&_nc_ohc=abcdefghijklmnop&edm=APs17CUBAAAA&ccb=7-5&oh=00_AT_abcdefghijklmnopqrstuvwxyz&oe=64ABCDEF&_nc_sid=10d13b"
        };
    </script>
</html>
`;

// Test patterns from the ThreadsExtractor
const patterns = [
    { name: 'video_url', regex: /"video_url":"(https:[^"]*\.mp4[^"]*)"/g },
    { name: 'playback_url', regex: /"playback_url":"(https:[^"]*\.mp4[^"]*)"/g },
    { name: 'src', regex: /"src":"(https:[^"]*\.mp4[^"]*)"/g },
    { name: 'video_tag', regex: /<video[^>]*src="([^"]*\.mp4[^"]*)"/g },
    { name: 'videoUrl', regex: /"videoUrl":"(https:[^"]*\.mp4[^"]*)"/g },
    { name: 'url', regex: /"url":"(https:[^"]*\.mp4[^"]*)"/g },
    { name: 'general_mp4', regex: /(https:\/\/[^"\s]*\.mp4[^"\s]*)/g },
    { name: 'instagram_cdn', regex: /"src":"(https:\/\/video[^"]*\.cdninstagram\.com[^"]*\.mp4[^"]*)"/g },
    { name: 'facebook_cdn', regex: /"src":"(https:\/\/video[^"]*\.fbcdn\.net[^"]*\.mp4[^"]*)"/g },
    { name: 'instagram_cdn_general', regex: /(https:\/\/video[^"\s]*\.cdninstagram\.com[^"\s]*\.mp4[^"\s]*)/g },
    { name: 'facebook_cdn_general', regex: /(https:\/\/video[^"\s]*\.fbcdn\.net[^"\s]*\.mp4[^"\s]*)/g }
];

console.log('Testing pattern matching on mock HTML content...\n');

const foundUrls = new Set();
let totalMatches = 0;

patterns.forEach((pattern, index) => {
    console.log(`${index + 1}. Testing pattern: ${pattern.name}`);
    console.log(`   Pattern: ${pattern.regex.source}`);
    
    const matches = [];
    let match;
    
    // Reset regex lastIndex
    pattern.regex.lastIndex = 0;
    
    while ((match = pattern.regex.exec(mockHtml)) !== null) {
        let url = match[1];
        
        // Clean URL format (same as in ThreadsExtractor)
        url = url.replace(/\\\//g, '/');
        url = url.replace(/\\"/g, '"');
        url = url.replace(/\\/g, '');
        
        matches.push(url);
        foundUrls.add(url);
        
        if (matches.length >= 10) break; // Prevent infinite loops
    }
    
    console.log(`   Matches: ${matches.length}`);
    matches.forEach((url, matchIndex) => {
        console.log(`     ${matchIndex + 1}: ${url.substring(0, 80)}...`);
    });
    
    totalMatches += matches.length;
    console.log('');
});

console.log(`📊 Summary:`);
console.log(`Total patterns tested: ${patterns.length}`);
console.log(`Total matches found: ${totalMatches}`);
console.log(`Unique URLs found: ${foundUrls.size}`);
console.log('');

// Test URL validation
console.log('🔍 URL Validation Test');
console.log('----------------------');

function isValidVideoUrl(url) {
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

const uniqueUrls = Array.from(foundUrls);
console.log(`Testing ${uniqueUrls.length} unique URLs for validity:`);

uniqueUrls.forEach((url, index) => {
    const isValid = isValidVideoUrl(url);
    console.log(`${index + 1}. ${isValid ? '✅' : '❌'} ${url.substring(0, 80)}...`);
});

console.log('');

// Test signature analysis
console.log('🔍 Signature Analysis');
console.log('--------------------');

function analyzeSignature(url) {
    try {
        const urlObj = new URL(url);
        const params = new URLSearchParams(urlObj.search);
        
        const signatureParams = ['oh', 'oe', 'ts', 'sig', '__gda__', '_nc_ohc', '_nc_ht'];
        const foundParams = [];
        
        signatureParams.forEach(param => {
            if (params.has(param)) {
                foundParams.push({
                    param,
                    value: params.get(param)
                });
            }
        });
        
        return {
            url: url.substring(0, 80) + '...',
            domain: urlObj.hostname,
            hasSignature: foundParams.length > 0,
            signatureParams: foundParams,
            totalParams: params.size
        };
    } catch (error) {
        return {
            url: url.substring(0, 80) + '...',
            error: error.message
        };
    }
}

console.log('Analyzing signature parameters in found URLs:');
uniqueUrls.forEach((url, index) => {
    const analysis = analyzeSignature(url);
    console.log(`\n${index + 1}. ${analysis.url}`);
    
    if (analysis.error) {
        console.log(`   ❌ Error: ${analysis.error}`);
    } else {
        console.log(`   Domain: ${analysis.domain}`);
        console.log(`   Has signature: ${analysis.hasSignature ? '✅' : '❌'}`);
        console.log(`   Total params: ${analysis.totalParams}`);
        
        if (analysis.signatureParams.length > 0) {
            console.log(`   Signature params:`);
            analysis.signatureParams.forEach(param => {
                console.log(`     ${param.param}: ${param.value.substring(0, 20)}...`);
            });
        }
    }
});

console.log('');

// Test signature issues
console.log('🔍 Potential Signature Issues');
console.log('-----------------------------');

const issues = [];
const recommendations = [];

uniqueUrls.forEach((url, index) => {
    const analysis = analyzeSignature(url);
    
    if (!analysis.error) {
        // Check for common signature issues
        if (!analysis.hasSignature) {
            issues.push(`URL ${index + 1}: Missing signature parameters`);
        }
        
        if (url.includes('&amp;')) {
            issues.push(`URL ${index + 1}: Contains HTML entities (&amp;)`);
        }
        
        // Check for required Instagram/Facebook signature params
        const requiredParams = ['oh', 'oe'];
        const analysis2 = analyzeSignature(url);
        const foundRequired = analysis2.signatureParams.filter(p => requiredParams.includes(p.param));
        
        if (foundRequired.length === 0) {
            issues.push(`URL ${index + 1}: Missing required signature parameters (oh, oe)`);
        }
        
        // Check for expiration indicators
        if (url.includes('_nc_ohc') || url.includes('_nc_ht')) {
            // These are good - they indicate proper Instagram/Facebook CDN URLs
        } else {
            issues.push(`URL ${index + 1}: Missing CDN-specific parameters`);
        }
    }
});

if (issues.length > 0) {
    console.log('Found issues:');
    issues.forEach(issue => console.log(`❌ ${issue}`));
} else {
    console.log('✅ No signature issues found');
}

console.log('');

// Generate recommendations
console.log('💡 Recommendations');
console.log('------------------');

if (foundUrls.size > 0) {
    console.log('✅ Pattern matching is working correctly');
    console.log('✅ Video URLs can be extracted from Threads content');
} else {
    console.log('❌ No video URLs found - patterns may need adjustment');
}

if (issues.length > 0) {
    console.log('⚠️  Some signature issues detected:');
    console.log('   - Ensure HTML entities are properly decoded');
    console.log('   - Check for required signature parameters');
    console.log('   - Verify CDN-specific parameters are preserved');
} else {
    console.log('✅ Signature handling appears correct');
}

console.log('');

console.log('🎯 Next Steps for Real Implementation:');
console.log('1. Fix proxy access issues (try different proxies or methods)');
console.log('2. Test with real Threads page content');
console.log('3. Verify extracted URLs are accessible');
console.log('4. Implement proper signature validation');
console.log('5. Add error handling for various edge cases');