import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, AlertTriangle, Shield, Scale } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { buildMetadata } from "@/lib/metadata"

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description: "Read the Terms of Service for Threads Extractor, including acceptable use, copyright, advertising, and service limitations.",
  path: "/terms",
  keywords: ["threads extractor terms", "threads downloader terms of service"],
})

export default function TermsPage() {
  return (
    <div className="bg-background w-full min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary rounded-full">
              <FileText className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            Terms of <span className="text-primary">Service</span>
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Please read these terms carefully before using Threads Extractor
          </p>
          <p className="text-sm text-muted-foreground">
            Last updated: April 3, 2026
          </p>
        </div>

        <Card className="border border-border bg-card shadow-lg">
          <CardContent className="p-8 space-y-8">
            
            {/* Acceptance of Terms */}
            <Alert className="border-primary/20 bg-primary/5">
              <Shield className="h-5 w-5 text-primary" />
              <AlertDescription className="text-base text-foreground">
                By accessing and using Threads Extractor, you accept and agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our service.
              </AlertDescription>
            </Alert>

            {/* Service Description */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">1. Service Description</h2>
              </div>
              <p className="text-muted-foreground">
                Threads Extractor provides a free web-based service that allows users to extract and download 
                video content from publicly accessible Threads posts. Our service is provided &quot;as is&quot; without 
                any warranties, express or implied.
              </p>
            </section>

            <hr className="border-border" />

            {/* Acceptable Use */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <Scale className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">2. Acceptable Use Policy</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">You agree to:</h3>
                  <ul className="space-y-2 text-muted-foreground pl-6">
                    <li>• Use the service only for lawful purposes</li>
                    <li>• Download videos only for personal, non-commercial use</li>
                    <li>• Respect intellectual property rights of content creators</li>
                    <li>• Comply with Threads&apos;/Meta&apos;s Terms of Service</li>
                    <li>• Not use the service to infringe on anyone&apos;s rights or privacy</li>
                    <li>• Not attempt to circumvent any security features of our service</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">You agree NOT to:</h3>
                  <ul className="space-y-2 text-muted-foreground pl-6">
                    <li>• Use our service to download copyrighted content without permission</li>
                    <li>• Redistribute, sell, or commercially exploit downloaded content</li>
                    <li>• Use automated tools or bots to access our service</li>
                    <li>• Attempt to reverse engineer or modify our service</li>
                    <li>• Use the service in any way that could damage or overload our servers</li>
                    <li>• Violate any applicable local, state, national, or international law</li>
                  </ul>
                </div>
              </div>
            </section>

            <hr className="border-border" />

            {/* Copyright and Intellectual Property */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">3. Copyright and Intellectual Property</h2>
              
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Threads Extractor respects the intellectual property rights of others and expects users to do the same.
                </p>

                <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold text-foreground">Your Responsibilities:</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm pl-4">
                    <li>• You are solely responsible for ensuring you have the right to download any content</li>
                    <li>• Content creators retain all rights to their original work</li>
                    <li>• Downloaded content should be used in accordance with applicable copyright laws</li>
                    <li>• Give proper attribution to original content creators when sharing or using their work</li>
                  </ul>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold text-foreground">DMCA Compliance:</h3>
                  <p className="text-muted-foreground text-sm">
                    If you believe that your copyrighted work has been downloaded through our service in a way that 
                    constitutes copyright infringement, please contact us at:
                  </p>
                  <p className="text-muted-foreground text-sm">
                    <strong>Email:</strong> dmca@threadsextractor.com
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Please provide: (1) Description of copyrighted work, (2) URL of the content, 
                    (3) Your contact information, (4) Statement of good faith belief
                  </p>
                </div>
              </div>
            </section>

            <hr className="border-border" />

            {/* Disclaimer of Warranties */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">4. Disclaimer of Warranties</h2>
              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <p className="text-muted-foreground text-sm">
                  THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, 
                  EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
                </p>
                <ul className="space-y-2 text-muted-foreground text-sm pl-4">
                  <li>• Warranties of merchantability or fitness for a particular purpose</li>
                  <li>• Warranties that the service will be uninterrupted, timely, secure, or error-free</li>
                  <li>• Warranties regarding the accuracy or reliability of any content or information</li>
                  <li>• Warranties that defects will be corrected</li>
                </ul>
              </div>
            </section>

            <hr className="border-border" />

            {/* Limitation of Liability */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">5. Limitation of Liability</h2>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-muted-foreground text-sm mb-3">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, THREADS EXTRACTOR SHALL NOT BE LIABLE FOR:
                </p>
                <ul className="space-y-2 text-muted-foreground text-sm pl-4">
                  <li>• Any indirect, incidental, special, consequential, or punitive damages</li>
                  <li>• Loss of profits, data, use, goodwill, or other intangible losses</li>
                  <li>• Damages resulting from your use or inability to use the service</li>
                  <li>• Unauthorized access to or alteration of your transmissions or data</li>
                  <li>• Any content obtained from the service</li>
                  <li>• Viruses or malicious code obtained through our service</li>
                </ul>
              </div>
            </section>

            <hr className="border-border" />

            {/* Third Party Links */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">6. Third-Party Links and Services</h2>
              <p className="text-muted-foreground">
                Our service may contain links to third-party websites or services (including Threads, Instagram, and Meta platforms) 
                that are not owned or controlled by Threads Extractor. We have no control over, and assume no responsibility for, 
                the content, privacy policies, or practices of any third-party websites or services.
              </p>
              <p className="text-muted-foreground">
                You acknowledge and agree that Threads Extractor shall not be responsible or liable for any damage or loss 
                caused by your use of any third-party content, goods, or services.
              </p>
            </section>

            <hr className="border-border" />

            {/* Advertising */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">7. Advertising</h2>
              <p className="text-muted-foreground">
                We use Google AdSense to display advertisements on our website. These advertisements help us maintain 
                and improve our free service. By using our service, you agree to the display of these advertisements.
              </p>
              <p className="text-muted-foreground">
                For more information about how Google uses data when you use our site, please review our{" "}
                <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
              </p>
            </section>

            <hr className="border-border" />

            {/* Changes to Terms */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">8. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify or replace these Terms at any time at our sole discretion. 
                If a revision is material, we will provide at least 30 days&apos; notice prior to any new terms taking effect.
              </p>
              <p className="text-muted-foreground">
                Your continued use of the service after any changes to the Terms constitutes acceptance of those changes.
              </p>
            </section>

            <hr className="border-border" />

            {/* Termination */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">9. Termination</h2>
              <p className="text-muted-foreground">
                We may terminate or suspend your access to our service immediately, without prior notice or liability, 
                for any reason, including if you breach these Terms.
              </p>
              <p className="text-muted-foreground">
                Upon termination, your right to use the service will immediately cease.
              </p>
            </section>

            <hr className="border-border" />

            {/* Governing Law */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">10. Governing Law</h2>
              <p className="text-muted-foreground">
                These Terms shall be governed by and construed in accordance with applicable international laws, 
                without regard to its conflict of law provisions.
              </p>
            </section>

            <hr className="border-border" />

            {/* Contact */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">11. Contact Information</h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-muted-foreground text-sm">
                  <strong>Email:</strong> legal@threadsextractor.com
                </p>
                <p className="text-muted-foreground text-sm">
                  <strong>General Support:</strong> support@threadsextractor.com
                </p>
              </div>
            </section>

            {/* Important Notice */}
            <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-800">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <AlertDescription className="text-orange-800 dark:text-orange-200">
                <strong>Important:</strong> This service is an independent tool and is not affiliated with, endorsed by, 
                or connected to Meta Platforms, Inc., Threads, or Instagram. Use at your own risk and responsibility.
              </AlertDescription>
            </Alert>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}
