import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const FAQSection = () => {
  return (
    <section id="faq" className="bg-slate-50 py-20 md:py-28">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-[800px] text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Frequently Asked Questions</h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Everything you need to know about the Beer Pong Battle Royale.
          </p>
        </div>

        <div className="mt-16 mx-auto max-w-[800px] bg-white p-8 rounded-lg shadow-sm">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-medium">Who can participate?</AccordionTrigger>
              <AccordionContent className="text-base">
                The tournament is open to everyone 18 years and older. You don't need to be a student to
                participate.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-medium">Do I need to bring my own equipment?</AccordionTrigger>
              <AccordionContent className="text-base">
                No, all equipment will be provided, including cups, balls, and tables. Just bring your A-game! (Note! Drinks are not included. BYOB)
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-medium">What's the refund policy?</AccordionTrigger>
              <AccordionContent className="text-base">
                You can transfer your registration to another team but no refunds will be issued. Team name can be changed up to 1 week before the tournament date.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-medium">Is there food available at the event?</AccordionTrigger>
              <AccordionContent className="text-base">
                No food will be provided by the event organizers. However, there are a couple of fast food restaurants and student cafeterias nearby. Please note that student cafeteria opening hours may vary, especially since the event takes place on a Saturday.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-medium">Can we bring our own beverages?</AccordionTrigger>
              <AccordionContent className="text-base">
                Yes.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger className="text-lg font-medium">Is drinking mandatory for players?</AccordionTrigger>
              <AccordionContent className="text-base">
                No. You do not have to drink to participate.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-7">
              <AccordionTrigger className="text-lg font-medium">Is there parking available?</AccordionTrigger>
              <AccordionContent className="text-base">
                Limited parking is available <i>nearby</i>. We recommend using public transportation.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  )
}