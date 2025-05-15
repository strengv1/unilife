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
import { useNavbarContext } from "@/contexts/NavbarContext"
import { Event, useEvents } from "@/hooks/useEvents"

export function Navbar() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [eventsSubmenuOpen, setEventsSubmenuOpen] = useState(false)
  const { mobileMenuOpen, setMobileMenuOpen } = useNavbarContext();

  const { all } = useEvents();

  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
    const minScrollDifference = 10; // Minimum scroll difference to trigger a hide/show
    const headerHeight = 100;
    let isMobile = window.innerWidth <= 768;

    const controlHeader = () => {
      // If mobile menu is open, close it on scroll
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
        return;
      }
      
      const currentScrollY = window.scrollY;
      const scrollDifference = Math.abs(currentScrollY - lastScrollY);
      
      // Only process significant scroll events to reduce jittering
      if (scrollDifference < minScrollDifference && !isMobile) {
        return;
      }
      
      // When at the top of the page, always show the header
      if (currentScrollY < 50) {
        setIsVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }
      
      // On mobile, be less sensitive to hide action
      const hideThreshold = isMobile ? headerHeight * 1.5 : headerHeight;
      
      // Determine scroll direction with improved thresholds
      if (currentScrollY > lastScrollY && currentScrollY > hideThreshold) {
        // Scrolling DOWN and past header height - hide header
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling UP - show header
        setIsVisible(true);
      }
      
      // Update last scroll position
      setLastScrollY(currentScrollY);
    };

    const handleScroll = () => {
      // Clear the timeout if it's already set
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      // Set a timeout to run the controlHeader function
      scrollTimeout = setTimeout(() => {
        controlHeader();
      }, isMobile ? 50 : 10); // Use a slower debounce on mobile
    };

    // Handle resize to update isMobile flag
    const handleResize = () => {
      isMobile = window.innerWidth <= 768;
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [lastScrollY, mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  }
  
  return (
    <header
      className={`sticky top-0 z-50 w-full bg-amber-50 shadow-md transition-transform duration-300 ${
        !isVisible ? "-translate-y-full" : ""
      }`}
    >
      <div className="flex h-20 items-center justify-between px-4 max-w-6xl mx-auto">
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
          className={`inset-0 top-20 z-40 bg-amber-50 md:hidden overflow-y-auto
            transition-transform duration-300 ease-in-out transform
            ${ mobileMenuOpen ? "fixed translate-x-0" : "hidden translate-x-full"
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
                {
                  all.map((event: Event) => (
                    <Link
                      key={event.urlName}
                      href={`/events/${event.urlName}`}
                      className="block py-1 hover:text-red-500"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {`${event.title}`}
                    </Link>
                  ))
                }
                
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
                  {
                    all.map((event: Event) => (
                      <li key={event.urlName}>
                        <NavigationMenuLink asChild>
                          <Link href={`/events/${event.urlName}`} className="block hover:text-red-500 font-medium">
                            {event.title}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))
                  }

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