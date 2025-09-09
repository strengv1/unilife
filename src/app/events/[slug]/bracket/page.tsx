import Link from 'next/link';
import { unstable_cache } from 'next/cache';
import { BracketClient } from './BracketClient';
import {
  getTournamentBySlugAction,
  getStandingsAction,
  fetchMatchesAction
} from '@/lib/actions/tournament-actions';
import { getComments } from '@/lib/actions/comment-actions';

interface BracketPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function TournamentNotFound() {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Tournament Not Found</h1>
      <p className="mb-4">The tournament you&apos;re looking for doesn&apos;t exist or has been removed.</p>
      <Link href="/" className="text-blue-600 hover:underline">Go back home</Link>
    </div>
  );
}

// Create cached versions of your server actions
const getCachedTournament = unstable_cache(
  async (slug: string) => getTournamentBySlugAction(slug),
  ['tournament-by-slug'],
  { 
    revalidate: 60,
    tags: ['tournament']
  }
);

const getCachedStandings = unstable_cache(
  async (slug: string) => getStandingsAction(slug),
  ['standings-by-slug'],
  { 
    revalidate: 60,
    tags: ['standings']
  }
);

const getCachedMatches = unstable_cache(
  async (slug: string) => fetchMatchesAction(slug, 'all'),
  ['matches-by-slug'],
  { 
    revalidate: 60,
    tags: ['matches']
  }
);

const getCachedComments = unstable_cache(
  async (tournamentId: number, pageNumber: number, commentsPerPage: number) => 
    getComments(tournamentId, pageNumber, commentsPerPage),
  ['comments'],
  { 
    revalidate: 10, // Comments might need faster updates
    tags: ['comments']
  }
);

export const revalidate = 60;

export default async function BracketPage({ params }: BracketPageProps) {
  const { slug } = await params;
 
  try {
    // Use cached versions instead of direct server actions
    const [tournamentResult, standingsResult, matchesResult] = await Promise.all([
      getCachedTournament(slug),
      getCachedStandings(slug),
      getCachedMatches(slug),
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
    const commentsResult = await getCachedComments(tournament.id, pageNumber, commentsPerPage);

    return (
      <BracketClient
        tournament={tournament}
        standings={standings}
        matches={matches}
        comments={commentsResult.comments}
        commentStats={commentsResult.stats}
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