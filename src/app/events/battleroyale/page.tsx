import { Navbar } from "@/components/navbar";
import { AboutSection } from "./_components/AboutSection";
import { CTASection } from "./_components/CTASection";
import { FAQSection } from "./_components/FAQSection";
import { HeroSection } from "./_components/HeroSection";
import { OrganizersSection } from "./_components/OrganizersSection";
import dynamic from 'next/dynamic';
import { PrizesSection } from "./_components/PrizesSection";
import { RegistrationSection } from "./_components/RegistrationSection";
import { TournamentSection } from "./_components/TournamentSection";
import { Footer } from "@/components/footer";
import { BackToEventsButton } from "@/components/backToEventsButton";
import { EventSchema } from "@/components/EventSchema";

const PartnerSection = dynamic(() => import('./_components/PartnerSection'), {
  loading: () => <div className="py-20 text-center">Loading partners...</div>
});

export const metadata = {
  title: "Beer Pong Battle Royale 2025",
  description: "Join Finland's biggest Beer Pong tournament at Alvarinaukio, Otaniemi on September 14th, 2025. 150 teams compete for a €2,500 prize pool. Register now!",
  keywords: [
    "Beer Pong Battle Royale",
    "Finland beer pong tournament",
    "Otaniemi student events",
    "beer pong competition Finland",
    "UNI LIFE events",
    "beer pong tournament",
    "beer pong turnaus",
    "opiskelijatapahtumat helsinki"
  ],
  openGraph: {
    title: "Beer Pong Battle Royale 2025",
    description: "Join Finland's biggest Beer Pong tournament with 150 teams competing for a €2,500 prize pool",
    images: [
      {
        url: "https://unilife.fi/abp_festarit.png",
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
    images: ["https://unilife.fi/abp_festarit.png"]
  },
  alternates: {
    canonical: "https://unilife.fi/events/battleroyale"
  }
}


export default function BeerPongBattleRoyale() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Add comprehensive Event schema */}
      <EventSchema
        title="Beer Pong Battle Royale"
        description="Join Finland's biggest Beer Pong tournament with 150 teams competing for a €2,500 prize pool."
        image="/abp_festarit.png"
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
        <PartnerSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}