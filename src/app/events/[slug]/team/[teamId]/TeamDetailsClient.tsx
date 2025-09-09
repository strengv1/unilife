'use client';

import { ArrowLeft, Users, Target, TrendingUp, Info, X, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { TeamWithMatches } from '@/lib/actions/team-actions';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface TeamDetailsClientProps {
  team: TeamWithMatches;
}

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  show: boolean;
  onClose: () => void;
}

function Tooltip({ children, content, show, onClose }: TooltipProps) {
  // Close on click outside
  useEffect(() => {
    if (show) {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Element;
        if (!target.closest('[data-tooltip]')) {
          onClose();
        }
      };
      
      // Small delay to prevent immediate closing
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 100);
      
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [show, onClose]);

  return (
    <div className="relative" data-tooltip>
      {children}
      {show && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
          <div className="bg-gray-800 text-white text-xs rounded-lg p-3 shadow-xl max-w-xs min-w-64 relative">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-1 right-1 p-1 hover:bg-gray-600 rounded text-gray-300"
            >
              <X className="w-3 h-3" />
            </button>
            
            <div className="pr-6"> {/* Add padding for close button */}
              {content}
            </div>
            
            {/* Arrow pointing down */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800" />
          </div>
        </div>
      )}
    </div>
  );
}

