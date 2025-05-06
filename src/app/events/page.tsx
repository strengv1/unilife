import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { EventCard } from "@/components/event-card"
import { Button } from "@/components/ui/button"
import { type Event, useEvents } from "../hooks/useEvents"

export default function EventsPage() {
  const { all } = useEvents();

  return (
    <div className="flex min-h-screen flex-col bg-amber-50">
      <Navbar />
      <main className="flex-1">
        {/* Filters Section
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input type="search" placeholder="Search events..." className="w-full" />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Select>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="festival">Festival</SelectItem>
                    <SelectItem value="networking">Networking</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="party">Party</SelectItem>
                    <SelectItem value="career">Career</SelectItem>
                    <SelectItem value="orientation">Orientation</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="helsinki">Helsinki</SelectItem>
                    <SelectItem value="turku">Turku</SelectItem>
                    <SelectItem value="tampere">Tampere</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">Filter</Button>
              </div>
            </div>
          </div>
        </section> */}

        {/* Events Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Upcoming Events</h2>
            <div className={`grid gap-6 grid-cols-1 justify-items-center ${all.length > 1 ? "md:grid-cols-2 lg:grid-cols-3" : ""}`}>
              {all.map((event: Event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          </div>
        </section>

        {/* Pagination */}
        {/* <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex justify-center">
              <nav className="flex items-center gap-1">
                <Button variant="outline" size="icon" disabled>
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
                    className="h-4 w-4"
                  >
                    <path d="m15 18-6-6 6-6"></path>
                  </svg>
                  <span className="sr-only">Previous</span>
                </Button>
                <Button variant="outline" size="sm" className="bg-red-50 dark:bg-red-950/20">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="icon">
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
                    className="h-4 w-4"
                  >
                    <path d="m9 18 6-6-6-6"></path>
                  </svg>
                  <span className="sr-only">Next</span>
                </Button>
              </nav>
            </div>
          </div>
        </section> */}

        {/* Host an Event CTA */}
        <section className="py-16 bg-amber-100">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Want to Host an Event Together?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8 text-balance">
              If you&apos;re a student organization looking to create an unforgettable event, let&apos;s make it happen — together!
            </p>
            <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
              <a href="/contact">Get in Touch</a>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
