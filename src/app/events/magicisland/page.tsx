import { Navbar } from "@/components/navbar";
import { AboutSection } from "./_components/AboutSection";
import { HeroSection } from "./_components/HeroSection";
import { Footer } from "@/components/footer";
import { NewsletterSection } from "@/components/newsletterSection";
import { BackToEventsButton } from "@/components/backToEventsButton";
import { EventSchema } from "@/components/EventSchema";

export const metadata = {
  title: "Magic Island",
  description: "Experience the mystery of Magic Island - a unique student event coming soon to Finland.",
  openGraph: {
    title: "Magic Island",
    description: "Experience the mystery of Magic Island - a unique student event coming soon to Finland.",
    images: [
      {
        url: "/magic_island_cover.png",
        width: 1200,
        height: 630,
        alt: "Magic Island Event"
      }
    ],
  }
}

export default function MagicIsland() {
  return (
    <div className="flex min-h-screen flex-col">
      <EventSchema
        title="Magic Island"
        description="Experience an unforgettable open-air party with live DJ sets, free food, and a mysterious location."
        image="/magic_island_cover.png"
        location="Secret Location"
        performers="Live DJs"
        organizers="UNI LIFE"
        addressRegion="Uusimaa"
        country="Finland"
        eventCategory="Entertainment Event"
      />
      <Navbar />
      <main className="flex-1">
        <BackToEventsButton />

        <HeroSection />
        <AboutSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  )
}