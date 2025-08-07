import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import TournamentStructure from "./TournamentStructure"

export const TournamentSection = () => {

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
                <TournamentStructure />

                
              </div>
            </TabsContent>
            <TabsContent value="rules" className="space-y-4">
              <div className="rounded-lg border p-8 shadow-sm">
                <h3 className="text-2xl font-bold">Quick Rules</h3>
                <a 
                  href="/BPBR_official_rules.pdf" 
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
                    <span>Rock-Paper-Scissors determines the starting team</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className={checkCircleClass} />
                    <span>Standard 10-cup triangle formation, 2 fingers from table edge</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className={checkCircleClass} />
                    <span>Elbow must be behind the table when releasing the ball</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className={checkCircleClass} />
                    <span>Bounce shots count as two cups and can be blocked</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className={checkCircleClass} />
                    <span><strong>Rebound</strong>: If the ball remains on the table after a throw, it can be caught by the throwing team for a Trickshot opportunity</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className={checkCircleClass} />
                    <span><strong>Triple Shot</strong>: Two balls in same cup = 3 cups removed total</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className={checkCircleClass} />
                    <span><strong>Balls Back</strong>: When both teammates hit cups in same turn, get balls back + extra turn</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className={checkCircleClass} />
                    <span><strong>On Fire!</strong>: Hit 3 cups in a row to keep shooting until you miss</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className={checkCircleClass} />
                    <span>Re-racking automatically at 6, 3, and 1 cups remaining (centered, 2 fingers from back edge)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className={checkCircleClass} />
                    <span>No redemption round. First team to drop the last cup wins</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className={checkCircleClass} />
                    <span>Game length: 20 minutes maximum. Tiebreakers by cup differential</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className={checkCircleClass} />
                    <span>Special rules <strong>The Gulag</strong> and <strong>Tactical Nuke</strong>! Read full rules for more information.</span>
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
                    <span>18:30 - Championship finals and award ceremony</span>
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