import Link from "next/link"
import { PartyPopper } from "lucide-react"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center mx-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <PartyPopper className="h-6 w-6 text-pink-500" />
          <span>UNI LIFE</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/" className="text-sm font-medium hover:text-pink-500 transition-colors">
            Home
          </Link>
          <Link href="/events" className="text-sm font-medium hover:text-pink-500 transition-colors">
            Events
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-pink-500 transition-colors">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  )
}
