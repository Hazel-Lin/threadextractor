export const adsenseConfig = {
  publisherId: "ca-pub-4541336405653119",
  ads: {
    homePage: {
      afterExtractor: "1234567890", // 替换为您的实际广告位 ID
      afterHelp: "2345678901", // 替换为您的实际广告位 ID
      topBanner: "3456789012", // 页面顶部横幅广告
      bottomBanner: "4567890123", // 页面底部横幅广告
    },
    sidebar: "5678901234", // 侧边栏广告位
    footer: "6789012345", // 页脚广告位
    inArticle: "7890123456", // 文章内嵌广告
    popup: "8901234567", // 弹窗广告（谨慎使用）
  },
  settings: {
    enableLazyLoad: true, // 启用延迟加载
    enableAutoAds: false, // 是否启用自动广告
    testMode: false, // 测试模式
  }
}

export const ADSENSE_CLIENT_ID = adsenseConfig.publisherId