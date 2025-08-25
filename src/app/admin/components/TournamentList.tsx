'use client';

import { Tournament } from '@/app/lib/db';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useTransition } from 'react';
import { startTournamentAction } from '@/app/lib/actions/tournament-actions';

interface TournamentListProps {
  tournaments: Tournament[];
  onRefresh: () => void;
  isLoading: boolean;
}

export function TournamentList({ tournaments, onRefresh, isLoading }: TournamentListProps) {
  const [isPending, startTransition] = useTransition();

  const handleStartTournament = async (slug: string) => {
    if (!confirm('Start the Swiss rounds? This will generate the first round pairings.')) {
      return;
    }

    startTransition(async () => {
      const result = await startTournamentAction(slug);
      
      if (result.error) {
        alert(`Failed to start tournament: ${result.error}`);
      } else {
        alert('Tournament started! First round pairings generated.');
        onRefresh();
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">Loading tournament list..</div>
    )
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {tournaments.map((tournament) => (
          <li key={tournament.id}>
            <div className="px-3 py-4 sm:px-6">
              {/* Tournament Info */}
              <div className="mb-4">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">
                  {tournament.name}
                </h3>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Type: {tournament.type.replace('_', ' + ')} | Status: {tournament.status}</p>
                  {tournament.createdAt && (
                    <p className="text-xs text-gray-400">
                      Created: {new Date(tournament.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Mobile-First Button Layout */}
              <div className="space-y-2 sm:space-y-0 sm:flex sm:flex-wrap sm:gap-2">
                {/* Primary Actions - Full width on mobile */}
                <div className="flex flex-col sm:flex-row gap-2 sm:flex-1">
                  <a
                    href={`/events/${tournament.slug}/bracket`}
                    className="flex items-center justify-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Bracket 
                    <ExternalLink className="ml-2 w-4 h-4 flex-shrink-0" />
                  </a>
                  
                  <a
                    href={`/events/${tournament.slug}/bracket/admin`}
                    className="flex items-center justify-center px-3 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Score Reporter
                  </a>
                </div>

                {/* Secondary Actions */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href={`/admin/tournaments/${tournament.slug}`}
                    className="flex items-center justify-center px-3 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                  >
                    Manage
                  </a>
                  
                  {tournament.status === 'registration' && (
                    <button
                      onClick={() => handleStartTournament(tournament.slug)}
                      disabled={isPending}
                      className="flex items-center justify-center px-3 py-2 text-sm bg-yellow-500 text-white rounded-md
                      hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      {isPending ? 'Starting...' : 'Start Tournament'}
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
          <p className="text-base">No tournaments yet.</p>
          <p className="text-sm mt-1">Create one to get started!</p>
        </div>
      )}
    </div>
  );
}