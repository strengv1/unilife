import { Navbar } from "@/components/navbar";
import { AboutSection } from "./_components/AboutSection";
import { CTASection } from "./_components/CTASection";
import { FAQSection } from "./_components/FAQSection";
import { HeroSection } from "./_components/HeroSection";
import { OrganizersSection } from "./_components/OrganizersSection";
import { PrizesSection } from "./_components/PrizesSection";
import { RegistrationSection } from "./_components/RegistrationSection";
import { TournamentSection } from "./_components/TournamentSection";
import { Footer } from "@/components/footer";
import { BackToEventsButton } from "@/components/backToEventsButton";
import { EventSchema } from "@/components/EventSchema";
import { SimpleParnersSection } from "./_components/SimplePartnerSection";

export const metadata = {
  title: "Beer Pong Battle Royale 2025",
  description: "Join Finland's biggest Beer Pong tournament at Alvarinaukio, Otaniemi on September 14th, 2025. 150 teams compete for a €2,500 prize pool. Register now!",
  keywords: [
    "beer pong finland",
    "beer pong suomi",
    "beerpong suomi",
    "beer pong tournament helsinki",
    "student beer pong competition",
    "beer pong battle royale",
    "university beer pong events",
    "beer pong turnaus",
    "beer pong tapahtuma",
    "beer pong 2025",
    "fun student events finland",
    "beer pong prizes helsinki",
    "beer pong palkinto",
    "opiskelijaturnaus helsinki",
    "suurin beer pong turnaus",
    "Otaniemi tapahtumat",
    "Otaniemi events"
  ],
  openGraph: {
    title: "Beer Pong Battle Royale 2025",
    description: "Join Finland's biggest Beer Pong tournament with 150 teams competing for a €2,500 prize pool",
    images: [
      {
        url: "https://unilife.fi/abp_festarit_full.JPG",
        width: 1200,
        height: 630,
        alt: "Beer Pong Battle Royale 2025"
      }
    ],
    type: "website",
    site_name: "UNI LIFE",
    locale: "en_FI"
  },
  twitter: {
    card: "summary_large_image",
    title: "Beer Pong Battle Royale 2025 | UNI LIFE Finland",
    description: "Finland's biggest Beer Pong tournament with 150 teams competing for a €2,500 prize pool",
    images: ["https://unilife.fi/abp_festarit_full.JPG"]
  },
  alternates: {
    canonical: "https://www.unilife.fi/events/battleroyale"
  }
}


export default function BeerPongBattleRoyale() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Add comprehensive Event schema */}
      <EventSchema
        title="Beer Pong Battle Royale"
        description="Join Finland's biggest Beer Pong tournament with 150 teams competing for a €2,500 prize pool."
        image="/abp_festarit_full.JPG"
        startDate="2025-09-14T12:00:00"
        endDate="2025-09-14T19:00:00"
        location="Alvarinaukio, Otaniemi"
        performers="Student Teams from across Finland"
        organizers={["UNI LIFE", "Aalto Beer Pong"]}
        price="40"
        currency="EUR"
        availability="LimitedAvailability"
        addressLocality="Espoo"
        addressRegion="Uusimaa"
        streetAddress="Alvarinaukio"
        postalCode="02150"
        country="Finland"
        maxAttendees={300}
        eventCategory="Sports Event"
      />
      <Navbar />
      <main className="flex-1">
        <BackToEventsButton />

        <HeroSection />
        <AboutSection />
        <PrizesSection />
        <RegistrationSection />
        <TournamentSection />
        <OrganizersSection />
        <FAQSection />
        {/* <PartnerSection /> */}
        <SimpleParnersSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}