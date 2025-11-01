import { Card } from "@/components/ui/card"

export function HowToSection() {
  const steps = [
    {
      step: "1",
      title: "Find Your Video",
      description: "Open the Threads app or website and navigate to the video you want to download. Locate the share button on the post."
    },
    {
      step: "2",
      title: "Copy the Link",
      description: "Tap or click the share button and select 'Copy Link' from the options. The video URL will be copied to your clipboard."
    },
    {
      step: "3",
      title: "Paste and Extract",
      description: "Return to Threads Extractor, paste the link into the input field, and click the 'Load' button to start the extraction process."
    },
    {
      step: "4",
      title: "Download Your Video",
      description: "Once extraction is complete, click the 'Download Video' button. The video will be saved to your device in high quality."
    }
  ]

  return (
    <div className="w-full bg-background py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            How to Download Threads Videos
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Follow these simple steps to download any video from Threads in just a few seconds
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, index) => (
            <Card key={index} className="p-6 relative hover:shadow-lg transition-shadow">
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold shadow-lg">
                {item.step}
              </div>
              <div className="space-y-3 pt-4">
                <h3 className="text-xl font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-semibold text-foreground mb-1">
                  Is it free to use?
                </h4>
                <p className="text-sm text-muted-foreground">
                  Yes, completely free with no hidden fees or subscriptions.
                </p>
              </div>

              <div>
                <h4 className="text-base font-semibold text-foreground mb-1">
                  What video quality?
                </h4>
                <p className="text-sm text-muted-foreground">
                  We extract videos in the highest quality available from Threads without compression.
                </p>
              </div>

              <div>
                <h4 className="text-base font-semibold text-foreground mb-1">
                  Need an account?
                </h4>
                <p className="text-sm text-muted-foreground">
                  No account needed. Simply paste the link and download.
                </p>
              </div>

              <div>
                <h4 className="text-base font-semibold text-foreground mb-1">
                  Private videos?
                </h4>
                <p className="text-sm text-muted-foreground">
                  Only publicly accessible videos can be downloaded.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 border border-border rounded-lg p-6">
            <h3 className="text-xl font-bold text-foreground mb-4">
              Tips for Best Results
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span>Use a stable internet connection</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span>Copy the complete URL without modifications</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span>Refresh and retry if extraction fails</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span>Process one video at a time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span>Check your downloads folder</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span>Respect copyright and creator rights</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

