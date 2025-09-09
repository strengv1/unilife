import Link from 'next/link';
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

// This tells Next.js to cache this page for 60 seconds
export const revalidate = 60;

// Force static generation and avoid dynamic rendering
export const dynamic = 'force-static';

export default async function BracketPage({ params }: BracketPageProps) {
  const { slug } = await params;
 
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