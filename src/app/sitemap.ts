import { MetadataRoute } from 'next'
import { indexableGuidePages } from '@/lib/seo-pages'
import { siteConfig } from '@/lib/site-config'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.baseUrl
  const staticPages = ["", "/guides", "/about", "/contact", "/editorial-policy", "/privacy", "/terms"]
  const rootChangeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "daily"
  const staticChangeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "weekly"
  
  return [
    ...staticPages.map((path, index) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: index === 0 ? rootChangeFrequency : staticChangeFrequency,
      priority: index === 0 ? 1 : 0.85,
    })),
    ...indexableGuidePages.map((page) => ({
      url: `${baseUrl}/guides/${page.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
  ]
}
