import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { EventCard } from "@/components/event-card"
import { type Event, useEvents } from "./hooks/useEvents"
import { NewsletterSection } from "@/components/newsletterSection"

export default function Home() {
  const { upcoming } = useEvents()

  return (
    <div className="flex min-h-screen flex-col bg-amber-50">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <div className="relative h-[80vh] overflow-hidden">
            <Image
              src="/unilife_cover.jpg"
              alt="Students celebrating"
              fill
              className="object-cover scale-[1.2] object-[center_calc(100%-60px)] sm:scale-[1] sm:object-center opacity-70"
              priority
            />
            <div className="h-full relative z-20 flex flex-col 
              items-center justify-end text-center text-white pb-4 mx-4
            ">
              <div className="flex flex-col md:flex-row w-full gap-8 md:gap-1 md:justify-between md:pb-4">
                <div className="flex flex-col md:basis-[65vw] gap-2
                  text-4xl text-left font-extrabold tracking-tight md:text-6xl lg:text-7xl
                ">
                  <p>Every uni.</p>
                  <p>One community.</p>
                  <p>Welcome to <span className="underline whitespace-nowrap ">UNI LIFE</span>.</p>
                </div>

                <div className="flex flex-col justify-end md:basis-[35vw] gap-2">
                  <p className="text-left text-lg md:text-2xl">
                    We bring students together to laugh harder, stay up too late, and meet more people.
                  </p>
                  <p className=" text-left text-lg md:text-2xl">
                    No one cares what you study — everyone’s here for a good time with great people!
                  </p>
                  <div className="flex flex-col md:flex-row gap-4 mt-8">
                    <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                      <Link href="/events">Explore Events</Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="bg-transparent text-white border-white hover:bg-white/10"
                    >
                      <Link href="/contact">Get in Touch</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section className="py-16">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Upcoming Events</h2>
                <p className="text-muted-foreground mt-2">Don&apos;t miss out on our next big events</p>
              </div>
              {/* <Button asChild variant="outline" className="mt-4 md:mt-0">
                <Link href="/events">View All Events</Link>
              </Button> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.map((event: Event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  )
}
