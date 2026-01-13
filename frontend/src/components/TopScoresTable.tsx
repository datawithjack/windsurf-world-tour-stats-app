import { useState } from 'react';
import FeatureCard from './FeatureCard';

interface ScoreEntry {
  athlete: string;
  score: number;
  move?: string;
  heatNo: string;
  round?: string;
}

interface TopScoresTableProps {
  topHeatScores: ScoreEntry[];
  topJumpScores: ScoreEntry[];
  topWaveScores: ScoreEntry[];
  isLoading?: boolean;
}

const INITIAL_ROWS = 10;

const TopScoresTable = ({
  topHeatScores,
  topJumpScores,
  topWaveScores,
  isLoading = false,
}: TopScoresTableProps) => {
  const [expandedHeat, setExpandedHeat] = useState(false);
  const [expandedJump, setExpandedJump] = useState(false);
  const [expandedWave, setExpandedWave] = useState(false);

  const renderTable = (
    scores: ScoreEntry[],
    showMove: boolean = false,
    expanded: boolean,
    setExpanded: (val: boolean) => void
  ) => {
    if (isLoading) {
      return (
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-700 rounded"></div>
          ))}
        </div>
      );
    }

    // Sort scores by score descending as safety measure
    const sortedScores = [...scores].sort((a, b) => b.score - a.score);
    const displayedScores = expanded ? sortedScores : sortedScores.slice(0, INITIAL_ROWS);
    const hasMore = sortedScores.length > INITIAL_ROWS;

    return (
      <div className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  #
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Athlete
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Score
                </th>
                {showMove && (
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Move
                  </th>
                )}
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Round
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Heat
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedScores.map((entry, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-700/30 hover:bg-slate-800/40 transition-colors duration-200"
                >
                  <td className="py-3 px-4 text-sm font-semibold">
                    <span
                      className={
                        index === 0
                          ? 'text-yellow-400'
                          : index === 1
                          ? 'text-gray-300'
                          : index === 2
                          ? 'text-amber-600'
                          : 'text-gray-400'
                      }
                    >
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-white">{entry.athlete}</td>
                  <td className="py-3 px-4 text-sm text-right text-white font-semibold">
                    {entry.score.toFixed(2)}
                  </td>
                  {showMove && (
                    <td className="py-3 px-4 text-sm text-right text-gray-400">
                      {entry.move}
                    </td>
                  )}
                  <td className="py-3 px-4 text-sm text-right text-gray-400">
                    {entry.round || '-'}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-gray-400">
                    {entry.heatNo}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Expand/Collapse Button */}
        {hasMore && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full py-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors duration-200 font-medium"
          >
            {expanded
              ? 'Show Less'
              : `View All (${sortedScores.length - INITIAL_ROWS} more)`}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Top Heat Scores */}
      <FeatureCard title="Top Heat Scores (Top 10)" isLoading={isLoading}>
        {renderTable(topHeatScores, false, expandedHeat, setExpandedHeat)}
      </FeatureCard>

      {/* Top Jump Scores */}
      <FeatureCard title="Top Jump Scores (Top 10)" isLoading={isLoading}>
        {renderTable(topJumpScores, true, expandedJump, setExpandedJump)}
      </FeatureCard>

      {/* Top Wave Scores */}
      <FeatureCard title="Top Wave Scores (Top 10)" isLoading={isLoading}>
        {renderTable(topWaveScores, false, expandedWave, setExpandedWave)}
      </FeatureCard>
    </div>
  );
};

export default TopScoresTable;
