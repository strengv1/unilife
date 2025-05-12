import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { NewsletterSection } from "@/components/newsletterSection"

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-amber-50">
      <Navbar />
      <main className="flex-1">
        <section className="py-16 lg:py-32">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">Our story</h2>
            <p className="text-muted-foreground mb-2">
              UNI LIFE is ..
            </p>

          </div>

        </section>
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  )
}