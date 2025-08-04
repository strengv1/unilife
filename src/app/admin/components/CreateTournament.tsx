'use client';

import { useState } from 'react';
import { useTeamValidation } from '@/hooks/useTeamValidation';

interface CreateTournamentProps {
  onSuccess: () => void;
}

export function CreateTournament({ onSuccess }: CreateTournamentProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [type, setType] = useState('swiss_elimination');
  const [swissRounds, setSwissRounds] = useState(6);
  const [numberOfTeams, setNumberOfTeams] = useState(150);
  const [eliminationTeams, setEliminationTeams] = useState(32);
  const [teamsText, setTeamsText] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Initialize team validation (no existing teams for new tournament)
  const { validateMultipleTeams, getDuplicatesInfo } = useTeamValidation([]);

  const handleNameChange = (value: string) => {
    setName(value);
    const generatedSlug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setSlug(generatedSlug);
  };

  const handleTeamsTextChange = (value: string) => {
    setTeamsText(value);
    
    // Validate teams as user types
    if (value.trim()) {
      const teamNames = value.split('\n').filter(t => t.trim());
      const validation = validateMultipleTeams(teamNames);
      const errors = validation
        .filter(v => !v.isValid)
        .map(v => `${v.name || '(empty)'}: ${v.error}`);
      setValidationErrors(errors);
    } else {
      setValidationErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation before submit
    const teamNames = teamsText
      .split('\n')
      .map(t => t.trim())
      .filter(t => t.length > 0);
    
    if (teamNames.length > 0) {
      const validation = validateMultipleTeams(teamNames);
      const invalid = validation.filter(v => !v.isValid);
      
      if (invalid.length > 0) {
        alert('Please fix team name errors before submitting');
        return;
      }
    }

    setLoading(true);

    try {
      const isValidSlug = /^[a-z0-9-]+$/.test(slug);
      if (!isValidSlug) {
        alert("Invalid slug: only lowercase letters, digits, and hyphens allowed.");
        return;
      }

      // Create tournament
      const tournamentRes = await fetch('/api/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          type,
          swissRounds,
          eliminationTeams,
        }),
      });

      if (!tournamentRes.ok) {
        throw new Error('Failed to create tournament');
      }

      const tournament = await tournamentRes.json();

      // Add teams if provided
      for (const teamName of teamNames) {
        await fetch(`/api/tournaments/${tournament.slug}/teams`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: teamName }),
        });
      }

      alert('Tournament created successfully!');
      onSuccess();
    } catch (error) {
      alert('Error creating tournament: ' + (error instanceof Error ? error.message : 'Internal Server Error'));
    } finally {
      setLoading(false);
    }
  };

  const duplicatesInfo = getDuplicatesInfo(teamsText.split('\n'));

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tournament Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Beer Pong Battle Royale 2024"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL Slug
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="beer-pong-2024"
            // pattern="[a-z0-9-]+"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            URL will be: /events/{slug}/bracket
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tournament Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="swiss_elimination">Swiss + Elimination</option>
            <option value="single_elimination">Single Elimination Only (TODO)</option>
          </select>
        </div>

        {type === 'swiss_elimination' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Approx. Number of Teams
              </label>
              <input
                type="number"
                value={numberOfTeams}
                onChange={(e) => setNumberOfTeams(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Swiss Rounds
              </label>
              <input
                type="number"
                value={swissRounds}
                onChange={(e) => setSwissRounds(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="1"
                max="20"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Recommended Swiss Rounds for {numberOfTeams} teams: {Math.ceil(Math.log2(numberOfTeams))}
              </p>

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teams Advancing to Elimination
              </label>
              <select
                value={eliminationTeams}
                onChange={(e) => setEliminationTeams(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="8">Top 8</option>
                <option value="16">Top 16</option>
                <option value="32">Top 32</option>
                <option value="64">Top 64</option>
              </select>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Teams (one per line)
          </label>
          <textarea
            value={teamsText}
            onChange={(e) => handleTeamsTextChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${
              validationErrors.length > 0 ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={10}
            placeholder={`Team Alpha\nTeam Bravo\nTeam Charlie\n...`}
          />
          
          {/* Team count info */}
          {teamsText.trim() && (
            <div className="mt-2 text-sm">
              <span className="text-gray-600">
                Total teams: {duplicatesInfo.total}
              </span>
              {duplicatesInfo.hasDuplicates && (
                <span className="text-red-600 ml-3">
                  ({duplicatesInfo.duplicates} duplicate{duplicatesInfo.duplicates > 1 ? 's' : ''})
                </span>
              )}
            </div>
          )}
          
          {/* Validation errors */}
          {validationErrors.length > 0 && (
            <div className="mt-2 text-sm text-red-600">
              <p className="font-medium">Please fix the following errors:</p>
              <ul className="list-disc list-inside mt-1">
                {validationErrors.slice(0, 5).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
                {validationErrors.length > 5 && (
                  <li>... and {validationErrors.length - 5} more errors</li>
                )}
              </ul>
            </div>
          )}
          
          <p className="mt-1 text-sm text-gray-500">
            You can add teams now or later. Leave empty to add teams later.
          </p>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || validationErrors.length > 0}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Tournament'}
          </button>
        </div>
      </form>
    </div>
  );
}