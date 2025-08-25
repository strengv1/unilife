'use client';

import { useEffect, useState, useTransition } from 'react';
import { SwissBracket } from '../components/SwissBracket';
import { EliminationBracket } from '../components/EliminationBracket';
import { TeamStandings } from '../components/TeamStandings';
import { Match, TeamWithBuchholz, Tournament } from '@/app/lib/db';
import { 
  getStandingsAction,
  fetchMatchesAction 
} from '@/app/lib/actions/tournament-actions';

interface BracketClientProps {
  tournament: Tournament;
  standings: TeamWithBuchholz[];
  matches: Match[];
}

export function BracketClient({ 
  tournament: initialTournament, 
  standings: initialStandings, 
  matches: initialMatches 
}: BracketClientProps) {
  const [tournament] = useState(initialTournament); // Tournament rarely changes
  const [standings, setStandings] = useState(initialStandings);
  const [matches, setMatches] = useState(initialMatches);
  const [activeTab, setActiveTab] = useState('standings');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setLastUpdated(new Date().toLocaleTimeString())
  }, [])

  const refreshData = async () => {
    startTransition(async () => {
      try {
        const [standingsResult, matchesResult] = await Promise.all([
          getStandingsAction(tournament.slug),
          fetchMatchesAction(tournament.slug, 'all'),
        ]);

        if (!standingsResult.error) {
          setStandings(standingsResult.standings || []);
        }
        if (!matchesResult.error) {
          setMatches(matchesResult.matches || []);
        }
        
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (error) {
        console.error('Error refreshing data:', error);
        // Could show a toast notification here
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 h-[76px] z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg md:text-2xl font-bold truncate mr-2">{tournament.name}</h1>
            <button
              onClick={refreshData}
              disabled={isPending}
              className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
            >
              <svg className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isPending ? 'Updating' : 'Refresh'}
            </button>
          </div>
          {lastUpdated && !isPending ?
            <p className="text-xs text-gray-500 mt-1">Updated: {lastUpdated}</p>
          :
            <div className="text-xs text-gray-500 mt-1 flex items-center">Updated: <div className="w-12 h-4 bg-gray-200 rounded-full animate-pulse"></div></div>
          }
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-[76px] z-30">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            <button
              className={`pb-3 pt-3 px-4 whitespace-nowrap text-sm md:text-base font-medium transition-colors ${
                activeTab === 'standings' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('standings')}
              disabled={isPending}
            >
              Standings
            </button>
            {tournament.status !== 'registration' && (
              <button
                className={`pb-3 pt-3 px-4 whitespace-nowrap text-sm md:text-base font-medium transition-colors ${
                  activeTab === 'swiss' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('swiss')}
                disabled={isPending}
              >
                Swiss Rounds
              </button>
            )}
            <button
              className={`pb-3 pt-3 px-4 whitespace-nowrap text-sm md:text-base font-medium transition-colors ${
                activeTab === 'elimination' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : tournament.status === 'elimination' || tournament.status === 'completed'
                    ? 'text-gray-600 hover:text-gray-900'
                    : 'text-gray-400 cursor-not-allowed'
              }`}
              onClick={() => setActiveTab('elimination')}
              disabled={!(tournament.status === 'elimination' || tournament.status === 'completed') || isPending}
            >
              Elimination
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto">
        {activeTab === 'standings' && (
          <TeamStandings 
            standings={standings}
            showElimination={tournament.status === 'elimination' || tournament.status === 'completed'}
          />
        )}
        {activeTab === 'swiss' && (
          <SwissBracket matches={matches.filter(m => m.phase === 'swiss')} />
        )}
        {activeTab === 'elimination' && (
          <EliminationBracket matches={matches.filter(m => m.phase === 'elimination')} />
        )}
      </div>
    </div>
  );
}