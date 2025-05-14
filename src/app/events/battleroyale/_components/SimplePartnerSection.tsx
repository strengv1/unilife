import Image from "next/image"

export const SimpleParnersSection = () => {
  return (
    <section className="py-10 md:py-16 relative overflow-hidden">
      <div className="container px-4 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Our Partners</h2>
      </div>

      <div className="my-4 md:my-8 flex items-center justify-center h-32">
        <Image
          src="/fat_lizard_logo.jpg"
          alt={`© Fat Lizard Brewing Co. logo`}
          width={120}
          height={80}
          className="max-h-full max-w-full object-contain"
        />
      </div>
      <p className="font-medium text-center">© Fat Lizard Brewing Co.</p>

      <div className="mt-6 md:mt-10 text-center">
        <p className="text-sm text-muted-foreground">
          Interested in sponsoring our event?{" "}
          <a href="/contact" className="text-primary hover:underline font-medium">
            Contact us
          </a>
        </p>
      </div>
    </section>
  )
}