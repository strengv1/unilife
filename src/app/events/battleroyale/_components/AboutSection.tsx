import Image from "next/image"

export const AboutSection = () => {
  return (
    <section id="about" className="pt-10 md:pt-16" aria-labelledby="about-heading">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 id="about-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-balance">
              Finland&apos;s Ultimate Beer Pong Experience
            </h2>
            <Image
              className="block md:hidden mx-auto mt-3 h-48 w-auto order-first"
              src="/bpbr_logo.png"
              alt="Beer Pong Battle Royale logo"
              height={250}
              width={250}
            />
            <p className="mt-2 leading-snug text-lg text-muted-foreground text-balance">
              Organized by the powerhouses UNI LIFE and Aalto Beer Pong, the highly anticipated <span className="text-nowrap">Beer Pong Battle Royale</span> unites beer pong enthusiasts from all over Finland for an epic, one-of-a-kind tournament.
            </p>
          </div>
          <Image
            className="hidden md:block mx-auto pl-8 h-48 w-auto order-first"
            src="/bpbr_logo.png"
            alt="Beer Pong Battle Royale logo"
            height={250}
            width={250}
          />
        </div>
      </div>
    </section>
  )
}