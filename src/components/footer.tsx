import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-center space-y-2">
          <div className="flex justify-center items-center space-x-4">
            <Link 
              href="/privacy" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-muted-foreground">•</span>
            <a 
              href="mailto:contact@threadextractor.com"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </a>
          </div>
          
          <p className="text-xs text-muted-foreground">
            © 2024 Thread Extractor. This tool is not affiliated with Meta or Threads.
          </p>
        </div>
      </div>
    </footer>
  )
}