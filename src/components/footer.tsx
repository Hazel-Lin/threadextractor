import Link from "next/link"

export function Footer() {
  const guideLinks = [
    { href: "/guides/how-to-download-videos-from-threads", label: "How to Download Videos from Threads" },
    { href: "/guides/threads-video-not-downloading", label: "Threads Video Not Downloading" },
    { href: "/guides/download-threads-videos-on-iphone-android-pc", label: "Download Threads Videos on iPhone, Android, and PC" },
  ]

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-foreground">Site</h3>
              <div className="flex flex-col gap-2">
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
                <Link href="/guides" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Guides</Link>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
                <Link href="/#help" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How to Use</Link>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-foreground">Workflow</h3>
              <div className="flex flex-col gap-2">
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Main Downloader</Link>
                <Link href="/guides/how-to-download-videos-from-threads" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Basic Download Steps</Link>
                <Link href="/guides/threads-video-not-downloading" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Failure Checks</Link>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-foreground">Guides</h3>
              <div className="flex flex-col gap-2">
                {guideLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-foreground">Trust</h3>
              <div className="flex flex-col gap-2">
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
                <Link href="/editorial-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Editorial Policy</Link>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
                <a href="mailto:contact@threadsextractor.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact Us</a>
              </div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Threads Extractor is a free tool for public Threads video workflows. The maintained site centers on one downloader entry point plus a small set of manually reviewed support guides.
            </p>
          </div>

          <div className="text-center text-xs text-muted-foreground space-y-1">
            <p>
              © 2025 Threads Extractor. All rights reserved.
            </p>
            <p>
              This tool is not affiliated with, endorsed by, or connected to Meta Platforms, Inc., Threads, or Instagram.
            </p>
            <p className="mt-2">
              We use Google AdSense to display advertisements. By using this site, you agree to our use of cookies. 
              <Link href="/privacy" className="text-primary hover:underline ml-1">
                Learn more
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
