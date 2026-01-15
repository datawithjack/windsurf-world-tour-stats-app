import type { AthleteStatsResponse } from '../types';
import FeatureCard from './FeatureCard';
import EventStatsChart from './EventStatsChart';
import AthleteHeatScoresChart from './AthleteHeatScoresChart';

interface AthleteDetailPanelProps {
  data: AthleteStatsResponse;
}

const AthleteDetailPanel = ({ data }: AthleteDetailPanelProps) => {
  const { summary_stats, move_type_scores, heat_scores, jump_scores, wave_scores } = data;

  // Check if jump/wave data exists (score > 0)
  const hasJumpData = summary_stats.best_jump_score &&
    summary_stats.best_jump_score.score != null &&
    summary_stats.best_jump_score.score > 0;
  const hasWaveData = summary_stats.best_wave_score &&
    summary_stats.best_wave_score.score != null &&
    summary_stats.best_wave_score.score > 0;
  const hasJumpScores = jump_scores && jump_scores.length > 0;
  const hasWaveScores = wave_scores && wave_scores.length > 0;

  // Transform move type scores for EventStatsChart
  const chartData = move_type_scores?.map(score => ({
    type: score.move_type,
    best: score.best_score,
    average: score.average_score,
    fleetAverage: score.fleet_average,
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
        {/* Best Heat Score */}
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 sm:p-6">
          <h3 className="text-base font-medium text-white mb-2 font-inter">
            Best Heat Score
          </h3>
          {summary_stats.best_heat_score && summary_stats.best_heat_score.score != null ? (
            <>
              <p className="text-3xl sm:text-5xl font-bold text-white mb-2">
                {summary_stats.best_heat_score.score.toFixed(2)} <span className="text-xl sm:text-2xl text-gray-400">pts</span>
              </p>
              <p className="text-xs text-gray-400">{summary_stats.best_heat_score.round_name}</p>
              {summary_stats.best_heat_score.opponents && Array.isArray(summary_stats.best_heat_score.opponents) && summary_stats.best_heat_score.opponents.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">v {summary_stats.best_heat_score.opponents.join(', ')}</p>
              )}
            </>
          ) : (
            <p className="text-xl text-gray-500">No data available</p>
          )}
        </div>

        {/* Best Jump Score - only show if there's jump data */}
        {hasJumpData && (
          <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 sm:p-6">
            <h3 className="text-base font-medium text-white mb-2 font-inter">
              Best Jump Score
            </h3>
            <p className="text-3xl sm:text-5xl font-bold text-white mb-2">
              {summary_stats.best_jump_score!.score.toFixed(2)} <span className="text-xl sm:text-2xl text-gray-400">pts</span>
            </p>
            <p className="text-xs text-gray-400">{summary_stats.best_jump_score!.round_name}</p>
            {summary_stats.best_jump_score!.opponents && Array.isArray(summary_stats.best_jump_score!.opponents) && summary_stats.best_jump_score!.opponents.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">v {summary_stats.best_jump_score!.opponents.join(', ')}</p>
            )}
            <p className="text-xs text-cyan-400 mt-1">{summary_stats.best_jump_score!.move}</p>
          </div>
        )}

        {/* Best Wave Score - only show if there's wave data */}
        {hasWaveData && (
          <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 sm:p-6">
            <h3 className="text-base font-medium text-white mb-2 font-inter">
              Best Wave Score
            </h3>
            <p className="text-3xl sm:text-5xl font-bold text-white mb-2">
              {summary_stats.best_wave_score!.score.toFixed(2)} <span className="text-xl sm:text-2xl text-gray-400">pts</span>
            </p>
            <p className="text-xs text-gray-400">{summary_stats.best_wave_score!.round_name}</p>
            {summary_stats.best_wave_score!.opponents && Array.isArray(summary_stats.best_wave_score!.opponents) && summary_stats.best_wave_score!.opponents.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">v {summary_stats.best_wave_score!.opponents.join(', ')}</p>
            )}
          </div>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Best and Average Score by Type */}
        <FeatureCard title="Best and Average Counting Score by Type" isLoading={false}>
          <EventStatsChart data={chartData} />
        </FeatureCard>

        {/* Heat Scores */}
        <FeatureCard title="Heat Scores" isLoading={false}>
          <AthleteHeatScoresChart data={sortedHeatScores.map(h => ({
            roundName: h.round_name,
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
            <FeatureCard title="Jump Scores" isLoading={false}>
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
                    {jump_scores?.map((score, index) => (
                      <tr
                        key={index}
                        className="border-b border-slate-700/30 hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-3 px-2 text-gray-300">{score.round_name}</td>
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
              </div>
            </FeatureCard>
          )}

          {/* Wave Scores Table */}
          {hasWaveScores && (
            <FeatureCard title="Wave Scores" isLoading={false}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      <th className="text-left py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Round
                      </th>
                      <th className="text-right py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Best Wave Score
                      </th>
                      <th className="text-center py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Counting
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {wave_scores?.map((score, index) => (
                      <tr
                        key={index}
                        className="border-b border-slate-700/30 hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-3 px-2 text-gray-300">{score.round_name}</td>
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
              </div>
            </FeatureCard>
          )}
        </div>
      )}
    </div>
  );
};

export default AthleteDetailPanel;
