import { ArrowDown, Target, ArrowRight, Crown, Euro } from "lucide-react"

export default function TournamentStructure() {
  const SwissIllustration = () => (
    <div className="bg-white rounded-xl p-3 lg:p-6 border-2 border-blue-200 shadow-sm">
      <div className="mb-2 text-center">
        <h5 className="font-bold text-gray-800 mb-3">Swiss Pairing Example</h5>
        <p className="text-sm text-gray-700 italic inline-block">After Round 2</p>
      </div>
      
      {/* Round visualization */}
      <div className="space-y-3">
        {/* 2-0 teams */}
        <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-green-100 rounded-lg py-1 px-3 lg:py-3 border border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
            <span className="text-sm font-semibold text-green-800">Team A (2-0)</span>
          </div>
          <div className="bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-500 border">vs</div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-green-800">Team B (2-0)</span>
            <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
          </div>
        </div>
        
        {/* 1-1 teams */}
        <div className="flex items-center justify-between bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg py-1 px-3 lg:py-3 border border-yellow-200">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-sm"></div>
            <span className="text-sm font-semibold text-yellow-800">Team C (1-1)</span>
          </div>
          <div className="bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-500 border">vs</div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-yellow-800">Team D (1-1)</span>
            <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-sm"></div>
          </div>
        </div>
        
        {/* 0-2 teams */}
        <div className="flex items-center justify-between bg-gradient-to-r from-red-50 to-red-100 rounded-lg py-1 px-3 lg:py-3 border border-red-200">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
            <span className="text-sm font-semibold text-red-800">Team E (0-2)</span>
          </div>
          <div className="bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-500 border">vs</div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-red-800">Team F (0-2)</span>
            <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-5">
        <p className="text-sm text-gray-600 bg-blue-50 rounded-lg px-3 py-2">
          <Target className="inline w-4 h-4 mr-2" />
          Similar records face each other
        </p>
      </div>
    </div>
  )

  const BracketIllustration = () => (
    <div className="bg-white rounded-xl px-2 py-4 sm:p-4 lg:p-6 border-2 border-red-200 shadow-sm">
      <div className="text-center mb-2">
        <h5 className="font-bold text-gray-800 lg:mb-2">Single Elimination Playoff Bracket</h5>
      </div>
      
      {/* Bracket visualization */}
      <div className="flex items-center justify-around sm:gap-1 text-sm">
        <div className="text-center">
          <div className="text-gray-600 mb-2 font-medium">Top 64</div>
          <div className="space-y-1">
            {[1,64, 32, 33].map(i => (
              <div key={i} className="flex items-center justify-center px-1 h-6
                bg-gradient-to-r from-red-100 to-red-200 rounded-lg border border-red-300
                text-xs sm:font-medium tracking-tighter sm:tracking-tight"
              >
                Seed #{i}
              </div>
            ))}
            <div className="text-gray-400 text-xs">⋮</div>
            {[2, 63].map(i => (
              <div key={i} className="flex items-center justify-center px-1 h-6
                bg-gradient-to-r from-red-100 to-red-200 rounded-lg border border-red-300
                text-xs sm:font-medium tracking-tighter sm:tracking-tight"
              >
                Seed #{i}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col items-center text-gray-400">
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        
        <div className="text-center">
          <div className="text-gray-600 mb-2 font-medium">Top 32</div>
          <div className="space-y-1">
            {[1,2].map(i => (
              <div key={i} className="flex items-center justify-center h-6 px-1
                bg-gradient-to-r from-red-200 to-red-300 rounded-lg border border-red-400
                text-xs sm:font-medium tracking-tighter sm:tracking-normal">
                Winner
              </div>
            ))}
            <div className="text-gray-400 text-xs">⋮</div>
            <div className="flex items-center justify-center h-6 px-1
              bg-gradient-to-r from-red-200 to-red-300 rounded-lg border border-red-400
              text-xs sm:font-medium tracking-tighter sm:tracking-normal"
            >
              Winner
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center text-gray-400">
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>

        <div className="flex flex-col items-center text-gray-400">
          <div className="text-xs">...</div>
        </div>

        <div className="flex flex-col items-center text-gray-400">
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>

        <div className="text-center">
          <div className="text-gray-600 mb-2 text-sm sm:text-base font-medium">Finals</div>
          <div className="h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center border-2 border-yellow-600 shadow-md">
            <Crown className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="mx-auto">
      {/* Header */}
      <div className="mx-2 xs:mx-0 mb-4 lg:mb-6">
        <h2 className="text-xl lg:text-3xl font-bold text-gray-900 mb-2">Tournament consists of <u>two phases</u>:</h2>
        <p className="text-md lg:text-xl text-gray-600">
          <strong className="text-blue-700">Swiss preliminaries</strong> followed by <strong className="text-red-600">single-elimination playoffs</strong>
        </p>
      </div>

      {/* Vertical stacked phases */}
      <div className="space-y-6 mb-4 lg:mb-6">
        {/* Swiss Phase */}
        <div className="flex flex-col lg:flex-row lg:gap-6 lg:items-start">
          <div className="lg:flex-1">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-3 lg:p-6 mb-3 lg:mb-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white text-blue-600 w-10 h-10 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Swiss Preliminaries</h3>
                  <p className="text-blue-100 text-sm">6 rounds • All teams play</p>
                </div>
              </div>
              
              <div className="space-y-1 text-blue-50 text-sm">
                <div>- Teams paired by similar records</div>
                <div>- No rematches allowed</div>
                <div>- Win = 3pts, Draw = 1pt, Loss = 0pts</div>
                <div>- Best-of-1 format</div>
              </div>

              <div className="mt-4">
                <p className="text-blue-100 text-sm mb-2">Tiebreakers used to rank teams after 6 rounds:</p>
                
                <div className="grid md:grid-cols-2 gap-y-2">
                  {[
                    { num: "1", title: "Swiss Points", desc: "Win-Loss-Draw record" },
                    { num: "2", title: "Cup Differential", desc: "Cups won minus cups lost" },
                    { num: "3", title: "Median Buchholz (MB)", desc: "Sum of opponents' Swiss points (excl. best and worst)" },
                    { num: "4", title: "Opponents' Median Buchholz (OMB)", desc: "Sum of opponents' MB scores" }
                  ].map((item) => (
                    <div key={item.num} className="flex gap-3">
                      <div className={` text-blue-white border border-white  w-5 h-5 mt-1 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0`}>
                        {item.num}
                      </div>
                      <div>
                        <div className=" text-white text-sm">{item.title}</div>
                        <div className="text-xs text-blue-50">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:flex-1">
            <SwissIllustration />
          </div>
        </div>

        {/* Transition Arrow */}
        <div className="flex justify-center">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-1 h-16 bg-gradient-to-b from-blue-500 to-red-500 rounded-full"></div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                <ArrowDown className="w-5 h-5 text-red-500" />
              </div>
            </div>
            
            <span className="text-sm font-semibold text-gray-800">
              Top <span className="text-red-600 font-bold">64</span> teams advance
            </span>

            <div className="relative">
              <div className="w-1 h-16 bg-gradient-to-b from-blue-500 to-red-500 rounded-full"></div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                <ArrowDown className="w-5 h-5 text-red-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Playoff Phase */}
        <div className="flex flex-col lg:flex-row lg:gap-6 lg:items-start">
          <div className="lg:flex-1">
            <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl p-3 lg:p-6 mb-3 lg:mb-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white text-red-600 w-10 h-10 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Playoff Bracket</h3>
                  <p className="text-red-100 text-sm">Top 64 teams • Single elimination</p>
                </div>
              </div>
              
              <div className="space-y-1 text-red-50 text-sm">
                <div>- Single-elimination bracket</div>
                <div>- Seeded by Swiss results</div>
                <div className="ml-4">- #1 seed gets easiest path to finals</div>
                <div className="ml-4">- Top seeds avoid each other early</div>

                <div>- Win or go home</div>
                <div>- All games are best-of-1</div>
                <div className="flex items-center gap-2 border-t border-red-400 pt-2 mt-5">
                  <Euro className="font-semibold"/>
                  <div className="font-semibold">Cash prizes for Top 16</div>
                </div>
              </div>
              
            </div>
          </div>
          
          <div className="lg:flex-1">
            <BracketIllustration />
          </div>
        </div>
      </div>
    </div>
  )
}