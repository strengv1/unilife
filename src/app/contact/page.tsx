import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, MapPin, Clock, Instagram, Facebook, Twitter } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-red-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">Get in Touch</h1>
            <p className="max-w-2xl mx-auto text-lg opacity-90">
              Have questions or want to collaborate? We&apos;d love to hear from you!
            </p>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
              <p className="text-muted-foreground mb-8">
                Feel free to reach out to us through any of the following channels. We&apos;re always happy to hear from
                students, universities, and potential partners.
              </p>
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                <a href="mailto:info@uni-life.fi">
                  <Mail className="mr-2 h-5 w-5" />
                  Email Us Now
                </a>
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <Card>
                <CardContent className="flex flex-col items-center text-center gap-4 p-6">
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-sm text-muted-foreground">info@uni-life.fi</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-col items-center text-center gap-4 p-6">
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                    <Phone className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-sm text-muted-foreground">+358 50 123 4567</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-col items-center text-center gap-4 p-6">
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Office Address</h3>
                    <p className="text-sm text-muted-foreground">Mannerheimintie 100, 00100 Helsinki, Finland</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-col items-center text-center gap-4 p-6">
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Office Hours</h3>
                    <p className="text-sm text-muted-foreground">Monday - Friday: 9:00 AM - 5:00 PM</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center mt-12">
              <div className="text-center">
                <h3 className="font-medium mb-4">Follow Us</h3>
                <div className="flex space-x-4 justify-center">
                  <a
                    href="#"
                    className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 hover:bg-red-200 transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                    <span className="sr-only">Instagram</span>
                  </a>
                  <a
                    href="#"
                    className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 hover:bg-red-200 transition-colors"
                  >
                    <Facebook className="h-5 w-5" />
                    <span className="sr-only">Facebook</span>
                  </a>
                  <a
                    href="#"
                    className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 hover:bg-red-200 transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                    <span className="sr-only">Twitter</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

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

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">How can I partner with UNI LIFE?</h3>
                  <p className="text-muted-foreground">
                    We&apos;re always looking for partners! Please email us with details about your organization and
                    partnership ideas.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">Do you offer student discounts?</h3>
                  <p className="text-muted-foreground">
                    Yes! All our events have special pricing for students. Make sure to bring your valid student ID to
                    the events.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">Can I volunteer at your events?</h3>
                  <p className="text-muted-foreground">
                    We&apos;re always looking for enthusiastic volunteers. Send us an email mentioning you&apos;re interested in
                    volunteering.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">How can I stay updated on upcoming events?</h3>
                  <p className="text-muted-foreground">
                    Subscribe to our newsletter, follow us on social media, or regularly check our Events page for the
                    latest updates.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}