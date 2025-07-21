from flask import Flask, render_template, request, jsonify, Response, stream_template
import sys
import os
from urllib.parse import quote
from dotenv import load_dotenv
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import validators
import re
from urllib.parse import urlparse

# Load environment variables from .env file
load_dotenv()

# 将现有的脚本功能导入
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import re
import json
import requests
from urllib.parse import unquote

app = Flask(__name__)

# Configure rate limiting for API protection
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=[
        os.getenv('RATELIMIT_DEFAULT_PER_HOUR', '100') + " per hour",
        os.getenv('RATELIMIT_DEFAULT_PER_MINUTE', '20') + " per minute"
    ],
    storage_uri=os.getenv('RATELIMIT_STORAGE_URL', 'memory://'),
    strategy="fixed-window"
)

# Rate limit exceeded handler
@app.errorhandler(429)
def rate_limit_exceeded(e):
    return jsonify({
        'success': False,
        'message': 'Rate limit exceeded. Please try again later.',
        'error': 'Too Many Requests',
        'retry_after': str(e.retry_after) if hasattr(e, 'retry_after') else '60'
    }), 429

# Input validation functions
def validate_threads_url(url):
    """Validate and sanitize Threads URL"""
    if not url or not isinstance(url, str):
        return False, "URL is required and must be a string"
    
    # Strip whitespace and normalize
    url = url.strip()
    
    # Basic URL format validation
    if not validators.url(url):
        return False, "Invalid URL format"
    
    # Parse URL for detailed validation
    try:
        parsed = urlparse(url)
    except Exception:
        return False, "Invalid URL structure"
    
    # Check protocol security
    if parsed.scheme not in ['http', 'https']:
        return False, "Only HTTP and HTTPS protocols are allowed"
    
    # Validate Threads domains
    allowed_domains = [
        'threads.com',
        'www.threads.com',
        'threads.net',
        'www.threads.net',
        'instagram.com',
        'www.instagram.com'
    ]
    
    if not any(domain in parsed.netloc.lower() for domain in allowed_domains):
        return False, "Only Threads and Instagram URLs are supported"
    
    # Check for suspicious patterns
    suspicious_patterns = [
        r'javascript:',
        r'data:',
        r'file:',
        r'ftp:',
        r'<script',
        r'</script>',
        r'<iframe',
        r'</iframe>'
    ]
    
    for pattern in suspicious_patterns:
        if re.search(pattern, url, re.IGNORECASE):
            return False, "URL contains potentially malicious content"
    
    # URL length check
    if len(url) > 2000:
        return False, "URL is too long (maximum 2000 characters)"
    
    return True, url

def validate_image_url(url):
    """Validate image URL for proxy endpoint"""
    if not url or not isinstance(url, str):
        return False, "Image URL is required"
    
    url = url.strip()
    
    # Basic URL validation
    if not validators.url(url):
        return False, "Invalid image URL format"
    
    try:
        parsed = urlparse(url)
    except Exception:
        return False, "Invalid image URL structure"
    
    # Check protocol
    if parsed.scheme not in ['http', 'https']:
        return False, "Only HTTP and HTTPS protocols allowed for images"
    
    # Validate allowed image domains
    allowed_image_domains = [
        'cdninstagram.com',
        'threads.net',
        'instagram.com',
        'scontent.cdninstagram.com'
    ]
    
    if not any(domain in parsed.netloc.lower() for domain in allowed_image_domains):
        return False, "Image domain not allowed"
    
    # Check file extension if present
    path = parsed.path.lower()
    if path and '.' in path:
        allowed_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
        if not any(path.endswith(ext) for ext in allowed_extensions):
            return False, "Image file type not supported"
    
    # URL length check
    if len(url) > 1000:
        return False, "Image URL is too long"
    
    return True, url

