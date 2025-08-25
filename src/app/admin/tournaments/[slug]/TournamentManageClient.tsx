'use client';

import { useState, useEffect, useMemo, useTransition } from 'react';
import Link from 'next/link';
import { Team, Tournament } from '@/app/lib/db';
import { useTeamValidation } from '@/hooks/useTeamValidation';
import { 
  getTeamsByTournamentSlugAction,
  updateTournamentSettingsAction,
  deleteTeamAction,
  addMultipleTeamsAction
} from '@/app/lib/actions/tournament-actions';

interface TournamentManageClientProps {
  tournament: Tournament;
  teams: Team[];
  slug: string;
}

export function TournamentManageClient({ 
  tournament: initialTournament, 
  teams: initialTeams,
  slug
}: TournamentManageClientProps) {
  const [tournament, setTournament] = useState(initialTournament);
  const [teams, setTeams] = useState(initialTeams);
  const [error, setError] = useState('');

  const [swissRounds, setSwissRounds] = useState(6);
  const [eliminationTeams, setEliminationTeams] = useState(32);
  const [teamsText, setTeamsText] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'id' | 'seed'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [isPending, startTransition] = useTransition();

  // Initialize validation with existing team names
  const existingTeamNames = teams.map(t => t.name);
  const { validateMultipleTeams, getDuplicatesInfo } = useTeamValidation(existingTeamNames);
  
  const displayedTeams = useMemo(() => {
    const filtered = teams.filter(team => 
      team.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    filtered.sort((a, b) => {
      let aVal = a[sortBy as keyof Team];
      let bVal = b[sortBy as keyof Team];
      
      // Handle null/undefined values
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      
      if (sortBy === 'name') {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

    return filtered;
  }, [teams, searchQuery, sortBy, sortOrder]);

  useEffect(() => {
    setSwissRounds(tournament.swissRounds || 6);
    setEliminationTeams(tournament.eliminationTeams || 32);
  }, [tournament]);

  const refreshTeams = async () => {
    setError('');
    
    startTransition(async () => {
      try {
        const teamsResult = await getTeamsByTournamentSlugAction(slug);

        if (teamsResult.error) {
          setError(teamsResult.error);
          return;
        }

        setTeams(teamsResult.teams || []);
      } catch (error) {
        console.error('Error fetching teams:', error);
        setError('Failed to refresh teams data');
      }
    });
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

  const handleDeleteTeam = async (teamId: number) => {
    if (!confirm('Delete this team?')) return;

    setError('');
    startTransition(async () => {
      const result = await deleteTeamAction(slug, teamId);
      
      if (result.error) {
        setError(result.error);
      } else {
        await refreshTeams();
      }
    });
  };

  const handleAddTeams = async () => {
    const teamNames = teamsText
      .split('\n')
      .map(name => name.trim())
      .filter(name => name.length > 0);

    // Final validation
    if (teamNames.length > 0) {
      const validation = validateMultipleTeams(teamNames);
      const invalid = validation.filter(v => !v.isValid);
      
      if (invalid.length > 0) {
        setError('Please fix team name errors before submitting');
        return;
      }
    }

    setError('');
    startTransition(async () => {
      const result = await addMultipleTeamsAction(slug, teamNames);
      
      if (result.error) {
        setError(result.error);
      } else {
        setTeamsText('');
        setValidationErrors([]);
        await refreshTeams();
        
        if (result.errors && result.errors.length > 0) {
          setError(`Some teams could not be added: ${result.errors.join(', ')}`);
        }
      }
    });
  };

  const handleUpdateSettings = async () => {
    setError('');
    startTransition(async () => {
      const result = await updateTournamentSettingsAction(
        slug,
        swissRounds,
        eliminationTeams
      );
      
      if (result.error) {
        setError(result.error);
      } else {
        // Update local tournament state
        setTournament(prev => ({
          ...prev,
          swissRounds,
          eliminationTeams
        }));
      }
    });
  };

  const duplicatesInfo = getDuplicatesInfo(teamsText.split('\n'));
  const totalTeamCount = teams.length + duplicatesInfo.unique;
  const recommendedRounds = Math.ceil(Math.log2(totalTeamCount));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-screen-lg">
        <div className="mb-6">
          <Link href="/admin" className="text-blue-500 hover:underline">
            ← Back to Admin
          </Link>
        </div>

        {/* Error display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">{tournament.name}</h1>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Status:</span> {tournament.status}
            </div>
            <div>
              <span className="font-medium">Type:</span> {tournament.type}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Swiss Rounds</label>
              <input
                type="number"
                value={swissRounds}
                onChange={(e) => setSwissRounds(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="1"
                max="20"
                disabled={tournament.status !== 'registration' || isPending}
              />
              {totalTeamCount > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: {recommendedRounds} rounds for {totalTeamCount} teams
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Elimination Teams</label>
              <select
                value={eliminationTeams}
                onChange={(e) => setEliminationTeams(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled={tournament.status !== 'registration' || isPending}
              >
                <option value="8">Top 8</option>
                <option value="16">Top 16</option>
                <option value="32">Top 32</option>
                <option value="64">Top 64</option>
              </select>
            </div>
          </div>
          {tournament.status === 'registration' && (
            <button
              onClick={handleUpdateSettings}
              disabled={isPending || !(swissRounds !== tournament.swissRounds || eliminationTeams !== tournament.eliminationTeams)}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isPending ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </div>

        {/* Teams Card */}
        <div className="bg-white rounded-lg shadow p-6">
          {/* Header with title and controls */}
          <h2 className="text-xl font-semibold">
            Teams ({teams.length})
            {searchQuery && ` - Showing ${displayedTeams.length}`}
          </h2>

          {tournament.status === 'registration' && (
            <form action={handleAddTeams} className="mb-6 border-t pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Add Teams (one per line)
              </label>
              <textarea
                value={teamsText}
                onChange={(e) => handleTeamsTextChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${
                  validationErrors.length > 0 ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={10}
                placeholder={`Team Alpha\nTeam Bravo\nTeam Charlie\n...`}
                disabled={isPending}
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

              <button
                type="submit"
                disabled={isPending || validationErrors.length > 0}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? 'Adding...' : 'Add Teams'}
              </button>
            </form>
          )}

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search teams..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full sm:w-64"
                disabled={isPending}
              />
              <svg 
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Sort */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field as 'name' | 'id' | 'seed');
                setSortOrder(order as 'asc' | 'desc');
              }}
              className="px-3 py-2 border border-gray-300 rounded-md"
              disabled={isPending}
            >
              <option value="name-asc">Name (A-Ö)</option>
              <option value="name-desc">Name (Ö-A)</option>
              <option value="id-asc">Added (First)</option>
              <option value="id-desc">Added (Last)</option>
              {tournament.status !== 'registration' && (
                <>
                  <option value="seed-asc">Seed (1-n)</option>
                  <option value="seed-desc">Seed (n-1)</option>
                </>
              )}
            </select>

            {/* View Mode */}
            <div className="flex border border-gray-300 rounded-md">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                title="Grid view"
                disabled={isPending}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                title="List view"
                disabled={isPending}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Teams Display */}
          {displayedTeams.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchQuery ? 'No teams match your search' : 'No teams added yet'}
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {displayedTeams.map((team: Team, index: number) => (
                <div 
                  key={team.id} 
                  className="group bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate" title={team.name}>
                        {team.name}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span>#{index + 1}</span>
                        {team.seed && <span>Seed: {team.seed}</span>}
                      </div>
                    </div>
                    {tournament.status === 'registration' && (
                      <button
                        onClick={() => handleDeleteTeam(team.id)}
                        className="ml-2 md:opacity-0 md:group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                        title="Delete team"
                        disabled={isPending}
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  {/* Optional: Add team stats if tournament has started */}
                  {tournament.status !== 'registration' && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Points:</span>
                          <span className="ml-1 font-medium">{team.swissPoints || 0}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">W-L-D:</span>
                          <span className="ml-1 font-medium">
                            {team.swissWins || 0}-{team.swissLosses || 0}-{team.swissDraws || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Team Name
                    </th>
                    {tournament.status !== 'registration' && (
                      <>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Points
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          W-L-D
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Seed
                        </th>
                      </>
                    )}
                    {tournament.status === 'registration' && (
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayedTeams.map((team: Team, index: number) => (
                    <tr key={team.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {team.name}
                      </td>
                      {tournament.status !== 'registration' && (
                        <>
                          <td className="px-4 py-3 text-sm text-center">
                            {team.swissPoints || 0}
                          </td>
                          <td className="px-4 py-3 text-sm text-center">
                            {team.swissWins || 0}-{team.swissLosses || 0}-{team.swissDraws || 0}
                          </td>
                          <td className="px-4 py-3 text-sm text-center">
                            {team.seed || '-'}
                          </td>
                        </>
                      )}
                      {tournament.status === 'registration' && (
                        <td className="px-4 py-3 text-sm text-right">
                          <button
                            onClick={() => handleDeleteTeam(team.id)}
                            className="text-red-500 hover:text-red-700 disabled:opacity-50"
                            disabled={isPending}
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Summary Stats */}
          {teams.length > 10 && (
            <div className="mt-6 pt-6 border-t text-sm text-gray-600">
              <div className="flex flex-wrap gap-4">
                <span>Total: {teams.length} teams</span>
                {searchQuery && <span>Filtered: {displayedTeams.length} teams</span>}
                <span>Swiss rounds needed: {Math.ceil(Math.log2(teams.length))}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}