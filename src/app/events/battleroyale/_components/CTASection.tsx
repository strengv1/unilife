import { Button } from "@/components/ui/button"
import Link from "next/link"

export const CTASection = () => {
  return (
    <section className="bg-red-600 py-20 md:py-24 text-white">
      <div className="container mx-auto max-w-6xl px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Ready to Become a Champion?</h2>
        <p className="mt-6 mx-auto max-w-[600px] text-lg text-red-100">
          Don't miss your chance to compete in Finland's biggest beer pong tournament and win amazing prizes!
        </p>
        <Button asChild size="lg" className="mt-10 bg-white text-red-600 hover:bg-red-100 text-lg px-8 py-6">
          <Link href="#registration">Register Your Team Now</Link>
        </Button>
      </div>
    </section>
  )
}