import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin, Trophy, Users } from "lucide-react"

export const HeroSection = () => {
  return (
    <section className="relative" aria-labelledby="hero-heading">
      <div className="absolute inset-0 bg-black/80 z-10" />
      <div className="relative flex items-center min-h-[80vh] bg-blue-800 pb-4">
        <Image
          src="/abp_festarit.png"
          alt="Aalto Beer Pong at festival"
          fill
          className="object-cover opacity-70"
          priority
        />
        <div className="container h-full max-w-6xl mx-auto relative z-20 flex flex-col 
          items-center justify-center text-center text-white
          px-4 pt-10
        ">
          <div className="space-y-6">
            <div className="inline-block rounded-md bg-red-600 px-3 py-1 text-sm font-semibold">
              FINLAND&apos;S BIGGEST BEER PONG TOURNAMENT
            </div>
            <h1 id="hero-heading" className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              BEER PONG <br />
              <span className="text-red-500">BATTLE ROYALE</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-lg md:text-xl">
              150 teams. One champion. <span className="block md:inline underline">€2,500 Prize Pool</span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 justify-items-center justify-center gap-2 sm:gap-6 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>September 14th, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>Espoo, Finland</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>150 Teams</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                <span>Cash Prizes</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6 mt-10 mx-10">
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
                <Link href="#registration">Register Your Team</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white bg-transparent">
                <Link href="#tournament">Tournament Details</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}