'use client';

import { Match } from '@/app/lib/db';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function ScoreReporter({ tournamentSlug }: { tournamentSlug: string }) {
  const [matches, setMatches] = useState<Match[] | null>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [team1Score, setTeam1Score] = useState('');
  const [team2Score, setTeam2Score] = useState('');
  const [filter, setFilter] = useState('pending');
  const [submitting, setSubmitting] = useState(false);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMatches();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournamentSlug, filter]);

  // Set the scores to existing scores when selecting a completed game
  useEffect(() => {
    if (selectedMatch && selectedMatch.status === 'completed') {
      setTeam1Score(selectedMatch.team1Score?.toString() || '');
      setTeam2Score(selectedMatch.team2Score?.toString() || '');
    } else {
      setTeam1Score('');
      setTeam2Score('');
    }
  }, [selectedMatch]);
  
  const fetchMatches = async () => {
    setLoadingMatches(true);
    try {
      const res = await fetch(`/api/tournaments/${tournamentSlug}/matches?status=${filter}`);
      if (res.status == 200) {
        const data = await res.json();
        setMatches(data);
      }
    } catch (error) {
      console.error('Failed to fetch matches:', error);
    } finally {
      setLoadingMatches(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMatch) {
      alert('Please select a match');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/tournaments/${tournamentSlug}/matches`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId: selectedMatch.id,
          team1Score: parseInt(team1Score),
          team2Score: parseInt(team2Score)
        }),
        credentials: 'include'
      });

      if (res.ok) {
        toast('Score Submitted', {
          description: (
            <>
              <span className="block text-gray-700">
                {selectedMatch.team1?.name} <strong>{team1Score}</strong> – <strong>{team2Score}</strong> {selectedMatch.team2?.name}
              </span>
              <span className="text-xs text-green-600">
                Winner: {parseInt(team1Score) < parseInt(team2Score) ?
                  selectedMatch.team2?.name :
                  selectedMatch.team1?.name}
              </span>
            </>
          ),
        });
        
        setSelectedMatch(null);
        setTeam1Score('');
        setTeam2Score('');
        fetchMatches();
      } else {
        const errorData = await res.json();
        alert(`Error reporting score: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting score:', error);
      alert('Error reporting score');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = async () => {
    if (!selectedMatch) return;
    
    if (!confirm('Are you sure you want to reset this match? This will remove the scores and may affect subsequent matches.')) {
      return;
    }

    const res = await fetch(`/api/tournaments/${tournamentSlug}/matches`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        matchId: selectedMatch.id,
        action: 'reset'
      }),
      credentials: 'include'
    });

    if (res.ok) {
      toast('Match reset successfully!');
      setSelectedMatch(null);
      setTeam1Score('');
      setTeam2Score('');
      fetchMatches();
    } else {
      const error = await res.json();
      alert('Error resetting match: ' + error.error);
    }
  };

  if (!matches) {
    return (
      <div className="flex min-h-screen items-center justify-center">Loading matches..</div>
    )
  }
    
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
        Score Reporter – Admin
      </h1>

      {/* Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-gray-700">
          Filter matches:
        </label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-64 p-2 border rounded-md"
        >
          <option value="pending">Not Played</option>
          <option value="completed">Completed</option>
          <option value="all">All Matches</option>
        </select>
      </div>

      {/* Main content: responsive grid */}
      <div className="flex flex-col md:grid md:grid-cols-2 md:gap-8 gap-8">
        {/* Match Selector */}
        <div className="order-2 md:order-1">
          <div className="flex mb-2 md:space-x-4 flex-col md:flex-row items-center">
            <h2 className="text-xl font-semibold text-center md:text-left">
              Select Match
            </h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by team name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pr-10 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          {loadingMatches ? (
            <div className="flex items-center justify-center">Loading matches..</div>
          ) : (
            <div className="space-y-2 md:max-h-[32rem] md:overflow-y-auto">
              {matches.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  No matches found for the selected filter
                </p>
              )}

              {matches
                .filter((match) => {
                  const term = searchTerm.toLowerCase();
                  const t1 = match.team1?.name?.toLowerCase() || '';
                  const t2 = match.team2?.name?.toLowerCase() || '';
                  return t1.includes(term) || t2.includes(term);
                })
                .map((match) => (
                  <div
                    key={match.id}
                    onClick={() => setSelectedMatch(match)}
                    className={`p-4 border rounded cursor-pointer hover:bg-gray-50 transition ${
                      selectedMatch?.id === match.id ? 'border-blue-500 bg-blue-50' : ''
                    }`}
                  >
                    <div className="font-semibold text-sm md:text-base">
                      {match.phase === 'swiss'
                        ? `Swiss Round ${match.roundNumber}`
                        : `Elimination ${match.bracketPosition || 'TBD'}`}
                    </div>
                    <div className="text-xs md:text-sm mt-1">
                      {match.team1?.name || 'TBD'} vs {match.team2?.name || 'TBD'}
                    </div>
                    <div className="mt-2 text-xs text-gray-500 flex flex-wrap items-center justify-between">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          match.status === 'completed'
                            ? 'bg-gray-200 text-gray-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {match.status === 'completed' ? 'Completed' : 'Not Played'}
                      </span>
                      {match.team1Score != null && match.team2Score != null && (
                        <span className="text-gray-600">
                          {match.team1Score} - {match.team2Score}
                        </span>
                      )}
                    </div>
                  </div>
              ))}
            </div>
          )}
        </div>

        {/* Score Form */}
        <div className="order-1 md:order-2">
          <h2 className="text-xl font-semibold mb-4 text-center md:text-left">
            Report Score
          </h2>

          {selectedMatch ? (
            <form
              onSubmit={handleSubmit}
              className="bg-gray-50 p-6 rounded-lg space-y-4"
            >
              <h3 className="font-medium text-sm text-gray-700">
                {selectedMatch.phase === 'swiss'
                  ? `Swiss Round ${selectedMatch.roundNumber}`
                  : `Elimination ${selectedMatch.bracketPosition}`}
              </h3>

              <div>
                <label className="block mb-1 font-medium text-gray-800">
                  {selectedMatch.team1?.name || 'Team 1 (TBD)'}
                </label>
                <input
                  type="number"
                  value={team1Score}
                  onChange={(e) => setTeam1Score(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  min="0"
                  max="10"
                  placeholder="Enter score"
                  required
                  disabled={!selectedMatch.team1}
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-800">
                  {selectedMatch.team2?.name || 'Team 2 (TBD)'}
                </label>
                <input
                  type="number"
                  value={team2Score}
                  onChange={(e) => setTeam2Score(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  min="0"
                  max="10"
                  placeholder="Enter score"
                  required
                  disabled={!selectedMatch.team2}
                />
              </div>

              {(!selectedMatch.team1 || !selectedMatch.team2) && (
                <p className="text-sm text-gray-600 text-center">
                  This match cannot be scored yet as one or both teams are not determined.
                </p>
              )}

              <div className="flex flex-col md:flex-row gap-2">
                <button
                  type="submit"
                  className="
                    flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 cursor-pointer
                    disabled:cursor-not-allowed disabled:bg-gray-400
                  "
                  disabled={submitting || !selectedMatch.team1 || !selectedMatch.team2}
                >
                  {submitting
                    ? 'Submitting...'
                    : selectedMatch.status === 'completed'
                    ? 'Edit Score'
                    : 'Submit Score'}
                </button>

                {selectedMatch.status === 'completed' && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                  >
                    Reset Match
                  </button>
                )}
              </div>
            </form>
          ) : (
            <div className="bg-gray-50 p-6 rounded text-center text-gray-600">
              <p className="mb-2">Select a match to report score</p>
              <p className="text-sm text-gray-400">Choose a match from the list</p>
            </div>
          )}
        </div>
      </div>

      {/* Links */}
      <div className="mt-10 flex flex-col md:flex-row gap-4 justify-center md:justify-start">
        <Link
          href={`/events/${tournamentSlug}/bracket`}
          className="flex items-center text-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          target="_blank"
        >
          View Public Bracket <ExternalLink className="ml-2 w-4 h-4" />
        </Link>
        <Link
          href={`/admin/tournaments/${tournamentSlug}`}
          className="text-center bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          Back to Admin
        </Link>
      </div>
    </div>
  );
}