def validate_video_url(url):
    """Validate video URL for download endpoint"""
    if not url or not isinstance(url, str):
        return False, "Video URL is required"
    
    url = url.strip()
    
    # Basic URL validation
    if not validators.url(url):
        return False, "Invalid video URL format"
    
    try:
        parsed = urlparse(url)
    except Exception:
        return False, "Invalid video URL structure"
    
    # Check protocol
    if parsed.scheme not in ['http', 'https']:
        return False, "Only HTTP and HTTPS protocols allowed for videos"
    
    # Video URLs should typically be from video hosting domains
    trusted_video_domains = [
        'cdninstagram.com',
        'video.threads.net',
        'scontent.cdninstagram.com',
        'instagram.com'
    ]
    
    if not any(domain in parsed.netloc.lower() for domain in trusted_video_domains):
        return False, "Video domain not trusted"
    
    # Check for video file indicators (more flexible)
    path = parsed.path.lower()
    if path:
        video_indicators = ['.mp4', '.mov', '.avi', '.webm', '/v/', '/video/']
        # If path has extension, it should be video-related
        # If no extension, allow it (many video URLs don't have extensions)
        if '.' in path.split('/')[-1]:  # Check only the filename part
            if not any(indicator in path for indicator in video_indicators):
                return False, "URL does not appear to be a video"
    
    # URL length check
    if len(url) > 1500:
        return False, "Video URL is too long"
    
    return True, url

# Configure CORS manually for better security
@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    # Allow specific origins for better security
    allowed_origins = ['http://localhost:3000', 'https://threadextractor.com']
    
    if origin in allowed_origins:
        response.headers.add('Access-Control-Allow-Origin', origin)
    else:
        # For development, allow localhost
        if origin and 'localhost' in origin:
            response.headers.add('Access-Control-Allow-Origin', origin)
    
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

# Handle preflight requests
@app.route('/', methods=['OPTIONS'])
@app.route('/extract', methods=['OPTIONS'])
@app.route('/download', methods=['OPTIONS'])
@app.route('/proxy-image', methods=['OPTIONS'])
def handle_options():
    return '', 200

def extract_video_url_selenium(thread_url):
    """提取Threads视频链接"""
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)

    driver = webdriver.Chrome(options=chrome_options)
    driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
    
    try:
        driver.get(thread_url)
        
        # 等待页面加载
        wait = WebDriverWait(driver, 20)
        
        # 尝试等待视频元素加载
        try:
            wait.until(EC.presence_of_element_located((By.TAG_NAME, "video")))
        except:
            pass
        
        # 额外等待动态内容加载
        time.sleep(10)
        
        html = driver.page_source
        
        # Extract user profile information
        user_profile = extract_user_profile(html)
        
        # Extract video metadata (title and thumbnail)
        video_metadata = extract_video_metadata(html)
        
        # 获取cookies用于后续请求
        cookies = driver.get_cookies()
        cookie_dict = {cookie['name']: cookie['value'] for cookie in cookies}
        
        # 尝试多种正则表达式模式匹配视频URL
        patterns = [
            r'"video_url":"(https:[^"]*\.mp4[^"]*)"',
            r'"playback_url":"(https:[^"]*\.mp4[^"]*)"',
            r'"src":"(https:[^"]*\.mp4[^"]*)"',
            r'<video[^>]*src="([^"]*\.mp4[^"]*)"',
            r'"videoUrl":"(https:[^"]*\.mp4[^"]*)"',
            r'"url":"(https:[^"]*\.mp4[^"]*)"',
            r'(https://[^"\s]*\.mp4[^"\s]*)',
            r'"dash_prefetch_experimental":"(https:[^"]*\.mp4[^"]*)"',
            r'"video_dash_manifest":"(https:[^"]*\.mp4[^"]*)"'
        ]
        
        video_urls = []
        for pattern in patterns:
            matches = re.findall(pattern, html)
            for match in matches:
                # 清理URL格式 - 保持HTML实体编码
                clean_url = match.replace("\\/", "/")
                # 不要立即解码&amp;，保持原始格式
                if clean_url and clean_url not in video_urls:
                    video_urls.append(clean_url)
        
        # 直接从video元素获取src属性
        try:
            video_elements = driver.find_elements(By.TAG_NAME, "video")
            if video_elements:
                for i, video in enumerate(video_elements):
                    src = video.get_attribute("src")
                    if src and src not in video_urls:
                        video_urls.append(src)
        except Exception as e:
            pass
        
        if video_urls:
            valid_urls = []
            
            for url in video_urls:
                # 验证链接有效性
                if validate_video_url_simple(url, cookie_dict):
                    valid_urls.append(url)
            
            return {
                'videos': valid_urls,
                'user_profile': user_profile,
                'video_metadata': video_metadata
            }
        else:
            return {
                'videos': None,
                'user_profile': user_profile,
                'video_metadata': video_metadata
            }
            
    except Exception as e:
        return None
    finally:
        driver.quit()

