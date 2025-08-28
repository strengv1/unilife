'use client';

import { useState } from "react";
import { StandingWithPosition } from "@/app/lib/db";
import { ChevronDown, Search, X } from "lucide-react";
import TeamRowMobile from "./TeamStandingsMobileRow";
import Link from "next/link";
import { useParams } from "next/navigation";

interface TeamStandingsProps {
  standings: StandingWithPosition[];
  showElimination?: boolean;
}

export function TeamStandings({
  standings = [],
  showElimination = false
}: TeamStandingsProps) {
  const [showBuchholzInfo, setShowBuchholzInfo] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const params = useParams();
  const tournamentSlug = params.slug as string;
  
  const clearSearch = () => setSearchTerm("")

  const sortedTeams = [...standings].sort((a, b) => {
    // 1. Swiss Points
    if (b.swissPoints !== a.swissPoints) return (b.swissPoints || 0) - (a.swissPoints || 0);
    
    // 2. Goal Difference
    const aDiff = (a.swissGamePointsFor || 0) - (a.swissGamePointsAgainst || 0);
    const bDiff = (b.swissGamePointsFor || 0) - (b.swissGamePointsAgainst || 0);
    if (bDiff !== aDiff) return bDiff - aDiff;
    
    // 3. Median-Buchholz Score
    if (b.buchholzScore !== a.buchholzScore) {
      return (b.buchholzScore || 0) - (a.buchholzScore || 0);
    }
    
    // 4. Opponents' Buchholz Score
    return (b.opponentsBuchholzScore || 0) - (a.opponentsBuchholzScore || 0);
  });

  const filteredTeams = sortedTeams.filter((team) => team.name.toLowerCase().startsWith(searchTerm.toLowerCase().trim()))

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Buchholz Info Toggle */}
      <button
        onClick={() => setShowBuchholzInfo(!showBuchholzInfo)}
        className="group
          w-full flex items-center justify-between px-4 py-3
          bg-gray-50 border-b hover:bg-gray-100
        "
      >
        <div
          className="text-sm text-blue-600 group-hover:text-blue-800"
        >
          {showBuchholzInfo ? 'Hide' : 'Show'} Tie-Breaking Info
        </div>
        <ChevronDown className={`transition-transform ${showBuchholzInfo ? 'rotate-180' : 'rotate-0'}`}/>
      </button>

      {/* Buchholz Explanation */}
      {showBuchholzInfo && (
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="text-sm text-gray-700 space-y-2">
            <p>Teams are ranked using the following tie-breaking system:</p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li><strong>Swiss Points:</strong> 3 for win, 1 for draw, 0 for loss</li>
              <li><strong>Cup Difference:</strong> Cups scored minus cups conceded</li>
              <li><strong>Median-Buchholz (MB):</strong> Sum of opponents&apos; Swiss points (excluding best and worst if 3+ opponents)</li>
              <li><strong>Opponents&apos; Buchholz (OMB):</strong> Sum of opponents&apos; MB scores</li>
            </ol>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">
                <strong>Note:</strong> Median-Buchholz helps differentiate between teams with the same points by considering the strength of their opponents. 
                A higher MB score indicates you played against stronger opponents overall.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Search Input */}
      <div className="p-4 border-b bg-gray-50">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search teams by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              text-sm"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>
        
        {/* Search Results Info */}
        {searchTerm.trim() && (
          <div className="mt-2 text-xs text-gray-600">
            Showing {filteredTeams.length} of {filteredTeams.length} teams
          </div>
        )}
      </div>
      
      {/* Mobile View */}
      <TeamRowMobile sortedTeams={filteredTeams} showElimination={showElimination} />

      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">W-L-D</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Cup Diff</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">MB</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">OMB</th>
              {showElimination && (
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTeams.map((team) => {
              const pointDiff = (team.swissGamePointsFor || 0) - (team.swissGamePointsAgainst || 0);
              return (
                <tr 
                  key={team.id} 
                  className={team.qualifiedForElimination ? 'bg-green-50' : ''}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{team.position}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <Link
                      href={`/events/${tournamentSlug}/team/${team.id}`}
                      className="text-blue-500"
                    >
                      {team.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center font-semibold">{team.swissPoints}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {team.swissWins}-{team.swissLosses}-{team.swissDraws}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span className={pointDiff > 0 ? 'text-green-600' : pointDiff < 0 ? 'text-red-600' : ''}>
                      {pointDiff > 0 ? '+' : ''}{pointDiff}
                    </span>
                    <span className="ml-2 text-gray-400">
                      ({team.swissGamePointsFor}:{team.swissGamePointsAgainst})
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {team.buchholzScore?.toFixed(1) || '0.0'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {team.opponentsBuchholzScore?.toFixed(1) || '0.0'}
                  </td>
                  {showElimination && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      {team.qualifiedForElimination ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Qualified #{team.seed}
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}