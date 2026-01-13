import { motion, useReducedMotion } from 'framer-motion';

interface H2HStatBarProps {
  label: string;
  athlete1Value: number;
  athlete2Value: number;
  winner: 'athlete1' | 'athlete2' | 'tie';
  difference: number;
  athlete1Name: string;
  athlete2Name: string;
  maxValue?: number;
}

const H2HStatBar = ({
  label,
  athlete1Value,
  athlete2Value,
  winner,
  difference,
  athlete1Name,
  athlete2Name,
  maxValue,
}: H2HStatBarProps) => {
  const prefersReducedMotion = useReducedMotion();
  const localMaxValue = maxValue || Math.max(athlete1Value, athlete2Value);
  const athlete1Percent = localMaxValue > 0 ? (athlete1Value / localMaxValue) * 100 : 0;
  const athlete2Percent = localMaxValue > 0 ? (athlete2Value / localMaxValue) * 100 : 0;
  const hasData = athlete1Value > 0 || athlete2Value > 0;

  // Extract surname (last word of name)
  const athlete1Surname = athlete1Name.split(' ').pop() || athlete1Name;
  const athlete2Surname = athlete2Name.split(' ').pop() || athlete2Name;
  const winnerName = winner === 'athlete1' ? athlete1Surname : athlete2Surname;

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4 }}
      className="py-4 border-b border-slate-700/30 last:border-0"
    >
      {/* Label */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-wide font-medium" style={{ fontFamily: 'var(--font-inter)' }}>
          {label}
        </p>
        {winner !== 'tie' && difference > 0 && hasData && (
          <span className={`text-xs font-semibold ${
            winner === 'athlete2' ? 'text-teal-400' : 'text-cyan-400'
          }`}>
            +{difference.toFixed(2)} Advantage to {winnerName}
          </span>
        )}
      </div>

      {!hasData ? (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500 italic" style={{ fontFamily: 'var(--font-inter)' }}>No Data Available</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Athlete 1 Bar */}
          <div className="relative h-12 md:h-14 bg-slate-700/30 rounded-lg overflow-hidden">
            <motion.div
              initial={prefersReducedMotion ? false : { width: 0 }}
              animate={{ width: `${athlete1Percent}%` }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8, ease: 'easeOut' }}
              className={`absolute inset-y-0 left-0 rounded-lg ${
                winner === 'athlete1'
                  ? 'bg-gradient-to-r from-cyan-500/80 to-cyan-400/60'
                  : 'bg-slate-600/50'
              }`}
            />
            <div className="absolute inset-0 flex items-center justify-between px-3">
              <span
                className="text-sm sm:text-base font-bold text-white uppercase tracking-wide"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {athlete1Surname}
              </span>
              <span
                className={`text-lg sm:text-xl font-bold ${
                  winner === 'athlete1' ? 'text-white' : 'text-gray-300'
                }`}
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {athlete1Value}
              </span>
            </div>
          </div>

          {/* Athlete 2 Bar */}
          <div className="relative h-12 md:h-14 bg-slate-700/30 rounded-lg overflow-hidden">
            <motion.div
              initial={prefersReducedMotion ? false : { width: 0 }}
              animate={{ width: `${athlete2Percent}%` }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8, ease: 'easeOut', delay: 0.1 }}
              className={`absolute inset-y-0 left-0 rounded-lg ${
                winner === 'athlete2'
                  ? 'bg-gradient-to-r from-teal-500/80 to-teal-400/60'
                  : 'bg-slate-600/50'
              }`}
            />
            <div className="absolute inset-0 flex items-center justify-between px-3">
              <span
                className="text-sm sm:text-base font-bold text-white uppercase tracking-wide"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {athlete2Surname}
              </span>
              <span
                className={`text-lg sm:text-xl font-bold ${
                  winner === 'athlete2' ? 'text-white' : 'text-gray-300'
                }`}
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {athlete2Value}
              </span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default H2HStatBar;
