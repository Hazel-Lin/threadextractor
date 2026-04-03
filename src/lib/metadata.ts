import type { Metadata } from "next"
import { absoluteUrl, siteConfig } from "@/lib/site-config"

interface MetadataInput {
  title: string
  description: string
  path: string
  keywords?: string[]
  type?: "website" | "article"
}

export function buildMetadata({
  title,
  description,
  path,
  keywords = [],
  type = "website",
}: MetadataInput): Metadata {
  const url = absoluteUrl(path)
  const fullTitle = `${title} | ${siteConfig.name}`

  return {
    title: fullTitle,
    description,
    keywords,
    metadataBase: new URL(siteConfig.baseUrl),
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      creator: siteConfig.twitterHandle,
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
  }
}
