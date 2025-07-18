import ThreadsExtractor from "@/components/threads-extractor"
import { HelpSection } from "@/components/sections/help-section"

export default function Home() {
  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col bg-background transition-colors">
      <section id="home" className="flex-1 flex items-center justify-center bg-background">
        <ThreadsExtractor />
      </section>

      <section id="help" className="flex-1 flex items-center justify-center bg-background">
        <HelpSection />
      </section>
    </div>
  )
}
