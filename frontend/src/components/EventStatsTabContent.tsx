import { useState, useMemo } from 'react';
import FeatureCard from './FeatureCard';
import StatsSummaryCards from './StatsSummaryCards';
import EventStatsChart from './EventStatsChart';
import ScoreTable from './ui/ScoreTable';
import ShowMoreButton from './ui/ShowMoreButton';
import EmptyState from './ui/EmptyState';
import type { EventStatsResponse } from '../types';

// Types for score entries
interface BaseScoreEntry {
  athlete: string;
  athleteId: number;
  score: number;
  round: string;
  heatNo: string;
  eliminationType: string | null;
}

interface JumpScoreEntry extends BaseScoreEntry {
  move: string;
}

// Table column configurations
const HEAT_SCORE_COLUMNS = [
  { key: 'rank' as const, header: '#' },
  { key: 'athlete' as const, header: 'Athlete' },
  { key: 'score' as const, header: 'Score', align: 'right' as const },
  { key: 'round' as const, header: 'Round', align: 'right' as const },
  { key: 'heatNo' as const, header: 'Heat', align: 'right' as const },
];

const JUMP_SCORE_COLUMNS = [
  { key: 'rank' as const, header: '#' },
  { key: 'athlete' as const, header: 'Athlete' },
  { key: 'score' as const, header: 'Score', align: 'right' as const },
  { key: 'move' as const, header: 'Move', align: 'right' as const },
  { key: 'round' as const, header: 'Round', align: 'right' as const },
  { key: 'heatNo' as const, header: 'Heat', align: 'right' as const },
];

const WAVE_SCORE_COLUMNS = HEAT_SCORE_COLUMNS; // Same structure as heat scores

const DEFAULT_ROWS = 10;
const ROW_INCREMENT = 10;

interface EventStatsTabContentProps {
  statsData: EventStatsResponse | undefined;
  isLoading: boolean;
  onAthleteClick: (athleteId: number) => void;
  roundFilter: string;
  heatFilter: string;
  eliminationFilter: string;
}

// Helper to check if a score is valid
const isValidScore = (score: number | null | undefined): score is number => {
  return typeof score === 'number' && !isNaN(score) && isFinite(score);
};

// Transform API response to component format, filtering out entries with invalid scores
const transformScoreData = (statsData: EventStatsResponse) => ({
  topHeatScores: (statsData.top_heat_scores || [])
    .filter(score => isValidScore(score.score))
    .map(score => ({
      athlete: score.athlete_name,
      athleteId: score.athlete_id,
      score: score.score as number,
      heatNo: score.heat_number?.toString() || '',
      round: score.round_name || '',
      eliminationType: score.elimination_type || null,
    })),
  topJumpScores: (statsData.top_jump_scores || [])
    .filter(score => isValidScore(score.score))
    .map(score => ({
      athlete: score.athlete_name,
      athleteId: score.athlete_id,
      score: score.score as number,
      move: score.move_type || 'Unknown',
      heatNo: score.heat_number?.toString() || '',
      round: score.round_name || '',
      eliminationType: score.elimination_type || null,
    })),
  topWaveScores: (statsData.top_wave_scores || [])
    .filter(score => isValidScore(score.score))
    .map(score => ({
      athlete: score.athlete_name,
      athleteId: score.athlete_id,
      score: score.score as number,
      heatNo: score.heat_number?.toString() || '',
      round: score.round_name || '',
      eliminationType: score.elimination_type || null,
    })),
  chartData: (statsData.move_type_stats || [])
    .filter(stat => isValidScore(stat.best_score) && isValidScore(stat.average_score))
    .map(stat => ({
      type: stat.move_type,
      best: stat.best_score as number,
      average: stat.average_score as number,
      fleetAverage: stat.fleet_average ?? stat.average_score as number,
      bestBy: stat.best_scored_by ? {
        athlete: stat.best_scored_by.athlete_name,
        heat: stat.best_scored_by.heat_number?.toString() || '',
        round: stat.best_scored_by.round_name || '',
        score: stat.best_scored_by.score,
      } : null,
    })),
  summaryCards: {
    bestHeatScore: statsData.summary_stats?.best_heat_score || null,
    bestJumpScore: statsData.summary_stats?.best_jump_score || null,
    bestWaveScore: statsData.summary_stats?.best_wave_score || null,
  },
});

