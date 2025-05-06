"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"

export function Navbar() {
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const [lastScrollY, setLastScrollY] = useState<number>(0)

  useEffect(() => {
    const controlHeader = (): void => {
      const currentScrollY = window.scrollY
      
      // Determine scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // Scrolling DOWN and past header height - hide header
        setIsVisible(false)
      } else {
        // Scrolling UP - show header
        setIsVisible(true)
      }
      
      // Update last scroll position
      setLastScrollY(currentScrollY)
    }

    // Add scroll event listener with throttling for performance
    let timeoutId: NodeJS.Timeout | null = null
    
    const throttledControlHeader = (): void => {
      if (!timeoutId) {
        timeoutId = setTimeout(() => {
          controlHeader()
          timeoutId = null
        }, 150)
      }
    }

    window.addEventListener('scroll', throttledControlHeader)
    
    // Clean up event listener
    return () => {
      window.removeEventListener('scroll', throttledControlHeader)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [lastScrollY])

  
  return (
    <header
      className={`sticky top-0 z-50 w-full bg-amber-50 shadow-lg transition-transform duration-300 ${!isVisible ? '-translate-y-full' : ''}`}
    >
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
