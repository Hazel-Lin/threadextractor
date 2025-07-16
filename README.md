# Threads 视频提取器

一个基于Web的工具，用于从Threads贴文中提取视频链接。

## 功能特性

✅ **简单易用的Web界面**  
✅ **支持多个视频提取**  
✅ **自动验证链接有效性**  
✅ **一键复制下载链接**  
✅ **直接下载视频文件**  

## 系统要求

- Python 3.7+
- Chrome浏览器
- ChromeDriver (需要与Chrome版本匹配)

## 安装依赖

```bash
# 安装Python依赖
pip3 install flask selenium requests

# 确保已安装Chrome浏览器和ChromeDriver
```

## 使用方法

### 1. 启动Web服务

```bash
python3 start_server.py
```

### 2. 访问Web界面

打开浏览器访问: http://localhost:8080

### 3. 使用说明

1. 在输入框中粘贴Threads贴文链接
2. 点击"提取视频链接"按钮
3. 等待处理完成
4. 查看提取结果：
   - 复制链接到剪贴板
   - 直接下载视频文件

## 支持的链接格式

```
https://www.threads.com/@username/post/POST_ID
```

## 注意事项

⚠️ **请遵守平台使用条款**  
⚠️ **私密贴文无法提取**  
⚠️ **部分视频可能因版权保护无法下载**  
⚠️ **仅供个人学习使用**  

## 故障排除

### 常见问题

1. **ChromeDriver版本不匹配**
   - 确保ChromeDriver版本与Chrome浏览器版本一致

2. **链接无效**
   - 检查贴文是否为公开状态
   - 确认链接格式正确

3. **提取失败**
   - 检查网络连接
   - 重试操作

## 文件结构

```
.
├── app.py              # Flask主应用
├── start_server.py     # 启动脚本
├── test.py            # 原始测试脚本
├── templates/
│   └── index.html     # Web界面模板
└── README.md          # 使用说明
```

## 技术实现

- **前端**: HTML + CSS + JavaScript
- **后端**: Flask + Python
- **爬虫**: Selenium WebDriver
- **验证**: requests库

---

🎬 享受使用 Threads 视频提取器！