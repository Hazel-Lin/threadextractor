import { Card } from "@/components/ui/card"
import { ClipboardCheck, Download, Shield, TriangleAlert } from "lucide-react"

export function AboutSection() {
  const features = [
    {
      icon: ClipboardCheck,
      title: "Maintained workflow",
      description: "The site keeps one primary downloader entry point on the homepage and a small set of support guides so instructions and tool behavior stay aligned."
    },
    {
      icon: Download,
      title: "Public-post use only",
      description: "The downloader is intended for public Threads post URLs. Private content, account-only views, and bypass-style use cases are out of scope."
    },
    {
      icon: Shield,
      title: "Manual review of guidance",
      description: "Support content is updated against observed downloader behavior and browser save behavior. AI may help draft copy, but final guidance is manually reviewed."
    },
    {
      icon: TriangleAlert,
      title: "Known limits are documented",
      description: "The site explicitly calls out cases that fail most often, including private posts, stale media URLs, and browser-specific file handling differences."
    }
  ]

  return (
    <div className="w-full bg-muted/30 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            What the maintained site focuses on
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The site has been narrowed to one main downloader workflow and a small support set. The goal is to make the maintained pages easier to trust, easier to review, and easier to keep current.
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
            What changed recently
          </h3>
          <p className="text-muted-foreground leading-relaxed text-center">
            The site reduced near-duplicate topic pages, trimmed ad placements on support content, and moved more of the visible guidance toward tested behavior, failure checks, and device-specific handling.
          </p>
        </div>
      </div>
    </div>
  )
}
