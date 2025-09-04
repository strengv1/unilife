"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useEffect, useState } from "react"

export const RegistrationSection = () => {
  const emojiClasses = "text-xl"
  
  const registeredTeams = [
    { name: "Sub Musmo" },
    { name: "Eero" },
    { name: "Kossun rakastelijat" },
    { name: "Ponteva" },
    { name: "Tulokkaat" },
    { name: "Skene" },
    { name: "Swiss Cheese" },
    { name: "Bileinsinöörit" },
    { name: "Beeragraaf" },
    { name: "Pulmia" },
    { name: "Myskääjät" },
    { name: "jos me pelleillään ni meidät voi pistää kylmäks" },
    { name: "KiviKova" },
    { name: "Ballers" },
    { name: "BPC Vaasankatu" },
    { name: "VUOHET" },
    { name: "Herrasmiehet" },
    { name: "Border Between England and Irland" },
    { name: "LECLEEERC" },
    { name: "Patteman City" },
    { name: "The underdogs" },
    { name: "Broskis" },
    { name: "Bileinsinöörit 2" },
    { name: "Team Luttista" },
    { name: "Laihia Finest" },
    { name: "For chief" },
    { name: "BeerPongMyrsky" },
    { name: "Nökki" },
    { name: "Darrasstars" },
    { name: "Stay Frosty" },
    { name: "LuLa" },
    { name: "NOOT NOOT !" },
    { name: "RuoRi" },
    { name: "Kontulan Vetelät" },
    { name: "Sjundeåregattan" },
  ];
  const [shuffledTeams, setShuffledTeams] = useState(registeredTeams);
  
  const shuffleArray = (array: { name: string }[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  useEffect(() => {
    setShuffledTeams(shuffleArray(registeredTeams));
  }, [registeredTeams]);

  return (
    <section id="registration" className="bg-red-600 py-10 md:py-16 text-white">
      <div className="container mx-auto max-w-6xl px-2 xs:px-4">
        <div className="mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Register Your Team</h2>
          <p className="mt-4 md:mt-6 text-lg text-red-100">
            Secure your spot in Finland&apos;s largest beer pong tournament before all slots are filled!
          </p>
        </div>

        {/* Teams Carousel Section */}
        <div className="mt-8 mb-8 motion-reduce:hidden">
          <div className="text-center mb-1">
            <h3 className="text-lg font-bold text-white">
              🏆 Recently Registered Teams
            </h3>
          </div>

          <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
            <div className="flex items-center justify-center md:justify-start animate-infinite-scroll">
              {/* First set of teams */}
              {shuffledTeams.map((team, index) => (
                <div key={`first-${index}`} className="flex-shrink-0 mx-8">
                  <span className="text-white font-semibold text-lg px-4 py-2 rounded-lg whitespace-nowrap">
                    {team.name}
                  </span>
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {shuffledTeams.map((team, index) => (
                <div key={`second-${index}`} className="flex-shrink-0 mx-8">
                  <span className="text-white font-semibold text-lg px-4 py-2 rounded-lg whitespace-nowrap">
                    {team.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Card className="bg-white shadow-lg">
            <CardContent className="pt-4 md:pt-8 pb-6 px-4 xs:px-6">
              <h3 className="text-2xl font-bold">Registration Details</h3>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start gap-3">
                  - <span>€40 per team (=20€ per player)</span>
                </li>
                <li className="flex items-start gap-3">
                  - <span>Limited to 150 teams - first come, first served</span>
                </li>
                <li className="flex items-start gap-3">
                  - <span>Ticket sales close 24 hours before the event! (13.09. 12:00)</span>
                </li>
              </ul>
              
              <div className="mt-8">
                <Link href="https://kide.app/events/be966048-0eb5-464e-a389-fd7caae8d4dd" target="_blank" rel="noopener noreferrer" className="relative block">
                  <Button 
                    className="relative w-full bg-red-600 hover:bg-red-700 text-lg py-6 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 font-semibold overflow-hidden shine-effect"
                  >
                    <span className="relative z-10">
                      Register Now
                    </span>
                  </Button>
                </Link>
              </div>
              
              {/* <div className="mt-8 rounded-md bg-red-50 p-6 text-red-800">
                <p className="text-base font-medium">
                  Only a few spots remaining! Register today to secure your place.
                </p>
              </div> */}
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg">
            <CardContent className="pt-4 md:pt-8 pb-6 px-4 xs:px-6">
              <h3 className="text-2xl font-bold">What&apos;s Included</h3>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-3">
                  <span className={emojiClasses} >🎯</span> Tournament entry for both players
                </li>
                <li className="flex items-center gap-3">
                  <span className={emojiClasses} >🍻</span> includes you & your partner&apos;s first drinks!
                </li>
                <li className="flex items-center gap-3">
                  <span className={emojiClasses} >⚡</span> Two Red Bulls
                </li>
                <li className="flex items-center gap-3">
                  <span className={emojiClasses} >🏆</span> Two Beer Pong Battle Royale Patches
                </li>
                <li className="flex items-center gap-3">
                  <span className={emojiClasses} >🔥</span> OK20 Sauna afterparty with music and casual Beer Pong
                </li>
                <li className="flex items-center gap-3">
                  <span className={emojiClasses} >🦘</span> Australian surprise DJ!
                </li>
                <li className="flex items-center gap-3">
                  And a guaranteed good time!
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Add CSS for shine effect */}
      <style jsx global>{`
        .shine-effect::before {
          content: '';
          position: absolute;
          top: 0;
          width: 30px;
          height: 100%;
          background: rgba(255, 255, 255, 0.6);
          transform: skewX(-30deg);
          animation: shine 3s infinite;
          filter: blur(3px);
          z-index: 20;
          pointer-events: none;
        }
        
        @keyframes shine {
          0% { left: -30px; }
          20% { left: 110%; }
          100% { left: 110%; }
        }
        
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        
        .animate-infinite-scroll {
          animation: infinite-scroll 300s linear infinite;
        }
      `}</style>
    </section>
  )
}