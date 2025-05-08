import { Card, CardContent } from "@/components/ui/card"
import { PartyPopper, Music2, Utensils } from "lucide-react"

export const AboutSection = () => {
  return (
    <section id="about" className="py-20 md:py-28 bg-amber-50">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-[800px] text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Magic Island 🏝️ — The Summer Party You’ll Never Forget
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Magic Island is an open-air party like no other — free food, pulsing music, and just a bit of water between you and the wildest night of the summer season.
          </p>
          <p className="mt-6 text-lg text-muted-foreground">
          Yes, you’ll have to trek through water to get there..<br/>
          <b>But what waits on the other side?</b>
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <Card className="transform transition-transform hover:scale-105">
            <CardContent className="pt-8 pb-6 px-6">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100">
                <Utensils className="h-7 w-7 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold">Hot Grill, Cold Drinks</h3>
              <p className="mt-3 text-muted-foreground">
                🌭 Fresh hot dogs, all free for guests.
              </p>
            </CardContent>
          </Card>

          <Card className="transform transition-transform hover:scale-105">
            <CardContent className="pt-8 pb-6 px-6">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100">
                <Music2 className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold">Live DJ Sets</h3>
              <p className="mt-3 text-muted-foreground">
                🎧 DJs spinning tracks under the summer night sky
              </p>
            </CardContent>
          </Card>

          <Card className="transform transition-transform hover:scale-105">
            <CardContent className="pt-8 pb-6 px-6">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-pink-100">
                <PartyPopper className="h-7 w-7 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold">Memories that last</h3>
              <p className="mt-3 text-muted-foreground">
                ✨ Guaranteed good time under glowing lights.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mx-auto mt-16 max-w-max text-left text-muted-foreground text-lg">
          Here's the catch...
          <br />
          📍 Location: ???
          <br />
          📅 Date: ???
          <br />
          🕕 Time: ???
          <br />
          <br />
        </div>
        
        <p className="text-center text-muted-foreground text-lg">
          You won't see it on posters. You won't hear it through friends.
        </p>
        <p className="font-bold text-center text-muted-foreground text-lg">
          Only newsletter readers get the full details.
        </p>
      </div>
    </section>
  )
}
