import { useState, useMemo } from 'react';
import FeatureCard from './FeatureCard';
import StatsSummaryCards from './StatsSummaryCards';
import EventStatsChart from './EventStatsChart';
import StatsFilterBar from './StatsFilterBar';
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
}

// Transform API response to component format
const transformScoreData = (statsData: EventStatsResponse) => ({
  topHeatScores: statsData.top_heat_scores?.map(score => ({
    athlete: score.athlete_name,
    athleteId: score.athlete_id,
    score: score.score,
    heatNo: score.heat_number?.toString() || '',
    round: score.round_name || '',
  })) || [],
  topJumpScores: statsData.top_jump_scores?.map(score => ({
    athlete: score.athlete_name,
    athleteId: score.athlete_id,
    score: score.score,
    move: score.move_type || 'Unknown',
    heatNo: score.heat_number?.toString() || '',
    round: score.round_name || '',
  })) || [],
  topWaveScores: statsData.top_wave_scores?.map(score => ({
    athlete: score.athlete_name,
    athleteId: score.athlete_id,
    score: score.score,
    heatNo: score.heat_number?.toString() || '',
    round: score.round_name || '',
  })) || [],
  chartData: statsData.move_type_stats?.map(stat => ({
    type: stat.move_type,
    best: stat.best_score,
    average: stat.average_score,
    fleetAverage: stat.fleet_average,
    bestBy: stat.best_scored_by ? {
      athlete: stat.best_scored_by.athlete_name,
      heat: stat.best_scored_by.heat_number?.toString() || '',
      round: stat.best_scored_by.round_name || '',
      score: stat.best_scored_by.score,
    } : null,
  })) || [],
  summaryCards: {
    bestHeatScore: statsData.summary_stats?.best_heat_score || null,
    bestJumpScore: statsData.summary_stats?.best_jump_score || null,
    bestWaveScore: statsData.summary_stats?.best_wave_score || null,
  },
});

// Extract unique rounds and heats from score data
const extractFilterOptions = (statsData: EventStatsResponse) => {
  const rounds = new Set<string>();
  const heatDataCount = new Map<string, number>();

  [...(statsData.top_heat_scores || []),
   ...(statsData.top_jump_scores || []),
   ...(statsData.top_wave_scores || [])].forEach((score) => {
    if (score.round_name) rounds.add(score.round_name);
    if (score.heat_number) {
      heatDataCount.set(score.heat_number, (heatDataCount.get(score.heat_number) || 0) + 1);
    }
  });

  return {
    uniqueRounds: Array.from(rounds).sort(),
    uniqueHeats: Array.from(heatDataCount.keys()).sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, ''));
      const numB = parseInt(b.replace(/\D/g, ''));
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b);
    }),
  };
};

// Apply filters to score arrays
const filterScores = <T extends BaseScoreEntry>(
  scores: T[],
  roundFilter: string,
  heatFilter: string
): T[] => {
  return scores.filter((score) => {
    if (roundFilter && score.round !== roundFilter) return false;
    if (heatFilter && score.heatNo !== heatFilter) return false;
    return true;
  });
};

const EventStatsTabContent = ({ statsData, isLoading, onAthleteClick }: EventStatsTabContentProps) => {
  // Pagination state
  const [heatScoresLimit, setHeatScoresLimit] = useState(DEFAULT_ROWS);
  const [jumpScoresLimit, setJumpScoresLimit] = useState(DEFAULT_ROWS);
  const [waveScoresLimit, setWaveScoresLimit] = useState(DEFAULT_ROWS);

  // Filter state
  const [roundFilter, setRoundFilter] = useState('');
  const [heatFilter, setHeatFilter] = useState('');

  // Derived data
  const { uniqueRounds, uniqueHeats } = useMemo(
    () => statsData ? extractFilterOptions(statsData) : { uniqueRounds: [], uniqueHeats: [] },
    [statsData]
  );

  const hasFilters = !!(roundFilter || heatFilter);

  // Loading state
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

  // No data state
  if (!statsData) {
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

  const data = transformScoreData(statsData);
  const filteredHeatScores = filterScores(data.topHeatScores, roundFilter, heatFilter);
  const filteredJumpScores = filterScores(data.topJumpScores, roundFilter, heatFilter);
  const filteredWaveScores = filterScores(data.topWaveScores, roundFilter, heatFilter);

  // Calculate filtered summary stats
  const filteredSummaryStats = useMemo(() => {
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
  }, [data.summaryCards, filteredHeatScores, filteredJumpScores, filteredWaveScores, hasFilters]);

  // Calculate filtered chart data
  const filteredChartData = useMemo(() => {
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

    return Array.from(moveTypeStats.entries()).map(([type, stat]) => ({
      type,
      best: Math.max(...stat.scores),
      average: stat.scores.reduce((a, b) => a + b, 0) / stat.scores.length,
      fleetAverage: stat.scores.reduce((a, b) => a + b, 0) / stat.scores.length,
      bestBy: stat.bestBy,
    })).sort((a, b) => b.best - a.best);
  }, [data.chartData, filteredWaveScores, filteredJumpScores, hasFilters]);

  return (
    <div className="space-y-8">
      {/* Filter Bar */}
      <StatsFilterBar
        rounds={uniqueRounds}
        heats={uniqueHeats}
        roundFilter={roundFilter}
        heatFilter={heatFilter}
        onRoundChange={setRoundFilter}
        onHeatChange={setHeatFilter}
        onClear={() => {
          setRoundFilter('');
          setHeatFilter('');
        }}
      />

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
