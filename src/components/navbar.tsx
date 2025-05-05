import Link from "next/link"
import Image from "next/image"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-20 items-center gap-4 mx-4">
        <Link href="/" className="flex items-center gap-1 md:gap-4 font-bold text-xl">
          <Image 
            src="/unilife_logo.png"
            alt="UNI LIFE"
            height={48}
            width={216}
          />
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/" className=" font-medium hover:text-red-500 transition-colors">
            Home
          </Link>
          <Link href="/events" className=" font-medium hover:text-red-500 transition-colors">
            Events
          </Link>
          <Link href="/contact" className=" font-medium hover:text-red-500 transition-colors">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  )
}
