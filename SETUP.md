# Threads 视频提取器 - Next.js + Flask 架构

## 架构说明

### 方案1: 前后端分离（推荐）
```
Next.js Frontend (Port 3000)
     ↓ API 调用
Python Flask Backend (Port 8080)  
     ↓ Selenium 处理
Threads 视频提取
```

## 快速启动

### 1. 安装依赖

#### Python 后端依赖
```bash
pip3 install flask selenium requests
```

#### Node.js 前端依赖
```bash
cd frontend
npm install
```

### 2. 启动服务

#### 选项1: 同时启动两个服务器（推荐）
```bash
python3 start_both_servers.py
```

#### 选项2: 分别启动
```bash
# 终端1 - 启动后端
python3 app.py

# 终端2 - 启动前端  
cd frontend
npm run dev
```

### 3. 访问应用

- **前端界面**: http://localhost:3000
- **后端API**: http://localhost:8080

## 技术栈

### 前端 (Next.js)
- **框架**: Next.js 15 with App Router
- **UI库**: shadcn/ui + Tailwind CSS
- **语言**: TypeScript
- **功能**: 现代化的响应式UI界面

### 后端 (Flask)
- **框架**: Flask + Python
- **爬虫**: Selenium WebDriver
- **功能**: Threads视频链接提取和下载

## 文件结构

```
.
├── app.py                 # Flask 后端主文件
├── start_both_servers.py  # 双服务器启动脚本
├── frontend/              # Next.js 前端
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   └── components/
│   │       ├── ui/        # shadcn/ui 组件
│   │       └── threads-extractor.tsx
│   ├── package.json
│   └── tailwind.config.ts
├── templates/             # 原Flask模板（备用）
└── README.md             # 原版说明文档
```

## 功能特性

✅ **现代化UI界面** - 基于 shadcn/ui 的美观界面  
✅ **响应式设计** - 支持手机和桌面端  
✅ **实时状态反馈** - 加载状态和错误提示  
✅ **一键复制链接** - 便捷的剪贴板操作  
✅ **直接下载视频** - 代理下载功能  
✅ **前后端分离** - 可独立部署和扩展  

## 开发说明

### 前端开发
```bash
cd frontend
npm run dev      # 开发模式
npm run build    # 构建生产版本
npm run start    # 启动生产服务器
```

### 后端开发
- 后端代码在 `app.py` 中
- 支持CORS跨域请求
- API端点：`/extract` 和 `/download`

## 故障排除

1. **端口冲突**：确保 3000 和 8080 端口未被占用
2. **CORS错误**：后端已配置CORS支持
3. **Chrome驱动**：确保 ChromeDriver 版本匹配
4. **依赖安装**：检查 Python 和 Node.js 依赖是否完整安装

---

🎬 享受使用现代化的 Threads 视频提取器！