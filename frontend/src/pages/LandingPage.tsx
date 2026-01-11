import { Link } from 'react-router-dom';
import { ArrowRight, Info } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import StatCounter from '../components/StatCounter';
import { apiService } from '../services/api';

const LandingPage = () => {
  // Fetch global stats from API
  const { data: statsData, isLoading, isError } = useQuery({
    queryKey: ['globalStats'],
    queryFn: () => apiService.getGlobalStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Parse stats from API response or use fallback values
  const totalEvents = statsData?.stats.find(s => s.metric === 'total events')?.value || '35';
  const totalAthletes = statsData?.stats.find(s => s.metric === 'total athletes')?.value || '250';
  const totalScores = statsData?.stats.find(s => s.metric === 'total scores')?.value || '25000';

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight leading-none">
              WINDSURF WORLD TOUR STATS
            </h1>
            <p className="text-base md:text-lg text-gray-300 mb-8">
              Track every heat, jump, and wave from qualification to finals from the challengers to the champions.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/events"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 text-white font-semibold rounded-md hover:bg-cyan-600 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30"
              >
                Browse Events
                <ArrowRight size={18} />
              </Link>
              <button
                disabled
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-cyan-500/50 text-cyan-400/70 font-semibold rounded-md cursor-not-allowed"
              >
                Coming Soon: Athletes
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Informational Notice */}
      <section className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 flex items-start gap-3">
            <Info className="text-cyan-400 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-gray-300">
              Right now the site only contains wave event data. Slalom and freestyle event data will get added later in 2026.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {/* Events Stat */}
            <div className="text-center">
              <div className="mb-2">
                {isLoading || isError ? (
                  <div className="text-6xl font-bold text-gray-500">-</div>
                ) : (
                  <StatCounter end={parseInt(totalEvents)} duration={1500} delay={0} />
                )}
              </div>
              <p className="text-sm text-gray-400" style={{ fontFamily: 'var(--font-inter)' }}>
                Events (since 2016)
              </p>
            </div>

            {/* Athletes Stat */}
            <div className="text-center">
              <div className="mb-2">
                {isLoading || isError ? (
                  <div className="text-6xl font-bold text-gray-500">-</div>
                ) : (
                  <StatCounter end={parseInt(totalAthletes)} duration={1500} delay={100} />
                )}
              </div>
              <p className="text-sm text-gray-400" style={{ fontFamily: 'var(--font-inter)' }}>
                Athletes
              </p>
            </div>

            {/* Scores Stat */}
            <div className="text-center">
              <div className="mb-2">
                {isLoading || isError ? (
                  <div className="text-6xl font-bold text-gray-500">-</div>
                ) : (
                  <StatCounter end={parseInt(totalScores)} duration={1500} delay={200} />
                )}
              </div>
              <p className="text-sm text-gray-400" style={{ fontFamily: 'var(--font-inter)' }}>
                Wave and Jump Scores
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
