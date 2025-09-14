'use client';

import { Match } from "@/lib/db";
import { useMemo, useState } from "react";

export function SwissBracket({ matches }: { matches: Match[] }) {
  const rounds = useMemo(() => {
    return matches.reduce((acc, match) => {
      if (!acc[match.roundNumber]) {
        acc[match.roundNumber] = [];
      }
      acc[match.roundNumber].push(match);
      return acc;
    }, {} as Record<number, Match[]>);
  }, [matches]);

  const sortedRounds = useMemo(() => Object.keys(rounds).map(Number).sort((a, b) => a - b), [rounds]);
  const latestRound = sortedRounds[sortedRounds.length - 1];

  const [hiddenRounds, setHiddenRounds] = useState<Set<number>>(() => {
    const initialHidden = new Set<number>();
    sortedRounds.forEach(r => {
      if (r !== latestRound) {
        initialHidden.add(r);
      }
    });
    return initialHidden;
  });

  const toggleRound = (round: number) => {
    setHiddenRounds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(round)) {
        newSet.delete(round);
      } else {
        newSet.add(round);
      }
      return newSet;
    });
  };
  
  return (
    <div className="space-y-4">
      {sortedRounds.map(roundNumber => {
        const isHidden = hiddenRounds.has(roundNumber);
        const roundMatches = rounds[roundNumber].sort((a, b) => a.matchNumber - b.matchNumber);
        const activeMatches = roundMatches.filter(m => m.status === 'in_progress').length;
        const completedMatches = roundMatches.filter(m => m.status === 'completed').length;
        
        return (
          <div key={roundNumber} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <button
              onClick={() => toggleRound(roundNumber)}
              className="w-full px-4 py-3 md:px-6 md:py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-900">Round {roundNumber}</h3>
                <div className="flex items-center gap-2 text-sm">
                  {activeMatches > 0 && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {activeMatches} active
                    </span>
                  )}
                  <span className="text-gray-500">
                    {completedMatches}/{roundMatches.length} completed
                  </span>
                </div>
              </div>
              <svg 
                className={`w-5 h-5 text-gray-500 transition-transform ${isHidden ? '' : 'rotate-180'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {!isHidden && (
              <div className="p-4 md:p-6">
                <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                  {roundMatches.map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function MatchCard({ match }: { match: Match }) {
  const isTeam1Winner = match.winnerId === match.team1Id;
  const isTeam2Winner = match.winnerId === match.team2Id;
  const isDraw = match.status === 'completed' && !match.winnerId && match.team1Score === match.team2Score;

  const AMOUNT_OF_TABLES = 16;
  const turnNumber = Math.floor((match.matchNumber - 1) / AMOUNT_OF_TABLES) + 1;
  const tableNumber = ((match.matchNumber - 1) % AMOUNT_OF_TABLES) + 1;

  return (
    <div className={`
      border rounded-lg px-3 py-2 md:p-4 transition-all
      ${match.status === 'completed' ? 'bg-gray-50 border-gray-300' : 'bg-white border-gray-200'}
      ${match.status === 'in_progress' ? 'border-blue-400 shadow-md ring-2 ring-blue-200' : ''}
    `}>
      {/* Match Number (Table Number) */}
      <div className="flex items-center justify-between mb-2 md:mb-3">
        <span className="text-xs font-medium text-gray-500 uppercase">Table {tableNumber} {turnNumber>1 && <span className="ml-1">(Turn {turnNumber})</span>}</span>
        <span className={`
          text-xs px-2 py-1 rounded-full font-medium
          ${match.status === 'completed' ? 'bg-gray-200 text-gray-700' : ''}
          ${match.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : ''}
          ${match.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
        `}>
          {match.status === 'completed' && 'Completed'}
          {match.status === 'in_progress' && 'In Progress'}
          {match.status === 'pending' && 'Upcoming'}
        </span>
      </div>

      <div className="space-y-1 md:space-y-2">
        {/* Team 1 */}
        <div className={`
          flex justify-between items-center px-3 py-1 md:p-3 rounded-lg transition-colors
          ${isTeam1Winner ? 'bg-green-100 font-semibold' : 'bg-gray-100'}
          ${isDraw ? 'bg-yellow-50' : ''}
        `}>
          <span className="text-sm truncate mr-2">
            {match.team1?.name || 'BYE'}
          </span>
          <span className={`text-lg font-bold ${isTeam1Winner ? 'text-green-700' : ''}`}>
            {match.team1Score !== null ? match.team1Score : '-'}
          </span>
        </div>

        {/* Team 2 */}
        <div className={`
          flex justify-between items-center px-3 py-1 md:p-3 rounded-lg transition-colors
          ${isTeam2Winner ? 'bg-green-100 font-semibold' : 'bg-gray-100'}
          ${isDraw ? 'bg-yellow-50' : ''}
        `}>
          <span className="text-sm truncate mr-2">
            {match.team2?.name || 'BYE'}
          </span>
          <span className={`text-lg font-bold ${isTeam2Winner ? 'text-green-700' : ''}`}>
            {match.team2Score !== null ? match.team2Score : '-'}
          </span>
        </div>
      </div>
    </div>
  );
}