import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Mail } from "lucide-react"
import { NewsletterSection } from "@/components/newsletterSection"

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-amber-50">
      <Navbar />
      <main className="flex-1">
        {/* Contact Info */}
        <section className="py-16 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-2xl font-bold mb-4">Open Ears, Open Minds – Pitch Us Anything!</h1>
              <p className="text-muted-foreground mb-2">
                We&apos;re always happy to hear from students, universities, and potential partners.
              </p>
              <p className="text-muted-foreground mb-8">
                We believe anything is possible — as long as we do it together!
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <Card>
                <CardContent className="flex flex-col items-center text-center gap-4 p-6">
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-sm text-muted-foreground">contact@unilife.fi</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <NewsletterSection />
        {/* Map Section */}
        {/* <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Find Us</h2>
            <div className="aspect-video w-full max-w-4xl mx-auto rounded-lg overflow-hidden border">
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">Interactive Map Would Be Displayed Here</p>
              </div>
            </div>
          </div>
        </section> */}
      </main>
      <Footer />
    </div>
  )
}