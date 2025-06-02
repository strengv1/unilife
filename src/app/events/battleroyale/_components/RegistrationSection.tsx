"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export const RegistrationSection = () => {
  return (
    <section id="registration" className="bg-red-600 py-10 md:py-16 text-white">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Register Your Team</h2>
          <p className="mt-4 md:mt-6 text-lg text-red-100">
            Secure your spot in Finland&apos;s biggest beer pong tournament before all slots are filled!
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Card className="bg-white shadow-lg">
            <CardContent className="pt-4 md:pt-8 pb-6 px-6">
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
                  <span>Ticket sales close one week before the event</span>
                </li>
              </ul>
              
              <div className="mt-8">
                <Link href="https://kide.app/events/be966048-0eb5-464e-a389-fd7caae8d4dd" target="_blank" rel="noopener noreferrer" className="relative block">
                  <Button 
                    className="relative w-full bg-red-600 hover:bg-red-700 text-lg py-6 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 font-semibold overflow-hidden shine-effect"
                  >
                    <span className="relative z-10">
                      Register Now
                    </span>
                  </Button>
                </Link>
              </div>

              {/* <div className="mt-6 text-center">
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
              </div> */}
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg">
            <CardContent className="pt-4 md:pt-8 pb-6 px-6">
              <h3 className="text-2xl font-bold">What&apos;s Included</h3>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-red-600" />
                  <span>Welcome package with sponsor gifts and merchandise</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-red-600" />
                  <span>Exclusive Beer Pong Battle Royale patch</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-red-600" />
                  <span>Afterparty at OK20 with sauna, music and casual beer pong</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-red-600" />
                  <span>Guaranteed good time with friends, old and new!</span>
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
        
        {/* <NewsletterForm
          containerClassName="mt-10 bg-white text-black rounded-xl p-10"
          title="Be first to know when it's time to drop in to battle! 🪂"
          description={
            <p className="mb-6 max-w-xl mx-auto text-balance">
              Registration isn&apos;t open{" "}
              <span className="underline">yet</span>{" "}
              <ArrowRight className="inline-block -mt-0.5" size="1rem" />{" "}
              <span className="font-bold">subscribe to our newsletter and we&apos;ll let you know when it&apos;s time to deploy!</span>{" "}
              <span className="block">No spam, just raw information.</span>
            </p>
          }
          disclaimerText="By subscribing, you agree to receive emails from UNI LIFE about Beer Pong Battle Royale and related events. You can unsubscribe at any time."
        /> */}
      </div>
      
      {/* Add CSS for shine effect */}
      <style jsx global>{`
        .shine-effect::before {
          content: '';
          position: absolute;
          top: 0;
          width: 30px;
          height: 100%;
          background: rgba(255, 255, 255, 0.6);
          transform: skewX(-30deg);
          animation: shine 3s infinite;
          filter: blur(3px);
          z-index: 20;
          pointer-events: none;
        }
        
        @keyframes shine {
          0% { left: -30px; }
          20% { left: 110%; }
          100% { left: 110%; }
        }
      `}</style>
    </section>
  )
}