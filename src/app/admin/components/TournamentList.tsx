'use client';

import { Tournament } from '@/app/lib/db';
import Link from 'next/link';

interface TournamentListProps {
  tournaments: Tournament[];
  onRefresh: () => void;
  isLoading: boolean;
}

export function TournamentList({ tournaments, onRefresh, isLoading }: TournamentListProps) {
  
  const handleStartTournament = async (slug: string) => {
    if (!confirm('Start the Swiss rounds? This will generate the first round pairings.')) {
      return;
    }

    try {
      const res = await fetch(`/api/tournaments/${slug}/start`, {
        method: 'POST',
      });

      if (res.ok) {
        alert('Tournament started! First round pairings generated.');
        onRefresh();
      } else {
        alert('Failed to start tournament');
      }
    } catch (error) {
      alert('Error: ' + (error instanceof Error ? error.message : 'Internal Server Error'));
    }
  };

  if (isLoading){
    return (
      <div className="flex items-center justify-center">Loading tournament list.. </div>
    )
  }
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {tournaments.map((tournament) => (
          <li key={tournament.id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {tournament.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Type: {tournament.type.replace('_', ' + ')} | Status: {tournament.status}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {
                      tournament.createdAt &&
                        `Created: ${new Date(tournament.createdAt).toLocaleDateString()}`
                    }
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Link
                    href={`/events/${tournament.slug}/bracket`}
                    className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    target="_blank"
                  >
                    View Bracket
                  </Link>
                  <Link
                    href={`/events/${tournament.slug}/bracket/admin`}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Score Reporter
                  </Link>
                  <Link
                    href={`/admin/tournaments/${tournament.slug}`}
                    className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Manage
                  </Link>
                  {tournament.status === 'registration' && (
                    <button
                      onClick={() => handleStartTournament(tournament.slug)}
                      className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 cursor-pointer"
                    >
                      Start Tournament
                    </button>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {tournaments.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No tournaments yet. Create one to get started!
        </div>
      )}
    </div>
  );
}