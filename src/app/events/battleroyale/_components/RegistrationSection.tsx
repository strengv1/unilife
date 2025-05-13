import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export const RegistrationSection = () => {
  return (
    <section id="registration" className="bg-red-600 py-10 md:py-16 text-white">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-[800px] text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Register Your Team</h2>
          <p className="mt-6 text-lg text-red-100">
            Secure your spot in Finland&apos;s biggest beer pong tournament before all slots are filled!
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Card className="bg-white shadow-lg">
            <CardContent className="pt-8 pb-6 px-6">
              <h3 className="text-2xl font-bold">Registration Details</h3>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-red-600" />
                  <span>€40 per team (2 players)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-red-600" />
                  <span>Limited to 150 teams - first come, first served</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-red-600" />
                  <span>Registration includes tournament entry and a welcome package</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-red-600" />
                  <span>Registration deadline: One week before the event</span>
                </li>
              </ul>
              <Button disabled className="mt-8 w-full bg-red-600 hover:bg-red-700 text-lg py-6">Register Now</Button>
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Registration is not yet open.
                </p>
                <a
                  href="#newsletter"
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 transition"
                >
                  <CheckCircle className="h-4 w-4 text-red-600" />
                  Notify me when it opens!
                </a>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg">
            <CardContent className="pt-8 pb-6 px-6">
              <h3 className="text-2xl font-bold">What&apos;s Included</h3>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-red-600" />
                  <span>Guaranteed good time with friends, old and new!</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-red-600" />
                  <span>Full day tournament participation</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-red-600" />
                  <span>Welcome package with sponsor gifts and merchandise</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-red-600" />
                  <span>Afterparty at OK20 with sauna and shockingly discounted drinks</span>
                </li>
              </ul>
              {/* <div className="mt-8 rounded-md bg-red-50 p-6 text-red-800">
                <p className="text-base font-medium">
                  Only a few spots remaining! Register today to secure your place.
                </p>
              </div> */}
            </CardContent>
          </Card>
        </div>
        
        <div id="newsletter" className="mt-10 bg-white text-black rounded-xl p-10 text-center">
          <h3 className="text-2xl font-bold mb-2">Be first to know when it’s time to drop in to battle 🪂🏓</h3>
          <p className="mb-6 max-w-xl mx-auto">
            Registration isn’t open yet – subscribe to our newsletter and we’ll let you know when it’s time to deploy. No spam, just raw information.
          </p>
          <form
            action="https://formspree.io/f/xqaqqwgy"
            method="POST"
            className="flex flex-col md:flex-row gap-2 max-w-md mx-auto"
            aria-labelledby="newsletter-heading"
          >
            <h4 id="newsletter-heading" className="sr-only">Newsletter Signup</h4>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              required
              aria-label="Your email address"
            />
            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white cursor-pointer">
              Subscribe
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-4">
            By subscribing, you agree to receive emails from UNI LIFE about BPBR and related events. You can unsubscribe at any time. Read our{" "}
            <a href="/privacy" className="underline hover:text-black">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </section>
  )
}