def extract_user_profile(html):
    """Extract user profile information from Threads page"""
    try:
        user_info = {
            'username': None,
            'display_name': None,
            'avatar_url': None,
            'followers_count': None,
            'bio': None
        }
        
        # Extract username - multiple patterns to try
        username_patterns = [
            r'"username":"([^"]+)"',
            r'"handle":"([^"]+)"',
            r'"user_name":"([^"]+)"',
            r'@([a-zA-Z0-9_\.]+)',
            r'"pk":"(\d+)".*?"username":"([^"]+)"',
            r'username&quot;:&quot;([^&]+)&quot;'
        ]
        
        for pattern in username_patterns:
            matches = re.findall(pattern, html)
            if matches:
                if isinstance(matches[0], tuple):
                    user_info['username'] = matches[0][-1]  # Get last item from tuple
                else:
                    user_info['username'] = matches[0]
                break
        
        # Extract display name
        display_name_patterns = [
            r'"full_name":"([^"]+)"',
            r'"display_name":"([^"]+)"',
            r'"name":"([^"]+)"',
            r'full_name&quot;:&quot;([^&]+)&quot;',
            r'"title":"([^"]+)"'
        ]
        
        for pattern in display_name_patterns:
            matches = re.findall(pattern, html)
            if matches:
                user_info['display_name'] = matches[0]
                break
        
        # Extract avatar URL
        avatar_patterns = [
            r'"profile_pic_url":"([^"]+)"',
            r'"avatar_url":"([^"]+)"',
            r'"profile_picture":"([^"]+)"',
            r'profile_pic_url&quot;:&quot;([^&]+)&quot;',
            r'"hd_profile_pic_url_info":[^}]*"url":"([^"]+)"'
        ]
        
        for pattern in avatar_patterns:
            matches = re.findall(pattern, html)
            if matches:
                # Clean URL format
                avatar_url = matches[0].replace("\\/", "/").replace("\\u0026", "&")
                user_info['avatar_url'] = avatar_url
                break
        
        # Extract followers count
        followers_patterns = [
            r'"follower_count":(\d+)',
            r'"followers_count":(\d+)',
            r'follower_count&quot;:(\d+)',
            r'"edge_followed_by":[^}]*"count":(\d+)',
            r'(\d+(?:,\d+)*)\s*followers?',
            r'(\d+(?:\.\d+)?[KMB]?)\s*followers?'
        ]
        
        for pattern in followers_patterns:
            matches = re.findall(pattern, html, re.IGNORECASE)
            if matches:
                followers_text = matches[0]
                # Convert K, M, B to numbers
                if 'K' in followers_text.upper():
                    user_info['followers_count'] = int(float(followers_text.replace('K', '').replace('k', '')) * 1000)
                elif 'M' in followers_text.upper():
                    user_info['followers_count'] = int(float(followers_text.replace('M', '').replace('m', '')) * 1000000)
                elif 'B' in followers_text.upper():
                    user_info['followers_count'] = int(float(followers_text.replace('B', '').replace('b', '')) * 1000000000)
                else:
                    user_info['followers_count'] = int(followers_text.replace(',', ''))
                break
        
        # Extract bio/description
        bio_patterns = [
            r'"biography":"([^"]+)"',
            r'"bio":"([^"]+)"',
            r'"description":"([^"]+)"',
            r'biography&quot;:&quot;([^&]+)&quot;',
            r'"edge_owner_to_timeline_media":[^}]*"biography":"([^"]+)"'
        ]
        
        for pattern in bio_patterns:
            matches = re.findall(pattern, html)
            if matches:
                # Clean bio text
                bio = matches[0].replace('\\n', '\n').replace('\\"', '"').replace('\\/', '/')
                user_info['bio'] = bio
                break
        
        return user_info
        
    except Exception as e:
        print(f"Error extracting user profile: {str(e)}")
        return {
            'username': None,
            'display_name': None,
            'avatar_url': None,
            'followers_count': None,
            'bio': None
        }

