import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Analytics } from "@vercel/analytics/next"

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
  title: "Thread Extractor - Threads 视频提取器",
  description: "一键提取 Threads 视频下载链接，支持批量下载，简单易用的在线工具。Thread Extractor - Extract and download videos from Threads posts easily.",
  keywords: ["threads", "video", "extractor", "download", "threads.net", "社交媒体", "视频下载"],
  authors: [{ name: "Thread Extractor Team" }],
  creator: "Thread Extractor",
  publisher: "Thread Extractor",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://threadextractor.com"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Thread Extractor - Threads 视频提取器",
    description: "一键提取 Threads 视频下载链接，支持批量下载",
    url: "https://threadextractor.com",
    siteName: "Thread Extractor",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thread Extractor - Threads 视频提取器",
    description: "一键提取 Threads 视频下载链接，支持批量下载",
    creator: "@threadextractor",
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
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        <Navigation />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
