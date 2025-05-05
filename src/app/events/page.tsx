import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { EventCard } from "@/components/event-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for events
const events = [
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
  {
    id: "4",
    title: "End of Semester Party",
    date: "July 12, 2025",
    time: "21:00 - 03:00",
    location: "Club Apollo, Helsinki",
    image: "/placeholder.svg?height=400&width=600",
    category: "Party",
  },
  {
    id: "5",
    title: "Career Fair 2025",
    date: "August 10, 2025",
    time: "10:00 - 16:00",
    location: "Tampere University",
    image: "/placeholder.svg?height=400&width=600",
    category: "Career",
  },
  {
    id: "6",
    title: "Freshers Welcome Week",
    date: "September 1, 2025",
    time: "Various times",
    location: "Multiple Campuses",
    image: "/placeholder.svg?height=400&width=600",
    category: "Orientation",
    isFeatured: true,
  },
]

export default function EventsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-pink-600 text-white py-16">
          <div className="container px-4 text-center mx-auto">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">Discover Our Events</h1>
            <p className="max-w-2xl mx-auto text-lg opacity-90">
              Browse through our upcoming and past events to find the perfect experience for you.
            </p>
          </div>
        </section>

        {/* Filters Section */}
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
        </section>

        {/* Events Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">All Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          </div>
        </section>

        {/* Pagination */}
        <section className="py-8">
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
                <Button variant="outline" size="sm" className="bg-pink-50 dark:bg-pink-950/20">
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
        </section>

        {/* Host an Event CTA */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Want to Host Your Own Event?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              If you&apos;re a student organization or university department looking to create an unforgettable event, we can
              help!
            </p>
            <Button asChild className="bg-pink-600 hover:bg-pink-700 text-white">
              <a href="/contact">Get in Touch</a>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