def extract_video_metadata(html):
    """Extract comprehensive video metadata including post content and thumbnails"""
    try:
        metadata = {
            'title': None,
            'thumbnail_url': None,
            'post_content': None
        }
        
        # Priority 1: OpenGraph meta tags (most reliable for Threads)
        og_patterns = {
            'post_content': [
                r'<meta\s+property="og:description"\s+content="([^"]+)"',
                r'<meta\s+name="description"\s+content="([^"]+)"',
                r'<meta\s+property="description"\s+content="([^"]+)"'
            ],
            'thumbnail_url': [
                r'<meta\s+property="og:image"\s+content="([^"]+)"',
                r'<meta\s+name="image"\s+content="([^"]+)"',
                r'<meta\s+property="twitter:image"\s+content="([^"]+)"'
            ],
            'title': [
                r'<meta\s+property="og:title"\s+content="([^"]+)"',
                r'<meta\s+name="title"\s+content="([^"]+)"',
                r'<title>([^<]+)</title>'
            ]
        }
        
        # Extract from OpenGraph meta tags first (highest priority)
        for field, patterns in og_patterns.items():
            for pattern in patterns:
                matches = re.findall(pattern, html, re.IGNORECASE | re.DOTALL)
                if matches:
                    content = matches[0].strip()
                    # Clean HTML entities and decode
                    content = content.replace('&quot;', '"').replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>')
                    if len(content) > 5:  # Valid content
                        metadata[field] = content
                        break
        
        # Priority 2: Enhanced post text content extraction (fallback)
        if not metadata['post_content']:
            post_content_patterns = [
                # Main caption patterns
                r'"caption":{"text":"([^"]+)"',
                r'"caption":"([^"]+)"',
                r'"text":"([^"]*)"(?=.*video)',
                r'"body":"([^"]+)"',
                r'"content":"([^"]+)"',
                
                # Threads-specific patterns
                r'"thread_items":[^}]*"post":[^}]*"text":"([^"]+)"',
                r'"post_content":"([^"]+)"',
                r'"message":"([^"]+)"',
                
                # HTML entity encoded patterns
                r'caption&quot;:&quot;([^&]+)&quot;',
                r'text&quot;:&quot;([^&]+)&quot;',
                
                # Alternative text patterns
                r'"accessibility_caption":"([^"]+)"',
                r'"alt_text":"([^"]+)"',
                r'"description":"([^"]+)"',
                
                # Media caption patterns
                r'"edge_media_to_caption":[^}]*"text":"([^"]+)"',
                r'"media_preview":[^}]*"text":"([^"]+)"'
            ]
        
            best_content = ""
            for pattern in post_content_patterns:
                matches = re.findall(pattern, html, re.DOTALL)
                if matches:
                    for match in matches:
                        # Clean and validate content
                        content = match.replace('\\n', '\n').replace('\\"', '"').replace('\\/', '/').replace('\\t', ' ').strip()
                        # Filter out system messages and very short content
                        if len(content) > 10 and not any(skip in content.lower() for skip in ['loading', 'error', 'undefined', 'null']):
                            if len(content) > len(best_content):
                                best_content = content
            
            if best_content:
                metadata['post_content'] = best_content
        
        # Enhanced video title/caption extraction (fallback if post_content not found)
        if not metadata['post_content'] and not metadata['title']:
            title_patterns = [
                r'"title":"([^"]+)"',
                r'"headline":"([^"]+)"',
                r'"summary":"([^"]+)"'
            ]
            
            for pattern in title_patterns:
                matches = re.findall(pattern, html)
                if matches:
                    title = max(matches, key=len) if len(matches) > 1 else matches[0]
                    title = title.replace('\\n', ' ').replace('\\"', '"').replace('\\/', '/').strip()
                    if len(title) > 10:
                        metadata['title'] = title
                        break
        
        # Priority 3: Enhanced video thumbnail extraction (fallback if og:image not found)
        if not metadata['thumbnail_url']:
            thumbnail_patterns = [
                # CDN Instagram patterns (as seen in screenshot)
                r'https://scontent-[^\.]+\.cdninstagram\.com/[^"]*\.(?:jpg|jpeg|png|webp)[^"]*',
                
                # Direct thumbnail URLs
                r'"thumbnail_url":"([^"]+)"',
                r'"preview_url":"([^"]+)"',
                r'"poster_url":"([^"]+)"',
                r'"cover_url":"([^"]+)"',
                r'"image_url":"([^"]+)"',
                
                # HTML video poster
                r'<video[^>]*poster="([^"]+)"',
                r'"poster":"([^"]+)"',
                
                # Threads-specific patterns
                r'"video_thumbnail":"([^"]+)"',
                r'"preview_image":"([^"]+)"',
                r'"cover_image":"([^"]+)"',
                
                # HTML entity encoded patterns
                r'thumbnail_url&quot;:&quot;([^&]+)&quot;',
                r'poster&quot;:&quot;([^&]+)&quot;',
                
                # Display resources patterns
                r'"display_resources":[^}]*"src":"([^"]+)"',
                r'"thumbnail_resources":[^}]*"src":"([^"]+)"',
                r'"image_versions2":[^}]*"url":"([^"]+)"',
                
                # Preview image patterns
                r'"preview_image_url":"([^"]+)"',
                r'"first_frame":"([^"]+)"',
                r'"video_preview":"([^"]+)"',
                
                # Generic image patterns for video content
                r'"images":[^}]*"url":"([^"]+)"',
                r'"media":[^}]*"url":"([^"]*\.(?:jpg|jpeg|png|webp)[^"]*)"'
            ]
        
            best_thumbnail = None
            highest_quality_score = 0
            
            for pattern in thumbnail_patterns:
                matches = re.findall(pattern, html)
                for match in matches:
                    # Handle tuple results from groups vs single matches
                    thumbnail_url = match if isinstance(match, str) else match[0] if match else ""
                    
                    # Clean thumbnail URL
                    thumbnail_url = thumbnail_url.replace("\\/", "/").replace("\\u0026", "&").strip()
                    
                    # Validate image URL
                    if any(ext in thumbnail_url.lower() for ext in ['.jpg', '.jpeg', '.png', '.webp', '.gif']):
                        # Score based on URL quality indicators
                        quality_score = 0
                        
                        # Higher score for CDN Instagram URLs (as seen in screenshot)
                        if 'cdninstagram.com' in thumbnail_url:
                            quality_score += 5
                        if 'hd' in thumbnail_url.lower() or 'high' in thumbnail_url.lower():
                            quality_score += 3
                        if any(size in thumbnail_url for size in ['1080', '720', '480']):
                            quality_score += 2
                        if 'thumbnail' in thumbnail_url.lower() or 'preview' in thumbnail_url.lower():
                            quality_score += 1
                        
                        if quality_score > highest_quality_score or not best_thumbnail:
                            best_thumbnail = thumbnail_url
                            highest_quality_score = quality_score
            
            if best_thumbnail:
                metadata['thumbnail_url'] = best_thumbnail
        
        # Additional attempt to extract thumbnail from video elements
        if not metadata['thumbnail_url']:
            video_element_patterns = [
                r'<video[^>]*>.*?<source[^>]*src="([^"]+)"',
                r'"video_url":"([^"]+)".*?"poster":"([^"]+)"',
                r'"playback_url":"([^"]+)".*?"thumbnail":"([^"]+)"'
            ]
            
            for pattern in video_element_patterns:
                matches = re.findall(pattern, html)
                if matches:
                    # For patterns that capture both video and thumbnail
                    if len(matches[0]) == 2 if isinstance(matches[0], tuple) else False:
                        thumbnail_url = matches[0][1].replace("\\/", "/").replace("\\u0026", "&")
                        if any(ext in thumbnail_url.lower() for ext in ['.jpg', '.jpeg', '.png', '.webp']):
                            metadata['thumbnail_url'] = thumbnail_url
                            break
        
        return metadata
        
    except Exception as e:
        print(f"Error extracting video metadata: {str(e)}")
        return {
            'title': None,
            'thumbnail_url': None,
            'post_content': None
        }

