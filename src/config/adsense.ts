const DEFAULT_PUBLISHER_ID = "ca-pub-4541336405653119"
const ADSENSE_HOST = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
const ADS_TXT_DIRECT_SELLER_ID = "f08c47fec0942fa0"

function readEnv(value: string | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

function toPubId(clientId: string): string {
  return clientId.replace(/^ca-/, "")
}

function toAdsTxtPublisherId(clientId: string): string {
  return clientId.replace(/^ca-pub-/, "pub-")
}

const publisherId = readEnv(process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID) ?? DEFAULT_PUBLISHER_ID

export const adsenseConfig = {
  publisherId,
  ads: {
    homePage: {
      topBanner: readEnv(process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_TOP),
      afterExtractor: readEnv(process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_MIDDLE),
      afterHelp: readEnv(process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_BOTTOM),
    },
  },
  settings: {
    enableLazyLoad: readEnv(process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_LAZY_LOAD) !== "false",
    enableAutoAds: readEnv(process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_AUTO_ADS) === "true",
    testMode: process.env.NODE_ENV !== "production" || readEnv(process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_TEST_MODE) === "true",
  },
} as const

export const ADSENSE_CLIENT_ID = adsenseConfig.publisherId
export const ADSENSE_PUB_ID = toPubId(adsenseConfig.publisherId)
export const ADSENSE_SCRIPT_SRC = `${ADSENSE_HOST}?client=${adsenseConfig.publisherId}`
export const ADSENSE_ADS_TXT = `google.com, ${toAdsTxtPublisherId(adsenseConfig.publisherId)}, DIRECT, ${ADS_TXT_DIRECT_SELLER_ID}`

export function hasAdSensePublisher() {
  return Boolean(adsenseConfig.publisherId)
}

export function hasManualAdSlot(slot?: string): slot is string {
  return Boolean(slot)
}
