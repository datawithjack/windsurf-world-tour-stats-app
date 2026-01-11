import { useState } from 'react';
import { motion } from 'framer-motion';

interface TiedScore {
  score: number;
  athlete_name: string;
  athlete_id: string;
  heat_number: string;
  move_type?: string;
}

interface BestScore {
  score: number;
  athlete_name: string;
  athlete_id: string;
  heat_number: string;
  has_multiple_tied: boolean;
  all_tied_scores: TiedScore[] | null;
  move_type?: string;
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

const FlipCard = ({ title, scoreData, type }: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`relative ${scoreData.has_multiple_tied ? 'cursor-pointer' : ''}`}
      style={{ perspective: '1000px' }}
      onClick={() => scoreData.has_multiple_tied && setIsFlipped(!isFlipped)}
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
              <>
                {scoreData.athlete_name} - Heat {scoreData.heat_number}
                {type === 'jump' && scoreData.move_type && (
                  <span className="block mt-1">{scoreData.move_type}</span>
                )}
              </>
            )}
          </p>
        </motion.div>

        {/* Back of card */}
        {scoreData.has_multiple_tied && scoreData.all_tied_scores && (
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
                    <p className="text-xs text-gray-400">Heat {tied.heat_number}</p>
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