def validate_video_url_simple(url, cookies=None):
    """验证视频URL是否有效"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        }
        
        # 发送HEAD请求检查视频是否可访问
        response = requests.head(url, headers=headers, cookies=cookies, timeout=10, allow_redirects=True)
        
        if response.status_code == 200:
            content_type = response.headers.get('content-type', '')
            if 'video' in content_type.lower():
                return True
        
        return False
        
    except Exception as e:
        return False

@app.route('/')
def index():
    return jsonify({'message': 'Threads Video Extractor Backend API', 'status': 'running'})

@app.route('/health')
def health_check():
    """Health check endpoint for monitoring and load balancers"""
    try:
        # Check Chrome driver availability
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        
        driver = webdriver.Chrome(options=chrome_options)
        driver.quit()
        chrome_available = True
        chrome_error = None
    except Exception as e:
        chrome_available = False
        chrome_error = str(e)
    
    # Basic system info
    import time
    import psutil
    
    health_data = {
        'status': 'healthy' if chrome_available else 'degraded',
        'timestamp': time.time(),
        'version': '1.0.0',
        'components': {
            'chrome_driver': {
                'status': 'available' if chrome_available else 'unavailable',
                'error': chrome_error
            },
            'rate_limiter': {
                'status': 'available',
                'storage': os.getenv('RATELIMIT_STORAGE_URL', 'memory://')
            },
            'system': {
                'memory_percent': psutil.virtual_memory().percent,
                'cpu_percent': psutil.cpu_percent(interval=1),
                'disk_percent': psutil.disk_usage('/').percent
            }
        }
    }
    
    status_code = 200 if chrome_available else 503
    return jsonify(health_data), status_code

@app.route('/extract', methods=['POST'])
@limiter.limit("5 per minute")  # Strict limit for video extraction
def extract_videos():
    try:
        # Input validation for JSON data
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'Request must contain JSON data'}), 400
        
        thread_url = data.get('url', '')
        
        # Comprehensive URL validation
        is_valid, validation_result = validate_threads_url(thread_url)
        if not is_valid:
            return jsonify({
                'success': False, 
                'message': f'Invalid URL: {validation_result}'
            }), 400
        
        # Use the validated and sanitized URL
        thread_url = validation_result
        
        # 提取视频链接和用户信息
        extraction_result = extract_video_url_selenium(thread_url)
        
        if extraction_result and extraction_result.get('videos'):
            return jsonify({
                'success': True,
                'message': 'Video extraction successful',
                'videos': extraction_result['videos'],
                'user_profile': extraction_result['user_profile'],
                'video_metadata': extraction_result['video_metadata']
            })
        elif extraction_result and extraction_result.get('user_profile'):
            # 即使没有视频，但有用户信息时也返回成功
            return jsonify({
                'success': True,
                'message': 'User profile extracted, but no videos found',
                'videos': [],
                'user_profile': extraction_result['user_profile'],
                'video_metadata': extraction_result['video_metadata']
            })
        else:
            return jsonify({'success': False, 'message': 'No video links found. Please check if the link is correct or if the video is private'})
    
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error occurred during processing: {str(e)}'})

@app.route('/proxy-image')
@limiter.limit("30 per minute")  # Higher limit for image proxying
def proxy_image():
    """Proxy images to avoid CORS issues"""
    try:
        image_url = request.args.get('url')
        
        # Comprehensive image URL validation
        is_valid, validation_result = validate_image_url(image_url)
        if not is_valid:
            return jsonify({
                'error': f'Invalid image URL: {validation_result}'
            }), 400
        
        # Use the validated and sanitized URL
        image_url = validation_result
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        }
        
        response = requests.get(image_url, headers=headers, stream=True, timeout=10)
        
        if response.status_code == 200:
            content_type = response.headers.get('content-type', 'image/jpeg')
            
            def generate():
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        yield chunk
            
            return Response(
                generate(),
                mimetype=content_type,
                headers={
                    'Content-Type': content_type,
                    'Cache-Control': 'public, max-age=3600',
                    'Access-Control-Allow-Origin': '*'
                }
            )
        else:
            return jsonify({'error': f'Failed to fetch image, status: {response.status_code}'}), 400
            
    except Exception as e:
        return jsonify({'error': f'Error proxying image: {str(e)}'}), 500

@app.route('/download')
@limiter.limit("10 per minute")  # Moderate limit for downloads
def download_video():
    """代理下载视频"""
    try:
        video_url = request.args.get('url')
        
        # Comprehensive video URL validation
        is_valid, validation_result = validate_video_url(video_url)
        if not is_valid:
            return jsonify({
                'error': f'Invalid video URL: {validation_result}'
            }), 400
        
        # Use the validated and sanitized URL
        video_url = validation_result
        
        # Validate video index parameter
        video_index = request.args.get('index', '1')
        if not video_index.isdigit() or int(video_index) < 1 or int(video_index) > 100:
            return jsonify({'error': 'Invalid video index (must be 1-100)'}), 400
        
        filename = f'threads_video.mp4'
        
        # 设置请求头
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        }
        
        # 发送请求获取视频
        response = requests.get(video_url, headers=headers, stream=True, timeout=30)
        
        if response.status_code == 200:
            # 获取文件大小
            content_length = response.headers.get('content-length')
            
            def generate():
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        yield chunk
            
            # 返回文件流
            return Response(
                generate(),
                mimetype='video/mp4',
                headers={
                    'Content-Disposition': f'attachment; filename="{filename}"',
                    'Content-Length': content_length,
                    'Content-Type': 'video/mp4'
                }
            )
        else:
            return jsonify({'error': f'Download failed, status code: {response.status_code}'}), 400
            
    except Exception as e:
        return jsonify({'error': f'Error occurred during download: {str(e)}'}), 500

if __name__ == '__main__':
    # Production-safe configuration
    import os
    
    # Get configuration from environment variables
    debug_mode = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    host = os.getenv('FLASK_HOST', '127.0.0.1')  # Default to localhost for security
    port = int(os.getenv('FLASK_PORT', '8080'))
    
    # Warn about debug mode in production
    if debug_mode:
        import warnings
        warnings.warn(
            "Debug mode is enabled! This should NEVER be used in production.",
            UserWarning,
            stacklevel=2
        )
    
    app.run(debug=debug_mode, host=host, port=port)