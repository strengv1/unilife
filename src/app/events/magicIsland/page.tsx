import { Navbar } from "@/components/navbar";
import { AboutSection } from "./_components/AboutSection";
import { HeroSection } from "./_components/HeroSection";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { NewsletterSection } from "@/components/newsletterSection";

export default function MagicIsland() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Link
        href="/events" aria-label="Go back to events list"
        >
          <Button
            variant="outline"
            className="
              fixed top-24 left-4
              border-2 rounded-full
              z-50 h-12 w-12
              cursor-pointer hover:bg-black hover:text-white
            "
          >
            <ArrowLeft />
          </Button>
        </Link>

        <HeroSection />
        <AboutSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  )
}