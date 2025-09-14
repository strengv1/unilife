import Link from 'next/link';
import { Suspense } from 'react';
import { CachedClient } from './CachedClient';
import {
  getTournamentBySlugAction,
  getStandingsAction,
  fetchMatchesAction
} from '@/lib/actions/tournament-actions';
import { getComments } from '@/lib/actions/comment-actions';

function TournamentNotFound() {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Tournament Not Found</h1>
      <p className="mb-4">The tournament you&apos;re looking for doesn&apos;t exist or has been removed.</p>
      <Link href="/" className="text-blue-600 hover:underline">Go back home</Link>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 h-[76px] z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
            <div className="h-9 bg-gray-200 rounded animate-pulse w-20"></div>
          </div>
        </div>
      </div>
      <div className="bg-white border-b sticky top-[76px] z-30">
        <div className="flex overflow-x-auto">
          {['Standings', 'Swiss', 'Elimination', 'Lobby'].map((tab, index) => (
            <div key={index} className="pb-3 pt-3 px-4">
              <div className="h-5 bg-gray-200 rounded animate-pulse w-16"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="container mx-auto px-4 py-4">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// This tells Next.js to cache this page for 5 minutes
export const revalidate = 300;

export default async function BracketPage() {

  // const { slug } = await params;
  const slug = 'battleroyale'
  
  try {
    const [tournamentResult, standingsResult, matchesResult] = await Promise.all([
      getTournamentBySlugAction(slug),
      getStandingsAction(slug),
      fetchMatchesAction(slug, 'all'),
    ]);

    // Handle tournament result
    if (tournamentResult.error === 'Tournament not found' || !tournamentResult.tournament) {
      return <TournamentNotFound />;
    }

    // Handle other errors
    if (standingsResult.error) {
      throw new Error(standingsResult.error);
    }
    if (matchesResult.error) {
      throw new Error(matchesResult.error);
    }

    const tournament = tournamentResult.tournament;
    const standings = standingsResult.standings || [];
    const matches = matchesResult.matches || [];

    // Fetch comments with pagination and stats
    const commentsPerPage = 20;
    const pageNumber = 1;
    const commentsResult = await getComments(tournament.id, pageNumber, commentsPerPage);

    const lastUpdated = new Date().toLocaleTimeString('fi-FI', {
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'Europe/Helsinki'
    });
    
    return (
      <Suspense fallback={<LoadingFallback />}>
        <CachedClient
          tournament={tournament}
          standings={standings}
          matches={matches}
          comments={commentsResult.comments}
          commentStats={commentsResult.stats}
          lastUpdated={lastUpdated}
        />
      </Suspense>
    );
  } catch (error) {
    console.error('Error fetching tournament data:', error);
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="mb-4">
          {error instanceof Error ? error.message : 'An unknown error occurred.'}
        </p>
        <Link href="/" className="text-blue-600 hover:underline">
          Go back home
        </Link>
      </div>
    );
  }
}