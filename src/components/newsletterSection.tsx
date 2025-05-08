import { Button } from "./ui/button"

export const NewsletterSection = () => {

  return (
    <section id="newsletter" className="py-16 bg-amber-100">
      <div className="container px-4 mx-auto text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Stay Updated</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Subscribe to our newsletter to get the latest updates on upcoming events and exclusive offers.
        </p>
        <form
          action="https://formspree.io/f/xqaqqwgy"
          method="POST"
          className="flex flex-col md:flex-row gap-2 max-w-md mx-auto"
        >
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ..."
            required
          />
          <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white cursor-pointer">
            Subscribe
          </Button>
        </form>

      </div>
    </section>
  )
}