import { useParams, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Star, User, Loader2, Info, X } from 'lucide-react';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import FeatureCard from '../components/FeatureCard';
import ResultsTable from '../components/ResultsTable';
import EventStatsTabContent, { extractFilterOptions } from '../components/EventStatsTabContent';
import AthleteStatsTab, { extractAthleteFilterOptions } from '../components/AthleteStatsTab';
import HeadToHeadComparison from '../components/HeadToHeadComparison';
import Select from '../components/ui/Select';
import SearchableSelect from '../components/ui/SearchableSelect';
import EmptyState from '../components/ui/EmptyState';

type TabType = 'results' | 'event-stats' | 'athlete-stats' | 'head-to-head';
type GenderType = 'all' | 'men' | 'women';

const validTabs: TabType[] = ['results', 'event-stats', 'athlete-stats', 'head-to-head'];
const validGenders: GenderType[] = ['men', 'women'];

const EventResultsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize from URL params
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const tab = searchParams.get('tab') as TabType;
    return validTabs.includes(tab) ? tab : 'results';
  });
  const [genderFilter, setGenderFilter] = useState<GenderType>(() => {
    const gender = searchParams.get('gender') as GenderType;
    return validGenders.includes(gender) ? gender : 'women';
  });
  const [selectedAthleteId, setSelectedAthleteId] = useState<number | null>(null);
  const [defaultSet, setDefaultSet] = useState(false);
  const [genderSwitchNotice, setGenderSwitchNotice] = useState(false);

  // Event stats filter state
  const [roundFilter, setRoundFilter] = useState('');
  const [heatFilter, setHeatFilter] = useState('');
  const [eliminationFilter, setEliminationFilter] = useState('');

  // Athlete stats filter state (separate from event stats)
  const [athleteRoundFilter, setAthleteRoundFilter] = useState('');
  const [athleteHeatFilter, setAthleteHeatFilter] = useState('');
  const [athleteEliminationFilter, setAthleteEliminationFilter] = useState('');
  const [athleteFilterOptions, setAthleteFilterOptions] = useState<ReturnType<typeof extractAthleteFilterOptions> | null>(null);

  // Refs for tab navigation scrolling
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const tabContainerRef = useRef<HTMLDivElement | null>(null);

  // Update URL when tab or gender changes
  const updateUrlParams = useCallback(() => {
    const params = new URLSearchParams();
    if (activeTab !== 'results') params.set('tab', activeTab);
    if (genderFilter !== 'women') params.set('gender', genderFilter);
    setSearchParams(params, { replace: true });
  }, [activeTab, genderFilter, setSearchParams]);

  useEffect(() => {
    updateUrlParams();
  }, [updateUrlParams]);

  const { data: event, isLoading, error, refetch } = useQuery({
    queryKey: ['event', id],
    queryFn: () => apiService.getEvent(Number(id)),
    enabled: !!id,
    retry: 1,
  });

  // Fetch athlete results with gender filter
  const { data: resultsData, isLoading: resultsLoading } = useQuery({
    queryKey: ['athleteResults', event?.event_id, genderFilter],
    queryFn: () => apiService.getAthleteResults({
      event_id: event?.event_id,
      sex: genderFilter === 'all' ? undefined : genderFilter === 'men' ? 'Men' : 'Women',
      page_size: 100,
    }),
    enabled: !!event?.event_id,
    retry: 1,
  });

  // Fetch event stats with gender filter
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['eventStats', id, genderFilter],
    queryFn: () => apiService.getEventStats(
      Number(id),
      genderFilter === 'men' ? 'Men' : 'Women'
    ),
    enabled: !!id && genderFilter !== 'all',
    retry: 1,
  });

  // Fetch athlete list for event
  const { data: athleteListData, isLoading: athleteListLoading } = useQuery({
    queryKey: ['eventAthletes', event?.id, genderFilter],
    queryFn: () => apiService.getEventAthletes(
      event!.id,
      genderFilter === 'men' ? 'Men' : 'Women'
    ),
    enabled: !!event?.id && genderFilter !== 'all' && activeTab === 'athlete-stats',
    retry: 1,
  });

  // Derive filter options from stats data
  const filterOptions = useMemo(
    () => statsData ? extractFilterOptions(statsData) : {
      uniqueRounds: [],
      uniqueHeats: [],
      uniqueEliminations: [],
      getHeatsForRound: () => [],
      getRoundsForElimination: () => []
    },
    [statsData]
  );

  // Get available rounds based on selected elimination (cascading filter)
  const availableRounds = useMemo(
    () => filterOptions.getRoundsForElimination(eliminationFilter),
    [filterOptions, eliminationFilter]
  );

  // Get available heats based on selected round (cascading filter)
  const availableHeats = useMemo(
    () => filterOptions.getHeatsForRound(roundFilter),
    [filterOptions, roundFilter]
  );

  // Handle elimination filter change - clear round and heat if not valid
  const handleEliminationChange = useCallback((newElimination: string) => {
    setEliminationFilter(newElimination);
    // If switching elimination, check if current round is still valid
    if (newElimination && roundFilter) {
      const roundsForElimination = filterOptions.getRoundsForElimination(newElimination);
      if (!roundsForElimination.includes(roundFilter)) {
        setRoundFilter('');
        setHeatFilter('');
      }
    }
  }, [filterOptions, roundFilter]);

  // Handle round filter change - clear heat if not valid for new round
  const handleRoundChange = useCallback((newRound: string) => {
    setRoundFilter(newRound);
    // If switching to a specific round and current heat is not valid, clear it
    if (newRound && heatFilter) {
      const heatsForNewRound = filterOptions.getHeatsForRound(newRound);
      if (!heatsForNewRound.includes(heatFilter)) {
        setHeatFilter('');
      }
    }
  }, [filterOptions, heatFilter]);

  // Athlete stats cascading filter handlers
  const handleAthleteEliminationChange = useCallback((newElimination: string) => {
    setAthleteEliminationFilter(newElimination);
    if (newElimination && athleteRoundFilter && athleteFilterOptions) {
      const roundsForElimination = athleteFilterOptions.getRoundsForElimination(newElimination);
      if (!roundsForElimination.includes(athleteRoundFilter)) {
        setAthleteRoundFilter('');
        setAthleteHeatFilter('');
      }
    }
  }, [athleteFilterOptions, athleteRoundFilter]);

  const handleAthleteRoundChange = useCallback((newRound: string) => {
    setAthleteRoundFilter(newRound);
    if (newRound && athleteHeatFilter && athleteFilterOptions) {
      const heatsForNewRound = athleteFilterOptions.getHeatsForRound(newRound);
      if (!heatsForNewRound.includes(athleteHeatFilter)) {
        setAthleteHeatFilter('');
      }
    }
  }, [athleteFilterOptions, athleteHeatFilter]);

  // Get available rounds and heats for athlete stats filters based on current selection
  const athleteAvailableRounds = useMemo(
    () => athleteFilterOptions?.getRoundsForElimination(athleteEliminationFilter) || [],
    [athleteFilterOptions, athleteEliminationFilter]
  );

  const athleteAvailableHeats = useMemo(
    () => athleteFilterOptions?.getHeatsForRound(athleteRoundFilter) || [],
    [athleteFilterOptions, athleteRoundFilter]
  );

  // Handle gender change - reset all filters
  const handleGenderChange = useCallback((newGender: GenderType) => {
    setGenderFilter(newGender);
    // Reset event stats filters
    setRoundFilter('');
    setHeatFilter('');
    setEliminationFilter('');
    // Reset athlete stats filters
    setAthleteRoundFilter('');
    setAthleteHeatFilter('');
    setAthleteEliminationFilter('');
  }, []);

  // Set default gender filter and selected athlete based on available results
  useEffect(() => {
    if (!defaultSet && resultsData?.results !== undefined && event?.event_id) {
      // If no results for women, check if men's results exist
      if (resultsData.results.length === 0 && genderFilter === 'women') {
        // Show notice and switch to men's results
        setGenderSwitchNotice(true);
        setGenderFilter('men');
      }
      setDefaultSet(true);
    }
  }, [resultsData, event?.event_id, defaultSet, genderFilter]);

  // Auto-dismiss the gender switch notice after 5 seconds
  useEffect(() => {
    if (genderSwitchNotice) {
      const timer = setTimeout(() => setGenderSwitchNotice(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [genderSwitchNotice]);

  // Reset selected athlete when gender filter changes (but not when navigating to athlete-stats)
  useEffect(() => {
    setSelectedAthleteId(null);
  }, [genderFilter]);

  // Reset athlete stats filters when selected athlete changes
  useEffect(() => {
    setAthleteRoundFilter('');
    setAthleteHeatFilter('');
    setAthleteEliminationFilter('');
  }, [selectedAthleteId]);

  // Handle clicking on an athlete name to navigate to their stats
  const handleAthleteClick = (athleteId: number) => {
    setSelectedAthleteId(athleteId);
    setActiveTab('athlete-stats');
  };

  // Set default selected athlete when athlete list loads
  useEffect(() => {
    if (athleteListData?.athletes && athleteListData.athletes.length > 0 && selectedAthleteId === null) {
      // Default to first athlete (winner)
      setSelectedAthleteId(athleteListData.athletes[0].athlete_id);
    }
  }, [athleteListData, selectedAthleteId]);

  // Auto-scroll active tab into view on mobile
  useEffect(() => {
    const activeTabElement = tabRefs.current[activeTab];
    if (activeTabElement && tabContainerRef.current) {
      // Scroll the active tab into view, centered
      activeTabElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen pt-16">
      {/* Back Navigation */}
      <section className="px-4 sm:px-6 lg:px-8 pt-8">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-semibold">Back to Events</span>
          </Link>
        </div>
      </section>

      {/* Gender Switch Notice */}
      {genderSwitchNotice && (
        <section className="px-4 sm:px-6 lg:px-8 pt-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Info className="text-blue-400 flex-shrink-0" size={18} />
                <p className="text-sm text-gray-300">
                  No women's results available for this event. Showing men's results instead.
                </p>
              </div>
              <button
                onClick={() => setGenderSwitchNotice(false)}
                className="text-gray-400 hover:text-gray-300 transition-colors"
                aria-label="Dismiss notice"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Page Header */}
      <section className="px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-12 bg-slate-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-slate-700 rounded w-1/2"></div>
            </div>
          ) : error ? (
            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6">
              <EmptyState
                variant="error"
                title="Failed to Load Event"
                description="Unable to fetch event details from the server."
                onRetry={() => refetch()}
              />
            </div>
          ) : event ? (
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-2 tracking-tight leading-none uppercase">
                {event.event_name}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-sm md:text-base text-gray-400">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span>{event.country_flag}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{event.event_date}</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  {event.stars && (
                    <>
                      <span className="hidden sm:inline">•</span>
                      <div className="flex items-center gap-1">
                        <Star className="text-yellow-400 fill-yellow-400" size={16} />
                        <span className="font-semibold">{event.stars}</span>
                      </div>
                    </>
                  )}
                  {(event.total_men || event.total_women) && (
                    <>
                      <span className="hidden sm:inline">•</span>
                      <div className="flex items-center gap-3">
                        {event.total_men !== null && event.total_men > 0 && (
                          <div className="flex items-center gap-1">
                            <User className="text-blue-400" size={16} />
                            <span className="font-semibold">{event.total_men}</span>
                          </div>
                        )}
                        {event.total_women !== null && event.total_women > 0 && (
                          <div className="flex items-center gap-1">
                            <User className="text-pink-400" size={16} />
                            <span className="font-semibold">{event.total_women}</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="px-4 sm:px-6 lg:px-8 py-4 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto">
          <div ref={tabContainerRef} className="flex gap-1 overflow-x-auto scrollbar-hide">
            <button
              ref={(el) => { tabRefs.current['results'] = el; }}
              onClick={() => setActiveTab('results')}
              className={`px-6 py-3 font-semibold text-sm uppercase tracking-wide transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'results'
                  ? 'text-white border-b-2 border-cyan-500'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Results
              {activeTab === 'results' && resultsLoading && (
                <Loader2 size={14} className="animate-spin text-cyan-400" />
              )}
            </button>
            <button
              ref={(el) => { tabRefs.current['event-stats'] = el; }}
              onClick={() => setActiveTab('event-stats')}
              className={`px-6 py-3 font-semibold text-sm uppercase tracking-wide transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'event-stats'
                  ? 'text-white border-b-2 border-cyan-500'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Event Stats
              {activeTab === 'event-stats' && statsLoading && (
                <Loader2 size={14} className="animate-spin text-cyan-400" />
              )}
            </button>
            <button
              ref={(el) => { tabRefs.current['athlete-stats'] = el; }}
              onClick={() => setActiveTab('athlete-stats')}
              className={`px-6 py-3 font-semibold text-sm uppercase tracking-wide transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'athlete-stats'
                  ? 'text-white border-b-2 border-cyan-500'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Athlete Stats
              {activeTab === 'athlete-stats' && athleteListLoading && (
                <Loader2 size={14} className="animate-spin text-cyan-400" />
              )}
            </button>
            <button
              ref={(el) => { tabRefs.current['head-to-head'] = el; }}
              onClick={() => setActiveTab('head-to-head')}
              className={`px-6 py-3 font-semibold text-sm uppercase tracking-wide transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'head-to-head'
                  ? 'text-white border-b-2 border-cyan-500'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Head to Head
            </button>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-4 pb-2">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 flex-wrap">
            <Select
              value={genderFilter}
              onChange={(e) => handleGenderChange(e.target.value as GenderType)}
              aria-label="Filter by gender"
            >
              <option value="men">Men</option>
              <option value="women">Women</option>
            </Select>

            {/* Cascading Filters - only show on Event Stats tab */}
            {/* Order: Gender → Elimination → Round → Heat (each filters the next) */}
            {activeTab === 'event-stats' && filterOptions.uniqueRounds.length > 0 && (
              <>
                {/* Elimination filter - only show if there are elimination types (PWA events) */}
                {filterOptions.uniqueEliminations.length > 0 && (
                  <Select
                    value={eliminationFilter}
                    onChange={(e) => handleEliminationChange(e.target.value)}
                    aria-label="Filter by elimination"
                  >
                    <option value="">All Eliminations</option>
                    {filterOptions.uniqueEliminations.map((elim) => (
                      <option key={elim} value={elim}>{elim}</option>
                    ))}
                  </Select>
                )}

                {/* Round filter - options depend on selected elimination */}
                <Select
                  value={roundFilter}
                  onChange={(e) => handleRoundChange(e.target.value)}
                  aria-label="Filter by round"
                >
                  <option value="">All Rounds</option>
                  {availableRounds.map((round) => (
                    <option key={round} value={round}>{round}</option>
                  ))}
                </Select>

                {/* Heat filter - options depend on selected round */}
                <Select
                  value={heatFilter}
                  onChange={(e) => setHeatFilter(e.target.value)}
                  aria-label="Filter by heat"
                >
                  <option value="">All Heats</option>
                  {availableHeats.map((heat) => (
                    <option key={heat} value={heat}>Heat {heat}</option>
                  ))}
                </Select>

                {(roundFilter || heatFilter || eliminationFilter) && (
                  <button
                    onClick={() => {
                      setEliminationFilter('');
                      setRoundFilter('');
                      setHeatFilter('');
                    }}
                    className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors px-2"
                  >
                    Clear
                  </button>
                )}
              </>
            )}

            {/* Athlete Filter and Cascading Score Filters - only show on Athlete Stats tab */}
            {activeTab === 'athlete-stats' && (
              <>
                <SearchableSelect
                  options={
                    athleteListData?.athletes?.map((athlete) => ({
                      value: athlete.athlete_id,
                      label: `${athlete.overall_position}. ${athlete.name} (${athlete.country_code})`,
                    })) || []
                  }
                  value={selectedAthleteId}
                  onChange={(val) => setSelectedAthleteId(val as number | null)}
                  placeholder={athleteListLoading ? 'Loading athletes...' : 'Search athletes...'}
                  aria-label="Select athlete"
                  disabled={athleteListLoading || !athleteListData?.athletes.length}
                  className="min-w-[280px]"
                />

                {/* Cascading Filters for Athlete Stats - Elimination → Round → Heat */}
                {selectedAthleteId && athleteFilterOptions && athleteAvailableRounds.length > 0 && (
                  <>
                    {/* Elimination filter - only show if there are elimination types */}
                    {athleteFilterOptions.uniqueEliminations.length > 0 && (
                      <Select
                        value={athleteEliminationFilter}
                        onChange={(e) => handleAthleteEliminationChange(e.target.value)}
                        aria-label="Filter by elimination"
                      >
                        <option value="">All Eliminations</option>
                        {athleteFilterOptions.uniqueEliminations.map((elim) => (
                          <option key={elim} value={elim}>{elim}</option>
                        ))}
                      </Select>
                    )}

                    {/* Round filter - options depend on selected elimination */}
                    <Select
                      value={athleteRoundFilter}
                      onChange={(e) => handleAthleteRoundChange(e.target.value)}
                      aria-label="Filter by round"
                    >
                      <option value="">All Rounds</option>
                      {athleteAvailableRounds.map((round) => (
                        <option key={round} value={round}>{round}</option>
                      ))}
                    </Select>

                    {/* Heat filter - options depend on selected round */}
                    <Select
                      value={athleteHeatFilter}
                      onChange={(e) => setAthleteHeatFilter(e.target.value)}
                      aria-label="Filter by heat"
                    >
                      <option value="">All Heats</option>
                      {athleteAvailableHeats.map((heat) => (
                        <option key={heat} value={heat}>Heat {heat}</option>
                      ))}
                    </Select>

                    {(athleteRoundFilter || athleteHeatFilter || athleteEliminationFilter) && (
                      <button
                        onClick={() => {
                          setAthleteEliminationFilter('');
                          setAthleteRoundFilter('');
                          setAthleteHeatFilter('');
                        }}
                        className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors px-2"
                      >
                        Clear
                      </button>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="px-4 sm:px-6 lg:px-8 py-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'results' ? (
            <FeatureCard title="Final Rankings" isLoading={resultsLoading}>
              <ResultsTable
                results={resultsData?.results || []}
                isLoading={resultsLoading}
                onAthleteClick={handleAthleteClick}
              />
            </FeatureCard>
          ) : activeTab === 'event-stats' ? (
            <EventStatsTabContent
              statsData={statsData}
              isLoading={statsLoading}
              onAthleteClick={handleAthleteClick}
              roundFilter={roundFilter}
              heatFilter={heatFilter}
              eliminationFilter={eliminationFilter}
            />
          ) : activeTab === 'athlete-stats' ? (
            <AthleteStatsTab
              eventId={event?.id || 0}
              selectedAthleteId={selectedAthleteId}
              sex={genderFilter === 'men' ? 'Men' : 'Women'}
              eliminationFilter={athleteEliminationFilter}
              roundFilter={athleteRoundFilter}
              heatFilter={athleteHeatFilter}
              onFilterOptionsChange={setAthleteFilterOptions}
            />
          ) : (
            <HeadToHeadComparison
              eventId={event?.id || 0}
              gender={genderFilter === 'men' ? 'Men' : 'Women'}
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default EventResultsPage;
