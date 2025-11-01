import ThreadsExtractor from "@/components/threads-extractor"
import { AboutSection } from "@/components/sections/about-section"
import { HowToSection } from "@/components/sections/how-to-section"

export default function Home() {
  return (
    <div className="flex flex-col bg-background transition-colors mt-16">
      <section id="home" className="flex-1 flex items-center justify-center bg-background">
        <ThreadsExtractor />
      </section>

      <AboutSection />

      <section id="help">
        <HowToSection />
      </section>
    </div>
  )
}
