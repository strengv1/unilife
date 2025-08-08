import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import TournamentStructure from "./TournamentStructure"
import TournamentQuickRules from "./TournamentQuickRules"
import TournamentSchedule from "./TournamentSchedule"

export const TournamentSection = () => {
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
              <div className="rounded-lg border p-4 sm:p-8 shadow-sm">
                <TournamentQuickRules />
              </div>
            </TabsContent>
            <TabsContent value="schedule" className="space-y-4">
              <div className="rounded-lg border p-4 sm:p-8 shadow-sm">
                <TournamentSchedule />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}