export function TeamDetailsClient({ team }: TeamDetailsClientProps) {
  const [showBuchholzTooltip, setShowBuchholzTooltip] = useState(false);
  const [showOpponentsBuchholzTooltip, setShowOpponentsBuchholzTooltip] = useState(false);
  const [showBuchholzScores, setShowBuchholzScores] = useState(false);

  const pointDiff = (team.swissGamePointsFor || 0) - (team.swissGamePointsAgainst || 0);
  
  const params = useParams();
  const tournamentSlug = params.slug as string;

  const LinkToOpponent = (oppName: string, oppId: number) => (
    <Link
      href={`/events/${tournamentSlug}/team/${oppId}`}
      className="text-blue-500 hover:underline"
    >
      {oppName}
    </Link>
  )

  const renderBuchholzTooltip = () => {
    if (team.buchholzDetails.totalOpponents === 0) {
      return <p>No completed matches yet.</p>;
    }

    const includedOpponents = team.buchholzDetails.opponentDetails.filter(o => o.includedInCalculation);
    const excludedOpponents = team.buchholzDetails.opponentDetails.filter(o => !o.includedInCalculation);

    return (
      <div className="space-y-2">
        <div className="font-medium text-purple-200">Calculation breakdown:</div>
        
        {/* Show included opponents */}
        <div className="space-y-1">
          {includedOpponents.map((opponent) => (
            <div key={`${opponent.opponentId}-${opponent.roundNumber}`} className="text-xs">
              R{opponent.roundNumber}: {opponent.opponentName} ({opponent.swissPoints}pts)
            </div>
          ))}
        </div>

        {/* Show excluded if any */}
        {excludedOpponents.length > 0 && (
          <div className="text-xs text-gray-300 border-t border-gray-600 pt-1">
            Excluded: {excludedOpponents.map(o => `${o.opponentName} (${o.swissPoints}pts)`).join(', ')}
          </div>
        )}

        {/* Final calculation */}
        <div className="text-xs border-t border-gray-600 pt-1 font-medium">
          {team.buchholzDetails.totalOpponents >= 3 
            ? `Sum excluding best/worst: ${team.buchholzDetails.scoresUsed.join(' + ')} = ${team.buchholzDetails.medianBuchholzScore}`
            : `Sum of all: ${team.buchholzDetails.scoresUsed.join(' + ')} = ${team.buchholzDetails.medianBuchholzScore}`
          }
        </div>
      </div>
    );
  };

  const renderOpponentsBuchholzTooltip = () => {
    if (team.buchholzDetails.totalOpponents === 0) {
      return <p>No completed matches yet.</p>;
    }

    return (
      <div className="space-y-2">
        <div className="font-medium text-indigo-200">Your opponents&apos; MB scores:</div>
        
        {/* Show each opponent's MB score */}
        <div className="space-y-1">
          {team.buchholzDetails.opponentDetails.map((opponent) => (
            <div key={`${opponent.opponentId}-${opponent.roundNumber}`} className="text-xs">
              R{opponent.roundNumber}: {opponent.opponentName} (MB: {opponent.opponentBuchholzScore || 0})
            </div>
          ))}
        </div>

        {/* Final calculation */}
        <div className="text-xs border-t border-gray-600 pt-1 font-medium">
          Sum: {team.buchholzDetails.opponentDetails.map(o => o.opponentBuchholzScore || 0).join(' + ')} = {team.opponentsBuchholzScore}
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link 
              href={`/events/${team.tournament.slug}/bracket`}
              className="sm:p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg md:text-2xl font-bold truncate">
                Tournament Status for {team.name}
              </h1>
              <p className="text-sm text-gray-600 truncate">{team.tournament.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-3 md:space-y-6">
        {/* Record & Status */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            {team.name}
          </h2>
          <div className="space-y-1">
            {team.qualifiedForElimination && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Playoff Status</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Qualified #{team.seed}
                </span>
              </div>
            )}
            {team.eliminated && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Eliminated
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Swiss Points</span>
              <span className="font-semibold text-blue-600">{team.swissPoints || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Record (W-L-D)</span>
              <span className="font-semibold">
                {team.swissWins || 0}-{team.swissLosses || 0}-{team.swissDraws || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cups Scored</span>
              <span className="font-semibold text-green-600">{team.swissGamePointsFor || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cups Conceded</span>
              <span className="font-semibold text-red-600">{team.swissGamePointsAgainst || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cup Difference</span>
              <span className={`font-semibold ${pointDiff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {pointDiff > 0 ? '+' : ''}{pointDiff}
              </span>
            </div>

            <button
              onClick={() => setShowBuchholzScores(!showBuchholzScores)}
              className="w-full flex items-center justify-between px-4 pt-3"
            >
              <div
                className="text-sm text-blue-600"
              >
                {showBuchholzScores ? 'Hide' : 'Show'} Tie-Breaking Stats
              </div>
              <ChevronDown className={`transition-transform ${showBuchholzScores ? 'rotate-180' : 'rotate-0'}`}/>
            </button>
            {showBuchholzScores && (
              <>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Median-Buchholz (MB)</span>
                    <Tooltip
                      show={showBuchholzTooltip}
                      onClose={() => setShowBuchholzTooltip(false)}
                      content={renderBuchholzTooltip()}
                    >
                      <button
                        onClick={() => setShowBuchholzTooltip(!showBuchholzTooltip)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        title="Show calculation breakdown"
                      >
                        <Info className="w-4 h-4 text-gray-400" />
                      </button>
                    </Tooltip>
                  </div>
                  <span className="font-semibold text-purple-600">
                    {team.buchholzDetails.medianBuchholzScore}
                  </span>
                </div>

                {/* Opponents' Buchholz Score with Tooltip */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Opponents&apos; MB (OMB)</span>
                    <Tooltip
                      show={showOpponentsBuchholzTooltip}
                      onClose={() => setShowOpponentsBuchholzTooltip(false)}
                      content={renderOpponentsBuchholzTooltip()}
                    >
                      <button
                        onClick={() => setShowOpponentsBuchholzTooltip(!showOpponentsBuchholzTooltip)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        title="Show calculation breakdown"
                      >
                        <Info className="w-4 h-4 text-gray-400" />
                      </button>
                    </Tooltip>
                  </div>
                  <span className="font-semibold text-indigo-600">{team.opponentsBuchholzScore}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Next match or Status */}
        {team.nextMatch ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-900">
              <Users className="w-5 h-5" />
              Next Match
            </h2>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-blue-800">Round</span>
                <span className="font-semibold text-blue-900">
                  {team.nextMatch.phase === 'swiss' ? `Swiss Round ${team.nextMatch.roundNumber}` : 
                   team.nextMatch.phase === 'elimination' ? `Elimination Round ${team.nextMatch.roundNumber}` :
                   `Round ${team.nextMatch.roundNumber}`}
                </span>
              </div>
              {team.nextMatch.opponent ? (
                <div className="flex justify-between items-center">
                  <span className="text-blue-800">Opponent</span>
                  {LinkToOpponent(team.nextMatch.opponent.name, team.nextMatch.opponent.id)}
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="text-blue-800">Opponent</span>
                  <span className="font-semibold text-blue-900">TBD</span>
                </div>
              )}
              {team.nextMatch.tableNumber && (
                <div className="flex justify-between items-center">
                  <span className="text-blue-800">Table</span>
                  <span className="font-semibold text-blue-900">Table {team.nextMatch.tableNumber} {team.nextMatch.turnNumber>0 && `(Turn ${team.nextMatch.turnNumber})`}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Show status when no next match
          <div className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700">
              <Users className="w-5 h-5" />
              Match Status
            </h2>
            {team.tournament.status === 'swiss' ? (
              // Tournament is ongoing but no next match
              <div className="text-center py-4">
                <div className="text-2xl mb-2">⏳</div>
                <div className="font-semibold text-gray-700 mb-2">Next Match Pending</div>
                <div className="text-sm text-gray-600">
                  Waiting for the next round to be scheduled
                </div>
              </div>
            ) : (
              // Tournament might be over or in different phase
              <div className="text-center py-4">
                <div className="text-2xl mb-2">✅</div>
                <div className="font-semibold text-gray-700 mb-2">No Upcoming Matches</div>
                <div className="text-sm text-gray-600">
                  All matches completed for this phase
                </div>
              </div>
            )}
          </div>
        )}

        {/* Match History */}
        {team.pastMatches.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Match History
            </h2>
            <div className="space-y-3">
              {team.pastMatches.map((match) => {
                const teamScore = match.isTeam1 ? match.team1Score : match.team2Score;
                const opponentScore = match.isTeam1 ? match.team2Score : match.team1Score;
                const isWin = match.winnerId === team.id;
                const isDraw = !match.winnerId && teamScore === opponentScore;
                
                return (
                  <div 
                    key={match.id}
                    className={`p-4 rounded-lg border ${
                      isWin ? 'bg-green-50 border-green-200' :
                      isDraw ? 'bg-yellow-50 border-yellow-200' :
                      'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">
                          {match.phase === 'swiss' ? `Swiss Round ${match.roundNumber}` : 
                           `${match.phase} Round ${match.roundNumber}`}
                        </div>
                        <div className="text-sm text-gray-600">
                          {match.opponent ?
                              <>
                                <span className="mr-1.5">vs</span> {LinkToOpponent(match.opponent.name, match.opponent.id)}
                              </>
                            :
                            'BYE (No opponent this round, free win!)'
                          }
                        </div>
                      </div>
                      <div className="text-right min-w-11">
                        <div className={`text-lg font-bold ${
                          isWin ? 'text-green-700' :
                          isDraw ? 'text-yellow-700' :
                          'text-red-700'
                        }`}>
                          {teamScore} - {opponentScore}
                        </div>
                        <div className={`text-xs font-medium ${
                          isWin ? 'text-green-600' :
                          isDraw ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {isWin ? 'WIN' : isDraw ? 'DRAW' : 'LOSS'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tie-Breaking Explanation */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            How Rankings Work
          </h2>
          <div className="text-sm text-gray-700 space-y-2">
            <p>Teams are ranked using the following tie-breaking system:</p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li><strong>Swiss Points:</strong> 3 for win, 1 for draw, 0 for loss</li>
              <li><strong>Cup Difference:</strong> Cups scored minus cups conceded</li>
              <li><strong>Median-Buchholz (MB):</strong> Sum of opponents&apos; Swiss points (excluding best and worst if 3+ opponents)</li>
              <li><strong>Opponents&apos; Buchholz (OMB):</strong> Sum of opponents&apos; MB scores</li>
            </ol>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">
                <strong>Note:</strong> Median-Buchholz helps differentiate between teams with the same points by considering the strength of their opponents. 
                A higher MB score indicates you played against stronger opponents overall.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}