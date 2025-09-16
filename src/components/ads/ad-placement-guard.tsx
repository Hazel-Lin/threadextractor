"use client"

import { useEffect, useState, ReactNode } from "react"
import { usePathname } from "next/navigation"

interface AdPlacementGuardProps {
  children: ReactNode
  allowedPaths?: string[]
  blockedPaths?: string[]
}

export function AdPlacementGuard({ 
  children, 
  allowedPaths = ["/"],
  blockedPaths = ["/404", "/500", "/error"]
}: AdPlacementGuardProps) {
  const pathname = usePathname()
  const [shouldShowAd, setShouldShowAd] = useState(false)

  useEffect(() => {
    const isBlocked = blockedPaths.some(path => pathname.startsWith(path))
    const isAllowed = allowedPaths.some(path => 
      path === "*" || pathname === path || 
      (path.endsWith("*") && pathname.startsWith(path.slice(0, -1)))
    )
    
    const hasValidContent = () => {
      const hasError = document.querySelector('[data-error="true"]')
      const hasLoading = document.querySelector('[data-loading="true"]')
      const hasEmptyState = document.querySelector('[data-empty="true"]')
      
      return !hasError && !hasLoading && !hasEmptyState
    }
    
    setShouldShowAd(!isBlocked && isAllowed && hasValidContent())
  }, [pathname, allowedPaths, blockedPaths])

  if (!shouldShowAd) {
    return null
  }

  return <>{children}</>
}