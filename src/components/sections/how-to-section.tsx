import { Card } from "@/components/ui/card"

export function HowToSection() {
  const steps = [
    {
      step: "1",
      title: "Copy the original public post URL",
      description: "Start from the Threads post itself, not an old media asset URL. In repeated checks, the original public post link was the most reliable input."
    },
    {
      step: "2",
      title: "Paste it into the homepage tool",
      description: "Use the main downloader on the homepage. The maintained workflow is kept there so the tool behavior and the help content stay in sync."
    },
    {
      step: "3",
      title: "Wait for the result before retrying",
      description: "If the first request takes a moment, let it finish before pasting a new link. Retrying too early makes it harder to tell a slow response from a failed one."
    },
    {
      step: "4",
      title: "Check browser save behavior",
      description: "On iPhone and some mobile browsers, a successful result may open in a preview or save into Files/Downloads instead of feeling like a classic direct download."
    }
  ]

  const failureChecks = [
    "If the post is not public, the downloader will usually fail.",
    "If you are reusing an old media URL, restart from the original Threads post URL.",
    "If a file opened in a new tab, check the browser download controls before retrying.",
    "If mobile behavior feels inconsistent, compare the result in Safari/Chrome and then in a desktop browser.",
  ]

  return (
    <div className="w-full bg-background py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            How the maintained workflow works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The site now keeps one primary downloader workflow. These steps reflect the path that proved most reliable during manual checks of public Threads post URLs.
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
              What this workflow is for
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-semibold text-foreground mb-1">
                  Public posts
                </h4>
                <p className="text-sm text-muted-foreground">
                  The maintained downloader is meant for public Threads post URLs. Private-post access is out of scope.
                </p>
              </div>

              <div>
                <h4 className="text-base font-semibold text-foreground mb-1">
                  Browser-based use
                </h4>
                <p className="text-sm text-muted-foreground">
                  The workflow is designed to run in a browser without asking users to install an app or extension.
                </p>
              </div>

              <div>
                <h4 className="text-base font-semibold text-foreground mb-1">
                  Manual maintenance
                </h4>
                <p className="text-sm text-muted-foreground">
                  The homepage tool and the main guides are reviewed together so changes in observed behavior can be reflected quickly.
                </p>
              </div>

              <div>
                <h4 className="text-base font-semibold text-foreground mb-1">
                  Responsible use
                </h4>
                <p className="text-sm text-muted-foreground">
                  Users still need to respect copyright, creator rights, and platform rules when saving public media.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 border border-border rounded-lg p-6">
            <h3 className="text-xl font-bold text-foreground mb-4">
              Failure checks before you retry
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {failureChecks.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
