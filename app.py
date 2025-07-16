from flask import Flask, render_template, request, jsonify, Response, stream_template
import sys
import os
from urllib.parse import quote

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

# Add CORS headers to all responses
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# Handle preflight requests
@app.route('/', methods=['OPTIONS'])
@app.route('/extract', methods=['OPTIONS'])
@app.route('/download', methods=['OPTIONS'])
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
                if validate_video_url(url, cookie_dict):
                    valid_urls.append(url)
            
            return valid_urls
        else:
            return None
            
    except Exception as e:
        return None
    finally:
        driver.quit()

def validate_video_url(url, cookies=None):
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
    return render_template('index.html')

@app.route('/extract', methods=['POST'])
def extract_videos():
    try:
        data = request.get_json()
        thread_url = data.get('url', '').strip()
        
        if not thread_url:
            return jsonify({'success': False, 'message': '请输入有效的Threads链接'})
        
        # 验证是否为Threads链接
        if 'threads.com' not in thread_url:
            return jsonify({'success': False, 'message': '请输入有效的Threads链接'})
        
        # 提取视频链接
        video_urls = extract_video_url_selenium(thread_url)
        
        if video_urls:
            return jsonify({
                'success': True,
                'message': f'成功提取到 {len(video_urls)} 个视频链接',
                'videos': video_urls
            })
        else:
            return jsonify({'success': False, 'message': '未找到视频链接，请检查链接是否正确或视频是否为私密'})
    
    except Exception as e:
        return jsonify({'success': False, 'message': f'处理过程中出现错误: {str(e)}'})

@app.route('/download')
def download_video():
    """代理下载视频"""
    try:
        video_url = request.args.get('url')
        if not video_url:
            return jsonify({'error': '缺少视频链接'}), 400
        
        # 获取视频文件名
        video_index = request.args.get('index', '1')
        filename = f'threads_video_{video_index}.mp4'
        
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
            return jsonify({'error': f'下载失败，状态码: {response.status_code}'}), 400
            
    except Exception as e:
        return jsonify({'error': f'下载过程中出现错误: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)