"use client"

import { useEffect, useState, ReactNode } from "react"

interface ContentAwareAdProps {
  children: ReactNode
  minContentLength?: number
  minContentElements?: number
}

export function ContentAwareAd({ 
  children, 
  minContentLength = 500,
  minContentElements = 3
}: ContentAwareAdProps) {
  const [hasEnoughContent, setHasEnoughContent] = useState(false)

  useEffect(() => {
    const checkContent = () => {
      const mainContent = document.querySelector('main')
      if (!mainContent) return false

      const textContent = mainContent.textContent || ''
      const contentElements = mainContent.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li')
      
      const hasMinLength = textContent.length >= minContentLength
      const hasMinElements = contentElements.length >= minContentElements
      
      return hasMinLength && hasMinElements
    }

    const hasContent = checkContent()
    setHasEnoughContent(hasContent)
    
    const observer = new MutationObserver(() => {
      const hasContent = checkContent()
      setHasEnoughContent(hasContent)
    })
    
    const mainContent = document.querySelector('main')
    if (mainContent) {
      observer.observe(mainContent, {
        childList: true,
        subtree: true,
        characterData: true
      })
    }
    
    return () => observer.disconnect()
  }, [minContentLength, minContentElements])

  if (!hasEnoughContent) {
    return null
  }

  return <>{children}</>
}