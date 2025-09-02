# Threads Extractor - Threads 视频提取器

一个基于 Next.js 和 shadcn/ui 的现代化 Threads 视频提取工具，支持一键提取和下载 Threads 平台的视频内容。

## ✨ 特性

### 🎯 核心功能
- 📹 **视频提取** - 一键提取 Threads 视频链接
- 💾 **批量下载** - 支持多个视频同时下载
- 📋 **快速复制** - 一键复制视频链接到剪贴板
- 🔍 **智能识别** - 自动识别页面中的视频内容

### 🎨 界面设计
- 🌈 **现代化UI** - 基于 shadcn/ui 的精美界面
- 📱 **响应式设计** - 完美适配手机和桌面端
- 🌙 **深色模式** - 支持明暗主题切换
- ⚡ **流畅动画** - 优雅的交互动画效果

### 🛠️ 技术特色
- 🚀 **Next.js 15** - 最新的 React 框架
- 🎨 **Tailwind CSS** - 原子化 CSS 框架
- 🧩 **shadcn/ui** - 高质量组件库
- 📘 **TypeScript** - 类型安全的开发体验
- 🔧 **客户端渲染** - 无需服务器端支持

## 🚀 快速开始

### 环境要求
- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器

### 安装依赖
```bash
npm install
# 或
yarn install
```

### 启动开发服务器
```bash
npm run dev
# 或
yarn dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本
```bash
npm run build
npm run start
# 或
yarn build
yarn start
```

## 📁 项目结构

```
threadsextractor/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css         # 全局样式
│   │   ├── layout.tsx          # 根布局
│   │   └── page.tsx            # 主页面
│   ├── components/             # 组件目录
│   │   ├── ui/                 # shadcn/ui 组件
│   │   │   ├── alert.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── input.tsx
│   │   └── threads-extractor.tsx  # 主要组件
│   └── lib/                    # 工具库
│       ├── threads-extractor.ts   # 提取逻辑
│       └── utils.ts               # 工具函数
├── public/                     # 静态资源
├── tailwind.config.ts          # Tailwind 配置
├── tsconfig.json              # TypeScript 配置
└── package.json               # 项目配置
```

## 🎨 技术栈

### 前端框架
- **Next.js 15** - React 全栈框架
- **React 19** - 用户界面库
- **TypeScript** - 类型安全的 JavaScript

### 样式和组件
- **Tailwind CSS** - 原子化 CSS 框架
- **shadcn/ui** - 高质量组件库
- **Lucide React** - 图标库
- **clsx** - 条件类名工具

### 工具库
- **class-variance-authority** - 组件变体管理
- **tailwind-merge** - Tailwind 类名合并

## 📖 使用指南

### 基本用法
1. 在输入框中粘贴 Threads 链接
2. 点击"提取视频"按钮
3. 等待系统处理并显示结果
4. 点击"复制"或"下载"按钮获取视频

### 支持的链接格式
- `https://www.threads.net/@username/post/POST_ID`
- `https://threads.net/@username/post/POST_ID`
- `https://www.threads.com/@username/post/POST_ID`
- `https://threads.com/@username/post/POST_ID`

### 注意事项
- 确保链接是公开可访问的
- 某些私密内容可能无法提取
- 请遵守平台使用条款和版权规定

## 🛡️ 技术限制

### 浏览器限制
由于浏览器的跨域限制（CORS），直接提取可能会遇到问题。项目提供了以下解决方案：

1. **代理服务** - 使用 `allorigins.win` 代理服务
2. **使用说明** - 提供手动提取的详细步骤
3. **备用方案** - 推荐使用 Flask 后端版本

### 兼容性
- 现代浏览器（Chrome 90+, Firefox 88+, Safari 14+）
- 支持 ES2020 语法
- 需要 JavaScript 启用

## 🚀 部署建议

### Vercel（推荐）
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# 将 out 目录部署到 Netlify
```

### 自托管
```bash
npm run build
npm run start
```

## 🔮 未来计划

- [ ] 添加更多视频平台支持
- [ ] 实现视频预览功能
- [ ] 添加批量处理队列
- [ ] 优化移动端体验
- [ ] 添加用户偏好设置
- [ ] 实现离线缓存功能

---

<div align="center">
  <p>⭐ 如果这个项目对你有帮助，请给我们一个星标！</p>
  <p>Made with ❤️ by Threads Extractor Team</p>
</div>
