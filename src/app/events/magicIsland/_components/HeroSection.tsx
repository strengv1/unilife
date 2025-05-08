import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Calendar, MapPin, Clock } from "lucide-react"
import Link from "next/link"

export const HeroSection = () => {
  return (
    <section className="relative">
      <div className="absolute inset-0 bg-black/80 z-10" />
      <div className="relative h-[80vh] bg-blue-800">
        <Image
          src="/magic_island_cover.png"
          alt="Magic Island"
          fill
          className="object-cover opacity-70"
          priority
        />
        <div className="container h-full max-w-6xl mx-auto relative z-20 flex flex-col 
          items-center justify-center text-center text-white
          px-4 pt-10
        ">
          <div className="space-y-6">
            <div className="inline-block rounded-md bg-sky-600 px-3 py-1 text-sm font-semibold">
              Are you ready to escape reality?
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              A summer adventure like no other awaits you at <b>Magic Island</b> 
            </h1>

            <div className="grid grid-cols-3 max-w-md mx-auto justify-items-center justify-center text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>???</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>???</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>???</span>
              </div>

            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6 mt-10 mx-10">
              <Button asChild size="lg" className="bg-sky-600 hover:bg-sky-700">
                <Link href="#newsletter">Information only through newsletter</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}