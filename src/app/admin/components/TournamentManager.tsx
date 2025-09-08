'use client';

import { useState, useTransition } from 'react';
import { CreateTournament } from './CreateTournament';
import { TournamentList } from './TournamentList';
import { getTournamentsAction } from '@/app/lib/actions/tournament-actions';
import { Tournament } from '@/app/lib/db';

interface TournamentManagerProps {
  initialTournaments: Tournament[];
  initialError?: string;
}

export function TournamentManager({ initialTournaments, initialError }: TournamentManagerProps) {
  const [tournaments, setTournaments] = useState<Tournament[]>(initialTournaments);
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [error, setError] = useState(initialError || '');
  const [isPending, startTransition] = useTransition();

  const refreshTournaments = () => {
    setError('');
    
    startTransition(async () => {
      try {
        const result = await getTournamentsAction();
        
        if (result.error) {
          setError(result.error);
        } else {
          setTournaments(result.tournaments || []);
          setError('');
        }
      } catch (error) {
        console.error('Error refreshing tournaments:', error);
        setError('Failed to refresh tournaments');
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Error display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('list')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'list'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              disabled={isPending}
            >
              Tournaments
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'create'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              disabled={isPending}
            >
              Create New
            </button>
          </nav>
        </div>
      </div>
      
      {activeTab === 'list' ? (
        <TournamentList
          tournaments={tournaments}
          onRefresh={refreshTournaments}
          isLoading={isPending}
        />
      ) : (
        <CreateTournament onSuccess={() => {
          refreshTournaments();
          setActiveTab('list');
        }} />
      )}
    </div>
  );
}