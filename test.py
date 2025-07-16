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

def extract_video_url_selenium(thread_url):
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
        print("⏳ 正在打开页面，请稍候...")
        driver.get(thread_url)
        
        # 等待页面加载
        wait = WebDriverWait(driver, 20)
        
        # 尝试等待视频元素加载
        try:
            wait.until(EC.presence_of_element_located((By.TAG_NAME, "video")))
            print("✅ 检测到视频元素")
        except:
            print("⚠️ 未检测到视频元素，继续尝试...")
        
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
                print(f"🔍 找到 {len(video_elements)} 个视频元素")
                for i, video in enumerate(video_elements):
                    src = video.get_attribute("src")
                    if src and src not in video_urls:
                        print(f"视频 {i+1} src: {src}")
                        video_urls.append(src)
        except Exception as e:
            print(f"⚠️ 查找视频元素时出错: {e}")
        
        if video_urls:
            print("✅ 找到视频链接：")
            valid_urls = []
            
            for i, url in enumerate(video_urls, 1):
                print(f"{i}. 检测链接: {url[:100]}...")
                
                # 验证链接有效性
                if validate_video_url(url, cookie_dict):
                    print(f"   ✅ 链接有效")
                    valid_urls.append(url)
                else:
                    print(f"   ❌ 链接无效或已过期")
            
            if valid_urls:
                print(f"\n🎉 找到 {len(valid_urls)} 个有效的视频链接：")
                for i, url in enumerate(valid_urls, 1):
                    print(f"{i}. {url}")
                return valid_urls
            else:
                print("❌ 所有视频链接都无效")
                return None
        else:
            print("❌ 未找到视频链接")
            
            # 调试信息：保存页面源码
            print("💾 保存页面源码到 debug_page.html 以供调试")
            with open("debug_page.html", "w", encoding="utf-8") as f:
                f.write(html)
                
            return None
            
    except Exception as e:
        print(f"❌ 发生错误: {e}")
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
        print(f"   ⚠️ 验证时出错: {e}")
        return False

def download_video(url, filename="video.mp4", cookies=None):
    """下载视频文件"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        }
        
        print(f"⏳ 开始下载视频到 {filename}")
        response = requests.get(url, headers=headers, cookies=cookies, stream=True, timeout=30)
        
        if response.status_code == 200:
            with open(filename, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            print(f"✅ 视频下载完成: {filename}")
            return True
        else:
            print(f"❌ 下载失败，状态码: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ 下载时出错: {e}")
        return False

if __name__ == '__main__':
    # 使用提供的测试链接
    # test_url = "https://www.threads.com/@skill.boost.ai/post/DMKQvjdP0wA?xmt=AQF0M4_ofUm7YUFEH4sb7uPkvgagTWZS9OZtZnaGfsc8cg"
    test_url = "https://www.threads.com/@rahulchauh_n/post/DMKYGlBN6fJ?xmt=AQF0hdl7-CD9jlw9Q94fKS0mCbR1ARw8u8nukcEPh0doiA"
    
    print(f"🔗 测试链接: {test_url}")
    result = extract_video_url_selenium(test_url)
    
    if result:
        print(f"\n✅ 成功提取到 {len(result)} 个有效视频链接")
        
        # 询问是否下载视频
        try:
            choice = input("\n是否下载视频？(y/n): ").strip().lower()
            if choice == 'y':
                for i, url in enumerate(result, 1):
                    filename = f"threads_video_{i}.mp4"
                    print(f"\n⏳ 下载视频 {i}/{len(result)}")
                    if download_video(url, filename):
                        print(f"✅ 视频 {i} 下载成功: {filename}")
                    else:
                        print(f"❌ 视频 {i} 下载失败")
            else:
                print("📋 视频链接已提取，可以手动下载")
        except KeyboardInterrupt:
            print("\n👋 程序已取消")
    else:
        print("\n❌ 未能提取到有效的视频链接")
