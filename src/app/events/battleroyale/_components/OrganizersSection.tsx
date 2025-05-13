import Image from "next/image"

export const OrganizersSection = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-[800px] text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Organized By</h2>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center">
            <div className="relative flex h-24 lg:h-40 max-w-xs w-full items-center">
              <Image
                src="/unilife_logo.png"
                alt="Unilife"
                width={312}
                height={96}
                className="h-auto w-auto max-h-24 object-contain"
                style={{ maxWidth: '100%' }}
              />
            </div>
            <h3 className="mt-6 text-2xl font-bold">UNI LIFE</h3>
            <p className="mt-4 max-w-md text-lg text-balance text-muted-foreground">
              Professionally organized student events that are unlike anything you've seen before.
              <br /><br />
              We guarantee you'll have fun - every time!
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="h-40 w-40 overflow-hidden rounded-full bg-slate-100 shadow-md">
              <Image
                src="/abp_logo.png"
                alt="Aalto Beer Pong"
                width={160}
                height={160}
                className="h-full w-full object-cover"
              />
            </div>
            <h3 className="mt-6 text-2xl font-bold">Aalto Beer Pong</h3>
            <p className="mt-4 max-w-md text-lg text-muted-foreground">
              The original beer pong organization from Aalto University.
              <br /><br />
              Organizing tournaments since 2011.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}