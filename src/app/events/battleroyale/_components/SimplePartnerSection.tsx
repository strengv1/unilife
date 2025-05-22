import Image from "next/image"
import Link from "next/link"

export const SimpleParnersSection = () => {
  return (
    <section className="py-10 md:py-16 relative overflow-hidden">
      <div className="container px-4 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Our Partners</h2>

        <div className="my-8 flex items-center justify-center h-40 gap-2 md:gap-32 ">
          <div className="flex flex-col items-center h-full justify-between">
            <Link
              href="https://www.fatlizard.beer/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit Fat Lizard's website`}
            >
              <Image
                src="/fat_lizard_logo.jpg"
                alt={`© Fat Lizard Brewing Co. logo`}
                width={120}
                height={80}
                className="max-h-full max-w-full object-contain shadow-md hover:shadow-xl"
              />
            </Link>
            <p className="font-medium text-center">© Fat Lizard Brewing Co.</p>
          </div>
          
          <div className="flex flex-col items-center h-full justify-between">
            <div className="flex-grow flex items-center">
              <Link
                href="https://oikiasipsi.fi/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit Oikia's website`}
              >
                <Image
                  src="/oikia_logo.jpg"
                  alt={`Oikia logo`}
                  width={120}
                  height={80}
                  className="max-h-full max-w-full object-contain"
                />
              </Link>
            </div>
            <p className="font-medium text-center">Oikia</p>
          </div>
        </div>

        <div className="mt-6 md:mt-10 text-center">
          <p className="text-sm text-muted-foreground">
            Interested in sponsoring our event?{" "}
            <a href="/contact" className="text-primary hover:underline font-medium">
              Contact us
            </a>
          </p>
        </div>
      </div>

      
    </section>
  )
}