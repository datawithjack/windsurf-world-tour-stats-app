import { useState, useMemo } from 'react';
import FeatureCard from './FeatureCard';
import StatsSummaryCards from './StatsSummaryCards';
import EventStatsChart from './EventStatsChart';
import Select from './ui/Select';
import EmptyState from './ui/EmptyState';
import type { EventStatsResponse } from '../types';

// Show More button for tables - increments visible rows
const ShowMoreButton = ({
  currentCount,
  totalCount,
  increment = 10,
  onShowMore,
}: {
  currentCount: number;
  totalCount: number;
  increment?: number;
  onShowMore: () => void;
}) => {
  const remaining = totalCount - currentCount;
  if (remaining <= 0) return null;

  return (
    <button
      onClick={onShowMore}
      className="w-full py-2 text-xs text-cyan-400 hover:text-cyan-300 hover:bg-slate-800/40 transition-colors rounded-b-lg border-t border-slate-700/30"
    >
      Show More ({Math.min(remaining, increment)} more, {remaining} remaining)
    </button>
  );
};

interface TransformedStatsData {
  summaryCards: {
    bestHeatScore: EventStatsResponse['summary_stats']['best_heat_score'];
    bestJumpScore: EventStatsResponse['summary_stats']['best_jump_score'];
    bestWaveScore: EventStatsResponse['summary_stats']['best_wave_score'];
  };
  chartData: {
    type: string;
    best: number;
    average: number;
    fleetAverage: number;
    bestBy: { athlete: string; heat: string; round: string; score: number } | null;
  }[];
  topHeatScores: { athlete: string; athleteId: number; score: number; heatNo: string; round: string }[];
  topJumpScores: { athlete: string; athleteId: number; score: number; move: string; heatNo: string; round: string }[];
  topWaveScores: { athlete: string; athleteId: number; score: number; heatNo: string; round: string }[];
}

interface EventStatsTabContentProps {
  statsData: EventStatsResponse | undefined;
  isLoading: boolean;
  onAthleteClick: (athleteId: number) => void;
}

// Transform API response to component props format
const transformStatsData = (statsData: EventStatsResponse): TransformedStatsData => ({
  summaryCards: {
    bestHeatScore: statsData.summary_stats?.best_heat_score || null,
    bestJumpScore: statsData.summary_stats?.best_jump_score || null,
    bestWaveScore: statsData.summary_stats?.best_wave_score || null,
  },
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
});

const DEFAULT_ROWS = 10;
const ROW_INCREMENT = 10;

