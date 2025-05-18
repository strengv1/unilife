import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export const TournamentSection = () => {

  const commonNumberBadge = "mt-1 h-5 w-5 flex-shrink-0 rounded-full flex items-center justify-center font-bold text-xs"
  const checkCircleClass = "mt-1 h-5 w-5 flex-shrink-0 text-red-600"
  return (
    <section id="tournament" className="bg-slate-50 py-10 md:py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Tournament Structure</h2>
          <p className="mt-4 md:mt-6 text-lg text-muted-foreground">
            Designed for fair play and maximum excitement for everybody.
            <br/>
            <Link href="#prizes" className="text-red-600 hover:underline">
              Cash Prizes
            </Link>{" "}
            for the Top 16 best performing teams.
          </p>
        </div>

        <div className="mt-8">
          <Tabs defaultValue="format" className="mx-auto max-w-4xl">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="format">Format</TabsTrigger>
              <TabsTrigger value="rules">Rules</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>
            <TabsContent value="format" className="mt-0 space-y-4">
              <div className="rounded-lg border p-4 md:p-8 shadow-sm">
                <h3 className="text-2xl font-bold">Swiss Tournament Format</h3>
                
                <div className="mt-6 bg-red-50 p-4 rounded-md text-red-800 font-medium mb-8">
                  <span className="font-bold">GUARANTEED:</span> Every team plays at least 6 games!
                </div>
                
                <div className="flex flex-col gap-8">
                  {/* Tournament Structure */}
                  <div>
                    <h4 className="text-lg font-bold mb-4">Tournament Structure</h4>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <CheckCircle className={checkCircleClass} />
                        <span>Teams consist of 2 players each</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className={checkCircleClass} />
                        <span>Swiss-system format with 6 preliminary rounds for all teams</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className={checkCircleClass} />
                        <span>Top 64 teams advance to single-elimination playoffs</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className={checkCircleClass} />
                        <span>All games are single-match (best-of-1)</span>
                      </li>
                    </ul>
                  </div>
                  
                  {/* How Swiss Format Works */}
                  <div>
                    <h4 className="text-lg font-bold mb-4">How Swiss Format Works</h4>
                    <p className="text-muted-foreground mb-4">
                      Teams are paired each round based on their current record:
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className={`${commonNumberBadge} bg-red-100 text-red-600`}>1</div>
                        <span>Round 1: Random initial pairings</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className={`${commonNumberBadge} bg-red-100 text-red-600`}>2</div>
                        <span>Rounds 2-6: Teams with similar records face each other</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className={`${commonNumberBadge} bg-red-100 text-red-600`}>3</div>
                        <span>No rematches - teams never play the same opponent twice</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className={`${commonNumberBadge} bg-red-100 text-red-600`}>4</div>
                        <span>Wins award 3 points each. Draws award 1 point each. Losses award 0 points.</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                {/* Ranking System */}
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <h4 className="text-xl font-bold mb-4">Ranking System</h4>
                  <p className="text-muted-foreground mb-4">
                    After 6 rounds, teams are ranked by these tiebreakers (in order):
                  </p>
                  <ul className="space-y-3 grid md:grid-cols-2 gap-x-4">
                    <li className="flex items-start gap-3">
                      <div className={`${commonNumberBadge} bg-red-600 text-white`}>1</div>
                      <span><strong>Win-Loss-Draw Record</strong> – Total amount of points</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className={`${commonNumberBadge} bg-red-600 text-white`}>2</div>
                      <span><strong>Cup Differential</strong> – Cups won minus cups lost</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className={`${commonNumberBadge} bg-red-600 text-white`}>3</div>
                      <span><strong>Resistance</strong> – Average win % of your opponents.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className={`${commonNumberBadge} bg-red-600 text-white`}>4</div>
                      <span><strong>Opponents&apos; Resistance </strong> – Average win % of your opponents&apos; opponents.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="rules" className="space-y-4">
              <div className="rounded-lg border p-8 shadow-sm">
                <h3 className="text-2xl font-bold">Quick Rules</h3>
                <a 
                  href="/rules.pdf" 
                  download 
                  className="text-blue-500 hover:text-blue-700 underline flex items-center gap-2"
                >
                  <span>Download full rules here</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </a>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className={checkCircleClass} />
                    <span>Standard 10-cup triangle formation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className={checkCircleClass} />
                    <span>Re-racking is done automatically into standard triangles that are centered to the back when 6 or 3 cups are left. Last cup is also centered to the back row. Cups are placed so that they&apos;re centered and 2 fingers away (index and middle finger) from the edge of the table.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className={checkCircleClass} />
                    <span>Bounce shots count as two cups and can be blocked.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className={checkCircleClass} />
                    <span>No redemption round. First team to drop the last cup wins.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className={checkCircleClass} />
                    <span>Game length: 20 minutes maximum for Swiss rounds</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className={checkCircleClass} />
                    <span>Tiebreakers determined by cup differential and swiss-format magic</span>
                  </li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="schedule" className="space-y-4">
              <div className="rounded-lg border p-8 shadow-sm">
                <h3 className="text-2xl font-bold">Event Schedule</h3>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className={checkCircleClass} />
                    <span>11:00 - Registration and check-in</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className={checkCircleClass} />
                    <span>12:00 - Swiss rounds begin (6 rounds, approximately 40 minutes each)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className={checkCircleClass} />
                    <span>16:15 - Top 64 teams announced</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className={checkCircleClass} />
                    <span>16:20 - Single-elimination bracket begins</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className={checkCircleClass} />
                    <span>18:30 - Championship finals (best-of-3) and award ceremony</span>
                  </li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}