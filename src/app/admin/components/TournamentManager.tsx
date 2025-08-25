'use client';

import { useState, useEffect, useTransition } from 'react';
import { CreateTournament } from './CreateTournament';
import { TournamentList } from './TournamentList';
import { getTournamentsAction } from '@/app/lib/actions/tournament-actions';
import { Tournament } from '@/app/lib/db';

export function TournamentManager() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    setIsLoading(true);
    setError('');
    
    startTransition(async () => {
      try {
        const result = await getTournamentsAction();
        
        if (result.error) {
          setError(result.error);
          setTournaments([]);
        } else {
          setTournaments(result.tournaments || []);
        }
      } catch (error) {
        console.error('Error fetching tournaments:', error);
        setError('Failed to fetch tournaments');
        setTournaments([]);
      } finally {
        setIsLoading(false);
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
          onRefresh={fetchTournaments} 
          isLoading={isLoading || isPending}
        />
      ) : (
        <CreateTournament onSuccess={() => {
          fetchTournaments();
          setActiveTab('list');
        }} />
      )}
    </div>
  );
}