const EventStatsTabContent = ({ statsData, isLoading, onAthleteClick }: EventStatsTabContentProps) => {
  const [heatScoresLimit, setHeatScoresLimit] = useState(DEFAULT_ROWS);
  const [jumpScoresLimit, setJumpScoresLimit] = useState(DEFAULT_ROWS);
  const [waveScoresLimit, setWaveScoresLimit] = useState(DEFAULT_ROWS);

  // Filter state
  const [roundFilter, setRoundFilter] = useState<string>('');
  const [heatFilter, setHeatFilter] = useState<string>('');

  // Extract unique rounds and heats from all tables (only include heats that have actual data)
  const { uniqueRounds, uniqueHeats } = useMemo(() => {
    if (!statsData) return { uniqueRounds: [], uniqueHeats: [] };

    const rounds = new Set<string>();
    const heatDataCount = new Map<string, number>();

    // Collect from all score tables - track which heats have data
    [...(statsData.top_heat_scores || []),
     ...(statsData.top_jump_scores || []),
     ...(statsData.top_wave_scores || [])].forEach((score) => {
      if (score.round_name) rounds.add(score.round_name);
      if (score.heat_number) {
        heatDataCount.set(score.heat_number, (heatDataCount.get(score.heat_number) || 0) + 1);
      }
    });

    // Only include heats that have at least one data point
    const heatsWithData = Array.from(heatDataCount.keys());

    return {
      uniqueRounds: Array.from(rounds).sort(),
      uniqueHeats: heatsWithData.sort((a, b) => {
        // Sort heats numerically if possible
        const numA = parseInt(a.replace(/\D/g, ''));
        const numB = parseInt(b.replace(/\D/g, ''));
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
        return a.localeCompare(b);
      }),
    };
  }, [statsData]);

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

  const data = transformStatsData(statsData);

  // Apply filters to table data
  const filterScores = <T extends { round: string; heatNo: string }>(scores: T[]): T[] => {
    return scores.filter((score) => {
      if (roundFilter && score.round !== roundFilter) return false;
      if (heatFilter && score.heatNo !== heatFilter) return false;
      return true;
    });
  };

  const filteredHeatScores = filterScores(data.topHeatScores);
  const filteredJumpScores = filterScores(data.topJumpScores);
  const filteredWaveScores = filterScores(data.topWaveScores);

  // Calculate filtered summary stats when filters are applied
  const filteredSummaryStats = useMemo(() => {
    const hasFilters = roundFilter || heatFilter;

    if (!hasFilters) {
      // No filters - use original API data
      return data.summaryCards;
    }

    // Filters applied - calculate best from filtered data
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
        move_type: (bestJump as typeof filteredJumpScores[0]).move,
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
  }, [data.summaryCards, filteredHeatScores, filteredJumpScores, filteredWaveScores, roundFilter, heatFilter]);

  // Calculate filtered chart data when filters are applied
  const filteredChartData = useMemo(() => {
    const hasFilters = roundFilter || heatFilter;

    if (!hasFilters) {
      // No filters - use original API data
      return data.chartData;
    }

    // Group jump scores by move type and calculate best/average
    const moveTypeStats = new Map<string, { scores: number[]; bestBy: { athlete: string; heat: string; round: string; score: number } | null }>();

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

    // Convert to chart data format
    return Array.from(moveTypeStats.entries()).map(([type, stat]) => ({
      type,
      best: Math.max(...stat.scores),
      average: stat.scores.reduce((a, b) => a + b, 0) / stat.scores.length,
      fleetAverage: stat.scores.reduce((a, b) => a + b, 0) / stat.scores.length,
      bestBy: stat.bestBy,
    })).sort((a, b) => b.best - a.best);
  }, [data.chartData, filteredWaveScores, filteredJumpScores, roundFilter, heatFilter]);

  return (
    <div className="space-y-8">
      {/* Inline Filters - matching gender filter style */}
      {(uniqueRounds.length > 0 || uniqueHeats.length > 0) && (
        <div className="flex flex-wrap items-center gap-3">
          {uniqueRounds.length > 0 && (
            <Select
              value={roundFilter}
              onChange={(e) => setRoundFilter(e.target.value)}
            >
              <option value="">All Rounds</option>
              {uniqueRounds.map((round) => (
                <option key={round} value={round}>{round}</option>
              ))}
            </Select>
          )}
          {uniqueHeats.length > 0 && (
            <Select
              value={heatFilter}
              onChange={(e) => setHeatFilter(e.target.value)}
            >
              <option value="">All Heats</option>
              {uniqueHeats.map((heat) => (
                <option key={heat} value={heat}>Heat {heat}</option>
              ))}
            </Select>
          )}
          {(roundFilter || heatFilter) && (
            <button
              onClick={() => {
                setRoundFilter('');
                setHeatFilter('');
              }}
              className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors px-2"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Summary Cards - responsive to filters */}
      {(filteredSummaryStats.bestHeatScore || filteredSummaryStats.bestJumpScore || filteredSummaryStats.bestWaveScore) && (
        <StatsSummaryCards
          bestHeatScore={filteredSummaryStats.bestHeatScore}
          bestJumpScore={filteredSummaryStats.bestJumpScore}
          bestWaveScore={filteredSummaryStats.bestWaveScore}
        />
      )}

      {/* Bar Chart and Top Heat Scores */}
      {filteredChartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FeatureCard title="Best and Average Counting Score by Type" isLoading={false}>
            <EventStatsChart data={filteredChartData} />
          </FeatureCard>

          <FeatureCard
            title="Top Heat Scores"
            isLoading={false}
          >
            {filteredHeatScores.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700/50">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">#</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Athlete</th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Score</th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Round</th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Heat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredHeatScores.slice(0, heatScoresLimit).map((entry, index) => (
                        <tr key={index} className="border-b border-slate-700/30 hover:bg-slate-800/40 transition-colors duration-200">
                          <td className="py-3 px-4 text-sm text-gray-400 font-semibold">{index + 1}</td>
                          <td className="py-3 px-4 text-sm">
                            <button
                              onClick={() => onAthleteClick(entry.athleteId)}
                              className="text-white hover:text-cyan-400 transition-colors cursor-pointer text-left"
                            >
                              {entry.athlete}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-sm text-right text-white font-semibold">{entry.score.toFixed(2)}</td>
                          <td className="py-3 px-4 text-sm text-right text-gray-400">{entry.round || '-'}</td>
                          <td className="py-3 px-4 text-sm text-right text-gray-400">{entry.heatNo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <ShowMoreButton
                  currentCount={Math.min(heatScoresLimit, filteredHeatScores.length)}
                  totalCount={filteredHeatScores.length}
                  increment={ROW_INCREMENT}
                  onShowMore={() => setHeatScoresLimit((prev) => prev + ROW_INCREMENT)}
                />
              </>
            ) : (
              <EmptyState
                variant={(roundFilter || heatFilter) ? 'filtered' : 'no-data'}
                title={(roundFilter || heatFilter) ? 'No Matches Found' : 'No Heat Scores'}
                description={(roundFilter || heatFilter) ? 'Try adjusting your filters.' : 'Heat scores data not available.'}
              />
            )}
          </FeatureCard>
        </div>
      )}

      {/* Top Jump and Wave Scores */}
      {(data.topJumpScores.length > 0 || data.topWaveScores.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data.topJumpScores.length > 0 && (
            <FeatureCard
              title="Top Jump Scores"
              isLoading={false}
            >
              {filteredJumpScores.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-700/50">
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">#</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Athlete</th>
                          <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Score</th>
                          <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Move</th>
                          <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Round</th>
                          <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Heat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredJumpScores.slice(0, jumpScoresLimit).map((entry, index) => (
                          <tr
                            key={index}
                            className="border-b border-slate-700/30 hover:bg-slate-800/40 transition-colors duration-200"
                          >
                            <td className="py-3 px-4 text-sm text-gray-400 font-semibold">{index + 1}</td>
                            <td className="py-3 px-4 text-sm">
                              <button
                                onClick={() => onAthleteClick(entry.athleteId)}
                                className="text-white hover:text-cyan-400 transition-colors cursor-pointer text-left"
                              >
                                {entry.athlete}
                              </button>
                            </td>
                            <td className="py-3 px-4 text-sm text-right text-white font-semibold">{entry.score.toFixed(2)}</td>
                            <td className="py-3 px-4 text-sm text-right text-gray-400">{entry.move}</td>
                            <td className="py-3 px-4 text-sm text-right text-gray-400">{entry.round || '-'}</td>
                            <td className="py-3 px-4 text-sm text-right text-gray-400">{entry.heatNo}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <ShowMoreButton
                    currentCount={Math.min(jumpScoresLimit, filteredJumpScores.length)}
                    totalCount={filteredJumpScores.length}
                    increment={ROW_INCREMENT}
                    onShowMore={() => setJumpScoresLimit((prev) => prev + ROW_INCREMENT)}
                  />
                </>
              ) : (
                <EmptyState
                  variant={(roundFilter || heatFilter) ? 'filtered' : 'no-data'}
                  title={(roundFilter || heatFilter) ? 'No Matches Found' : 'No Jump Scores'}
                  description={(roundFilter || heatFilter) ? 'Try adjusting your filters.' : 'Jump scores data not available.'}
                />
              )}
            </FeatureCard>
          )}

          {data.topWaveScores.length > 0 && (
            <FeatureCard
              title="Top Wave Scores"
              isLoading={false}
            >
              {filteredWaveScores.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-700/50">
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">#</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Athlete</th>
                          <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Score</th>
                          <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Round</th>
                          <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Heat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredWaveScores.slice(0, waveScoresLimit).map((entry, index) => (
                          <tr
                            key={index}
                            className="border-b border-slate-700/30 hover:bg-slate-800/40 transition-colors duration-200"
                          >
                            <td className="py-3 px-4 text-sm text-gray-400 font-semibold">{index + 1}</td>
                            <td className="py-3 px-4 text-sm">
                              <button
                                onClick={() => onAthleteClick(entry.athleteId)}
                                className="text-white hover:text-cyan-400 transition-colors cursor-pointer text-left"
                              >
                                {entry.athlete}
                              </button>
                            </td>
                            <td className="py-3 px-4 text-sm text-right text-white font-semibold">{entry.score.toFixed(2)}</td>
                            <td className="py-3 px-4 text-sm text-right text-gray-400">{entry.round || '-'}</td>
                            <td className="py-3 px-4 text-sm text-right text-gray-400">{entry.heatNo}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <ShowMoreButton
                    currentCount={Math.min(waveScoresLimit, filteredWaveScores.length)}
                    totalCount={filteredWaveScores.length}
                    increment={ROW_INCREMENT}
                    onShowMore={() => setWaveScoresLimit((prev) => prev + ROW_INCREMENT)}
                  />
                </>
              ) : (
                <EmptyState
                  variant={(roundFilter || heatFilter) ? 'filtered' : 'no-data'}
                  title={(roundFilter || heatFilter) ? 'No Matches Found' : 'No Wave Scores'}
                  description={(roundFilter || heatFilter) ? 'Try adjusting your filters.' : 'Wave scores data not available.'}
                />
              )}
            </FeatureCard>
          )}
        </div>
      )}
    </div>
  );
};

export default EventStatsTabContent;
