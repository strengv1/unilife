import { Navbar } from "@/components/navbar";
import { AboutSection } from "./_components/AboutSection";
import { CTASection } from "./_components/CTASection";
import { FAQSection } from "./_components/FAQSection";
import { HeroSection } from "./_components/HeroSection";
import { OrganizersSection } from "./_components/OrganizersSection";
import PartnerSection from "./_components/PartnerSection";
import { PrizesSection } from "./_components/PrizesSection";
import { RegistrationSection } from "./_components/RegistrationSection";
import { TournamentSection } from "./_components/TournamentSection";
import { Footer } from "@/components/footer";
import { BackToEventsButton } from "@/components/backToEventsButton";
import { EventSchema } from "@/components/EventSchema";

export const metadata = {
  title: "Beer Pong Battle Royale | UNI LIFE",
  description: "Join Finland's biggest Beer Pong tournament at Alvarinaukio, Otaniemi. Compete for the largest prize pool in Finnish Beer Pong history!",
  openGraph: {
    title: "Beer Pong Battle Royale | UNI LIFE",
    description: "Join Finland's biggest Beer Pong tournament at Alvarinaukio, Otaniemi",
    images: [
      {
        url: "/abp_festarit.png",
        width: 1200,
        height: 630,
        alt: "Beer Pong Battle Royale"
      }
    ],
  }
}

export default function BeerPongBattleRoyale() {
  return (
    <div className="flex min-h-screen flex-col">
      <EventSchema
        title="Beer Pong Battle Royale"
        description="Join Finland's biggest Beer Pong tournament at Alvarinaukio, Otaniemi."
        date="September 14th, 2025"
        location="Alvarinaukio, Otaniemi"
        image="/abp_festarit.png"
        startTime="12:00"
        endTime="19:00"
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