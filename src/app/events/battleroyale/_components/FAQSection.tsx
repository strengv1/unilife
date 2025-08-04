import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Script from "next/script";

export const FAQSection = () => {
  const faqItems = [
    {
      question: "Who can participate?",
      answer: [
        "The tournament is open to everyone 18 years and older. You don't need to be a student to participate."
      ],
    },
    {
      question: "Do I need to bring my own equipment?",
      answer: [
        "No, all equipment will be provided, including cups, balls, and tables. Just bring your A-game!"
      ],
    },
    {
      question: "What's the refund policy?",
      answer: [
        "You can transfer your registration on kide.app to another user, but no refunds will be issued. The registered team name will remain the same, if you choose to transfer the ticket."
      ],
    },
    {
      question: "Can we bring our own beverages?",
      answer: [
        "Yes!",
        "Our fantastic brewery sponsors will be providing each player with a drink or two.",
        "To reach an even better buzz bringing your own drinks is recommended.",
        "Note: drinking alcohol is not required at this tournament or UNI LIFE events in general."
      ],
    },
    {
      question: "Is drinking mandatory for players?",
      answer: [
        "No. You do not have to drink to participate."
      ],
    },
    {
      question: "Is there parking available?",
      answer: [
        "Limited parking is available nearby. We recommend using public transportation."
      ],
    },
  ];  

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": Array.isArray(item.answer) ? item.answer.join(' ') : item.answer
      }
    }))
  };

  return (
    <section id="faq" className="bg-slate-50 py-10 md:py-16" aria-labelledby="faq-heading">
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h2 id="faq-heading" className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know about the Beer Pong Battle Royale.
          </p>
        </div>

        <div className="mt-4 md:mt-8 mx-auto max-w-4xl bg-white px-8 py-2 rounded-lg shadow-sm">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index + 1}`}>
                <AccordionTrigger className="text-lg font-medium">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-base">
                  {Array.isArray(item.answer) ? (
                    item.answer.map((line, lineIndex) => (
                      <p key={lineIndex} className={lineIndex > 0 ? "mt-2" : ""}>
                        {line}
                      </p>
                    ))
                  ) : (
                    item.answer
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}