import { PrivacySection } from "@/components/sections/privacy-section"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - Threads Extractor",
  description: "Privacy policy for Threads Extractor. Learn about how we protect your privacy, use cookies, and display advertisements through Google AdSense.",
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPage() {
  return <PrivacySection />
}