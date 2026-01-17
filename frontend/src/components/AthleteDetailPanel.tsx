import { useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { AthleteStatsResponse, HeatScoreBreakdown, TiedJumpScore, TiedWaveScore } from '../types';
import FeatureCard from './FeatureCard';
import EventStatsChart from './EventStatsChart';
import AthleteHeatScoresChart from './AthleteHeatScoresChart';

// Helper to format subtitle: "Round Name - (Heat X)" format matching Event Stats
const formatSubtitle = (roundName?: string | null, heatNumber?: string | null) => {
  const parts: string[] = [];
  if (roundName) parts.push(roundName);
  if (heatNumber) parts.push(`(Heat ${heatNumber})`);
  return parts.join(' - ');
};

interface ExpandableBestHeatCardProps {
  score: number;
  roundName: string;
  heatNumber?: string | null;
  opponents?: string[] | null;
  breakdown?: HeatScoreBreakdown | null;
}

const ExpandableBestHeatCard = ({ score, roundName, heatNumber, opponents, breakdown }: ExpandableBestHeatCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const hasBreakdown = breakdown && (breakdown.waves.length > 0 || breakdown.jumps.length > 0);

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 sm:p-6 transition-all duration-300 hover:bg-slate-800/60 hover:border-cyan-500/50">
      <h3 className="text-base font-medium text-white mb-2 font-inter">
        Best Heat Score
      </h3>
      <p className="text-3xl sm:text-5xl font-bold text-white mb-2">
        {score.toFixed(2)} <span className="text-xl sm:text-2xl text-gray-400">pts</span>
      </p>
      <p className="text-xs text-gray-400">{formatSubtitle(roundName, heatNumber)}</p>
      {opponents && Array.isArray(opponents) && opponents.length > 0 && (
        <p className="text-xs text-gray-500 mt-1">v {opponents.join(', ')}</p>
      )}

      {/* Expandable breakdown section */}
      {hasBreakdown && (
        <div className="mt-4">
          <button
            onClick={handleExpandClick}
            className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {isExpanded ? 'Hide Counting Scores' : 'Show Counting Scores'}
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-3 space-y-3">
                  {breakdown!.waves.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Top Waves</p>
                      <div className="flex gap-2">
                        {breakdown!.waves.map((wave, idx) => (
                          <div key={idx} className="bg-slate-900/40 border border-slate-700/30 rounded px-2 py-1">
                            <span className="text-sm text-white font-medium">{wave.score.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {breakdown!.jumps.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Top Jumps</p>
                      <div className="flex gap-2 flex-wrap">
                        {breakdown!.jumps.map((jump, idx) => (
                          <div key={idx} className="bg-slate-900/40 border border-slate-700/30 rounded px-2 py-1">
                            <span className="text-sm text-white font-medium">{jump.score.toFixed(2)}</span>
                            <span className="text-xs text-gray-400 ml-1">{jump.move_type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

// Expandable Best Jump Score Card with tied scores support
interface ExpandableBestJumpCardProps {
  score: number;
  roundName: string;
  heatNumber?: string | null;
  move: string;
  opponents?: string[] | null;
  hasMultipleTied?: boolean;
  allTiedScores?: TiedJumpScore[] | null;
}

const ExpandableBestJumpCard = ({ score, roundName, heatNumber, move, opponents, hasMultipleTied, allTiedScores }: ExpandableBestJumpCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 sm:p-6 transition-all duration-300 hover:bg-slate-800/60 hover:border-cyan-500/50">
      <h3 className="text-base font-medium text-white mb-2 font-inter">
        Best Jump Score
      </h3>
      <p className="text-3xl sm:text-5xl font-bold text-white mb-2">
        {score.toFixed(2)} <span className="text-xl sm:text-2xl text-gray-400">pts</span>
      </p>
      <p className="text-xs text-gray-400">
        {hasMultipleTied ? `Tied - ${roundName}` : formatSubtitle(roundName, heatNumber)}
      </p>
      {!hasMultipleTied && opponents && Array.isArray(opponents) && opponents.length > 0 && (
        <p className="text-xs text-gray-500 mt-1">v {opponents.join(', ')}</p>
      )}
      <p className="text-xs text-cyan-400 mt-1">{move}</p>

      {/* Expandable tied scores section */}
      {hasMultipleTied && allTiedScores && allTiedScores.length > 1 && (
        <div className="mt-4">
          <button
            onClick={handleExpandClick}
            className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {isExpanded ? 'Hide Tied Scores' : `Show Tied Scores (${allTiedScores.length})`}
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-3 space-y-2">
                  {allTiedScores.map((tied, idx) => (
                    <div key={idx} className="bg-slate-900/40 border border-slate-700/30 rounded px-3 py-2 flex justify-between items-center">
                      <div>
                        <span className="text-sm text-white font-medium">{tied.score.toFixed(2)} pts</span>
                        <span className="text-xs text-cyan-400 ml-2">{tied.move}</span>
                      </div>
                      <span className="text-xs text-gray-400">{formatSubtitle(tied.round_name, tied.heat_number)}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

// Expandable Best Wave Score Card with tied scores support
interface ExpandableBestWaveCardProps {
  score: number;
  roundName: string;
  heatNumber?: string | null;
  opponents?: string[] | null;
  hasMultipleTied?: boolean;
  allTiedScores?: TiedWaveScore[] | null;
}

const ExpandableBestWaveCard = ({ score, roundName, heatNumber, opponents, hasMultipleTied, allTiedScores }: ExpandableBestWaveCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 sm:p-6 transition-all duration-300 hover:bg-slate-800/60 hover:border-cyan-500/50">
      <h3 className="text-base font-medium text-white mb-2 font-inter">
        Best Wave Score
      </h3>
      <p className="text-3xl sm:text-5xl font-bold text-white mb-2">
        {score.toFixed(2)} <span className="text-xl sm:text-2xl text-gray-400">pts</span>
      </p>
      <p className="text-xs text-gray-400">
        {hasMultipleTied ? `Tied - ${roundName}` : formatSubtitle(roundName, heatNumber)}
      </p>
      {!hasMultipleTied && opponents && Array.isArray(opponents) && opponents.length > 0 && (
        <p className="text-xs text-gray-500 mt-1">v {opponents.join(', ')}</p>
      )}

      {/* Expandable tied scores section */}
      {hasMultipleTied && allTiedScores && allTiedScores.length > 1 && (
        <div className="mt-4">
          <button
            onClick={handleExpandClick}
            className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {isExpanded ? 'Hide Tied Scores' : `Show Tied Scores (${allTiedScores.length})`}
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-3 space-y-2">
                  {allTiedScores.map((tied, idx) => (
                    <div key={idx} className="bg-slate-900/40 border border-slate-700/30 rounded px-3 py-2 flex justify-between items-center">
                      <span className="text-sm text-white font-medium">{tied.score.toFixed(2)} pts</span>
                      <span className="text-xs text-gray-400">{formatSubtitle(tied.round_name, tied.heat_number)}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

interface AthleteDetailPanelProps {
  data: AthleteStatsResponse;
  /** Whether filters are currently applied (to trigger summary recalculation) */
  hasActiveFilters?: boolean;
}

const DEFAULT_TABLE_ROWS = 10;

const AthleteDetailPanel = ({ data, hasActiveFilters = false }: AthleteDetailPanelProps) => {
  const { summary_stats, move_type_scores, heat_scores, jump_scores, wave_scores } = data;

  // Recalculate summary stats from filtered data when filters are active
  const effectiveSummaryStats = useMemo(() => {
    // If no filters are active, use the API-provided summary stats
    if (!hasActiveFilters) {
      return summary_stats;
    }

    // Find best heat score from filtered heat_scores
    const bestHeatFromFiltered = heat_scores?.reduce((best, current) => {
      if (current.score && (!best || (current.score > (best.score || 0)))) {
        return current;
      }
      return best;
    }, null as typeof heat_scores[0] | null);

    // Find best jump score from filtered jump_scores
    const bestJumpFromFiltered = jump_scores?.reduce((best, current) => {
      if (current.score && (!best || current.score > (best.score || 0))) {
        return current;
      }
      return best;
    }, null as typeof jump_scores[0] | null);

    // Find best wave score from filtered wave_scores
    const bestWaveFromFiltered = wave_scores?.reduce((best, current) => {
      if (current.score && (!best || current.score > (best.score || 0))) {
        return current;
      }
      return best;
    }, null as typeof wave_scores[0] | null);

    return {
      ...summary_stats,
      best_heat_score: bestHeatFromFiltered ? {
        score: bestHeatFromFiltered.score || 0,
        heat: bestHeatFromFiltered.heat_number,
        heat_number: bestHeatFromFiltered.heat_number,
        round_name: bestHeatFromFiltered.round_name,
        opponents: null, // Not available in filtered data
        breakdown: null, // Not available in filtered data
      } : summary_stats.best_heat_score,
      best_jump_score: bestJumpFromFiltered ? {
        score: bestJumpFromFiltered.score,
        heat: bestJumpFromFiltered.heat_number,
        heat_number: bestJumpFromFiltered.heat_number,
        round_name: bestJumpFromFiltered.round_name,
        move: bestJumpFromFiltered.move,
        opponents: null,
        has_multiple_tied: false,
        all_tied_scores: null,
      } : summary_stats.best_jump_score,
      best_wave_score: bestWaveFromFiltered ? {
        score: bestWaveFromFiltered.score,
        heat: bestWaveFromFiltered.heat_number,
        heat_number: bestWaveFromFiltered.heat_number,
        round_name: bestWaveFromFiltered.round_name,
        opponents: null,
        has_multiple_tied: false,
        all_tied_scores: null,
      } : summary_stats.best_wave_score,
    };
  }, [hasActiveFilters, summary_stats, heat_scores, jump_scores, wave_scores]);

  // State for expandable tables
  const [jumpScoresExpanded, setJumpScoresExpanded] = useState(false);
  const [waveScoresExpanded, setWaveScoresExpanded] = useState(false);

  // Check if jump/wave data exists (score > 0)
  const hasJumpData = effectiveSummaryStats.best_jump_score &&
    effectiveSummaryStats.best_jump_score.score != null &&
    effectiveSummaryStats.best_jump_score.score > 0;
  const hasWaveData = effectiveSummaryStats.best_wave_score &&
    effectiveSummaryStats.best_wave_score.score != null &&
    effectiveSummaryStats.best_wave_score.score > 0;
  const hasJumpScores = jump_scores && jump_scores.length > 0;
  const hasWaveScores = wave_scores && wave_scores.length > 0;

  // Get visible scores based on expanded state
  const visibleJumpScores = jumpScoresExpanded ? jump_scores : jump_scores?.slice(0, DEFAULT_TABLE_ROWS);
  const visibleWaveScores = waveScoresExpanded ? wave_scores : wave_scores?.slice(0, DEFAULT_TABLE_ROWS);
  const hasMoreJumpScores = jump_scores && jump_scores.length > DEFAULT_TABLE_ROWS;
  const hasMoreWaveScores = wave_scores && wave_scores.length > DEFAULT_TABLE_ROWS;

  // Transform move type scores for EventStatsChart
  const chartData = move_type_scores?.map(score => ({
    type: score.move_type,
    best: score.best_score,
    average: score.average_score,
    fleetAverage: score.fleet_average ?? 0,
    fleetBest: score.fleet_best ?? 0,
    bestBy: {
      athlete: data.profile?.name || '',
      heat: '',
      round: '',
      score: score.best_score,
    },
  })) || [];

  // Sort heat scores by round progression
  const getRoundOrder = (roundName: string): number => {
    const lowerRound = roundName.toLowerCase();

    // Handle special rounds
    if (lowerRound.includes('final')) {
      if (lowerRound.includes('quarter')) return 900;
      if (lowerRound.includes('semi')) return 950;
      if (lowerRound === 'final' || lowerRound === 'finals') return 1000;
    }

    // Extract round number for "Round X" format
    const roundMatch = roundName.match(/round\s*(\d+)/i);
    if (roundMatch) {
      return parseInt(roundMatch[1], 10);
    }

    // Default fallback
    return 0;
  };

  const sortedHeatScores = heat_scores ? [...heat_scores].sort((a, b) => {
    return getRoundOrder(a.round_name) - getRoundOrder(b.round_name);
  }) : [];

  return (
    <div className="space-y-6">
      {/* Summary Cards - dynamically sized grid based on available data */}
      <div className={`grid grid-cols-1 gap-4 sm:gap-6 ${
        hasJumpData && hasWaveData ? 'sm:grid-cols-2 lg:grid-cols-3' :
        hasJumpData || hasWaveData ? 'sm:grid-cols-2' : ''
      }`}>
        {/* Best Heat Score - Expandable */}
        {effectiveSummaryStats.best_heat_score && effectiveSummaryStats.best_heat_score.score != null ? (
          <ExpandableBestHeatCard
            score={effectiveSummaryStats.best_heat_score.score}
            roundName={effectiveSummaryStats.best_heat_score.round_name}
            heatNumber={effectiveSummaryStats.best_heat_score.heat_number}
            opponents={effectiveSummaryStats.best_heat_score.opponents}
            breakdown={effectiveSummaryStats.best_heat_score.breakdown}
          />
        ) : (
          <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 sm:p-6">
            <h3 className="text-base font-medium text-white mb-2 font-inter">
              Best Heat Score
            </h3>
            <p className="text-xl text-gray-500">No data available</p>
          </div>
        )}

        {/* Best Jump Score - Expandable with tied scores */}
        {hasJumpData && (
          <ExpandableBestJumpCard
            score={effectiveSummaryStats.best_jump_score!.score}
            roundName={effectiveSummaryStats.best_jump_score!.round_name}
            heatNumber={effectiveSummaryStats.best_jump_score!.heat_number}
            move={effectiveSummaryStats.best_jump_score!.move}
            opponents={effectiveSummaryStats.best_jump_score!.opponents}
            hasMultipleTied={effectiveSummaryStats.best_jump_score!.has_multiple_tied}
            allTiedScores={effectiveSummaryStats.best_jump_score!.all_tied_scores}
          />
        )}

        {/* Best Wave Score - Expandable with tied scores */}
        {hasWaveData && (
          <ExpandableBestWaveCard
            score={effectiveSummaryStats.best_wave_score!.score}
            roundName={effectiveSummaryStats.best_wave_score!.round_name}
            heatNumber={effectiveSummaryStats.best_wave_score!.heat_number}
            opponents={effectiveSummaryStats.best_wave_score!.opponents}
            hasMultipleTied={effectiveSummaryStats.best_wave_score!.has_multiple_tied}
            allTiedScores={effectiveSummaryStats.best_wave_score!.all_tied_scores}
          />
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Best and Average Score by Type - with fleet comparison */}
        <FeatureCard title="Best and Average Counting Score by Type" isLoading={false}>
          <EventStatsChart data={chartData} showFleetComparison={true} />
        </FeatureCard>

        {/* Heat Scores */}
        <FeatureCard title="Heat Scores" isLoading={false}>
          <AthleteHeatScoresChart data={sortedHeatScores.map(h => ({
            roundName: h.round_name,
            heatNumber: h.heat_number,
            score: h.score,
            type: h.elimination_type
          }))} />
        </FeatureCard>
      </div>

      {/* Score Tables Row - only show if there are jump or wave scores */}
      {(hasJumpScores || hasWaveScores) && (
        <div className={`grid grid-cols-1 gap-4 sm:gap-6 ${hasJumpScores && hasWaveScores ? 'lg:grid-cols-2' : ''}`}>
          {/* Jump Scores Table */}
          {hasJumpScores && (
            <FeatureCard title={`Jump Scores (${jump_scores?.length || 0})`} isLoading={false}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      <th className="text-left py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Round
                      </th>
                      <th className="text-left py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Move
                      </th>
                      <th className="text-right py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Score
                      </th>
                      <th className="text-center py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Counting
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleJumpScores?.map((score, index) => (
                      <tr
                        key={index}
                        className="border-b border-slate-700/30 hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-3 px-2 text-gray-300">{formatSubtitle(score.round_name, score.heat_number)}</td>
                        <td className="py-3 px-2 text-gray-300">{score.move}</td>
                        <td className="py-3 px-2 text-right font-semibold text-white">
                          {score.score != null ? score.score.toFixed(2) : '0.00'} pts
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              score.counting
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-gray-500/20 text-gray-400'
                            }`}
                          >
                            {score.counting ? 'Yes' : 'No'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {hasMoreJumpScores && (
                  <button
                    onClick={() => setJumpScoresExpanded(!jumpScoresExpanded)}
                    className="w-full mt-3 py-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center justify-center gap-1"
                  >
                    {jumpScoresExpanded ? (
                      <>
                        <ChevronUp size={16} />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} />
                        Show All ({jump_scores?.length})
                      </>
                    )}
                  </button>
                )}
              </div>
            </FeatureCard>
          )}

          {/* Wave Scores Table */}
          {hasWaveScores && (
            <FeatureCard title={`Wave Scores (${wave_scores?.length || 0})`} isLoading={false}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      <th className="text-left py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Round
                      </th>
                      <th className="text-right py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Score
                      </th>
                      <th className="text-center py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Counting
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleWaveScores?.map((score, index) => (
                      <tr
                        key={index}
                        className="border-b border-slate-700/30 hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-3 px-2 text-gray-300">{formatSubtitle(score.round_name, score.heat_number)}</td>
                        <td className="py-3 px-2 text-right font-semibold text-white">
                          {score.score != null ? score.score.toFixed(2) : '0.00'} pts
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              score.counting
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-gray-500/20 text-gray-400'
                            }`}
                          >
                            {score.counting ? 'Yes' : 'No'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {hasMoreWaveScores && (
                  <button
                    onClick={() => setWaveScoresExpanded(!waveScoresExpanded)}
                    className="w-full mt-3 py-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center justify-center gap-1"
                  >
                    {waveScoresExpanded ? (
                      <>
                        <ChevronUp size={16} />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} />
                        Show All ({wave_scores?.length})
                      </>
                    )}
                  </button>
                )}
              </div>
            </FeatureCard>
          )}
        </div>
      )}
    </div>
  );
};

export default AthleteDetailPanel;
