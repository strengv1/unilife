import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export const RegistrationSection = () => {
  return (
    <section id="registration" className="bg-red-600 py-20 md:py-28 text-white">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-[800px] text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Register Your Team</h2>
          <p className="mt-6 text-lg text-red-100">
            Secure your spot in Finland's biggest beer pong tournament before all slots are filled!
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <Card className="bg-white shadow-lg">
            <CardContent className="pt-8 pb-6 px-6">
              <h3 className="text-2xl font-bold">Registration Details</h3>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-red-600" />
                  <span>Students €20 per team (2 players)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-red-600" />
                  <span>Non-Students €25 per team (2 players)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-red-600" />
                  <span>Limited to 128 teams - first come, first served</span>
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
              <Button className="mt-8 w-full bg-red-600 hover:bg-red-700 text-lg py-6">Register Now</Button>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg">
            <CardContent className="pt-8 pb-6 px-6">
              <h3 className="text-2xl font-bold">What's Included</h3>
              <ul className="mt-6 space-y-4">
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
                  <span>Access to after-party with special drink discounts ??</span>
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
      </div>
    </section>
  )
}