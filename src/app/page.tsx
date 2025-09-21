import ThreadsExtractor from "@/components/threads-extractor"
import { HelpSection } from "@/components/sections/help-section"

export default function Home() {
  return (
    <div className="flex flex-col bg-background transition-colors mt-16">
      <section id="home" className="flex-1 flex items-center justify-center bg-background">
        <ThreadsExtractor />
      </section>

      <section id="help" className="flex-1 flex items-center justify-center bg-background my-16">
        <HelpSection />
      </section>
    </div>
  )
}
