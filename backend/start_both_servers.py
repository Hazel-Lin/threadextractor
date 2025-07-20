#!/usr/bin/env python3
"""
启动脚本 - 同时运行 Flask 后端和 Next.js 前端
"""

import subprocess
import time
import os
import signal
import sys

def run_flask_server():
    """启动 Flask 后端服务器"""
    print("🚀 启动 Flask 后端服务器 (端口 8080)...")
    return subprocess.Popen([
        sys.executable, 'app.py'
    ], cwd=os.path.dirname(os.path.abspath(__file__)))

def run_nextjs_server():
    """启动 Next.js 前端服务器"""
    print("🚀 启动 Next.js 前端服务器 (端口 3000)...")
    frontend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    return subprocess.Popen([
        'npm', 'run', 'dev'
    ], cwd=frontend_dir)

def signal_handler(sig, frame):
    """处理 Ctrl+C 信号"""
    print('\n\n🛑 正在停止服务器...')
    if 'flask_process' in globals():
        flask_process.terminate()
    if 'nextjs_process' in globals():
        nextjs_process.terminate()
    print('✅ 服务器已停止')
    sys.exit(0)

if __name__ == '__main__':
    # 注册信号处理器
    signal.signal(signal.SIGINT, signal_handler)
    
    print("🎬 Threads 视频提取器 - 双服务器启动")
    print("=" * 50)
    
    try:
        # 启动 Flask 后端
        flask_process = run_flask_server()
        
        # 等待 Flask 启动
        time.sleep(3)
        
        # 启动 Next.js 前端
        nextjs_process = run_nextjs_server()
        
        print("\n" + "=" * 50)
        print("✅ 服务器启动成功!")
        print("📱 前端地址: http://localhost:3000")
        print("🔧 后端地址: http://localhost:8080")
        print("🛑 按 Ctrl+C 停止服务器")
        print("=" * 50)
        
        # 等待进程结束
        flask_process.wait()
        nextjs_process.wait()
        
    except Exception as e:
        print(f"❌ 启动失败: {e}")
        sys.exit(1)