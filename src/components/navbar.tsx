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

        <NavigationMenu>
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
                    <Link href="/events/magicIsland" className="block hover:text-red-500 font-medium">
                      Magic Island
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
