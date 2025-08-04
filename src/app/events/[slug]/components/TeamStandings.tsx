'use client';

import { useState } from "react";
import { TeamWithBuchholz } from "@/app/lib/db";
import { ChevronDown } from "lucide-react";
import TeamRowMobile from "./TeamStandingsMobileRow";

interface TeamStandingsProps {
  standings: TeamWithBuchholz[];
  showElimination?: boolean;
}

export function TeamStandings({
  standings = [],
  showElimination = false
}: TeamStandingsProps) {
  const [showBuchholzInfo, setShowBuchholzInfo] = useState(false);

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
        <div className="bg-blue-50 border-b border-blue-200 p-4">
          <h4 className="font-medium text-blue-900 mb-2">Tie-Breaking System</h4>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. <strong>Swiss Points:</strong> 3 for win, 1 for draw, 0 for loss</li>
            <li>2. <strong>Goal Difference:</strong> Cups scored minus cups conceded</li>
            <li>3. <strong>Median-Buchholz (MB):</strong> Sum of opponents&apos; points (excluding best and worst)</li>
            <li>4. <strong>Opponents&apos; Buchholz (OMB):</strong> Sum of all opponents&apos; MB scores</li>
          </ol>
        </div>
      )}

      {/* Mobile View */}
      <TeamRowMobile sortedTeams={sortedTeams} showElimination={showElimination} />

      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">W-D-L</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Cup Diff</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">MB</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">OMB</th>
              {showElimination && (
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedTeams.map((team, index) => {
              const pointDiff = (team.swissGamePointsFor || 0) - (team.swissGamePointsAgainst || 0);
              return (
                <tr 
                  key={team.id} 
                  className={team.qualifiedForElimination ? 'bg-green-50' : ''}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{team.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center font-semibold">{team.swissPoints}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {team.swissWins}-{team.swissDraws}-{team.swissLosses}
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