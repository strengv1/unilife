'use client';

import { Match } from "@/app/lib/db";
import { useEffect, useRef, useState, useCallback } from "react";

function BracketMatch({
  match,
  hasTeams,
  matchStatus
}: {
  match: Match,
  hasTeams: boolean,
  matchStatus: string
}) {
  const isTeam1Winner = match.winnerId === match.team1?.id;
  const isTeam2Winner = match.winnerId === match.team2?.id;
  const tableNumber = match.bracketPosition?.match(/\d+$/)?.[0] || "?";

  return (
    <div className={`
      bg-white border-2 rounded-lg py-2 px-4 shadow-sm
      w-64 h-[156px] flex flex-col overflow-hidden
      ${match.status === 'completed' ? 'border-gray-300' : ''}
      ${hasTeams && match.status === 'pending' ? 'border-blue-400' : ''}
      ${!hasTeams ? 'border-gray-200 opacity-75' : ''}
    `}>
      <div className="flex justify-between mb-1 flex-shrink-0">
        <span className="text-sm font-bold text-gray-900">Table {tableNumber}</span>
        <span className={`
          text-xs px-2 py-1 rounded-full font-medium
          ${match.status === 'completed' ? 'bg-gray-200 text-gray-700' : ''}
          ${hasTeams && match.status === 'pending' ? 'bg-blue-100 text-blue-700' : ''}
          ${!hasTeams ? 'bg-gray-100 text-gray-500' : ''}
        `}>
          {matchStatus}
        </span>
      </div>
      <div className="flex-1 flex flex-col justify-center space-y-2 min-h-0">
        {/* Team 1 */}
        <div className={`
          flex justify-between items-center p-2 rounded min-h-[40px]
          ${isTeam1Winner ? 'bg-green-100 font-semibold' : ''}
          ${match.status === 'completed' && !isTeam1Winner && match.team1 ? 'opacity-60' : ''}
          ${!match.team1 ? 'text-gray-400' : ''}
        `}>
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            {match.team1?.seed && (
              <span className="text-xs text-gray-500 flex-shrink-0">#{match.team1.seed}</span>
            )}
            <span className="text-sm truncate" title={match.team1?.name || ''}>
              {match.team1?.name || (match.winnerId ? 'BYE' : 'TBD')}
            </span>
          </div>
          <span className={`text-lg ml-2 flex-shrink-0 ${isTeam1Winner ? 'text-green-700' : ''}`}>
            {match.team1Score !== null ? match.team1Score : '-'}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 flex-shrink-0"></div>

        {/* Team 2 */}
        <div className={`
          flex justify-between items-center p-2 rounded min-h-[40px]
          ${isTeam2Winner ? 'bg-green-100 font-semibold' : ''}
          ${match.status === 'completed' && !isTeam2Winner && match.team2 ? 'opacity-60' : ''}
          ${!match.team2 ? 'text-gray-400' : ''}
        `}>
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            {match.team2?.seed && (
              <span className="text-xs text-gray-500 flex-shrink-0">#{match.team2.seed}</span>
            )}
            <span className="text-sm truncate" title={match.team2?.name || ''}>
              {match.team2?.name || (match.winnerId ? 'BYE' : 'TBD')}
            </span>
          </div>
          <span className={`text-lg ml-2 flex-shrink-0 ${isTeam2Winner ? 'text-green-700' : ''}`}>
            {match.team2Score !== null ? match.team2Score : '-'}
          </span>
        </div>
      </div>
    </div>
  );
}

function getRoundNames(totalRounds: number): string[] {
  const names = [];
  let teamsInRound = Math.pow(2, totalRounds);

  for (let i = 0; i < totalRounds; i++) {
    if (teamsInRound === 2) {
      names.push('Final');
    } else if (teamsInRound === 4) {
      names.push('Semi-Final');
    } else if (teamsInRound === 8) {
      names.push('Quarter-Final');
    } else {
      names.push(`Round of ${teamsInRound}`);
    }
    teamsInRound = teamsInRound / 2;
  }

  return names;
}

// Helper function to determine valid bracket sizes based on matches
function getAvailableBracketSizes(matches: Match[]): number[] {
  if (matches.length === 0) return [64];
  
  const maxBracketSize = Math.pow(2, matches.length > 0 ? Math.max(...matches.map(m => m.roundNumber)) : 6);
  
  // Return valid power-of-2 sizes up to the max
  const sizes = [8, 16, 32, 64, 128].filter(size => size <= maxBracketSize);
  return sizes.length > 0 ? sizes : [64];
}

