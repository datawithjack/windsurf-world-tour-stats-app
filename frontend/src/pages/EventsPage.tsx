import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { Calendar, MapPin, Star, User, LayoutGrid, List } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import Select from '../components/ui/Select';
import EmptyState from '../components/ui/EmptyState';

const EventsPage = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('wave');
  const [statusFilter, setStatusFilter] = useState<string>('completed');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    const saved = localStorage.getItem('eventsViewMode');
    return saved === 'list' ? 'list' : 'grid';
  });

  // Persist view mode preference
  useEffect(() => {
    localStorage.setItem('eventsViewMode', viewMode);
  }, [viewMode]);

  const { data: eventsData, isLoading, error, refetch } = useQuery({
    queryKey: ['events', eventTypeFilter],
    queryFn: () => apiService.getEvents(1, 50, eventTypeFilter === 'wave'),
    retry: 1,
  });

  // Sort events by start_date descending (latest first)
  const sortedEvents = eventsData?.events.sort((a, b) =>
    new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  );

  // Extract available years from events
  const availableYears = useMemo(() => {
    if (!sortedEvents) return [];
    const years = sortedEvents.map(event => new Date(event.start_date).getFullYear());
    return Array.from(new Set(years)).sort((a, b) => b - a);
  }, [sortedEvents]);

  // Apply filters
  const events = useMemo(() => {
    if (!sortedEvents) return [];

    return sortedEvents.filter(event => {
      const eventYear = new Date(event.start_date).getFullYear();
      const matchesYear = yearFilter === 'all' || eventYear === parseInt(yearFilter);

      const matchesType =
        eventTypeFilter === 'all' ||
        (eventTypeFilter === 'wave' && event.has_wave_discipline) ||
        (eventTypeFilter === 'non-wave' && !event.has_wave_discipline);

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'upcoming' && event.event_section === 'Upcoming events') ||
        (statusFilter === 'completed' && event.event_section === 'Completed events');

      return matchesYear && matchesType && matchesStatus;
    });
  }, [sortedEvents, yearFilter, eventTypeFilter, statusFilter]);

  // Group events by year
  const eventsByYear = useMemo(() => {
    if (!events) return {};

    return events.reduce((acc, event) => {
      const year = new Date(event.start_date).getFullYear();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(event);
      return acc;
    }, {} as Record<number, typeof events>);
  }, [events]);

  const getStatusBadge = (event_section: string) => {
    switch (event_section) {
      case 'Upcoming events':
        return 'text-blue-400';
      case 'Completed events':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Page Header */}
      <section className="px-4 sm:px-6 lg:px-8 pt-12 md:pt-16 pb-6 md:pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Title and Description */}
            <div className="max-w-4xl">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight leading-none">
                EVENTS
              </h1>
              <p className="text-base md:text-lg text-gray-300">
                Browse all events from around the world.
              </p>
            </div>

            {/* Filters - Top right on desktop, below title on mobile */}
            <div className="flex items-center gap-3 lg:pt-2 flex-wrap">
              {/* Year Filter */}
              <Select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                aria-label="Filter events by year"
              >
                <option value="all">All Years</option>
                {availableYears.map(year => (
                  <option key={year} value={year.toString()}>{year}</option>
                ))}
              </Select>

              {/* Status Filter */}
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter events by status"
              >
                <option value="all">All</option>
                <option value="completed">Completed</option>
                <option value="upcoming">Upcoming</option>
              </Select>

              {/* Event Type Filter */}
              <Select
                value={eventTypeFilter}
                onChange={(e) => setEventTypeFilter(e.target.value)}
                aria-label="Filter events by type"
              >
                <option value="all">All Events</option>
                <option value="wave">Wave</option>
                <option value="non-wave">Non-Wave</option>
              </Select>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-slate-800/60 border border-slate-700/50 rounded-md p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list'
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg overflow-hidden animate-pulse"
                >
                  {/* Image skeleton */}
                  <div className="h-48 bg-slate-700/50"></div>
                  {/* Content skeleton */}
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-slate-700 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-700 rounded w-1/3"></div>
                    <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                    <div className="h-4 bg-slate-700 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-8 max-w-md mx-auto">
              <EmptyState
                variant="error"
                title="Failed to Load Events"
                description="Unable to fetch events from the server. Please check your connection."
                onRetry={() => refetch()}
              />
            </div>
          ) : events && events.length > 0 ? (
            <div className="space-y-12">
              {Object.entries(eventsByYear)
                .sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA))
                .map(([year, yearEvents]) => (
                  <div key={year}>
                    {/* Year Header */}
                    <div className="mb-6">
                      <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">{year}</h2>
                      <div className="h-1 w-20 bg-cyan-500 rounded"></div>
                    </div>

                    {viewMode === 'grid' ? (
                      /* Grid View */
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {yearEvents.map((event, index) => (
                          <Link key={event.id} to={`/events/${event.id}`}>
                            <motion.div
                              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5, delay: index * 0.05 }}
                              className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg overflow-hidden hover:bg-slate-800/60 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer h-full flex flex-col"
                            >
                              {event.event_image_url && (
                                <div className="relative">
                                  <img
                                    src={event.event_image_url}
                                    alt={event.event_name}
                                    className="w-full h-48 object-cover"
                                  />
                                  {/* Status Badge - Top Left */}
                                  <div className="absolute top-3 left-3">
                                    <span
                                      className={`bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold uppercase whitespace-nowrap ${getStatusBadge(
                                        event.event_section
                                      )}`}
                                    >
                                      {event.event_section.replace(' events', '')}
                                    </span>
                                  </div>
                                  {/* Stars Badge - Top Right */}
                                  {event.stars && (
                                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded">
                                      <Star className="text-yellow-400 fill-yellow-400" size={14} />
                                      <span className="text-xs text-white font-semibold">{event.stars}</span>
                                    </div>
                                  )}
                                </div>
                              )}
                              <div className="p-6 flex-1 flex flex-col">
                                <div className="mb-3">
                                  <h3 className="text-sm md:text-base font-extrabold text-white line-clamp-2 leading-tight" style={{ fontFamily: 'var(--font-inter)' }} title={event.event_name}>
                                    {event.event_name}
                                  </h3>
                                </div>
                                <div className="space-y-2 text-gray-300 mt-auto">
                                  <div className="flex items-center gap-2">
                                    <MapPin className="text-cyan-400 flex-shrink-0" size={16} />
                                    <span className="text-sm">{event.country_flag}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="text-cyan-400 flex-shrink-0" size={16} />
                                    <span className="text-sm">{event.event_date}</span>
                                  </div>
                                  {(event.total_men || event.total_women) && (
                                    <div className="flex items-center gap-3">
                                      {event.total_men !== null && event.total_men > 0 && (
                                        <div className="flex items-center gap-1">
                                          <User className="text-blue-400 flex-shrink-0" size={16} />
                                          <span className="text-sm font-semibold">{event.total_men}</span>
                                        </div>
                                      )}
                                      {event.total_women !== null && event.total_women > 0 && (
                                        <div className="flex items-center gap-1">
                                          <User className="text-pink-400 flex-shrink-0" size={16} />
                                          <span className="text-sm font-semibold">{event.total_women}</span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      /* List View */
                      <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-slate-700/50">
                              <th className="text-left py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                              <th className="text-left py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Event</th>
                              <th className="text-left py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Date</th>
                              <th className="text-left py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Location</th>
                              <th className="text-center py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Athletes</th>
                              <th className="text-center py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Stars</th>
                            </tr>
                          </thead>
                          <tbody>
                            {yearEvents.map((event, index) => (
                              <motion.tr
                                key={event.id}
                                initial={prefersReducedMotion ? false : { opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3, delay: index * 0.02 }}
                                className="border-b border-slate-700/30 last:border-b-0 hover:bg-slate-700/30 transition-colors cursor-pointer focus:outline-none focus:bg-slate-700/40"
                                onClick={() => navigate(`/events/${event.id}`)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    navigate(`/events/${event.id}`);
                                  }
                                }}
                                tabIndex={0}
                                role="button"
                                aria-label={`View ${event.event_name} details`}
                              >
                                <td className="py-3 px-4">
                                  <span
                                    className={`px-2 py-1 rounded text-xs font-semibold uppercase whitespace-nowrap ${getStatusBadge(
                                      event.event_section
                                    )}`}
                                  >
                                    {event.event_section.replace(' events', '')}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <Link
                                    to={`/events/${event.id}`}
                                    className="text-white font-medium hover:text-cyan-400 transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {event.event_name}
                                  </Link>
                                </td>
                                <td className="py-3 px-4 text-gray-300 text-sm hidden md:table-cell">
                                  {event.event_date}
                                </td>
                                <td className="py-3 px-4 text-gray-300 text-sm hidden lg:table-cell">
                                  {event.country_flag}
                                </td>
                                <td className="py-3 px-4 text-center hidden sm:table-cell">
                                  <div className="flex items-center justify-center gap-2">
                                    {event.total_men !== null && event.total_men > 0 && (
                                      <span className="text-blue-400 text-sm font-semibold">{event.total_men}M</span>
                                    )}
                                    {event.total_women !== null && event.total_women > 0 && (
                                      <span className="text-pink-400 text-sm font-semibold">{event.total_women}W</span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  {event.stars && (
                                    <div className="flex items-center justify-center gap-1">
                                      <Star className="text-yellow-400 fill-yellow-400" size={14} />
                                      <span className="text-white text-sm font-semibold">{event.stars}</span>
                                    </div>
                                  )}
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-12 max-w-md mx-auto">
                <Calendar className="text-gray-600 mx-auto mb-4" size={64} />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No Events Found</h3>
                <p className="text-gray-500">
                  There are no events available at the moment. Check back soon!
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default EventsPage;
