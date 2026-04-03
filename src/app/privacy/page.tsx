import { PrivacySection } from "@/components/sections/privacy-section"
import type { Metadata } from "next"
import { buildMetadata } from "@/lib/metadata"

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "Read the privacy policy for Threads Extractor, including temporary media processing, cookies, and Google AdSense advertising disclosures.",
  path: "/privacy",
  keywords: ["threads extractor privacy policy", "threads downloader privacy", "adsense privacy policy"],
})

export default function PrivacyPage() {
  return <PrivacySection />
}
