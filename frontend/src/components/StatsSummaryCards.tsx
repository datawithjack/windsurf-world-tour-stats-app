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

// Helper to format subtitle: "Full Name - Round (Heat No)"
const formatSubtitle = (scoreData: BestScore, type: 'heat' | 'jump' | 'wave') => {
  const parts: string[] = [scoreData.athlete_name];

  if (scoreData.round_name) {
    parts.push(scoreData.round_name);
  }

  parts.push(`(Heat ${scoreData.heat_number})`);

  return (
    <>
      {parts.join(' - ')}
      {type === 'jump' && scoreData.move_type && (
        <span className="block mt-1">{scoreData.move_type}</span>
      )}
    </>
  );
};

const FlipCard = ({ title, scoreData, type }: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // For heat cards with breakdown, use expand instead of flip
  const hasBreakdown = type === 'heat' && scoreData.breakdown &&
    (scoreData.breakdown.waves.length > 0 || scoreData.breakdown.jumps.length > 0);
  const canFlip = scoreData.has_multiple_tied && !hasBreakdown;
  const canExpand = hasBreakdown && !scoreData.has_multiple_tied;

  const handleClick = () => {
    if (canFlip) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`relative ${canFlip ? 'cursor-pointer' : ''}`}
      style={{ perspective: '1000px' }}
      onClick={handleClick}
    >
      <motion.div
        className="relative w-full"
        style={{
          transformStyle: 'preserve-3d',
        }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        {/* Front of card */}
        <motion.div
          className={`w-full bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 transition-all duration-300 hover:bg-slate-800/60 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 ${isFlipped ? 'absolute' : 'relative'}`}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            minHeight: '180px',
          }}
          animate={{
            opacity: isFlipped ? 0 : 1,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <h3 className="text-base font-medium text-white mb-2" style={{ fontFamily: 'var(--font-inter)' }}>
            {title}
          </h3>
          <p className="text-4xl font-bold text-white mb-2">{scoreData.score != null ? scoreData.score.toFixed(2) : '0.00'} pts</p>
          <p className="text-xs text-gray-400">
            {scoreData.has_multiple_tied ? (
              <span className="text-gray-300 font-semibold">Multiple (Click to see)</span>
            ) : (
              formatSubtitle(scoreData, type)
            )}
          </p>

          {/* Expandable breakdown for heat cards */}
          {canExpand && (
            <div className="mt-4">
              <button
                onClick={handleExpandClick}
                className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {isExpanded ? 'Hide' : 'Show'} Counting Scores
              </button>

              <AnimatePresence>
                {isExpanded && scoreData.breakdown && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 space-y-3">
                      {/* Waves breakdown */}
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

                      {/* Jumps breakdown */}
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
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Back of card */}
        {canFlip && scoreData.all_tied_scores && (
          <motion.div
            className={`w-full bg-slate-800/40 backdrop-blur-sm border border-cyan-500/50 rounded-lg ${isFlipped ? 'relative' : 'absolute'}`}
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
            animate={{
              opacity: isFlipped ? 1 : 0,
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="p-6">
              <h3 className="text-base font-medium text-white mb-3" style={{ fontFamily: 'var(--font-inter)' }}>
                All Tied Scores
              </h3>
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
                    <p className="text-xs text-gray-300 font-semibold mt-1">{tied.score != null ? tied.score.toFixed(2) : '0.00'} pts</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center italic">Click to flip back</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

const StatsSummaryCards = ({
  bestHeatScore,
  bestJumpScore,
  bestWaveScore,
}: StatsSummaryCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