// Extract unique rounds, heats, and elimination types from score data
// Only includes rounds/heats that have actual wave or jump score data (not just heat totals)
// Builds cascading maps: elimination → rounds → heats
export const extractFilterOptions = (statsData: EventStatsResponse) => {
  const roundHeatsMap = new Map<string, Set<string>>();
  const eliminationRoundsMap = new Map<string, Set<string>>();
  const allHeats = new Set<string>();
  const allRounds = new Set<string>();
  const allEliminationTypes = new Set<string>();

  // Only use wave and jump scores - these represent actual detailed score data
  // Exclude top_heat_scores as those are just totals without breakdown data
  const scoresWithData = [
    ...(statsData.top_jump_scores || []),
    ...(statsData.top_wave_scores || []),
  ];

  scoresWithData.forEach((score) => {
    const round = score.round_name || '';
    const heat = score.heat_number || '';
    const eliminationType = score.elimination_type || '';

    // Track elimination types (only non-null values from PWA events)
    if (eliminationType) {
      allEliminationTypes.add(eliminationType);
      // Build elimination → rounds map
      if (round) {
        if (!eliminationRoundsMap.has(eliminationType)) {
          eliminationRoundsMap.set(eliminationType, new Set());
        }
        eliminationRoundsMap.get(eliminationType)!.add(round);
      }
    }

    // Only add round if it has a valid heat with score data
    if (heat) {
      allHeats.add(heat);
      if (round) {
        allRounds.add(round);
        if (!roundHeatsMap.has(round)) {
          roundHeatsMap.set(round, new Set());
        }
        roundHeatsMap.get(round)!.add(heat);
      }
    }
  });

  const sortHeats = (heats: string[]) => heats.sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, ''));
    const numB = parseInt(b.replace(/\D/g, ''));
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return a.localeCompare(b);
  });

  // Sort rounds in logical order (Round 1, Round 2, etc.)
  const sortRounds = (rounds: string[]) => rounds.sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, ''));
    const numB = parseInt(b.replace(/\D/g, ''));
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return a.localeCompare(b);
  });

  const uniqueRounds = sortRounds(Array.from(allRounds));
  const uniqueHeats = sortHeats(Array.from(allHeats));
  // Sort elimination types: Single first, then Double
  const uniqueEliminations = Array.from(allEliminationTypes).sort((a, b) => {
    if (a === 'Single') return -1;
    if (b === 'Single') return 1;
    return a.localeCompare(b);
  });

  return {
    uniqueRounds,
    uniqueHeats,
    uniqueEliminations,
    roundHeatsMap,
    eliminationRoundsMap,
    // Get rounds available for a given elimination type (or all rounds if no filter)
    getRoundsForElimination: (elimination: string) => {
      if (!elimination) return uniqueRounds;
      return sortRounds(Array.from(eliminationRoundsMap.get(elimination) || []));
    },
    // Get heats available for a given round (or all heats if no filter)
    getHeatsForRound: (round: string) => {
      if (!round) return uniqueHeats;
      return sortHeats(Array.from(roundHeatsMap.get(round) || []));
    },
  };
};

// Apply filters to score arrays
const filterScores = <T extends BaseScoreEntry>(
  scores: T[],
  roundFilter: string,
  heatFilter: string,
  eliminationFilter: string
): T[] => {
  return scores.filter((score) => {
    if (roundFilter && score.round !== roundFilter) return false;
    if (heatFilter && score.heatNo !== heatFilter) return false;
    if (eliminationFilter && score.eliminationType !== eliminationFilter) return false;
    return true;
  });
};

