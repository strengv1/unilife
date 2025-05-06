import { Card, CardContent } from "@/components/ui/card"
import { Clock, Trophy, Users } from "lucide-react"

export const AboutSection = () => {
  return (
    <section id="about" className="py-20 md:py-28">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-[800px] text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Finland's Ultimate Beer Pong Experience
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Organized by Unilife and Aalto Beer Pong, the Beer Pong Battle Royale brings together the best beer pong
            players from across Finland for an epic tournament of unheard proportions.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <Card className="transform transition-transform hover:scale-105">
            <CardContent className="pt-8 pb-6 px-6">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                <Trophy className="h-7 w-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold">Epic Competition</h3>
              <p className="mt-3 text-muted-foreground">
                128 teams will battle through multiple rounds in a tournament designed to crown the ultimate beer
                pong champions.
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
                More than just a tournament, it's a celebration of student culture and community with music, beer,
                and entertainment.
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
                A full day of excitement, competition, and memories that will last long after the final cup is sunk.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}