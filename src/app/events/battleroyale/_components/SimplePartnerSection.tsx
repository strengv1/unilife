import Image from "next/image"
import Link from "next/link"

export const SimpleParnersSection = () => {

  const partnerNameClass = "font-medium text-center text-sm sm:text-base text-pretty"
  return (
    <section className="py-10 md:py-16 relative overflow-hidden">
      <div className="container px-4 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Our Partners</h2>

        <div className="my-8 grid grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-12 items-center justify-center gap-2 ">
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
            <p className={partnerNameClass}>© Fat Lizard Brewing Co.</p>
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
                  src="/oikia_logo.png"
                  alt={`Oikia logo`}
                  width={150}
                  height={80}
                  className="max-h-full max-w-full object-contain"
                />
              </Link>
            </div>
            <p className={partnerNameClass}>Oikia</p>
          </div>

          <div className="flex flex-col items-center h-full justify-between">
            <div className="flex-grow flex items-center bg-black py-3 px-4 my-3">
              <Link
                href="https://masisbrewery.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit Masis Brewery's website`}
              >
                <Image
                  src="https://masisbrewery.com/wp-content/themes/iggo20/images/logonew-white.svg"
                  alt={`Masis Brewery logo`}
                  width={120}
                  height={80}
                  className="max-h-full max-w-full object-contain"
                />
              </Link>
            </div>
            <p className={partnerNameClass}>Masis Brewery</p>
          </div>

          <div className="flex flex-col items-center h-full justify-between">
            <div className="flex-grow flex items-center ">
              <Link
                href="https://www.beerpongkauppa.fi/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit Beerpongkauppa.fi`}
              >
                <Image
                  src="/beerpongkauppa_logo.png"
                  alt={`Beerpongkauppa logo`}
                  width={150}
                  height={80}
                  className="max-h-full max-w-full object-contain"
                />
              </Link>
            </div>
            <p className={partnerNameClass}>Beerpongkauppa</p>
          </div>
        </div>

        <div className="mt-6 md:mt-10 text-center">
          <p className="text-sm text-muted-foreground">
            Interested in reaching our audience through this event? Let’s put your brand in the spotlight.{" "}
            <a href="/contact" className="text-primary hover:underline font-medium">
              Contact us
            </a>
          </p>
        </div>
      </div>

      
    </section>
  )
}