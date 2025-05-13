"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const [lastScrollY, setLastScrollY] = useState<number>(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const [eventsSubmenuOpen, setEventsSubmenuOpen] = useState(false);

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
    let ticking = false;
    const throttledControlHeader = (): void => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          controlHeader();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledControlHeader)
    
    // Clean up event listener
    return () => {
      window.removeEventListener('scroll', throttledControlHeader)
    }
  }, [lastScrollY])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }
  
  return (
    <header
      className={`sticky top-0 z-50 w-full bg-amber-50 shadow-md transition-transform duration-300 ${
        !isVisible ? "-translate-y-full" : ""
      }`}
    >
      <div className="flex h-20 items-center justify-between px-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Image
            src="/unilife_logo.png"
            alt="UNI LIFE"
            height={48}
            width={216}
            priority
          />
        </Link>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-gray-700 hover:text-red-500 focus:outline-none" 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Mobile menu */}
        <div 
          className={`inset-0 top-20 z-40 bg-amber-50 md:hidden transition-transform duration-300 ease-in-out transform ${
            mobileMenuOpen ? "fixed translate-x-0" : "hidden translate-x-full"
          }`}
        >
          <nav className="flex flex-col p-4 space-y-4">
            <Link 
              href="/" 
              className="font-medium text-lg py-2 border-b border-amber-200 hover:text-red-500"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            
            <div className="py-2 border-b border-amber-200">
              <div 
                className="font-medium text-lg flex justify-between items-center cursor-pointer hover:text-red-500"
                onClick={() => setEventsSubmenuOpen(!eventsSubmenuOpen)}
              >
                Events
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <div className={`pl-4 mt-2 space-y-2 ${eventsSubmenuOpen ? '' : 'hidden'}`}>
                <Link 
                  href="/events/battleroyale" 
                  className="block py-1 hover:text-red-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Beer Pong Battle Royale
                </Link>
                <Link 
                  href="/events/magicisland" 
                  className="block py-1 hover:text-red-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Magic Island
                </Link>
                <Link
                  href="/events" 
                  className="block py-1 hover:text-red-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  All Events
                </Link>
              </div>
            </div>
            
            <Link 
              href="/contact" 
              className="font-medium text-lg py-2 border-b border-amber-200 hover:text-red-500"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
        </div>

        {/* Desktop menu */}
        <NavigationMenu className="hidden md:block">
          <NavigationMenuList className="flex ml-4 gap-2 lg:gap-6">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/" className="font-medium transition-colors !bg-inherit hover:bg-inherit hover:text-red-500">
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger 
                className="!bg-inherit cursor-pointer transition-colors font-medium 
                hover:text-red-500 data-[state=open]:bg-amber-50 data-[state=open]:text-red-500
              ">
                Events
              </NavigationMenuTrigger>
              <NavigationMenuContent className="p-4 shadow-lg rounded-md">
                <ul className="grid gap-3 p-2 w-[200px]">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="/events/battleroyale" className="block hover:text-red-500 font-medium">
                        Beer Pong Battle Royale
                      </Link>
                    </NavigationMenuLink>
                  </li>

                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="/events/magicisland" className="block hover:text-red-500 font-medium">
                        Magic Island
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="/events" className="block hover:text-red-500 font-medium">
                        All Events
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/contact" className="font-medium transition-colors !bg-inherit hover:bg-inherit hover:text-red-500">
                  Contact
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  )
}