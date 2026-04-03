export const siteConfig = {
  name: "Threads Extractor",
  shortName: "Threads Extractor",
  description:
    "Download public Threads videos online, learn how Threads media download works, and explore guides for saving Threads posts across desktop and mobile.",
  baseUrl: "https://threadsextractor.com",
  locale: "en_US",
  twitterHandle: "@threadsextractor",
  contactEmail: "contact@threadsextractor.com",
} as const

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return new URL(normalizedPath, siteConfig.baseUrl).toString()
}
