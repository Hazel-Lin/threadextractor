# Thread Extractor - 项目架构说明

## 项目架构选择：Flask 后端

我们已经统一项目架构，选择使用 **Flask 后端 + Next.js 前端** 的分离架构。

### 已解决的架构问题

#### ❌ 之前的问题：
- **双重架构**：同时存在 Next.js API 路由和 Flask 后端
- **代码冗余**：前端包含完整的客户端提取库（3000+行代码）但实际未使用
- **硬编码 URL**：前端直接调用 `http://localhost:8080` 而不是使用环境变量
- **CORS 配置不当**：Flask 使用通配符 `*` 允许所有来源

#### ✅ 现在的解决方案：

1. **统一架构**
   - 移除了 `/src/app/api/` 目录下的所有 Next.js API 路由
   - 移除了未使用的客户端提取库 `/src/lib/threads-extractor.ts`
   - 前端专注于 UI 和用户交互
   - 后端专注于视频提取逻辑

2. **环境变量配置**
   - 添加 `NEXT_PUBLIC_BACKEND_URL` 环境变量
   - 创建 `.env.example` 模板文件
   - 前端动态读取后端 URL：`process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'`

3. **安全的 CORS 配置**
   ```python
   # 仅允许特定来源
   allowed_origins = ['http://localhost:3000', 'https://threadextractor.com']
   ```

4. **代码清理**
   - 修复了所有 ESLint 构建错误
   - 移除了未使用的变量和函数
   - 优化了 TypeScript 类型定义

## 当前架构图

```
┌─────────────────┐    HTTP API     ┌─────────────────┐
│   Next.js       │ ◄────────────► │   Flask         │
│   Frontend      │    Requests     │   Backend       │
│   (Port 3000)   │                 │   (Port 8080)   │
└─────────────────┘                 └─────────────────┘
│                                   │
├─ UI Components                    ├─ Video Extraction
├─ State Management                 ├─ Selenium WebDriver  
├─ User Interactions                ├─ Image Proxy
└─ Environment Config               └─ CORS Security

```

## 部署配置

### 开发环境
```bash
# 前端 (Next.js)
npm run dev                    # http://localhost:3000

# 后端 (Flask)
cd backend
python app.py                 # http://localhost:8080
```

### 生产环境
```bash
# 设置环境变量
NEXT_PUBLIC_BACKEND_URL=https://your-backend-domain.com

# 构建前端
npm run build
npm start

# 运行后端
python backend/app.py
```

## 环境变量

### 前端 (.env.local)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

### 生产环境示例
```env
NEXT_PUBLIC_BACKEND_URL=https://api.threadextractor.com
```

## API 端点

### Flask 后端提供的 API：

1. **POST /extract** - 提取视频链接
   - 请求：`{ "url": "threads_url" }`
   - 响应：`{ "success": true, "videos": [...], "user_profile": {...}, "video_metadata": {...} }`

2. **GET /download** - 下载视频
   - 查询参数：`?url=video_url&index=1`

3. **GET /proxy-image** - 图片代理
   - 查询参数：`?url=image_url`

## 项目优势

1. **清晰的职责分离**：前端处理 UI，后端处理业务逻辑
2. **更好的安全性**：CORS 配置仅允许特定来源
3. **环境灵活性**：通过环境变量轻松切换后端地址
4. **代码简洁**：移除了大量未使用的代码
5. **构建成功**：解决了所有 ESLint 和 TypeScript 错误

## 下一步优化建议

1. **后端部署**：使用 Gunicorn + Nginx 部署 Flask 应用
2. **容器化**：创建 Docker 配置文件
3. **监控**：添加日志记录和错误监控
4. **缓存**：实现视频链接缓存机制
5. **速率限制**：添加 API 调用频率限制