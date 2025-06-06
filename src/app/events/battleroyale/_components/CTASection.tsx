import { Button } from "@/components/ui/button"
import Link from "next/link"

export const CTASection = () => {
  return (
    <section className="bg-red-600 py-10 md:py-16 text-white">
      <div className="container mx-auto max-w-6xl px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Ready to Become a Champion?</h2>
        <p className="mt-4 md:mt-6 mx-auto max-w-xl text-lg text-red-100">
          Don&apos;t miss your chance to compete in Finland&apos;s biggest beer pong tournament and win amazing prizes!
        </p>
        <Button
          asChild
          size="lg"
          className="mt-10 bg-white text-red-600 hover:bg-red-100
            text-lg px-8 py-2 whitespace-normal h-fit
            shadow-lg
          ">
          <Link href="https://kide.app/events/be966048-0eb5-464e-a389-fd7caae8d4dd" target="_blank" rel="noopener noreferrer" className="relative block">
            Register for Beer Pong Battle Royale
          </Link>
        </Button>
      </div>
    </section>
  )
}