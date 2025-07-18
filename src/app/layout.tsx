import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navigation />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
