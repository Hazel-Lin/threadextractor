import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-4">
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
            <Link 
              href="/#home" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/#help" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              How to Use
            </Link>
            <Link 
              href="/privacy" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <a 
              href="mailto:contact@threadextractor.com"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact Us
            </a>
          </div>

          <div className="max-w-2xl mx-auto">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Threads Extractor is a free online tool for downloading Threads videos. 
              We respect intellectual property rights and encourage users to comply with 
              copyright laws and the terms of service of social media platforms.
            </p>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
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