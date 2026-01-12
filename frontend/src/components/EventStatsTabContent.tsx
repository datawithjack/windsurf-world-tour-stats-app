import { useState, useMemo } from 'react';
import FeatureCard from './FeatureCard';
import StatsSummaryCards from './StatsSummaryCards';
import EventStatsChart from './EventStatsChart';
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

// Filter dropdown component
const FilterDropdown = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) => (
  <div className="flex items-center gap-2">
    <span className="text-xs text-gray-400">{label}:</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-slate-800/60 border border-slate-700/50 text-gray-300 px-2 py-1 rounded text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
    >
      <option value="">All</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

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

  // Extract unique rounds and heats from all tables
  const { uniqueRounds, uniqueHeats } = useMemo(() => {
    if (!statsData) return { uniqueRounds: [], uniqueHeats: [] };

    const rounds = new Set<string>();
    const heats = new Set<string>();

    // Collect from all score tables
    [...(statsData.top_heat_scores || []),
     ...(statsData.top_jump_scores || []),
     ...(statsData.top_wave_scores || [])].forEach((score) => {
      if (score.round_name) rounds.add(score.round_name);
      if (score.heat_number) heats.add(score.heat_number);
    });

    return {
      uniqueRounds: Array.from(rounds).sort(),
      uniqueHeats: Array.from(heats).sort((a, b) => {
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
      <div className="text-center py-12">
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-12">
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No Stats Available</h3>
          <p className="text-gray-500">Event statistics are not available for this event.</p>
        </div>
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

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      {(data.summaryCards.bestHeatScore || data.summaryCards.bestJumpScore || data.summaryCards.bestWaveScore) && (
        <StatsSummaryCards
          bestHeatScore={data.summaryCards.bestHeatScore}
          bestJumpScore={data.summaryCards.bestJumpScore}
          bestWaveScore={data.summaryCards.bestWaveScore}
        />
      )}

      {/* Filters */}
      {(uniqueRounds.length > 0 || uniqueHeats.length > 0) && (
        <div className="flex flex-wrap items-center gap-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
          <span className="text-sm font-medium text-gray-300">Filter Tables:</span>
          {uniqueRounds.length > 0 && (
            <FilterDropdown
              label="Round"
              value={roundFilter}
              options={uniqueRounds}
              onChange={setRoundFilter}
            />
          )}
          {uniqueHeats.length > 0 && (
            <FilterDropdown
              label="Heat"
              value={heatFilter}
              options={uniqueHeats}
              onChange={setHeatFilter}
            />
          )}
          {(roundFilter || heatFilter) && (
            <button
              onClick={() => {
                setRoundFilter('');
                setHeatFilter('');
              }}
              className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Bar Chart and Top Heat Scores */}
      {data.chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FeatureCard title="Best and Average Counting Score by Type" isLoading={false}>
            <EventStatsChart data={data.chartData} />
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
              <div className="text-gray-400 text-center py-12">
                <p className="text-sm text-gray-500">{(roundFilter || heatFilter) ? 'No results match the current filters' : 'Heat scores data not available from API'}</p>
              </div>
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
                <div className="text-gray-400 text-center py-12">
                  <p className="text-sm text-gray-500">{(roundFilter || heatFilter) ? 'No results match the current filters' : 'Jump scores data not available'}</p>
                </div>
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
                <div className="text-gray-400 text-center py-12">
                  <p className="text-sm text-gray-500">{(roundFilter || heatFilter) ? 'No results match the current filters' : 'Wave scores data not available'}</p>
                </div>
              )}
            </FeatureCard>
          )}
        </div>
      )}
    </div>
  );
};

export default EventStatsTabContent;