// Helper function to filter matches based on bracket size
function filterMatchesByBracketSize(matches: Match[], bracketSize: number): Match[] {
  if (matches.length === 0) return matches;
  
  // Calculate how many rounds this bracket size needs
  const neededRounds = Math.log2(bracketSize);
  const maxRound = Math.max(...matches.map(m => m.roundNumber));
  
  // Only show matches from the final N rounds
  const minRoundToShow = maxRound - neededRounds + 1;
  
  return matches.filter(match => match.roundNumber >= minRoundToShow);
}

const MAX_ZOOM_OUT_LEVEL = 0.2;
const MAX_ZOOM_IN_LEVEL = 1.5;

export function EliminationBracket({ matches }: { matches: Match[] }) {
  // New state for bracket size filtering
  const [bracketSize, setBracketSize] = useState<number>(() => {
    const sizes = getAvailableBracketSizes(matches);
    return sizes.length > 0 ? Math.max(...sizes) : 32;
  });
  const availableSizes = getAvailableBracketSizes(matches);
  
  // Filter matches based on selected bracket size
  const filteredMatches = filterMatchesByBracketSize(matches, bracketSize);
  
  // Use refs to store transform values without triggering re-renders
  const transformRef = useRef({ scale: 0.7, x: 0, y: 0 });
  const [controlsKey, setControlsKey] = useState(0); // Force re-render only for controls
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isPinching, setIsPinching] = useState(false);
  const [initialPinchDistance, setInitialPinchDistance] = useState(0);
  const [initialScale, setInitialScale] = useState(1);
  
  // Refs for container and content dimensions
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const transformElementRef = useRef<HTMLDivElement>(null);

  const rounds = filteredMatches.reduce((acc, match) => {
    if (!acc[match.roundNumber]) {
      acc[match.roundNumber] = [];
    }
    acc[match.roundNumber].push(match);
    return acc;
  }, {} as Record<number, Match[]>);

  // Get the filtered round numbers and calculate proper round names
  const filteredRoundNumbers = Object.keys(rounds).map(Number).sort((a, b) => a - b);
  const numFilteredRounds = filteredRoundNumbers.length;
  const roundNames = getRoundNames(numFilteredRounds);

  const hasTeams = (match: Match) => {
    return (match.team1Id !== null && match.team1 !== null) &&
           (match.team2Id !== null && match.team2 !== null);
  };

  const getMatchStatus = (match: Match) => {
    if (match.status === 'completed') return 'Completed';
    if (hasTeams(match)) return 'Ready';
    return 'Waiting';
  };

  // Apply transform directly to DOM element
  const applyTransform = useCallback(() => {
    if (transformElementRef.current) {
      const { scale, x, y } = transformRef.current;
      transformElementRef.current.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    }
  }, []);

  // Constrain position within bounds
  const constrainPosition = useCallback((x: number, y: number, scale: number) => {
    if (!containerRef.current || !contentRef.current) return { x, y };
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const contentWidth = (contentRef.current.scrollWidth || 800) * scale;
    const contentHeight = (contentRef.current.scrollHeight + 100) * scale;
    
    // Calculate bounds
    const PADDING_X = 20;
    const PADDING_Y = 10;
    const minX = Math.min(0, containerRect.width - contentWidth - PADDING_X-80); //extra padding at bottom for mobile
    const maxX = PADDING_X;
    const minY = Math.min(0, containerRect.height - contentHeight - PADDING_Y);
    const maxY = PADDING_Y;
    
    return {
      x: Math.max(minX, Math.min(maxX, x)),
      y: Math.max(minY, Math.min(maxY, y))
    };
  }, []);

  // Get distance between two touch points
  const getTouchDistance = (touches: React.TouchList) => {
    const touch1 = touches[0];
    const touch2 = touches[1];
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Get center point between two touches
  const getTouchCenter = (touches: React.TouchList) => {
    const touch1 = touches[0];
    const touch2 = touches[1];
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2
    };
  };

  const handleZoomIn = useCallback(() => {
    const newScale = Math.min(transformRef.current.scale + 0.1, MAX_ZOOM_IN_LEVEL);
    transformRef.current.scale = newScale;
    applyTransform();
    setControlsKey(prev => prev + 1); // Force controls re-render for visual feedback
  }, [applyTransform]);

  const handleZoomOut = useCallback(() => {
    const newScale = Math.max(transformRef.current.scale - 0.1, MAX_ZOOM_OUT_LEVEL);
    transformRef.current.scale = newScale;
    applyTransform();
    setControlsKey(prev => prev + 1);
  }, [applyTransform]);

  const handleReset = useCallback(() => {
    transformRef.current = { scale: 0.7, x: 0, y: 0 };
    applyTransform();
    setControlsKey(prev => prev + 1);
  }, [applyTransform]);

  // Touch handlers - no state updates during movement
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch zoom start
      setIsPinching(true);
      setInitialPinchDistance(getTouchDistance(e.touches));
      setInitialScale(transformRef.current.scale);
    } else if (e.touches.length === 1) {
      // Pan start
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({ 
        x: touch.clientX - transformRef.current.x, 
        y: touch.clientY - transformRef.current.y 
      });
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && isPinching) {
      // Pinch zoom
      e.preventDefault();
      const currentDistance = getTouchDistance(e.touches);
      const scaleFactor = currentDistance / initialPinchDistance;
      const newScale = Math.max(MAX_ZOOM_OUT_LEVEL, Math.min(MAX_ZOOM_IN_LEVEL, initialScale * scaleFactor));
      
      // Adjust position to zoom towards pinch center
      if (containerRef.current) {
        const center = getTouchCenter(e.touches);
        const containerRect = containerRef.current.getBoundingClientRect();
        const centerX = center.x - containerRect.left;
        const centerY = center.y - containerRect.top;
        
        const scaleRatio = newScale / transformRef.current.scale;
        const newX = centerX - (centerX - transformRef.current.x) * scaleRatio;
        const newY = centerY - (centerY - transformRef.current.y) * scaleRatio;
        
        const constrained = constrainPosition(newX, newY, newScale);
        transformRef.current = { scale: newScale, x: constrained.x, y: constrained.y };
        applyTransform();
      } else {
        transformRef.current.scale = newScale;
        applyTransform();
      }
    } else if (e.touches.length === 1 && isDragging && !isPinching) {
      // Pan
      const touch = e.touches[0];
      const newX = touch.clientX - dragStart.x;
      const newY = touch.clientY - dragStart.y;
      const constrained = constrainPosition(newX, newY, transformRef.current.scale);
      transformRef.current.x = constrained.x;
      transformRef.current.y = constrained.y;
      applyTransform();
    }
  }, [isDragging, isPinching, initialPinchDistance, initialScale, dragStart, constrainPosition, applyTransform]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      setIsDragging(false);
      setIsPinching(false);
    } else if (e.touches.length === 1) {
      // If going from 2 fingers to 1, update drag start for smooth transition
      setIsPinching(false);
      const touch = e.touches[0];
      setDragStart({ 
        x: touch.clientX - transformRef.current.x, 
        y: touch.clientY - transformRef.current.y 
      });
      setIsDragging(true);
    }
  }, []);

  // Mouse handlers for desktop testing
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ 
      x: e.clientX - transformRef.current.x, 
      y: e.clientY - transformRef.current.y 
    });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    const constrained = constrainPosition(newX, newY, transformRef.current.scale);
    transformRef.current.x = constrained.x;
    transformRef.current.y = constrained.y;
    applyTransform();
  }, [isDragging, dragStart, constrainPosition, applyTransform]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  // Wheel zoom for desktop
  const handleWheel = useCallback((e: React.WheelEvent) => {
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.max(MAX_ZOOM_OUT_LEVEL, Math.min(MAX_ZOOM_IN_LEVEL, transformRef.current.scale + delta));
    
    // Zoom towards cursor position
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const cursorX = e.clientX - containerRect.left;
      const cursorY = e.clientY - containerRect.top;
      
      const scaleRatio = newScale / transformRef.current.scale;
      const newX = cursorX - (cursorX - transformRef.current.x) * scaleRatio;
      const newY = cursorY - (cursorY - transformRef.current.y) * scaleRatio;
      
      const constrained = constrainPosition(newX, newY, newScale);
      transformRef.current = { scale: newScale, x: constrained.x, y: constrained.y };
      applyTransform();
    }
  }, [constrainPosition, applyTransform]);

  // Reset transform when bracket size changes
  useEffect(() => {
    handleReset();
  }, [bracketSize, handleReset]);

  // Initial setup
  useEffect(() => {
    applyTransform();
  }, [applyTransform]);

  const LINE_WIDTH = 2
  const LINE_COLOR = "#d1d5db"
  const HorizontalLine = ({ color = LINE_COLOR }: { color?: string }) => (
    <div
      className="border-0"
      style={{
        backgroundColor: color,
        height: LINE_WIDTH,
        width: "100%",
        minHeight: LINE_WIDTH,
        flexShrink: 0
      }}
    />
  );
  const VerticalLine = ({ color = LINE_COLOR, height }: { color?: string, height: number }) => (
    <div
      className="border-0"
      style={{
        backgroundColor: color,
        height: Math.round(height),
        width: LINE_WIDTH,
        minWidth: LINE_WIDTH,
        minHeight: Math.round(height),
        flexShrink: 0
      }}
    />
  );
  
  return (
    <>
      {/* Mobile View - Zoomable Bracket */}
      <div className="md:hidden bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Controls */}
        <div className="bg-gray-50 px-4 py-3 border-b" key={controlsKey}>
          {/* Show Rounds Selector */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Show Rounds</span>
            <select
              value={bracketSize}
              onChange={(e) => setBracketSize(Number(e.target.value))}
              className="px-2 py-1 text-sm border border-gray-300 rounded-lg bg-white"
            >
              {availableSizes.map((size, index) => (
                <option key={size} value={size}>
                  {index === availableSizes.length - 1 ? 'Full Bracket' : `Top ${size}`}
                </option>
              ))}
            </select>
          </div>
          
          {/* Zoom Controls */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Pinch to zoom • Drag to pan</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleZoomOut}
                className="p-1.5 rounded-lg bg-white border border-gray-300"
                aria-label="Zoom out"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <button
                onClick={handleReset}
                className="px-2 py-1 text-xs rounded-lg bg-white border border-gray-300"
              >
                Reset
              </button>
              <button
                onClick={handleZoomIn}
                className="p-1.5 rounded-lg bg-white border border-gray-300"
                aria-label="Zoom in"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Bracket Container */}
        <div 
          ref={containerRef}
          className="relative overflow-hidden touch-none"
          style={{ height: '70dvh' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
        >
          <div
            ref={transformElementRef}
            className="absolute"
            style={{
              transformOrigin: 'top left',
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
          >
            <div ref={contentRef} className="flex p-4" style={{ minWidth: '800px' }}>
              {filteredRoundNumbers.map((roundNumber, index) => {
                // Calculate gaps to position parent match between child matches and form the bracket
                const MATCH_CARD_HEIGHT = 156;
                const TITLE_HEIGHT = 36;
                const multiplier = Math.pow(2, index) - 1;
    
                const topMarginPx = Math.round(multiplier * (MATCH_CARD_HEIGHT/2));
                const gapPx = Math.round(multiplier * MATCH_CARD_HEIGHT);

                return (
                  <div key={roundNumber}
                    className="inline-flex"
                  >
                    {/* Line Before Box */}
                    {roundNumber !== Math.min(...filteredRoundNumbers) &&
                      <div
                        className="flex flex-col"
                        style={{
                          width: 20,
                          gap: Math.round(gapPx + MATCH_CARD_HEIGHT - LINE_WIDTH),
                          marginTop: Math.round(topMarginPx + MATCH_CARD_HEIGHT/2 + LINE_WIDTH + TITLE_HEIGHT),
                          flexShrink: 0
                        }}
                      >
                        {rounds[roundNumber].map((_, idx) => (
                          <HorizontalLine key={idx} />
                        ))}
                      </div>
                    }
                    <div className="flex flex-col">
                      <h3 className="text-sm font-semibold text-center mb-1">
                        {roundNames[index]}
                      </h3>
                      <div
                        className={`flex flex-col justify-around`}
                        style={{gap: gapPx, marginTop: topMarginPx}}
                      >
                        {rounds[roundNumber]
                          ?.sort((a, b) => a.matchNumber - b.matchNumber)
                          .map(match => (
                            <BracketMatch 
                              key={match.id} 
                              match={match} 
                              hasTeams={hasTeams(match)}
                              matchStatus={getMatchStatus(match)}
                            />
                          ))}
                      </div>
                    </div>

                    {/* Line After Box */}
                    {roundNumber !== Math.max(...filteredRoundNumbers) && 
                      <div
                        className="flex flex-col"
                        style={{
                          width: 20,
                          gap: Math.round(gapPx + MATCH_CARD_HEIGHT - LINE_WIDTH),
                          marginTop: Math.round(topMarginPx + MATCH_CARD_HEIGHT/2 + TITLE_HEIGHT),
                          flexShrink: 0
                        }}
                      >
                        {rounds[roundNumber].map((_, idx) => (
                          <HorizontalLine key={idx} />
                        ))}
                      </div>
                    }

                    {/* Vertical Line, after Box */}
                    {(roundNumber !== Math.max(...filteredRoundNumbers)) &&
                      <div
                        className="flex flex-col"
                        style={{
                          width: LINE_WIDTH,
                          marginTop: Math.round(topMarginPx + MATCH_CARD_HEIGHT/2 + TITLE_HEIGHT),
                          flexShrink: 0
                        }}
                      >
                        {rounds[roundNumber].map((_, index) => {
                          const lineHeight = Math.round(gapPx + MATCH_CARD_HEIGHT + LINE_WIDTH);
                          return (index % 2 === 0) ? (
                            <VerticalLine key={index} height={lineHeight} />
                          ) : (
                            <VerticalLine key={index} color="transparent" height={lineHeight-LINE_WIDTH*2} />
                          );
                        })}
                      </div>
                    }
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm">
        {/* Desktop Controls */}
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Show Rounds:</span>
              <select
                value={bracketSize}
                onChange={(e) => setBracketSize(Number(e.target.value))}
                className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-sm"
              >
                {availableSizes.map((size, index) => (
                  <option key={size} value={size}>
                    {index === availableSizes.length - 1 ? 'Full Bracket' : `Top ${size}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-sm text-gray-500">
              Showing {filteredRoundNumbers.length} round{filteredRoundNumbers.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto pb-4">
          <div className="flex p-6 min-w-max">
            {filteredRoundNumbers.map((roundNumber, index) => {
              // Calculate gaps to position parent match between child matches and form the bracket
              const MATCH_CARD_HEIGHT = 156;
              const TITLE_HEIGHT = 44;
              const multiplier = Math.pow(2, index) - 1;

              const topMarginPx = Math.round(multiplier * (MATCH_CARD_HEIGHT/2));
              const gapPx = multiplier * MATCH_CARD_HEIGHT;
              
              return (
                <div key={roundNumber} className="inline-flex">
                  {/* Line Before Box */}
                  {roundNumber !== Math.min(...filteredRoundNumbers) &&
                    <div
                      className="flex flex-col"
                      style={{
                        width: 20,
                        gap: Math.round(gapPx + MATCH_CARD_HEIGHT - LINE_WIDTH),
                        marginTop: Math.round(topMarginPx + MATCH_CARD_HEIGHT/2 + LINE_WIDTH + TITLE_HEIGHT),
                        flexShrink: 0
                      }}
                    >
                      {rounds[roundNumber].map((_, idx) => (
                        <HorizontalLine key={idx} />
                      ))}
                    </div>
                  }


                  <div className="flex flex-col space-y-4">
                    <h3 className="text-lg font-semibold text-center mb-2">
                      {roundNames[index]}
                    </h3>
                    <div className="flex flex-col justify-around" style={{gap: gapPx, marginTop: topMarginPx}}>
                      {rounds[roundNumber]
                        ?.sort((a, b) => a.matchNumber - b.matchNumber)
                        .map(match => (
                          <BracketMatch 
                            key={match.id} 
                            match={match} 
                            hasTeams={hasTeams(match)}
                            matchStatus={getMatchStatus(match)}
                          />
                        ))}
                    </div>
                  </div>
                  
                  {/* Line After Box */}
                  {roundNumber !== Math.max(...filteredRoundNumbers) && 
                    <div
                      className="flex flex-col"
                      style={{
                        width: 20,
                        gap: Math.round(gapPx + MATCH_CARD_HEIGHT - LINE_WIDTH),
                        marginTop: Math.round(topMarginPx + MATCH_CARD_HEIGHT/2 + TITLE_HEIGHT),
                        flexShrink: 0
                      }}
                    >
                      {rounds[roundNumber].map((_, idx) => (
                        <HorizontalLine key={idx} />
                      ))}
                    </div>
                  }

                  {/* Vertical Line, after Box */}
                  {(roundNumber !== Math.max(...filteredRoundNumbers)) &&
                    <div
                      className="flex flex-col"
                      style={{
                        width: LINE_WIDTH,
                        marginTop: Math.round(topMarginPx + MATCH_CARD_HEIGHT/2 + TITLE_HEIGHT),
                        flexShrink: 0
                      }}
                    >
                      {rounds[roundNumber].map((_, index) => {
                        const lineHeight = Math.round(gapPx + MATCH_CARD_HEIGHT + LINE_WIDTH);
                        return (index % 2 === 0) ? (
                          <VerticalLine key={index} height={lineHeight} />
                        ) : (
                          <VerticalLine key={index} color="transparent" height={lineHeight-LINE_WIDTH*2} />
                        );
                      })}
                    </div>
                  }
                </div>
              )}
            )}
          </div>
        </div>
      </div>
    </>
  );
}