const EventStatsTabContent = ({ statsData, isLoading, onAthleteClick, roundFilter, heatFilter, eliminationFilter }: EventStatsTabContentProps) => {
  // Pagination state
  const [heatScoresLimit, setHeatScoresLimit] = useState(DEFAULT_ROWS);
  const [jumpScoresLimit, setJumpScoresLimit] = useState(DEFAULT_ROWS);
  const [waveScoresLimit, setWaveScoresLimit] = useState(DEFAULT_ROWS);

  const hasFilters = !!(roundFilter || heatFilter || eliminationFilter);

  // Transform and filter score data
  const data = useMemo(
    () => statsData ? transformScoreData(statsData) : null,
    [statsData]
  );

  const filteredHeatScores = useMemo(
    () => data ? filterScores(data.topHeatScores, roundFilter, heatFilter, eliminationFilter) : [],
    [data, roundFilter, heatFilter, eliminationFilter]
  );

  const filteredJumpScores = useMemo(
    () => data ? filterScores(data.topJumpScores, roundFilter, heatFilter, eliminationFilter) : [],
    [data, roundFilter, heatFilter, eliminationFilter]
  );

  const filteredWaveScores = useMemo(
    () => data ? filterScores(data.topWaveScores, roundFilter, heatFilter, eliminationFilter) : [],
    [data, roundFilter, heatFilter, eliminationFilter]
  );

  // Calculate filtered summary stats
  const filteredSummaryStats = useMemo(() => {
    if (!data) return { bestHeatScore: null, bestJumpScore: null, bestWaveScore: null };
    if (!hasFilters) return data.summaryCards;

    const bestHeat = filteredHeatScores.length > 0
      ? filteredHeatScores.reduce((best, curr) => curr.score > best.score ? curr : best)
      : null;

    const bestJump = filteredJumpScores.length > 0
      ? filteredJumpScores.reduce((best, curr) => curr.score > best.score ? curr : best)
      : null;

    const bestWave = filteredWaveScores.length > 0
      ? filteredWaveScores.reduce((best, curr) => curr.score > best.score ? curr : best)
      : null;

    return {
      bestHeatScore: bestHeat ? {
        score: bestHeat.score,
        athlete_name: bestHeat.athlete,
        athlete_id: String(bestHeat.athleteId),
        heat_number: bestHeat.heatNo,
        round_name: bestHeat.round,
        has_multiple_tied: false,
        all_tied_scores: null,
        breakdown: null,
      } : null,
      bestJumpScore: bestJump ? {
        score: bestJump.score,
        athlete_name: bestJump.athlete,
        athlete_id: String(bestJump.athleteId),
        heat_number: bestJump.heatNo,
        round_name: bestJump.round,
        has_multiple_tied: false,
        all_tied_scores: null,
        move_type: (bestJump as JumpScoreEntry).move,
      } : null,
      bestWaveScore: bestWave ? {
        score: bestWave.score,
        athlete_name: bestWave.athlete,
        athlete_id: String(bestWave.athleteId),
        heat_number: bestWave.heatNo,
        round_name: bestWave.round,
        has_multiple_tied: false,
        all_tied_scores: null,
      } : null,
    };
  }, [data, filteredHeatScores, filteredJumpScores, filteredWaveScores, hasFilters]);

  // Calculate filtered chart data
  const filteredChartData = useMemo(() => {
    if (!data) return [];
    if (!hasFilters) return data.chartData;

    const moveTypeStats = new Map<string, { scores: number[]; bestBy: typeof data.chartData[0]['bestBy'] }>();

    // Add wave scores
    if (filteredWaveScores.length > 0) {
      const waveScores = filteredWaveScores.map(s => s.score);
      const bestWave = filteredWaveScores.reduce((best, curr) => curr.score > best.score ? curr : best);
      moveTypeStats.set('Wave', {
        scores: waveScores,
        bestBy: { athlete: bestWave.athlete, heat: bestWave.heatNo, round: bestWave.round, score: bestWave.score }
      });
    }

    // Add jump scores grouped by move type
    filteredJumpScores.forEach(jump => {
      const moveType = jump.move || 'Unknown';
      if (!moveTypeStats.has(moveType)) {
        moveTypeStats.set(moveType, { scores: [], bestBy: null });
      }
      const stat = moveTypeStats.get(moveType)!;
      stat.scores.push(jump.score);
      if (!stat.bestBy || jump.score > stat.bestBy.score) {
        stat.bestBy = { athlete: jump.athlete, heat: jump.heatNo, round: jump.round, score: jump.score };
      }
    });

    // Filter out entries with no valid scores and calculate stats safely
    return Array.from(moveTypeStats.entries())
      .filter(([, stat]) => stat.scores.length > 0)
      .map(([type, stat]) => {
        // Filter out null/NaN scores
        const validScores = stat.scores.filter(s => typeof s === 'number' && !isNaN(s) && isFinite(s));
        if (validScores.length === 0) {
          return null;
        }
        return {
          type,
          best: Math.max(...validScores),
          average: validScores.reduce((a, b) => a + b, 0) / validScores.length,
          fleetAverage: validScores.reduce((a, b) => a + b, 0) / validScores.length,
          bestBy: stat.bestBy,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => b.best - a.best);
  }, [data, filteredWaveScores, filteredJumpScores, hasFilters]);

  // Loading state - AFTER all hooks
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-slate-700 rounded w-full"></div>
          <div className="h-64 bg-slate-700 rounded w-full"></div>
        </div>
      </div>
    );
  }

  // No data state - AFTER all hooks
  if (!statsData || !data) {
    return (
      <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg">
        <EmptyState
          variant="no-data"
          title="No Stats Available"
          description="Event statistics are not available for this event."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      {(filteredSummaryStats.bestHeatScore || filteredSummaryStats.bestJumpScore || filteredSummaryStats.bestWaveScore) && (
        <StatsSummaryCards
          bestHeatScore={filteredSummaryStats.bestHeatScore}
          bestJumpScore={filteredSummaryStats.bestJumpScore}
          bestWaveScore={filteredSummaryStats.bestWaveScore}
        />
      )}

      {/* Chart and Top Heat Scores */}
      {filteredChartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FeatureCard title="Best and Average Counting Score by Type" isLoading={false}>
            <EventStatsChart data={filteredChartData} />
          </FeatureCard>

          <FeatureCard title="Top Heat Scores" isLoading={false}>
            <ScoreTable
              data={filteredHeatScores}
              columns={HEAT_SCORE_COLUMNS}
              visibleCount={heatScoresLimit}
              onAthleteClick={onAthleteClick}
              emptyTitle="No Heat Scores"
              emptyDescription="Heat scores data not available."
              isFiltered={hasFilters}
            />
            <ShowMoreButton
              currentCount={Math.min(heatScoresLimit, filteredHeatScores.length)}
              totalCount={filteredHeatScores.length}
              increment={ROW_INCREMENT}
              onShowMore={() => setHeatScoresLimit(prev => prev + ROW_INCREMENT)}
            />
          </FeatureCard>
        </div>
      )}

      {/* Jump and Wave Scores */}
      {(data.topJumpScores.length > 0 || data.topWaveScores.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data.topJumpScores.length > 0 && (
            <FeatureCard title="Top Jump Scores" isLoading={false}>
              <ScoreTable
                data={filteredJumpScores}
                columns={JUMP_SCORE_COLUMNS}
                visibleCount={jumpScoresLimit}
                onAthleteClick={onAthleteClick}
                emptyTitle="No Jump Scores"
                emptyDescription="Jump scores data not available."
                isFiltered={hasFilters}
              />
              <ShowMoreButton
                currentCount={Math.min(jumpScoresLimit, filteredJumpScores.length)}
                totalCount={filteredJumpScores.length}
                increment={ROW_INCREMENT}
                onShowMore={() => setJumpScoresLimit(prev => prev + ROW_INCREMENT)}
              />
            </FeatureCard>
          )}

          {data.topWaveScores.length > 0 && (
            <FeatureCard title="Top Wave Scores" isLoading={false}>
              <ScoreTable
                data={filteredWaveScores}
                columns={WAVE_SCORE_COLUMNS}
                visibleCount={waveScoresLimit}
                onAthleteClick={onAthleteClick}
                emptyTitle="No Wave Scores"
                emptyDescription="Wave scores data not available."
                isFiltered={hasFilters}
              />
              <ShowMoreButton
                currentCount={Math.min(waveScoresLimit, filteredWaveScores.length)}
                totalCount={filteredWaveScores.length}
                increment={ROW_INCREMENT}
                onShowMore={() => setWaveScoresLimit(prev => prev + ROW_INCREMENT)}
              />
            </FeatureCard>
          )}
        </div>
      )}
    </div>
  );
};

export default EventStatsTabContent;
