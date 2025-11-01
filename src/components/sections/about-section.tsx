import { Card } from "@/components/ui/card"
import { Video, Download, Shield, Zap } from "lucide-react"

export function AboutSection() {
  const features = [
    {
      icon: Video,
      title: "High Quality Video Extraction",
      description: "Extract videos from Threads in their original quality. Our advanced extraction technology ensures you get the best possible video quality available from the source."
    },
    {
      icon: Download,
      title: "One-Click Download",
      description: "Simple and fast download process. Just paste the Threads link, click extract, and download your video instantly. No complicated steps or unnecessary waiting."
    },
    {
      icon: Shield,
      title: "Safe and Secure",
      description: "Your privacy is our priority. We don't store any of your data or download history. All processing happens securely, and no personal information is collected or shared."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized for speed and efficiency. Our servers are designed to process your requests quickly, so you can download videos without delays or interruptions."
    }
  ]

  return (
    <div className="w-full bg-muted/30 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Why Choose Threads Extractor?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The most reliable and user-friendly tool for downloading Threads videos. 
            Built with modern technology to provide you with the best experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="max-w-3xl mx-auto p-6 bg-card border border-border rounded-lg">
          <h3 className="text-xl font-bold text-foreground mb-3 text-center">
            About Our Service
          </h3>
          <p className="text-muted-foreground leading-relaxed text-center">
            Threads Extractor is a free online tool for downloading videos from Threads. 
            Built with cutting-edge web technologies, we provide a fast, reliable, and secure experience. 
            We respect content creators&apos; rights and encourage responsible use in compliance with copyright laws.
          </p>
        </div>
      </div>
    </div>
  )
}

