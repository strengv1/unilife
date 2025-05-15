import { Card, CardContent } from "@/components/ui/card"
import { Clock, Trophy, Users } from "lucide-react"
import Image from "next/image"

export const AboutSection = () => {
  return (
    <section id="about" className="py-10 md:py-16" aria-labelledby="about-heading">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 id="about-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-balance">
              Finland&apos;s Ultimate Beer Pong Experience
            </h2>
            <Image
              className="block md:hidden mx-auto mt-3 h-48 w-auto order-first"
              src="/bpbr_logo.png"
              alt="Beer Pong Battle Royale logo"
              height={250}
              width={250}
            />
            <p className="mt-2 text-lg text-muted-foreground text-balance">
              Organized by the powerhouses UNI LIFE and Aalto Beer Pong, the highly anticipated <span className="text-nowrap">Beer Pong Battle Royale</span> unites beer pong enthusiasts from all over Finland for an epic, one-of-a-kind tournament.
            </p>
          </div>
          <Image
            className="hidden md:block mx-auto h-48 w-auto order-first"
            src="/bpbr_logo.png"
            alt="Beer Pong Battle Royale logo"
            height={250}
            width={250}
          />
        </div>
        <div className="hidden md:grid mt-16 gap-8 md:grid-cols-3">
          <Card className="transform transition-transform hover:scale-105">
            <CardContent className="pt-8 pb-6 px-6">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                <Trophy className="h-7 w-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold">Epic Competition</h3>
              <p className="mt-3 text-muted-foreground">
                150 teams will battle through multiple rounds in a tournament designed to crown the ultimate beer pong team.
              </p>
            </CardContent>
          </Card>
          <Card className="transform transition-transform hover:scale-105">
            <CardContent className="pt-8 pb-6 px-6">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                <Users className="h-7 w-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold">Community Event</h3>
              <p className="mt-3 text-muted-foreground">
                More than just a tournament, it&apos;s a celebration of student culture and community — with music, food, and a good buzz.
              </p>
            </CardContent>
          </Card>
          <Card className="transform transition-transform hover:scale-105">
            <CardContent className="pt-8 pb-6 px-6">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                <Clock className="h-7 w-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold">Unforgettable Experience</h3>
              <p className="mt-3 text-muted-foreground">
                A full day of excitement, competition, and everything a legendary student event should be.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}