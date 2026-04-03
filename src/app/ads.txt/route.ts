import { ADSENSE_ADS_TXT } from "@/config/adsense"

export async function GET() {
  return new Response(ADSENSE_ADS_TXT, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      'X-Robots-Tag': 'noindex',
    },
  });
}
