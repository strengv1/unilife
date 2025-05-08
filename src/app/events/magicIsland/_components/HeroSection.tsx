import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Calendar, MapPin, Clock } from "lucide-react"
import Link from "next/link"

export const HeroSection = () => {
  return (
    <section className="relative">
      <div className="absolute inset-0 z-10" />
      <div className="relative flex items-center justify-center min-h-[80vh] pb-4 bg-blue-800">
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
            <h1 className="max-w-[95vw] mx-auto
              font-extrabold tracking-tight text-3xl sm:text-5xl md:text-6xl lg:text-7xl
              text-shadow-lg
            ">
              Are you ready?
            </h1>
            <p className="mx-auto max-w-5xl text-center leading-tight
              text-xl sm:text-3xl md:text-4xl lg:text-[2.75rem]
              text-shadow-lg
            ">
              A summer adventure like no other awaits you at
              <span className="flex align-baseline items-center justify-center">
                <Image
                  src="/magic_island_logo.png"
                  alt="Magic Island"
                  width={800}
                  height={100}
                  className="h-[1em] w-auto"
                  priority
                />
              </span>
            </p>
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