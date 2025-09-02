"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { Logo } from "@/components/logo"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const handleLogoClick = () => {
    if (pathname === '/') {
      // If on homepage, scroll to home section
      scrollToSection('home')
    } else {
      // If on other pages, navigate to homepage
      router.push('/')
    }
    setIsMenuOpen(false)
  }

  const handleHomeClick = () => {
    if (pathname === '/') {
      // If on homepage, scroll to home section
      scrollToSection('home')
    } else {
      // If on other pages, navigate to homepage
      router.push('/')
    }
    setIsMenuOpen(false)
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
    setIsMenuOpen(false)
  }

  return (
    <nav className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-between">
          {/* Logo */}
          <button
            onClick={handleLogoClick}
            className="flex items-center text-foreground hover:text-primary transition-colors"
          >
            <Logo className="w-12 h-12" />
            <span className="text-lg font-bold text-primary">
              Threads Extractor
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={handleHomeClick}
              className="text-sm text-primary hover:text-primary/80 transition-colors font-bold px-2 py-1 rounded-md hover:bg-primary/10"
            >
              Home
            </button>
            {/* <button
              onClick={() => scrollToSection('help')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium px-2 py-1 rounded-md hover:bg-accent"
            >
              How to use
            </button> */}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <div className="flex flex-col space-y-4">
              <button
                onClick={handleHomeClick}
                className="text-left text-sm text-primary hover:text-primary/80 transition-colors font-bold py-2 px-2 rounded-md hover:bg-primary/10"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('help')}
                className="text-left text-sm text-muted-foreground hover:text-foreground transition-colors font-bold py-2 px-2 rounded-md hover:bg-accent"
              >
                How to use
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}