#!/usr/bin/env python3
import requests
import json

def test_threads_extraction():
    """测试完整的Threads链接提取和下载流程"""
    
    # 测试URL
    test_url = "https://www.threads.com/@aiposthub/post/DMUEx27MB9C?xmt=AQF08QlS338MxmGtYzsD7or6mHnJCZ89Nd9spMSSZdBP-g"
    backend_url = "http://127.0.0.1:8081"
    
    print("🔍 测试Threads视频提取...")
    print(f"测试链接: {test_url}")
    print("-" * 50)
    
    # Step 1: 提取视频信息
    print("1. 提取视频信息...")
    extract_response = requests.post(
        f"{backend_url}/extract",
        headers={"Content-Type": "application/json"},
        json={"url": test_url},
        timeout=60
    )
    
    if extract_response.status_code != 200:
        print(f"❌ 提取失败: {extract_response.status_code}")
        print(extract_response.text)
        return
    
    extract_data = extract_response.json()
    print(f"✅ 提取成功: {extract_data.get('success')}")
    
    # 显示用户信息
    user_profile = extract_data.get('user_profile', {})
    if user_profile:
        print(f"👤 用户: @{user_profile.get('username', 'N/A')}")
        print(f"📝 显示名: {user_profile.get('display_name', 'N/A')}")
        print(f"🖼️ 头像: {user_profile.get('avatar_url', 'N/A')[:60]}...")
    
    # 显示视频信息
    video_metadata = extract_data.get('video_metadata', {})
    if video_metadata:
        print(f"📄 内容: {video_metadata.get('post_content', 'N/A')[:100]}...")
        print(f"🖼️ 缩略图: {video_metadata.get('thumbnail_url', 'N/A')[:60]}...")
    
    # 显示视频URL
    videos = extract_data.get('videos', [])
    if videos:
        print(f"🎥 找到 {len(videos)} 个视频:")
        for i, video_url in enumerate(videos, 1):
            print(f"  {i}. {video_url[:80]}...")
        
        # Step 2: 测试视频下载
        print("\n2. 测试视频下载...")
        first_video_url = videos[0]
        
        # 构建下载URL
        import urllib.parse
        encoded_video_url = urllib.parse.quote(first_video_url, safe='')
        download_url = f"{backend_url}/download?url={encoded_video_url}"
        
        print(f"下载链接: {download_url[:100]}...")
        
        # 测试下载（只获取响应头）
        download_response = requests.head(download_url, timeout=30)
        
        if download_response.status_code == 200:
            print("✅ 视频下载链接有效")
            content_length = download_response.headers.get('Content-Length')
            if content_length:
                print(f"📊 视频大小: {int(content_length) / (1024*1024):.2f} MB")
        else:
            print(f"❌ 视频下载失败: {download_response.status_code}")
            # 获取错误详情
            error_response = requests.get(download_url, timeout=10)
            print(f"错误详情: {error_response.text}")
    
    else:
        print("❌ 未找到视频")
    
    print("\n" + "=" * 50)
    print("测试完成！")

if __name__ == "__main__":
    test_threads_extraction()