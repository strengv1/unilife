'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SwissBracket } from '../events/[slug]/components/SwissBracket';
import { EliminationBracket } from '../events/[slug]/components/EliminationBracket';
import { TempTeamStandings } from './tempComponents/TempTeamStandings';
import CommentSection from '../events/[slug]/components/CommentSection';
import { Match, StandingWithPosition, Tournament } from '@/lib/db';
import { Comment, CommentStats, getComments } from '@/lib/actions/comment-actions';

interface CachedClientProps {
  tournament: Tournament;
  standings: StandingWithPosition[];
  matches: Match[];
  comments: Comment[];
  commentStats: CommentStats;
  lastUpdated: string;
}

export function CachedClient({ 
  tournament: initialTournament, 
  standings: initialStandings, 
  matches: initialMatches,
  comments: initialComments,
  commentStats: initialCommentStats,
  lastUpdated
}: CachedClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tournament] = useState(initialTournament);
  const [comments, setComments] = useState(initialComments);
  const [commentStats, setCommentStats] = useState(initialCommentStats);
  const [isPending, startTransition] = useTransition();

  // Get active tab from URL params, default to 'standings'
  const activeTab = searchParams.get('tab') || 'standings';

  // Function to update the URL with the new tab
  const setActiveTab = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === 'standings') {
      // Remove tab param for default tab to keep URL clean
      params.delete('tab');
    } else {
      params.set('tab', tab);
    }
    
    // Use replace to avoid adding to browser history for tab switches
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    router.replace(newUrl, { scroll: false });
  };

  const refreshData = async () => {
    // Preserve the current tab when refreshing
    const currentParams = new URLSearchParams(searchParams.toString());
    const refreshUrl = currentParams.toString() ? `?${currentParams.toString()}` : window.location.pathname;
    window.location.href = refreshUrl;
  };

  const refreshComments = async () => {
    startTransition(async () => {
      try {
        const commentsResult = await getComments(tournament.id, 1, 20); // page 1, 20 comments
        setComments(commentsResult.comments);
        setCommentStats(commentsResult.stats);
      } catch (error) {
        console.error('Error refreshing comments:', error);
      }
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 h-[76px] z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg md:text-2xl font-bold truncate mr-2">{tournament.name}</h1>
            <button
              onClick={refreshData}
              disabled={isPending}
              className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
              title="Click to check for updates."
            >
              <svg className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isPending ? 'Updating' : 'Refresh'}
            </button>
          </div>
          {lastUpdated && !isPending ?
            <p className="text-xs text-gray-500 mt-1">
              Last Updated: {lastUpdated}
            </p>
          :
            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              Last Updated: 
              <div className="w-12 h-3 bg-gray-200 rounded animate-pulse"></div>
            </div>
          }
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-[76px] z-30">
        <div className="">
          <div className="flex overflow-x-auto">
            <button
              className={`pb-3 pt-3 px-4 whitespace-nowrap text-sm md:text-base font-medium transition-colors ${
                activeTab === 'standings' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('standings')}
              disabled={isPending}
            >
              Standings
            </button>
            {tournament.status !== 'registration' && (
              <button
                className={`pb-3 pt-3 px-4 whitespace-nowrap text-sm md:text-base font-medium transition-colors ${
                  activeTab === 'swiss' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('swiss')}
                disabled={isPending}
              >
                Swiss
              </button>
            )}
            <button
              className={`pb-3 pt-3 px-4 whitespace-nowrap text-sm md:text-base font-medium transition-colors ${
                activeTab === 'elimination' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : tournament.status === 'elimination' || tournament.status === 'completed'
                    ? 'text-gray-600 hover:text-gray-900'
                    : 'text-gray-400 cursor-not-allowed'
              }`}
              onClick={() => setActiveTab('elimination')}
              disabled={!(tournament.status === 'elimination' || tournament.status === 'completed') || isPending}
            >
              Elimination
            </button>
            {/* Enhanced Lobby Tab */}
            <button
              className={`pb-3 pt-3 px-4 whitespace-nowrap text-sm md:text-base font-medium transition-colors relative ${
                activeTab === 'lobby' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('lobby')}
              disabled={isPending}
            >
              Lobby
              {/* Enhanced comment count badge */}
              {commentStats.total > 0 && (
                <span className={`ml-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded-full ${
                  activeTab === 'lobby' 
                    ? 'text-blue-600 bg-blue-100' 
                    : 'text-gray-600 bg-gray-100'
                }`}>
                  {commentStats.total > 99 ? '99+' : commentStats.total}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-4">
        {activeTab === 'standings' && (
          <TempTeamStandings 
            standings={initialStandings}
            showElimination={tournament.status === 'elimination' || tournament.status === 'completed'}
          />
        )}
        {activeTab === 'swiss' && (
          <SwissBracket matches={initialMatches.filter(m => m.phase === 'swiss')} />
        )}
        {activeTab === 'elimination' && (
          <EliminationBracket matches={initialMatches.filter(m => m.phase === 'elimination')} />
        )}
        {activeTab === 'lobby' && (
          <CommentSection
            tournamentId={tournament.id}
            initialComments={comments}
            initialStats={commentStats}
            onSuccess={refreshComments}
          />
        )}
      </div>
    </div>
  );
}