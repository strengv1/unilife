import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BracketClient } from './BracketClient';
import { 
  getTournamentBySlugAction,
  getStandingsAction,
  fetchMatchesAction 
} from '@/app/lib/actions/tournament-actions';

interface BracketPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BracketPage({ params }: BracketPageProps) {
  const { slug } = await params;
  
  try {
    const [tournamentResult, standingsResult, matchesResult] = await Promise.all([
      getTournamentBySlugAction(slug),
      getStandingsAction(slug),
      fetchMatchesAction(slug, 'all'),
    ]);

    // Handle tournament result
    if (tournamentResult.error || !tournamentResult.tournament) {
      if (tournamentResult.error === 'Tournament not found') {
        notFound();
      }
      throw new Error(tournamentResult.error || 'Tournament not found');
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

    return (
      <BracketClient 
        tournament={tournament}
        standings={standings}
        matches={matches}
      />
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

// Create a not-found.tsx file in the same directory
export function NotFound() {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Tournament Not Found</h1>
      <p className="mb-4">The tournament you&apos;re looking for doesn&apos;t exist or has been removed.</p>
      <Link href="/" className="text-blue-600 hover:underline">Go back home</Link>
    </div>
  );
}