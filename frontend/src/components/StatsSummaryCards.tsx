import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface BreakdownScore {
  score: number;
  move_type: string;
}

interface HeatScoreBreakdown {
  waves: BreakdownScore[];
  jumps: BreakdownScore[];
}

interface TiedScore {
  score: number;
  athlete_name: string;
  athlete_id: string;
  heat_number: string;
  round_name?: string;
  move_type?: string;
}

interface BestScore {
  score: number;
  athlete_name: string;
  athlete_id: string;
  heat_number: string;
  round_name?: string;
  has_multiple_tied: boolean;
  all_tied_scores: TiedScore[] | null;
  move_type?: string;
  breakdown?: HeatScoreBreakdown | null;
}

interface StatsSummaryCardsProps {
  bestHeatScore: BestScore | null;
  bestJumpScore: BestScore | null;
  bestWaveScore: BestScore | null;
}

interface FlipCardProps {
  title: string;
  scoreData: BestScore;
  type: 'heat' | 'jump' | 'wave';
}

// Helper to format subtitle: "Full Name - Round (Heat No)" or "Tied - Round" when multiple tied
const formatSubtitle = (scoreData: BestScore, type: 'heat' | 'jump' | 'wave') => {
  // If multiple tied scores, show "Tied" instead of athlete name
  const displayName = scoreData.has_multiple_tied ? 'Tied' : scoreData.athlete_name;
  const parts: string[] = [displayName];

  if (scoreData.round_name) {
    parts.push(scoreData.round_name);
  }

  // Only show heat number if not tied (not relevant when multiple athletes)
  if (!scoreData.has_multiple_tied) {
    parts.push(`(Heat ${scoreData.heat_number})`);
  }

  return (
    <>
      {parts.join(' - ')}
      {type === 'jump' && scoreData.move_type && !scoreData.has_multiple_tied && (
        <span className="block mt-1">{scoreData.move_type}</span>
      )}
    </>
  );
};

const FlipCard = ({ title, scoreData, type }: FlipCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine what can be expanded
  const hasBreakdown = type === 'heat' && scoreData.breakdown &&
    (scoreData.breakdown.waves.length > 0 || scoreData.breakdown.jumps.length > 0);
  const hasTiedScores = scoreData.has_multiple_tied && scoreData.all_tied_scores && scoreData.all_tied_scores.length > 0;
  const canExpand = hasBreakdown || hasTiedScores;

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  // Determine expand button text
  const getExpandButtonText = () => {
    if (hasBreakdown) {
      return isExpanded ? 'Hide Counting Scores' : 'Show Counting Scores';
    }
    if (hasTiedScores) {
      return isExpanded ? 'Hide Tied Scores' : `Show Tied Scores (${scoreData.all_tied_scores?.length})`;
    }
    return '';
  };

  return (
    <div className="relative h-full">
      <div
        className="w-full h-full bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 transition-all duration-300 hover:bg-slate-800/60 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 flex flex-col"
        style={{ minHeight: '200px' }}
      >
        {/* Fixed height header area */}
        <div className="flex-none">
          <h3 className="text-base font-medium text-white mb-2" style={{ fontFamily: 'var(--font-inter)' }}>
            {title}
          </h3>
          <p className="text-4xl font-bold text-white mb-2">{scoreData.score != null ? scoreData.score.toFixed(2) : '0.00'} pts</p>
          <p className="text-xs text-gray-400 min-h-[2.5rem]">
            {formatSubtitle(scoreData, type)}
          </p>
        </div>

        {/* Spacer to push expand button to bottom */}
        <div className="flex-1" />

        {/* Expandable section - always at bottom */}
        {canExpand && (
          <div className="mt-4">
            <button
              onClick={handleExpandClick}
              className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {getExpandButtonText()}
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 space-y-3">
                    {/* Heat score breakdown (waves + jumps) */}
                    {hasBreakdown && scoreData.breakdown && (
                      <>
                        {scoreData.breakdown.waves.length > 0 && (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Top Waves</p>
                            <div className="flex gap-2">
                              {scoreData.breakdown.waves.map((wave, idx) => (
                                <div key={idx} className="bg-slate-900/40 border border-slate-700/30 rounded px-2 py-1">
                                  <span className="text-sm text-white font-medium">{wave.score.toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {scoreData.breakdown.jumps.length > 0 && (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Top Jumps</p>
                            <div className="flex gap-2 flex-wrap">
                              {scoreData.breakdown.jumps.map((jump, idx) => (
                                <div key={idx} className="bg-slate-900/40 border border-slate-700/30 rounded px-2 py-1">
                                  <span className="text-sm text-white font-medium">{jump.score.toFixed(2)}</span>
                                  <span className="text-xs text-gray-400 ml-1">{jump.move_type}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* Tied scores list */}
                    {hasTiedScores && scoreData.all_tied_scores && (
                      <div className="space-y-2">
                        {scoreData.all_tied_scores.map((tied, index) => (
                          <div
                            key={`${tied.athlete_id}-${tied.heat_number}-${index}`}
                            className="bg-slate-900/40 border border-slate-700/30 rounded p-2"
                          >
                            <p className="text-sm font-semibold text-white">{tied.athlete_name}</p>
                            <p className="text-xs text-gray-400">
                              {tied.round_name && `${tied.round_name} - `}Heat {tied.heat_number}
                            </p>
                            {type === 'jump' && tied.move_type && (
                              <p className="text-xs text-gray-400">{tied.move_type}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

const StatsSummaryCards = ({
  bestHeatScore,
  bestJumpScore,
  bestWaveScore,
}: StatsSummaryCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {/* Best Heat Score */}
        {bestHeatScore && (
          <FlipCard
            title="Best Heat Score"
            scoreData={bestHeatScore}
            type="heat"
          />
        )}

        {/* Best Jump Score */}
        {bestJumpScore && (
          <FlipCard
            title="Best Jump Score"
            scoreData={bestJumpScore}
            type="jump"
          />
        )}

        {/* Best Wave Score */}
        {bestWaveScore && (
          <FlipCard
            title="Best Wave Score"
            scoreData={bestWaveScore}
            type="wave"
          />
        )}
      </div>
  );
};

export default StatsSummaryCards;
