// Global type definitions for the application

declare global {
  interface Window {
    adsbygoogle?: unknown[]
    gtag?: (command: string, action: string, parameters?: Record<string, unknown>) => void
  }
}

// Google AdSense types
export interface AdsByGoogleInstance {
  push: (args: Record<string, unknown>) => void
}

// Google Analytics types
export interface GtagFunction {
  (command: 'config' | 'event' | 'custom', action: string, parameters?: Record<string, unknown>): void
}

export {}