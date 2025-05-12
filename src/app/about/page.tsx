import { Navbar } from "@/components/navbar"
import { NewsletterSection } from "@/components/newsletterSection"

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-amber-50">
      <Navbar />
      <main className="flex-1">
        <section className="py-16 lg:py-32">
          <h1>About us</h1>

        </section>


        <NewsletterSection />
      </main>
    </div>
  )
}