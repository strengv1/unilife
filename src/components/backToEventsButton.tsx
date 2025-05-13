"use client"

import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavbarContext } from "@/contexts/NavbarContext";

export function BackToEventsButton() {
  const { mobileMenuOpen } = useNavbarContext();
  
  return (
    <Link
      href="/events" 
      aria-label="Return to events page"
      className={`
        fixed top-24 left-4 z-40 group
        ${mobileMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
      `}
    >
      <Button
        variant="outline"
        className="
          border-2 rounded-full
          h-12 w-12
          cursor-pointer hover:bg-black hover:text-white
          group-focus-visible:ring-2 group-focus-visible:ring-red-500
        "
      >
        <ArrowLeft />
        <span className="sr-only">Back to events</span>
      </Button>
    </Link>
  )
}