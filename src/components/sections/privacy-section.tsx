import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Phone, Eye, Lock, Server, UserCheck, AlertTriangle } from "lucide-react"

export function PrivacySection() {
  return (
    <div className="bg-background w-full min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary rounded-full">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            Privacy <span className="text-primary">Policy</span>
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            We value your privacy and are committed to protecting your personal information
          </p>
          <p className="text-sm text-muted-foreground">
            Last updated: July 20, 2025
          </p>
        </div>

        {/* Single Comprehensive Card */}
        <Card className="border border-border bg-card shadow-lg">
          <CardContent className="p-8 space-y-8">
            
            {/* Privacy Commitment */}
            <Alert className="border-primary/20 bg-primary/5">
              <Shield className="h-5 w-5 text-primary" />
              <AlertDescription className="text-base text-foreground">
                <strong>Privacy Commitment:</strong> Thread Extractor uses complete client-side processing.
                We do not collect, store or transmit your personal information. All operations are completed locally in your browser.
              </AlertDescription>
            </Alert>

            {/* Information We Don't Collect */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Eye className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Information We Don&apos;t Collect</h2>
              </div>
              <p className="text-muted-foreground">
                We absolutely do not collect or store any of the following information:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground text-lg">Personal Information</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Name, email address, phone number</li>
                    <li>• Home address or ID numbers</li>
                    <li>• Login credentials or social accounts</li>
                    <li>• Payment information</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground text-lg">Usage & Device Data</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Threads links you enter</li>
                    <li>• Downloaded content or history</li>
                    <li>• Device identifiers or location</li>
                    <li>• Browser fingerprint or OS details</li>
                  </ul>
                </div>
              </div>
            </section>

            <hr className="border-border" />

            {/* How It Works */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Lock className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">How We Protect Your Privacy</h2>
              </div>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Local Processing</h3>
                    <p className="text-muted-foreground">
                      Video extraction is handled by our backend server, but no personal data or request content is stored.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Temporary Processing</h3>
                    <p className="text-muted-foreground">
                      URLs are processed momentarily for video extraction, then immediately discarded without logging.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Instant Cleanup</h3>
                    <p className="text-muted-foreground">
                      All temporary data is automatically cleared when you refresh or close the page.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <hr className="border-border" />

            {/* Third Party Services */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Server className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Third Party Services</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">Backend Video Processing</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    Our server extracts video content from Threads pages.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Only URL addresses are transmitted</li>
                    <li>• No user data is stored on our servers</li>
                  </ul>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">CDN & Hosting (Vercel, Cloudflare)</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    Used for website delivery and performance optimization.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Basic access logs (IP, timestamp) for security</li>
                    <li>• Automatically deleted within 30 days</li>
                  </ul>
                </div>
              </div>
            </section>

            <hr className="border-border" />

            {/* Your Rights */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <UserCheck className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Your Rights</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">Complete Anonymity</h3>
                  <p className="text-muted-foreground text-sm">
                    Use all features without registration or providing personal information.
                  </p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">Data Transparency</h3>
                  <p className="text-muted-foreground text-sm">
                    Our code is open source for your review and verification.
                  </p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">Stop Anytime</h3>
                  <p className="text-muted-foreground text-sm">
                    Discontinue use at any time without any action required.
                  </p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">Contact Support</h3>
                  <p className="text-muted-foreground text-sm">
                    Reach out with any privacy questions or concerns.
                  </p>
                </div>
              </div>
            </section>

            <hr className="border-border" />

            {/* Important Notice */}
            <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-800">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <AlertDescription className="text-orange-800 dark:text-orange-200">
                <strong>Important Notice:</strong> While we don&apos;t collect your data, downloaded content may be copyright protected.
                Please ensure you have the right to download and use this content in compliance with applicable laws.
              </AlertDescription>
            </Alert>

            {/* Contact Us */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Phone className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Contact Us</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">Privacy Questions</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    <strong>Email:</strong> privacy@threadextractor.com
                  </p>
                  <p className="text-xs text-muted-foreground">
                    We respond within 48 hours.
                  </p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">General Support</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    <strong>Email:</strong> support@threadextractor.com
                  </p>
                  <p className="text-xs text-muted-foreground">
                    For technical issues and questions.
                  </p>
                </div>
              </div>
            </section>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}