import { ArrowDown, Target, ArrowRight, Zap, Crown } from "lucide-react"

export default function TournamentStructure() {
  const SwissIllustration = () => (
    <div className="bg-white rounded-xl p-3 lg:p-6 border-2 border-blue-200 shadow-sm">
      <div className="text-center mb-4">
        <h5 className="font-bold text-gray-800 mb-2">Swiss Pairing Example</h5>
        <p className="text-sm text-gray-600 bg-gray-100 rounded-full px-3 py-1 inline-block">After Round 2</p>
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
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600 bg-blue-50 rounded-lg px-3 py-2">
          <Target className="inline w-4 h-4 mr-2" />
          Similar records face each other
        </p>
      </div>
    </div>
  )

  const BracketIllustration = () => (
    <div className="bg-white rounded-xl p-4 lg:p-6 border-2 border-red-200 shadow-sm">
      <div className="text-center mb-2 lg:mb-4">
        <h5 className="font-bold text-gray-800 lg:mb-2">Single Elimination Playoff Bracket</h5>
      </div>
      
      {/* Bracket visualization */}
      <div className="flex items-center justify-center gap-1 sm:gap-4 text-sm">
        <div className="text-center">
          <div className="text-gray-600 mb-2 font-medium">Top 64</div>
          <div className="space-y-1">
            {[1,64, 32, 33].map(i => (
              <div key={i} className="px-1 h-6 bg-gradient-to-r from-red-100 to-red-200 rounded-lg flex items-center justify-center text-xs font-medium border border-red-300">
                Seed #{i}
              </div>
            ))}
            <div className="text-gray-400 text-xs">⋮</div>
            {[2, 63].map(i => (
              <div key={i} className="px-1 h-6 bg-gradient-to-r from-red-100 to-red-200 rounded-lg flex items-center justify-center text-xs font-medium border border-red-300">
                Seed #{i}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col items-center text-gray-400">
          <ArrowRight className="w-5 h-5" />
        </div>
        
        <div className="text-center">
          <div className="text-gray-600 mb-2 font-medium">Top 32</div>
          <div className="space-y-1">
            {[1,2].map(i => (
              <div key={i} className="h-6 px-1 bg-gradient-to-r from-red-200 to-red-300 rounded-lg flex items-center justify-center text-xs font-medium border border-red-400">
                Winner
              </div>
            ))}
            <div className="text-gray-400 text-xs">⋮</div>
            <div className="h-6 px-1 bg-gradient-to-r from-red-200 to-red-300 rounded-lg flex items-center justify-center text-xs font-medium border border-red-400">
              Winner
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center text-gray-400">
          <ArrowRight className="w-5 h-5" />
        </div>

        <div className="flex flex-col items-center text-gray-400">
          <div className="text-xs">...</div>
        </div>

        <div className="flex flex-col items-center text-gray-400">
          <ArrowRight className="w-5 h-5" />
        </div>

        <div className="text-center">
          <div className="text-gray-600 mb-2 font-medium">Finals</div>
          <div className="h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center text-sm font-bold border-2 border-yellow-600 shadow-md">
            <Crown className="w-4 h-4" />
          </div>
        </div>
      </div>
      
      <div className="text-center mt-4 lg:mt-5">
        <p className="text-sm text-gray-600 bg-red-50 rounded-lg px-3 py-2">
          <Zap className="inline w-4 h-4 mr-2" />
          Best Swiss teams get best bracket positions
        </p>
      </div>
    </div>
  )

  return (
    <div className="mx-auto bg-white">
      {/* Header */}
      <div className="mb-4 lg:mb-6">
        <h2 className="text-xl lg:text-3xl font-bold text-gray-900 mb-2">Tournament consists of two phases:</h2>
        <p className="text-md lg:text-xl text-gray-600">
          <strong>Swiss preliminaries</strong> followed by <strong>single-elimination playoffs</strong>
        </p>
      </div>

      {/* Two main phases */}
      <div className="flex flex-col lg:flex-row gap-6 mb-4 lg:mb-6">
        {/* Swiss Phase */}
        <div className="flex-1">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-3 lg:p-6 mb-3 lg:mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white text-blue-600 w-10 h-10 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold">1</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Swiss Preliminaries</h3>
                <p className="text-blue-100 text-sm">6 rounds • All teams play</p>
              </div>
            </div>
            
            <div className="space-y-2 text-blue-50 text-sm">
              <div>- Teams paired by similar records</div>
              <div>- No rematches allowed</div>
              <div>- Win = 3pts, Draw = 1pt, Loss = 0pts</div>
              <div>- Best-of-1 format</div>
            </div>
          </div>
          
          <SwissIllustration />
        </div>

        <div className="lg:hidden w-full flex justify-center text-gray-600 ">
          <ArrowDown />
        </div>
        {/* Playoff Phase */}
        <div className="flex-1">
          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl p-3 lg:p-6 mb-3 lg:mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white text-red-600 w-10 h-10 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold">2</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Playoff Bracket</h3>
                <p className="text-red-100 text-sm">Top 64 teams • Single elimination</p>
              </div>
            </div>
            
            <div className="space-y-2 text-red-50 text-sm">
              <div>- Single-elimination bracket</div>
              <div>- Seeded by Swiss results</div>
              <div>- Win or go home</div>
              <div>- All games are best-of-1</div>
            </div>
          </div>
          
          <BracketIllustration />
        </div>
      </div>

      {/* Ranking system */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Swiss Ranking System</h3>
        <p className="text-gray-600 text-sm mb-4">Tiebreakers used to rank teams after 6 rounds:</p>
        
        <div className="grid md:grid-cols-2 gap-3">
          {[
            { num: "1", title: "Total Points", desc: "Win-Loss-Draw record", color: "bg-green-700" },
            { num: "2", title: "Cup Differential", desc: "Cups won minus cups lost", color: "bg-green-600" },
            { num: "3", title: "Median Buccholz (MB)", desc: "Sum of opponents' Swiss points (excl. best and worst)", color: "bg-green-500" },
            { num: "4", title: "Opponents' Median Buccholz (OMB)", desc: "Sum of opponents' MB scores", color: "bg-green-400" }
          ].map((item) => (
            <div key={item.num} className="flex gap-3">
              <div className={`${item.color} text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0`}>
                {item.num}
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">{item.title}</div>
                <div className="text-xs text-gray-600">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}