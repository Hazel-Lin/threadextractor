import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Analytics } from "@vercel/analytics/next"
import { AdSenseProvider } from "@/providers/adsense-provider";
import { ADSENSE_CLIENT_ID, ADSENSE_SCRIPT_SRC, adsenseConfig, hasAdSensePublisher } from "@/config/adsense";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Threads Extractor - Threads 视频提取器",
  description: "一键提取 Threads 视频下载链接，支持批量下载，简单易用的在线工具。Threads Extractor - Extract and download videos from Threads posts easily.",
  keywords: ["threads", "video", "extractor", "download", "threads.net", "社交媒体", "视频下载"],
  authors: [{ name: "Threads Extractor Team" }],
  creator: "Threads Extractor",
  publisher: "Threads Extractor",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://threadsextractor.com"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Threads Extractor - Threads 视频提取器",
    description: "一键提取 Threads 视频下载链接，支持批量下载",
    url: "https://threadsextractor.com",
    siteName: "Threads Extractor",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Threads Extractor - Threads 视频提取器",
    description: "一键提取 Threads 视频下载链接，支持批量下载",
    creator: "@threadsextractor",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hasAdsense = hasAdSensePublisher()
  const googleAnalyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID?.trim()

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {hasAdsense && (
          <meta name="google-adsense-account" content={ADSENSE_CLIENT_ID} />
        )}
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        {googleAnalyticsId && (
          <>
            <Script
              id="google-analytics"
              async
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            />
            <Script id="google-analytics-config" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${googleAnalyticsId}');`}
            </Script>
          </>
        )}
        {hasAdsense && (
          <>
            <Script
              id="google-adsense"
              async
              strategy="afterInteractive"
              src={ADSENSE_SCRIPT_SRC}
              crossOrigin="anonymous"
            />
            {adsenseConfig.settings.enableAutoAds && (
              <Script id="google-adsense-auto-ads" strategy="afterInteractive">
                {`(adsbygoogle = window.adsbygoogle || []).push({
  google_ad_client: "${ADSENSE_CLIENT_ID}",
  enable_page_level_ads: true
});`}
              </Script>
            )}
          </>
        )}
        <AdSenseProvider>
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AdSenseProvider>
        <Analytics />
      </body>
    </html>
  );
}
