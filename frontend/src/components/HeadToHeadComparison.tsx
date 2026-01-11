import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../services/api';
import FeatureCard from './FeatureCard';

interface HeadToHeadComparisonProps {
  eventId: number;
  gender: 'Men' | 'Women';
}

const HeadToHeadComparison: React.FC<HeadToHeadComparisonProps> = ({ eventId, gender }) => {
  const [athlete1Id, setAthlete1Id] = useState<number | null>(null);
  const [athlete2Id, setAthlete2Id] = useState<number | null>(null);
  const [athlete1ImageError, setAthlete1ImageError] = useState(false);
  const [athlete2ImageError, setAthlete2ImageError] = useState(false);

  // Fetch athlete list for event
  const { data: athleteListData, isLoading: athleteListLoading } = useQuery({
    queryKey: ['eventAthletes', eventId, gender],
    queryFn: () => apiService.getEventAthletes(eventId, gender),
    enabled: !!eventId,
    retry: 1,
  });

  // Fetch head-to-head comparison
  const { data: headToHeadData, isLoading: headToHeadLoading } = useQuery({
    queryKey: ['eventHeadToHead', eventId, athlete1Id, athlete2Id, gender],
    queryFn: () => apiService.getEventHeadToHead(eventId, athlete1Id!, athlete2Id!, gender),
    enabled: !!eventId && !!athlete1Id && !!athlete2Id,
    retry: 1,
  });

  // Reset selections when gender or event changes
  useEffect(() => {
    setAthlete1Id(null);
    setAthlete2Id(null);
    setAthlete1ImageError(false);
    setAthlete2ImageError(false);
  }, [gender, eventId]);

  // Reset image errors when athletes change
  useEffect(() => {
    setAthlete1ImageError(false);
  }, [athlete1Id]);

  useEffect(() => {
    setAthlete2ImageError(false);
  }, [athlete2Id]);

  const getPlacementSuffix = (placement: number) => {
    const lastTwo = placement % 100;
    // Special case for 11, 12, 13
    if (lastTwo >= 11 && lastTwo <= 13) {
      return 'TH';
    }
    const lastOne = placement % 10;
    switch (lastOne) {
      case 1: return 'ST';
      case 2: return 'ND';
      case 3: return 'RD';
      default: return 'TH';
    }
  };

  // Render stat comparison row with visual bars
  const renderStatRow = (
    label: string,
    athlete1Value: number,
    athlete2Value: number,
    winner: 'athlete1' | 'athlete2' | 'tie',
    difference: number,
    athlete1Name: string,
    athlete2Name: string,
    maxValue?: number
  ) => {
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
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
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
                initial={{ width: 0 }}
                animate={{ width: `${athlete1Percent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
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
                initial={{ width: 0 }}
                animate={{ width: `${athlete2Percent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
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

  const athletes = athleteListData?.athletes || [];
  const athlete1 = headToHeadData?.athlete1;
  const athlete2 = headToHeadData?.athlete2;
  const comparison = headToHeadData?.comparison;

  return (
    <div className="space-y-6">
      {/* Athlete Selection */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3"
      >
        <select
          value={athlete1Id || ''}
          onChange={(e) => setAthlete1Id(e.target.value ? Number(e.target.value) : null)}
          aria-label="Select first athlete to compare"
          className="bg-slate-800/60 border border-slate-700/50 text-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all text-sm sm:min-w-[250px] flex-1"
          disabled={athleteListLoading}
        >
          <option value="">Select first athlete</option>
          {athletes.map((athlete) => (
            <option
              key={athlete.athlete_id}
              value={athlete.athlete_id}
              disabled={athlete.athlete_id === athlete2Id}
            >
              {athlete.name} ({athlete.country_code})
            </option>
          ))}
        </select>

        <select
          value={athlete2Id || ''}
          onChange={(e) => setAthlete2Id(e.target.value ? Number(e.target.value) : null)}
          aria-label="Select second athlete to compare"
          className="bg-slate-800/60 border border-slate-700/50 text-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all text-sm sm:min-w-[250px] flex-1"
          disabled={athleteListLoading}
        >
          <option value="">Select second athlete</option>
          {athletes.map((athlete) => (
            <option
              key={athlete.athlete_id}
              value={athlete.athlete_id}
              disabled={athlete.athlete_id === athlete1Id}
            >
              {athlete.name} ({athlete.country_code})
            </option>
          ))}
        </select>
      </motion.div>

      {/* Comparison Content */}
      <AnimatePresence mode="wait">
        {!athlete1Id || !athlete2Id ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-12 text-center"
          >
            <p className="text-gray-400 text-base">
              Select two athletes to compare their performance
            </p>
          </motion.div>
        ) : headToHeadLoading ? (
          <FeatureCard title="Head to Head Comparison" isLoading={true}>
            <div />
          </FeatureCard>
        ) : athlete1 && athlete2 && comparison ? (
          <motion.div
            key="comparison"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Athlete Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-6 items-center">
              {/* Athlete 1 - Cyan */}
              <div className="flex flex-col items-center text-center gap-3">
                {athlete1.profile_image && !athlete1ImageError ? (
                  <img
                    src={athlete1.profile_image}
                    alt={athlete1.name}
                    className="w-28 h-28 rounded-lg object-cover border-4 border-cyan-400"
                    onError={() => setAthlete1ImageError(true)}
                  />
                ) : (
                  <div className="w-28 h-28 bg-slate-700/50 rounded-lg flex items-center justify-center border-4 border-cyan-400">
                    <User className="text-cyan-400" size={44} />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-cyan-400 mb-1" style={{ fontFamily: 'var(--font-inter)' }}>{athlete1.name}</h3>
                  <p className="text-sm text-gray-400" style={{ fontFamily: 'var(--font-inter)' }}>{athlete1.nationality}</p>
                </div>
              </div>

              {/* VS Divider - Desktop circular, Mobile horizontal */}
              <div className="flex items-center justify-center">
                {/* Desktop VS badge */}
                <div className="hidden sm:flex items-center justify-center px-4">
                  <div className="w-16 h-16 rounded-full bg-slate-700/50 border-2 border-slate-600/50 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-400" style={{ fontFamily: 'var(--font-bebas)' }}>
                      VS
                    </span>
                  </div>
                </div>
                {/* Mobile VS divider */}
                <div className="sm:hidden w-full flex items-center gap-4 py-2">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
                  <span className="text-xl font-bold text-gray-400 px-4" style={{ fontFamily: 'var(--font-bebas)' }}>VS</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
                </div>
              </div>

              {/* Athlete 2 - Teal */}
              <div className="flex flex-col items-center text-center gap-3">
                {athlete2.profile_image && !athlete2ImageError ? (
                  <img
                    src={athlete2.profile_image}
                    alt={athlete2.name}
                    className="w-28 h-28 rounded-lg object-cover border-4 border-teal-400"
                    onError={() => setAthlete2ImageError(true)}
                  />
                ) : (
                  <div className="w-28 h-28 bg-slate-700/50 rounded-lg flex items-center justify-center border-4 border-teal-400">
                    <User className="text-teal-400" size={44} />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-teal-400 mb-1" style={{ fontFamily: 'var(--font-inter)' }}>{athlete2.name}</h3>
                  <p className="text-sm text-gray-400" style={{ fontFamily: 'var(--font-inter)' }}>{athlete2.nationality}</p>
                </div>
              </div>
            </div>

            {/* Stats Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Overview - Placement & Heat Wins */}
              <FeatureCard title="Overview">
                <div className="space-y-6">
                  {/* Placement Comparison */}
                  <div>
                    <h5 className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-4 text-center" style={{ fontFamily: 'var(--font-inter)' }}>
                      Final Placement
                    </h5>
                    <div className="flex items-center justify-center gap-8 py-2">
                      <div className="text-center">
                        <div
                          className={`text-4xl sm:text-5xl font-bold mb-2 ${
                            athlete1.place < athlete2.place ? 'text-cyan-400' : 'text-gray-400'
                          }`}
                          style={{ fontFamily: 'var(--font-bebas)' }}
                        >
                          {athlete1.place}{getPlacementSuffix(athlete1.place)}
                        </div>
                        <p className={`text-xs font-medium ${
                          athlete1.place < athlete2.place ? 'text-cyan-400' : 'text-gray-500'
                        }`} style={{ fontFamily: 'var(--font-inter)' }}>
                          {athlete1.name.split(' ').pop()}
                        </p>
                      </div>
                      <div className="text-xl text-gray-600 font-bold" style={{ fontFamily: 'var(--font-bebas)' }}>VS</div>
                      <div className="text-center">
                        <div
                          className={`text-4xl sm:text-5xl font-bold mb-2 ${
                            athlete2.place < athlete1.place ? 'text-teal-400' : 'text-gray-400'
                          }`}
                          style={{ fontFamily: 'var(--font-bebas)' }}
                        >
                          {athlete2.place}{getPlacementSuffix(athlete2.place)}
                        </div>
                        <p className={`text-xs font-medium ${
                          athlete2.place < athlete1.place ? 'text-teal-400' : 'text-gray-500'
                        }`} style={{ fontFamily: 'var(--font-inter)' }}>
                          {athlete2.name.split(' ').pop()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Heat Wins */}
                  <div className="border-t border-slate-700/30 pt-4">
                    <h5 className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-4 text-center" style={{ fontFamily: 'var(--font-inter)' }}>
                      Heat Wins
                    </h5>
                    <div className="flex items-center justify-center gap-8 py-2">
                      <div className="text-center">
                        <div
                          className={`text-4xl sm:text-5xl font-bold mb-2 ${
                            comparison.heat_wins.winner === 'athlete1' ? 'text-cyan-400' : 'text-gray-400'
                          }`}
                          style={{ fontFamily: 'var(--font-bebas)' }}
                        >
                          {comparison.heat_wins.athlete1_value}
                        </div>
                        <p className={`text-xs font-medium ${
                          comparison.heat_wins.winner === 'athlete1' ? 'text-cyan-400' : 'text-gray-500'
                        }`} style={{ fontFamily: 'var(--font-inter)' }}>
                          {athlete1.name.split(' ').pop()}
                        </p>
                      </div>
                      <div className="text-xl text-gray-600 font-bold" style={{ fontFamily: 'var(--font-bebas)' }}>VS</div>
                      <div className="text-center">
                        <div
                          className={`text-4xl sm:text-5xl font-bold mb-2 ${
                            comparison.heat_wins.winner === 'athlete2' ? 'text-teal-400' : 'text-gray-400'
                          }`}
                          style={{ fontFamily: 'var(--font-bebas)' }}
                        >
                          {comparison.heat_wins.athlete2_value}
                        </div>
                        <p className={`text-xs font-medium ${
                          comparison.heat_wins.winner === 'athlete2' ? 'text-teal-400' : 'text-gray-500'
                        }`} style={{ fontFamily: 'var(--font-inter)' }}>
                          {athlete2.name.split(' ').pop()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </FeatureCard>

              {/* Heat Scores */}
              <FeatureCard title="Heat Scores">
                <div className="space-y-0">
                  {(() => {
                    const maxHeat = Math.max(
                      comparison.heat_scores_best.athlete1_value,
                      comparison.heat_scores_best.athlete2_value,
                      comparison.heat_scores_avg.athlete1_value,
                      comparison.heat_scores_avg.athlete2_value
                    );
                    return (
                      <>
                        {renderStatRow(
                          'Best',
                          comparison.heat_scores_best.athlete1_value,
                          comparison.heat_scores_best.athlete2_value,
                          comparison.heat_scores_best.winner,
                          comparison.heat_scores_best.difference,
                          athlete1.name,
                          athlete2.name,
                          maxHeat
                        )}
                        {renderStatRow(
                          'Average',
                          comparison.heat_scores_avg.athlete1_value,
                          comparison.heat_scores_avg.athlete2_value,
                          comparison.heat_scores_avg.winner,
                          comparison.heat_scores_avg.difference,
                          athlete1.name,
                          athlete2.name,
                          maxHeat
                        )}
                      </>
                    );
                  })()}
                </div>
              </FeatureCard>

              {/* Jumps */}
              <FeatureCard title="Jumps">
                <div className="space-y-0">
                  {(() => {
                    const maxJumps = Math.max(
                      comparison.jumps_best.athlete1_value,
                      comparison.jumps_best.athlete2_value,
                      comparison.jumps_avg_counting.athlete1_value,
                      comparison.jumps_avg_counting.athlete2_value
                    );
                    return (
                      <>
                        {renderStatRow(
                          'Best',
                          comparison.jumps_best.athlete1_value,
                          comparison.jumps_best.athlete2_value,
                          comparison.jumps_best.winner,
                          comparison.jumps_best.difference,
                          athlete1.name,
                          athlete2.name,
                          maxJumps
                        )}
                        {renderStatRow(
                          'Average Counting',
                          comparison.jumps_avg_counting.athlete1_value,
                          comparison.jumps_avg_counting.athlete2_value,
                          comparison.jumps_avg_counting.winner,
                          comparison.jumps_avg_counting.difference,
                          athlete1.name,
                          athlete2.name,
                          maxJumps
                        )}
                      </>
                    );
                  })()}
                </div>
              </FeatureCard>

              {/* Waves */}
              <FeatureCard title="Waves">
                <div className="space-y-0">
                  {(() => {
                    const maxWaves = Math.max(
                      comparison.waves_best.athlete1_value,
                      comparison.waves_best.athlete2_value,
                      comparison.waves_avg_counting.athlete1_value,
                      comparison.waves_avg_counting.athlete2_value
                    );
                    return (
                      <>
                        {renderStatRow(
                          'Best',
                          comparison.waves_best.athlete1_value,
                          comparison.waves_best.athlete2_value,
                          comparison.waves_best.winner,
                          comparison.waves_best.difference,
                          athlete1.name,
                          athlete2.name,
                          maxWaves
                        )}
                        {renderStatRow(
                          'Average Counting',
                          comparison.waves_avg_counting.athlete1_value,
                          comparison.waves_avg_counting.athlete2_value,
                          comparison.waves_avg_counting.winner,
                          comparison.waves_avg_counting.difference,
                          athlete1.name,
                          athlete2.name,
                          maxWaves
                        )}
                      </>
                    );
                  })()}
                </div>
              </FeatureCard>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-12 text-center"
          >
            <p className="text-gray-400 text-base">No comparison data available</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeadToHeadComparison;
