#!/usr/bin/env python3
"""
Threads 视频提取器 Web服务启动脚本
"""

from app import app

if __name__ == '__main__':
    print("🚀 启动 Threads 视频提取器 Web服务...")
    print("📱 访问地址: http://localhost:8080")
    print("🛑 按 Ctrl+C 停止服务")
    print("-" * 50)
    
    try:
        app.run(debug=True, host='0.0.0.0', port=8080)
    except KeyboardInterrupt:
        print("\n👋 服务已停止")