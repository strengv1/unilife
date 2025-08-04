'use client';

import { useState, useEffect } from 'react';
import { CreateTournament } from './CreateTournament';
import { TournamentList } from './TournamentList';

export function TournamentManager() {
  const [tournaments, setTournaments] = useState([]);
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    setIsLoading(true);

    try {
      const res = await fetch('/api/tournaments');
      if (res.ok) {
        const data = await res.json();
        setTournaments(data);
      }
    } catch (error) {
      console.error('Error: ' + (error instanceof Error ? error.message : 'Internal Server Error'))
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
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
            >
              Create New
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'list' ? (
        <TournamentList tournaments={tournaments} onRefresh={fetchTournaments} isLoading={isLoading}/>
      ) : (
        <CreateTournament onSuccess={() => {
          fetchTournaments();
          setActiveTab('list');
        }} />
      )}
    </div>
  );
}