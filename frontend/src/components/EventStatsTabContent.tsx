import { useState } from 'react';
import FeatureCard from './FeatureCard';
import StatsSummaryCards from './StatsSummaryCards';
import EventStatsChart from './EventStatsChart';
import TableRowTooltip from './TableRowTooltip';
import type { EventStatsResponse } from '../types';

// Row count selector for tables
const RowCountSelector = ({ value, onChange }: { value: number; onChange: (v: 10 | 25 | 50) => void }) => (
  <select
    value={value}
    onChange={(e) => onChange(Number(e.target.value) as 10 | 25 | 50)}
    className="bg-slate-800/60 border border-slate-700/50 text-gray-300 px-2 py-1 rounded text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
  >
    <option value={10}>10 rows</option>
    <option value={25}>25 rows</option>
    <option value={50}>50 rows</option>
  </select>
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
    bestBy: { athlete: string; heat: string; score: number } | null;
  }[];
  topHeatScores: { athlete: string; athleteId: number; score: number; heatNo: string }[];
  topJumpScores: { athlete: string; athleteId: number; score: number; move: string; heatNo: string }[];
  topWaveScores: { athlete: string; athleteId: number; score: number; heatNo: string }[];
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
      score: stat.best_scored_by.score,
    } : null,
  })) || [],
  topHeatScores: statsData.top_heat_scores?.map(score => ({
    athlete: score.athlete_name,
    athleteId: score.athlete_id,
    score: score.score,
    heatNo: score.heat_number?.toString() || '',
  })) || [],
  topJumpScores: statsData.top_jump_scores?.map(score => ({
    athlete: score.athlete_name,
    athleteId: score.athlete_id,
    score: score.score,
    move: score.move_type || 'Unknown',
    heatNo: score.heat_number?.toString() || '',
  })) || [],
  topWaveScores: statsData.top_wave_scores?.map(score => ({
    athlete: score.athlete_name,
    athleteId: score.athlete_id,
    score: score.score,
    heatNo: score.heat_number?.toString() || '',
  })) || [],
});

const EventStatsTabContent = ({ statsData, isLoading, onAthleteClick }: EventStatsTabContentProps) => {
  const [heatScoresLimit, setHeatScoresLimit] = useState<10 | 25 | 50>(10);
  const [jumpScoresLimit, setJumpScoresLimit] = useState<10 | 25 | 50>(10);
  const [waveScoresLimit, setWaveScoresLimit] = useState<10 | 25 | 50>(10);

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

      {/* Bar Chart and Top Heat Scores */}
      {data.chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FeatureCard title="Best and Average Counting Score by Type" isLoading={false}>
            <EventStatsChart data={data.chartData} />
          </FeatureCard>

          <FeatureCard
            title="Top Heat Scores"
            isLoading={false}
            headerAction={<RowCountSelector value={heatScoresLimit} onChange={setHeatScoresLimit} />}
          >
            {data.topHeatScores.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">#</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Athlete</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Score</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Heat No</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topHeatScores.slice(0, heatScoresLimit).map((entry, index) => (
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
                        <td className="py-3 px-4 text-sm text-right text-gray-400">{entry.heatNo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-gray-400 text-center py-12">
                <p className="text-sm text-gray-500">Heat scores data not available from API</p>
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
              headerAction={<RowCountSelector value={jumpScoresLimit} onChange={setJumpScoresLimit} />}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">#</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Athlete</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Score</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Move</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topJumpScores.slice(0, jumpScoresLimit).map((entry, index) => (
                      <TableRowTooltip
                        key={index}
                        content={`Heat ${entry.heatNo}`}
                        className="border-b border-slate-700/30 hover:bg-slate-800/40 transition-colors duration-200 cursor-help"
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
                      </TableRowTooltip>
                    ))}
                  </tbody>
                </table>
              </div>
            </FeatureCard>
          )}

          {data.topWaveScores.length > 0 && (
            <FeatureCard
              title="Top Wave Scores"
              isLoading={false}
              headerAction={<RowCountSelector value={waveScoresLimit} onChange={setWaveScoresLimit} />}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">#</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Athlete</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topWaveScores.slice(0, waveScoresLimit).map((entry, index) => (
                      <TableRowTooltip
                        key={index}
                        content={`Heat ${entry.heatNo}`}
                        className="border-b border-slate-700/30 hover:bg-slate-800/40 transition-colors duration-200 cursor-help"
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
                      </TableRowTooltip>
                    ))}
                  </tbody>
                </table>
              </div>
            </FeatureCard>
          )}
        </div>
      )}
    </div>
  );
};

export default EventStatsTabContent;
