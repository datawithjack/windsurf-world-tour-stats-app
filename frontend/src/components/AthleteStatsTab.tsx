import { useMemo, useEffect, useState } from 'react';
import AthleteDetailPanel from './AthleteDetailPanel';
import { Trophy } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import type { AthleteStatsResponse } from '../types';

// Helper to get initials from a name
const getInitials = (fullName: string): string => {
  const names = fullName.trim().split(' ');
  if (names.length >= 2) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return fullName.substring(0, 2).toUpperCase();
};

// Helper to get ordinal suffix (1st, 2nd, 3rd, 4th, 11th, 21st, etc.)
const getOrdinalSuffix = (n: number): string => {
  const lastTwo = n % 100;
  // Special case for 11, 12, 13
  if (lastTwo >= 11 && lastTwo <= 13) {
    return `${n}th`;
  }
  const lastOne = n % 10;
  switch (lastOne) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
};

// Export function to extract filter options from athlete stats for use in parent component
export const extractAthleteFilterOptions = (athleteStats: AthleteStatsResponse | null | undefined) => {
  if (!athleteStats) {
    return {
      uniqueEliminations: [] as string[],
      uniqueRounds: [] as string[],
      uniqueHeats: [] as string[],
      getRoundsForElimination: () => [] as string[],
      getHeatsForRound: () => [] as string[],
    };
  }

  // Combine all score data
  const allScores = [
    ...(athleteStats.heat_scores || []).map(s => ({
      round: s.round_name,
      heat: s.heat_number,
      elimination: s.elimination_type
    })),
    ...(athleteStats.jump_scores || []).map(s => ({
      round: s.round_name,
      heat: s.heat_number,
      elimination: s.elimination_type
    })),
    ...(athleteStats.wave_scores || []).map(s => ({
      round: s.round_name,
      heat: s.heat_number,
      elimination: s.elimination_type
    })),
  ];

  // Extract unique values
  const uniqueEliminations = [...new Set(allScores.map(s => s.elimination).filter(Boolean))] as string[];
  const uniqueRounds = [...new Set(allScores.map(s => s.round).filter(Boolean))].sort() as string[];
  const uniqueHeats = [...new Set(allScores.map(s => s.heat).filter(Boolean))].sort() as string[];

  // Build maps for cascading filters
  const eliminationToRounds = new Map<string, Set<string>>();
  const roundToHeats = new Map<string, Set<string>>();

  allScores.forEach(score => {
    // Map elimination to rounds
    if (score.elimination && score.round) {
      if (!eliminationToRounds.has(score.elimination)) {
        eliminationToRounds.set(score.elimination, new Set());
      }
      eliminationToRounds.get(score.elimination)!.add(score.round);
    }
    // Also add to "All" elimination
    if (score.round) {
      if (!eliminationToRounds.has('')) {
        eliminationToRounds.set('', new Set());
      }
      eliminationToRounds.get('')!.add(score.round);
    }

    // Map round to heats
    if (score.round && score.heat) {
      if (!roundToHeats.has(score.round)) {
        roundToHeats.set(score.round, new Set());
      }
      roundToHeats.get(score.round)!.add(score.heat);
    }
    // Also add to "All" round
    if (score.heat) {
      if (!roundToHeats.has('')) {
        roundToHeats.set('', new Set());
      }
      roundToHeats.get('')!.add(score.heat);
    }
  });

  return {
    uniqueEliminations,
    uniqueRounds,
    uniqueHeats,
    getRoundsForElimination: (elimination: string) => {
      const rounds = eliminationToRounds.get(elimination) || eliminationToRounds.get('') || new Set();
      return [...rounds].sort();
    },
    getHeatsForRound: (round: string) => {
      const heats = roundToHeats.get(round) || roundToHeats.get('') || new Set();
      return [...heats].sort();
    },
  };
};

interface AthleteStatsTabProps {
  eventId: number;
  selectedAthleteId: number | null;
  sex: 'Men' | 'Women';
  // Optional filter props - if not provided, no filtering is applied
  eliminationFilter?: string;
  roundFilter?: string;
  heatFilter?: string;
  // Callback to notify parent of filter options when data loads
  onFilterOptionsChange?: (options: ReturnType<typeof extractAthleteFilterOptions>) => void;
}

