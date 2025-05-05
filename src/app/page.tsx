import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { EventCard } from "@/components/event-card"

// Mock data for upcoming events
const upcomingEvents = [
  {
    id: "1",
    title: "Summer Kickoff Festival",
    date: "June 15, 2025",
    time: "18:00 - 02:00",
    location: "Helsinki University Campus",
    image: "/placeholder.svg?height=400&width=600",
    category: "Festival",
    isFeatured: true,
  },
  {
    id: "2",
    title: "Tech Startup Networking Night",
    date: "June 22, 2025",
    time: "19:00 - 23:00",
    location: "Aalto University",
    image: "/placeholder.svg?height=400&width=600",
    category: "Networking",
  },
  {
    id: "3",
    title: "International Student Mixer",
    date: "July 5, 2025",
    time: "20:00 - 01:00",
    location: "Turku Student Union",
    image: "/placeholder.svg?height=400&width=600",
    category: "Social",
  },
]

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="relative h-[80vh] bg-blue-800">
            <Image
              src="/Ullanlinnanmäki_Vappuna.jpg?height=800&width=1600"
              alt="Students celebrating"
              fill
              className="object-cover opacity-70"
              priority
            />
            <div className="container h-full max-w-6xl mx-auto relative z-20 flex flex-col 
              items-center justify-center text-center text-white
              px-4 pt-10
            ">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl max-w-3xl">
                Unforgettable Student Experiences Across Finland
              </h1>
              <p className="max-w-2xl text-lg sm:text-xl md:text-2xl">
                Join thousands of students at our high-energy events designed to create memories that last a lifetime.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button asChild size="lg" className="bg-pink-600 hover:bg-pink-700 text-white">
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
        </section>

        {/* Upcoming Events Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Upcoming Events</h2>
                <p className="text-muted-foreground mt-2">Don't miss out on our next big events</p>
              </div>
              <Button asChild variant="outline" className="mt-4 md:mt-0">
                <Link href="/events">View All Events</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Why Choose UNI LIFE?</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                We create unforgettable experiences that bring students together
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
                <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-pink-500"
                  >
                    <path d="M17 11h1a3 3 0 0 1 0 6h-1"></path>
                    <path d="M9 12v6"></path>
                    <path d="M13 12v6"></path>
                    <path d="M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 0-5c.78 0 1.57.5 2.5.5s2-.5 3-.5 2 .5 3 .5 1.44-.5 3-.5a2.5 2.5 0 0 1 0 5c-1.56 0-2-.5-3-.5Z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Large-Scale Events</h3>
                <p className="text-muted-foreground">
                  We specialize in creating massive, unforgettable events that bring together students from across
                  Finland.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
                <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-pink-500"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Community Building</h3>
                <p className="text-muted-foreground">
                  Our events foster connections and build lasting relationships among students from different
                  universities.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
                <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-pink-500"
                  >
                    <path d="M12 2v4"></path>
                    <path d="M12 18v4"></path>
                    <path d="m4.93 4.93 2.83 2.83"></path>
                    <path d="m16.24 16.24 2.83 2.83"></path>
                    <path d="M2 12h4"></path>
                    <path d="M18 12h4"></path>
                    <path d="m4.93 19.07 2.83-2.83"></path>
                    <path d="m16.24 7.76 2.83-2.83"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Unforgettable Experiences</h3>
                <p className="text-muted-foreground">
                  We create high-value experiences with top entertainment, venues, and activities for students.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-pink-50 dark:bg-pink-950/20">
          <div className="container px-4 mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Stay Updated</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Subscribe to our newsletter to get the latest updates on upcoming events and exclusive offers.
            </p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
              <Button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white">
                Subscribe
              </Button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
