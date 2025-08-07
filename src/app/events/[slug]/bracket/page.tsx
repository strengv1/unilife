'use client';

import { useState, useEffect } from 'react';
import { SwissBracket } from '../components/SwissBracket';
import { EliminationBracket } from '../components/EliminationBracket';
import { TeamStandings } from '../components/TeamStandings';
import { Match, TeamWithBuchholz, Tournament } from '@/app/lib/db';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function BracketPage() {
  const params = useParams();
  
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [standings, setStandings] = useState<TeamWithBuchholz[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [activeTab, setActiveTab] = useState('standings');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const [tournamentRes, standingsRes, matchesRes] = await Promise.all([
        fetch(`/api/tournaments/${params.slug}`),
        fetch(`/api/tournaments/${params.slug}/standings`),
        fetch(`/api/tournaments/${params.slug}/matches`),
      ]);
  
      if (tournamentRes.status === 404) {
        throw new Error('NOT_FOUND');
      } else if (!tournamentRes.ok) {
        const err = await tournamentRes.json();
        throw new Error(err.error || 'Failed to fetch tournament');
      }
  
      if (!standingsRes.ok) {
        const err = await standingsRes.json();
        throw new Error(err.error || 'Failed to fetch standings');
      }
  
      if (!matchesRes.ok) {
        const err = await matchesRes.json();
        throw new Error(err.error || 'Failed to fetch matches');
      }
  
      const tournamentData = await tournamentRes.json();
      const standingsData = await standingsRes.json();
      const matchesData = await matchesRes.json();

      setTournament(tournamentData);
      setStandings(standingsData);
      setMatches(matchesData);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Error fetching data:', err);
      if (err instanceof Error) {
        if (err.message === 'NOT_FOUND') {
          setError('Tournament not found');
        } else {
          setError(err.message);
        }
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug]);
  
  if (error === 'Tournament not found') {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Tournament Not Found</h1>
        <p className="mb-4">The tournament you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link href="/" className="text-blue-600 hover:underline">Go back home</Link>
      </div>
    );
  }

  if (!tournament) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="mb-4">{error}</p>
        <button
          onClick={fetchData}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Retrying...' : 'Retry'}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg md:text-2xl font-bold truncate mr-2">{tournament.name}</h1>
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loading ? 'Updating' : 'Refresh'}
            </button>
          </div>
          {lastUpdated && (
            <p className="text-xs text-gray-500 mt-1">Updated: {lastUpdated}</p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-[60px] md:top-[76px] z-30">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            <button
              className={`pb-3 pt-3 px-4 whitespace-nowrap text-sm md:text-base font-medium transition-colors ${
                activeTab === 'standings' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('standings')}
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
              disabled={!(tournament.status === 'elimination' || tournament.status === 'completed')}
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