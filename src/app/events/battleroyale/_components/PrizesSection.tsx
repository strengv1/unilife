import { Award, Crown, Trophy } from "lucide-react";

export default function PrizePodium() {
  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="text-center mb-4 md:mb-6">
          <h2 className="text-3xl mb-2 font-bold tracking-tight sm:text-4xl md:text-5xl">
            Massive Prize Pool
          </h2>
          <div className="text-xl md:text-2xl text-gray-700 font-medium">
            Total of €2,500
          </div>
        </div>

        {/* Podium */}
        <div className="relative flex items-end justify-center gap-1 xs:gap-4 md:gap-12 mb-12 md:mb-20">
          
          {/* 2nd Place */}
          <div className="text-center">
            <div className="mb-6">
              <Trophy className="w-8 xs:w-12 md:w-16 h-12 md:h-16 text-slate-500 mx-auto xs:mb-1" />
              <div className="text-sm sm:text-base text-slate-600 font-medium mb-3">2nd Place</div>
              <div className="text-lg xs:text-2xl md:text-4xl font-bold text-gray-900 mb-1">€400</div>
            </div>
            <div className="w-18 xs:w-24 md:w-32 h-22 md:h-28 bg-slate-400 mx-auto"></div>
          </div>

          {/* 1st Place */}
          <div className="text-center">
            <div className="mb-8">
              <Crown className="w-12 xs:w-16 md:w-20 h-16 md:h-20 text-yellow-500 mx-auto xs:mb-1" />
              <div className="text-yellow-600 font-semibold text-base sm:text-lg mb-3">1st Place</div>
              <div className="text-xl xs:text-3xl md:text-5xl font-bold text-gray-900 mb-2">€600</div>
              <div className="text-xs xs:text-sm text-gray-600 mt-1">+ Beer Pong Table</div>
              <div className="text-xs xs:text-sm text-gray-600 mt-1"><span className="text-nowrap">+ Championship</span> Trophy</div>
            </div>
            <div className="w-20 xs:w-28 md:w-36 h-36 md:h-42 bg-yellow-400 mx-auto"></div>
          </div>

          {/* 3rd-4th Place */}
          <div className="text-center">
            <div className="mb-6">
              <Award className="w-8 xs:w-12 md:w-16 h-12 md:h-16 text-amber-600 mx-auto xs:mb-1" />
              <div className="text-sm sm:text-base text-amber-700 font-medium mb-3">3rd-4th Places</div>
              <div className="text-lg xs:text-2xl md:text-4xl font-bold text-gray-900 mb-1">€250</div>
              <div className="text-xs xs:text-sm font-light text-gray-600">(for both teams)</div>
            </div>
            <div className="w-18 xs:w-24 md:w-32 h-16 md:h-20 bg-amber-500 mx-auto"></div>
          </div>
        </div>

        {/* Additional Prizes */}
        <div className="max-w-2xl mx-auto space-y-4">
          {/* 5th–8th Place */}
          <div className="flex items-center bg-orange-50 rounded-lg p-2 xs:p-4 border-l-4 border-orange-400">
            <div className="flex-shrink-0 w-10 xs:w-12 h-10 xs:h-12 bg-orange-400/85 rounded-lg flex items-center justify-center mr-2 xs:mr-4">
              <span className="text-white font-bold text-sm">5-8</span>
            </div>
            <div className="flex-grow">
              <div className="xs:text-lg xs:font-semibold text-gray-900 mr-2 xs:mr-4">5th-8th Places</div>
            </div>
            <div className="text-lg xs:text-2xl font-bold text-gray-900">
              €150 <span className="text-xs xs:text-sm font-light text-gray-600">(for each team)</span>
            </div>
          </div>

          {/* 9th–16th Place */}
          <div className="flex items-center bg-slate-100 rounded-lg p-2 xs:p-4 border-l-4 border-slate-400">
            <div className="flex-shrink-0 w-10 xs:w-12 h-10 xs:h-12 bg-slate-400/85 rounded-lg flex items-center justify-center mr-2 xs:mr-4">
              <span className="text-white font-bold text-xs">9-16</span>
            </div>
            <div className="flex-grow">
              <div className="xs:text-lg xs:font-semibold text-gray-900 mr-2 xs:mr-4">9th-16th Places</div>
            </div>
            <div className="text-lg xs:text-2xl font-bold text-gray-900">
              €50 <span className="text-xs xs:text-sm font-light text-gray-600">(for each team)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}