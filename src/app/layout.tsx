import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Analytics } from "@vercel/analytics/next"
import { AdSenseProvider } from "@/providers/adsense-provider";
import { ADSENSE_CLIENT_ID, ADSENSE_SCRIPT_SRC, adsenseConfig, hasAdSensePublisher } from "@/config/adsense";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";
import { buildOrganizationSchema, buildWebsiteSchema } from "@/lib/schema";

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
  ...buildMetadata({
    title: "Threads Video Downloader and Guides",
    description: siteConfig.description,
    path: "/",
    keywords: ["threads video downloader", "download threads video online", "threads to mp4"],
  }),
  authors: [{ name: "Threads Extractor Team" }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        {hasAdsense && (
          <meta name="google-adsense-account" content={ADSENSE_CLIENT_ID} />
        )}
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        <JsonLd data={[buildOrganizationSchema(), buildWebsiteSchema()]} />
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
                {`window.__threadsextractorAutoAdsInitialized = window.__threadsextractorAutoAdsInitialized || false;
if (!window.__threadsextractorAutoAdsInitialized) {
  (window.adsbygoogle = window.adsbygoogle || []).push({
    google_ad_client: "${ADSENSE_CLIENT_ID}",
    enable_page_level_ads: true
  });
  window.__threadsextractorAutoAdsInitialized = true;
}`}
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
