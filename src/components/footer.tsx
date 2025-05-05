import Link from "next/link"
import { PartyPopper, Instagram, Facebook, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <PartyPopper className="h-6 w-6 text-pink-500" />
              <span>UNI LIFE</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Creating large-scale and high-value student events across Finland.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="font-medium">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-medium">Connect With Us</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-pink-500 transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-pink-500 transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-pink-500 transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} UNI LIFE. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
