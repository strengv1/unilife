"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Clock, ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useInView } from "react-intersection-observer";

interface EventCardProps {
  id: string;
  title: string;
  subtitle: string;
  coverText: string;
  date: string;
  time: string;
  location: string;
  image: string;
  category: string;
  urlName: string;
  isFeatured?: boolean;
  attendeeCount?: number;
}

export default function EnhancedEventCard({
  title,
  subtitle,
  coverText,
  date,
  time,
  location,
  image,
  category,
  urlName,
  isFeatured = false,
  attendeeCount = 0,
}: EventCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  // Set visibility with a slight delay for animation
  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => setIsVisible(true), 300);
      return () => clearTimeout(timer);
    }
  }, [inView]);

  return (
    <div ref={ref} className={`transition-all duration-200 max-w-md w-full group
      ${isVisible ? "opacity-100 " : "opacity-0 -translate-x-24"}`}
    >
      <Link href={`/events/${urlName}`} className="block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg">
        <Card className={`overflow-hidden transition-all duration-300 w-full cursor-pointer
          group-hover:shadow-xl transform 
          ${isFeatured ? "border-red-500" : ""}
          ${
            isFeatured
              ? "bg-linear-to-bl from-red-100 to-white from-10% to-40%"
              : ""
          }
        `}>
          <div className="relative">
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              width={600}
              height={400}
              quality={100}
              className="aspect-video object-cover w-full text-center group-hover:brightness-105 transition-all"
            />
            {isFeatured && (
              <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
                Featured
              </Badge>
            )}
            
            {/* Highlight benefits/value prop with an eye-catching callout */}
            {coverText &&
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <p className="text-white font-bold text-center text-lg">
                  {coverText}
                </p>
              </div>
            }
          </div>

          <CardHeader className="px-4">
            <div className="space-y-1">
              <div className="flex justify-between items-center mb-2">
                <Badge variant="outline" className="text-blue-900 border-blue-100">
                  {category}
                </Badge>
                
                {/* Social proof - show attendee count */}
                { attendeeCount > 0 ?
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Users className="h-3 w-3 mr-1" />
                    <span>{attendeeCount} going</span>
                  </div>
                  : <></>
                }
              </div>
              
              <h3 className="font-bold text-xl line-clamp-2">{title}</h3>
              
              {/* Value proposition instead of generic subtitle */}
              <span className="text-muted-foreground">
                {subtitle}
              </span>
            </div>
          </CardHeader>

          <CardContent className="p-4 pt-0 space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-1 h-4 w-4" />
              <span>{date}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-1 h-4 w-4" />
              <span>{time}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-1 h-4 w-4" />
              <span>{location}</span>
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0">
            {/* Button with shine effect animation */}
            <div className={`w-full relative ${isVisible&&isFeatured ? "shine-effect" : ""}`}>
              <Button asChild className="w-full bg-red-600 hover:bg-red-700">
                <span className="flex items-center justify-center w-full">
                  View Details!
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </Button>
              
              {/* Limited spots indicator to create urgency */}
              {attendeeCount > 20 && (
                <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-1 rounded-bl-md">
                  Limited Spots
                </span>
              )}
            </div>
          </CardFooter>
        </Card>
      </Link>

      {/* Add CSS for shine effect */}
      <style jsx global>{`
        .shine-effect::before {
          content: '';
          position: absolute;
          top: 0;
          width: 30px;
          height: 100%;
          background: rgba(255, 255, 255, 0.3);
          transform: skewX(-30deg);
          animation: shine 3s infinite;
          filter: blur(3px);
        }
        
        @keyframes shine {
          0% { left: -30px; }
          20% { left: 110%; }
          100% { left: 110%; }
        }
      `}</style>
    </div>
  );
}