const AthleteStatsTab = ({
  eventId,
  selectedAthleteId,
  sex,
  eliminationFilter = '',
  roundFilter = '',
  heatFilter = '',
  onFilterOptionsChange
}: AthleteStatsTabProps) => {
  const [imageError, setImageError] = useState(false);

  // Reset image error when athlete changes
  useEffect(() => {
    setImageError(false);
  }, [selectedAthleteId]);

  // Fetch athlete stats from API
  // Pass filters to API so fleet stats (fleet_average, fleet_best) are calculated correctly
  const { data: athleteStats, isLoading, error } = useQuery({
    queryKey: ['athleteEventStats', eventId, selectedAthleteId, sex, eliminationFilter, roundFilter, heatFilter],
    queryFn: () => apiService.getAthleteEventStats(eventId, selectedAthleteId!, sex, {
      elimination: eliminationFilter || undefined,
      round_name: roundFilter || undefined,
      heat_number: heatFilter || undefined,
    }),
    enabled: !!eventId && !!selectedAthleteId,
    retry: 1,
  });

  // Extract filter options and notify parent when data changes
  const filterOptions = useMemo(() => extractAthleteFilterOptions(athleteStats), [athleteStats]);

  useEffect(() => {
    if (onFilterOptionsChange && athleteStats) {
      onFilterOptionsChange(filterOptions);
    }
  }, [filterOptions, onFilterOptionsChange, athleteStats]);

  // Filter the data based on selected filters from props
  const filteredAthleteStats = useMemo(() => {
    if (!athleteStats) return null;

    const filterScores = <T extends { round_name: string; heat_number: string; elimination_type?: string | null }>(scores: T[] | undefined): T[] => {
      if (!scores) return [];
      return scores.filter(score => {
        if (eliminationFilter && score.elimination_type !== eliminationFilter) return false;
        if (roundFilter && score.round_name !== roundFilter) return false;
        if (heatFilter && score.heat_number !== heatFilter) return false;
        return true;
      });
    };

    return {
      ...athleteStats,
      heat_scores: filterScores(athleteStats.heat_scores),
      jump_scores: filterScores(athleteStats.jump_scores),
      wave_scores: filterScores(athleteStats.wave_scores),
    };
  }, [athleteStats, eliminationFilter, roundFilter, heatFilter]);

  // Loading state
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

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-12">
          <h3 className="text-xl font-semibold text-red-400 mb-2">Error Loading Stats</h3>
          <p className="text-gray-300">Unable to fetch athlete statistics. Please try again.</p>
        </div>
      </div>
    );
  }

  // No athlete selected
  if (!selectedAthleteId) {
    return (
      <div className="text-center py-12">
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-12">
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No Athlete Selected</h3>
          <p className="text-gray-500">
            Please select an athlete from the dropdown above to view their statistics.
          </p>
        </div>
      </div>
    );
  }

  // Incomplete data - show helpful error
  if (!athleteStats || !athleteStats.profile) {
    console.error('Incomplete athlete stats data:', { athleteStats, eventId, selectedAthleteId, sex });
    return (
      <div className="text-center py-12">
        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-12">
          <h3 className="text-xl font-semibold text-yellow-400 mb-2">No Data Available</h3>
          <p className="text-gray-400">
            Statistics are not available for this athlete at this event.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Event ID: {eventId}, Athlete ID: {selectedAthleteId}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Athlete Profile Card */}
      <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 pb-20 sm:pb-6 relative">
        {/* Overall Position Stat Box - Always top right */}
        <div className="absolute top-6 right-6">
          <div className="w-24 h-24 bg-gradient-to-br from-teal-600/20 to-cyan-600/20 backdrop-blur-sm border border-teal-500/50 rounded-lg flex flex-col items-center justify-center">
            <div className="flex items-center justify-center gap-1">
              {athleteStats.summary_stats?.overall_position <= 3 && (
                <Trophy
                  className={`${
                    athleteStats.summary_stats.overall_position === 1 ? 'text-yellow-400' :
                    athleteStats.summary_stats.overall_position === 2 ? 'text-gray-300' :
                    'text-orange-400'
                  }`}
                  size={14}
                />
              )}
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Position</span>
            </div>
            <p className="text-3xl font-bold text-white">
              {athleteStats.summary_stats?.overall_position
                ? getOrdinalSuffix(athleteStats.summary_stats.overall_position)
                : '-'}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start gap-6 pr-28 sm:pr-32">
          {/* Profile Photo and Name - Mobile */}
          <div className="flex items-start gap-4 sm:gap-6 w-full sm:w-auto">
            <div className="flex-shrink-0">
              {athleteStats.profile?.profile_image && !imageError ? (
                <img
                  src={athleteStats.profile.profile_image}
                  alt={athleteStats.profile.name}
                  className="w-24 h-24 rounded-lg object-cover border border-slate-600/50"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center border border-slate-600/50 text-white text-2xl font-bold">
                  {getInitials(athleteStats.profile?.name || '')}
                </div>
              )}
            </div>

            {/* Name and Country - beside photo on mobile, integrated on desktop */}
            <div className="sm:hidden flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">{athleteStats.profile?.name}</h2>
              <p className="text-sm text-gray-300">{athleteStats.profile?.country}</p>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0 w-full">
            {/* Name and Country - desktop only */}
            <div className="hidden sm:block">
              <h2 className="text-2xl font-bold text-white mb-1">{athleteStats.profile?.name}</h2>
              <p className="text-sm text-gray-300 mb-4">{athleteStats.profile?.country}</p>
            </div>

            {/* Sponsors and Sail Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 sm:mt-0">
              {athleteStats.profile?.sponsors && (
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wide">Sponsors:</span>
                  <p className="text-sm text-gray-300">{athleteStats.profile.sponsors}</p>
                </div>
              )}
              {athleteStats.profile?.sail_number && (
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wide">Sail No:</span>
                  <p className="text-sm text-gray-300">{athleteStats.profile.sail_number}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Athlete Stats Detail - filters are now in parent EventResultsPage */}
      <AthleteDetailPanel
        data={filteredAthleteStats!}
        hasActiveFilters={!!(eliminationFilter || roundFilter || heatFilter)}
      />
    </div>
  );
};

export default AthleteStatsTab;
