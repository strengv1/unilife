import { Card, CardContent } from "@/components/ui/card"

export const PrizesSection = () => {

  const commonCardClass = "border-2 py-2 md:py-4 transform transition-transform hover:scale-105 shadow-md"
  const commonCardContentClass = "px-4 text-center flex flex-col h-full justify-between"
  const commonCardHeaderClass = "text:xl md:text-2xl font-bold"
  const commonCardDivClass = "my-6 text-3xl md:text-5xl font-bold"
  return (
    <section id="prizes" className="py-10 md:py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex flex-col mx-auto max-w-4xl text-center items-center justify-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Massive Prize Pool</h2>
          
          <p className="mt-4 md:mt-6 text-3xl">Total of €2,500</p>
        </div>

        <div className="mt-4 md:mt-6 grid gap-2 md:gap-8 grid-cols-2 max-w-4xl mx-auto">
          <Card className="border-2 col-span-full border-yellow-500 bg-gradient-to-b from-yellow-50 to-white transform transition-transform hover:scale-105 shadow-lg">
            <CardContent className={`${commonCardContentClass}`}>
              <h3 className="text-2xl font-bold">1st Place</h3>
              <div className="my-6 text-5xl font-bold text-yellow-600">€600</div>
              <p className="text-muted-foreground">
                Your very own <strong>Beer Pong table</strong>, a Championship trophy, and the title of Beer Pong Battle Royale Champions
              </p>
            </CardContent>
          </Card>
          <Card className={`${commonCardClass} border-slate-400 bg-gradient-to-b from-slate-50 to-white`} >
            <CardContent className={`${commonCardContentClass}`}>
              <h3 className={`${commonCardHeaderClass}`}>2nd Place</h3>
              <div className={`${commonCardDivClass} text-slate-600`}>€400</div>
            </CardContent>
          </Card>
          <Card className={`${commonCardClass} border-amber-700 bg-gradient-to-b from-amber-50 to-white`}>
            <CardContent className={`${commonCardContentClass}`}>
              <h3 className={`${commonCardHeaderClass}`}>3rd-4th Place</h3>
              <div className={`${commonCardDivClass} text-amber-700`}>€250</div>
            </CardContent>
          </Card>
          <Card className={commonCardClass}>
            <CardContent className={`${commonCardContentClass}`}>
              <h3 className={`${commonCardHeaderClass}`}>5th-8th Place</h3>
              <div className={`${commonCardDivClass} text-amber-800`}>€150</div>
            </CardContent>
          </Card>
          <Card className={commonCardClass}>
            <CardContent className={`${commonCardContentClass}`}>
              <h3 className={`${commonCardHeaderClass}`}>9th-16th Place</h3>
              <div className={`${commonCardDivClass} text-amber-800`}>€50</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}