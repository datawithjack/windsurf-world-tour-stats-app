import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../services/api';
import FeatureCard from './FeatureCard';
import H2HStatBar from './H2HStatBar';
import H2HAthleteCard from './H2HAthleteCard';
import H2HOverviewCard from './H2HOverviewCard';

interface HeadToHeadComparisonProps {
  eventId: number;
  gender: 'Men' | 'Women';
}

const HeadToHeadComparison = ({ eventId, gender }: HeadToHeadComparisonProps) => {
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
              <H2HAthleteCard
                name={athlete1.name}
                nationality={athlete1.nationality}
                profileImage={athlete1.profile_image}
                imageError={athlete1ImageError}
                onImageError={() => setAthlete1ImageError(true)}
                color="cyan"
              />

              {/* VS Divider */}
              <div className="flex items-center justify-center">
                <div className="hidden sm:flex items-center justify-center px-4">
                  <div className="w-16 h-16 rounded-full bg-slate-700/50 border-2 border-slate-600/50 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-400" style={{ fontFamily: 'var(--font-bebas)' }}>
                      VS
                    </span>
                  </div>
                </div>
                <div className="sm:hidden w-full flex items-center gap-4 py-2">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
                  <span className="text-xl font-bold text-gray-400 px-4" style={{ fontFamily: 'var(--font-bebas)' }}>VS</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
                </div>
              </div>

              <H2HAthleteCard
                name={athlete2.name}
                nationality={athlete2.nationality}
                profileImage={athlete2.profile_image}
                imageError={athlete2ImageError}
                onImageError={() => setAthlete2ImageError(true)}
                color="teal"
              />
            </div>

            {/* Stats Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <H2HOverviewCard
                athlete1Name={athlete1.name}
                athlete2Name={athlete2.name}
                athlete1Place={athlete1.place}
                athlete2Place={athlete2.place}
                heatWins={comparison.heat_wins}
              />

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
                        <H2HStatBar
                          label="Best"
                          athlete1Value={comparison.heat_scores_best.athlete1_value}
                          athlete2Value={comparison.heat_scores_best.athlete2_value}
                          winner={comparison.heat_scores_best.winner}
                          difference={comparison.heat_scores_best.difference}
                          athlete1Name={athlete1.name}
                          athlete2Name={athlete2.name}
                          maxValue={maxHeat}
                        />
                        <H2HStatBar
                          label="Average"
                          athlete1Value={comparison.heat_scores_avg.athlete1_value}
                          athlete2Value={comparison.heat_scores_avg.athlete2_value}
                          winner={comparison.heat_scores_avg.winner}
                          difference={comparison.heat_scores_avg.difference}
                          athlete1Name={athlete1.name}
                          athlete2Name={athlete2.name}
                          maxValue={maxHeat}
                        />
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
                        <H2HStatBar
                          label="Best"
                          athlete1Value={comparison.jumps_best.athlete1_value}
                          athlete2Value={comparison.jumps_best.athlete2_value}
                          winner={comparison.jumps_best.winner}
                          difference={comparison.jumps_best.difference}
                          athlete1Name={athlete1.name}
                          athlete2Name={athlete2.name}
                          maxValue={maxJumps}
                        />
                        <H2HStatBar
                          label="Average Counting"
                          athlete1Value={comparison.jumps_avg_counting.athlete1_value}
                          athlete2Value={comparison.jumps_avg_counting.athlete2_value}
                          winner={comparison.jumps_avg_counting.winner}
                          difference={comparison.jumps_avg_counting.difference}
                          athlete1Name={athlete1.name}
                          athlete2Name={athlete2.name}
                          maxValue={maxJumps}
                        />
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
                        <H2HStatBar
                          label="Best"
                          athlete1Value={comparison.waves_best.athlete1_value}
                          athlete2Value={comparison.waves_best.athlete2_value}
                          winner={comparison.waves_best.winner}
                          difference={comparison.waves_best.difference}
                          athlete1Name={athlete1.name}
                          athlete2Name={athlete2.name}
                          maxValue={maxWaves}
                        />
                        <H2HStatBar
                          label="Average Counting"
                          athlete1Value={comparison.waves_avg_counting.athlete1_value}
                          athlete2Value={comparison.waves_avg_counting.athlete2_value}
                          winner={comparison.waves_avg_counting.winner}
                          difference={comparison.waves_avg_counting.difference}
                          athlete1Name={athlete1.name}
                          athlete2Name={athlete2.name}
                          maxValue={maxWaves}
                        />
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
