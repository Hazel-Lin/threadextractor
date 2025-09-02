export async function GET() {
  const adsContent = 'google.com, pub-4541336405653119, DIRECT, f08c47fec0942fa0';

  return new Response(adsContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      'X-Robots-Tag': 'noindex',
    },
  });
}