"use client"

import { useEffect, useState, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Partner {
  name: string;
  imageSrc: string; // Use image source URLs instead of icons
  website?: string;
}

export default function PartnerSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Default visible count - will be updated after mount
  const [visibleCount, setVisibleCount] = useState(4);
  
  const partners: Partner[] = [
    {
      name: "Red Bull",
      imageSrc: "/redbull_logo.png",
      website: "https://redbull.com"
    },
    {
      name: "Aalto Beer Pong",
      imageSrc: "/abp_logo.png",
      website: "https://aaltobeerpong.fi"
    },
    {
      name: "UNI LIFE",
      imageSrc: "/unilife_logo.png",
      website: ""
    },
    {
      name: "Red Bull",
      imageSrc: "/redbull_logo.png",
      website: "https://redbull.com"
    },
    {
      name: "Aalto Beer Pong",
      imageSrc: "/abp_logo.png",
      website: "https://aaltobeerpong.fi"
    },
    {
      name: "UNI LIFE",
      imageSrc: "/unilife_logo.png",
      website: ""
    },
    {
      name: "Red Bull",
      imageSrc: "/redbull_logo.png",
      website: "https://redbull.com"
    },
    {
      name: "Aalto Beer Pong",
      imageSrc: "/abp_logo.png",
      website: "https://aaltobeerpong.fi"
    },
    {
      name: "UNI LIFE",
      imageSrc: "/unilife_logo.png",
      website: ""
    },
  ];

  // Update visible count after component mounts to avoid hydration mismatch
  useEffect(() => {
    const updateVisibleCount = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleCount(1);
      } else if (width < 768) {
        setVisibleCount(2);
      } else if (width < 1024) {
        setVisibleCount(3);
      } else {
        setVisibleCount(4);
      }
    };
    
    // Initial update
    updateVisibleCount();
    
    // Handle window resize
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => {
        const maxIndex = Math.max(0, partners.length - visibleCount);
        const next = current >= maxIndex ? 0 : current + 1;
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isPaused, partners.length, visibleCount]);

  const handleNext = () => {
    setActiveIndex((current) => {
      const maxIndex = Math.max(0, partners.length - visibleCount);
      const next = current >= maxIndex ? 0 : current + 1;
      return next;
    });
  };

  const handlePrev = () => {
    setActiveIndex((current) => {
      const maxIndex = Math.max(0, partners.length - visibleCount);
      const prev = current <= 0 ? maxIndex : current - 1;
      return prev;
    });
  };

  // Prevent rendering carousel content if we're in SSR or before first client render
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate max index for indicator dots
  const maxIndex = Math.max(0, partners.length - visibleCount);

  return (
    <section className="py-16 bg-muted/50 relative overflow-hidden">
      <div className="container px-4 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">Our Partners</h2>
        
        {isMounted && (
          <div 
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            ref={carouselRef}
          >
            {/* Navigation Buttons */}
            <button 
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 p-2 rounded-full shadow-md hover:bg-background transition-colors"
              aria-label="Previous partners"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button 
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 p-2 rounded-full shadow-md hover:bg-background transition-colors"
              aria-label="Next partners"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            
            {/* Carousel Content */}
            <div className="flex justify-center items-center overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ 
                  transform: `translateX(-${activeIndex * (100 / visibleCount)}%)` 
                }}
              >
                {partners.map((partner, index) => (
                  <div 
                    key={index} 
                    className="flex-shrink-0 px-4"
                    style={{ width: `${100 / visibleCount}%` }}
                  >
                    <a
                      href={partner.website || "#"}
                      target={partner.website ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center py-8 px-4 h-full transition-all duration-300 hover:scale-105"
                    >
                      <div className="mb-4 transition-transform duration-300 hover:scale-110 flex items-center justify-center h-24">
                        {/* Replace icons with images */}
                        <img
                          src={partner.imageSrc}
                          alt={`${partner.name}`}
                          className="max-h-full max-w-full object-contain"
                          // Fallback for image loading errors
                          
                        />
                      </div>
                      <p className="text-lg font-medium text-center">{partner.name}</p>
                    </a>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Indicator Dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    activeIndex === index ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Interested in sponsoring our event?{" "}
            <a href="/contact" className="text-primary hover:underline font-medium">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}