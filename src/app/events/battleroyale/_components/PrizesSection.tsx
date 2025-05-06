import { Card, CardContent } from "@/components/ui/card"

export const PrizesSection = () => {
  return (
    <section id="prizes" className="py-20 md:py-28">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-[800px] text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Massive Prize Pool</h2>
          <p className="mt-6 text-lg text-muted-foreground">Largest prize pool in the history of finnish Beer Pong!</p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <Card className="border-2 border-yellow-500 bg-gradient-to-b from-yellow-50 to-white transform transition-transform hover:scale-105 shadow-lg">
            <CardContent className="pt-8 pb-6 px-6 text-center">
              <h3 className="text-2xl font-bold">1st Place</h3>
              <div className="my-6 text-5xl font-extrabold text-yellow-600">€500</div>
              <p className="text-muted-foreground">
                Plus championship trophy and title of Finland's Beer Pong Champions
              </p>
            </CardContent>
          </Card>
          <Card className="border-2 border-slate-400 bg-gradient-to-b from-slate-50 to-white transform transition-transform hover:scale-105 shadow-md">
            <CardContent className="pt-8 pb-6 px-6 text-center">
              <h3 className="text-2xl font-bold">2nd Place</h3>
              <div className="my-6 text-5xl font-extrabold text-slate-600">€200</div>
              <p className="text-muted-foreground">Plus sponsor gift packages</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-amber-700 bg-gradient-to-b from-amber-50 to-white transform transition-transform hover:scale-105 shadow-md">
            <CardContent className="pt-8 pb-6 px-6 text-center">
              <h3 className="text-2xl font-bold">3rd Place</h3>
              <div className="my-6 text-5xl font-extrabold text-amber-700">€100</div>
              <p className="text-muted-foreground">Plus sponsor gift packages</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-amber-700 bg-gradient-to-b from-amber-50 to-white transform transition-transform hover:scale-105 shadow-md">
            <CardContent className="pt-8 pb-6 px-6 text-center">
              <h3 className="text-2xl font-bold">4th-8th Place</h3>
              <div className="my-6 text-5xl font-extrabold text-amber-700">€50</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}