import Link from 'next/link';
import { TournamentManageClient } from './TournamentManageClient';
import { 
  getTournamentBySlugAction,
  getTeamsByTournamentSlugAction 
} from '@/lib/actions/tournament-actions';

interface TournamentManagePageProps {
  params: Promise<{
    slug: string;
  }>;
}

function TournamentNotFound (){
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-screen-lg">
        <div className="mb-6">
          <Link href="/admin" className="text-blue-500 hover:underline">
            ← Back to Admin
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Tournament Not Found</h1>
          <p className="mb-4">The tournament you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/admin" className="text-blue-600 hover:underline">Go back to Admin</Link>
        </div>
      </div>
    </div>
  )
}

export default async function TournamentManagePage({ params }: TournamentManagePageProps) {
  const { slug } = await params;
  
  try {
    const [tournamentResult, teamsResult] = await Promise.all([
      getTournamentBySlugAction(slug),
      getTeamsByTournamentSlugAction(slug)
    ]);

    // Handle tournament result
    if (tournamentResult.error === 'Tournament not found' || !tournamentResult.tournament) {
      return (
        <TournamentNotFound />
      );
    }

    // Handle teams result
    if (teamsResult.error) {
      throw new Error(teamsResult.error);
    }

    const tournament = tournamentResult.tournament;
    const teams = teamsResult.teams || [];

    return (
      <TournamentManageClient 
        tournament={tournament}
        teams={teams}
        slug={slug}
      />
    );
  } catch (error) {
    console.error('Error fetching tournament data:', error);
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-screen-lg">
          <div className="mb-6">
            <Link href="/admin" className="text-blue-500 hover:underline">
              ← Back to Admin
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="mb-4">
              {error instanceof Error ? error.message : 'An unknown error occurred.'}
            </p>
            <Link href="/admin" className="text-blue-600 hover:underline">
              Go back to Admin
            </Link>
          </div>
        </div>
      </div>
    );
  }
}