import { Link } from 'react-router-dom';
import { Users, Trophy, Calendar, ArrowRight } from 'lucide-react';

interface ComingSoonProps {
  page: 'Athletes' | 'Head to Heads' | string;
}

const pageConfig: Record<string, { icon: typeof Users; description: string; color: string }> = {
  Athletes: {
    icon: Users,
    description: 'Browse athlete profiles, career statistics, and historical performance data across all events.',
    color: 'cyan',
  },
  'Head to Heads': {
    icon: Trophy,
    description: 'Compare any two athletes head-to-head across their entire career history and rivalry stats.',
    color: 'teal',
  },
};

const ComingSoon = ({ page }: ComingSoonProps) => {
  const config = pageConfig[page] || {
    icon: Calendar,
    description: 'This feature is currently under development.',
    color: 'cyan',
  };
  const Icon = config.icon;

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Frosted Glass Card */}
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-8 text-center">
          {/* Icon */}
          <div className={`
            inline-flex items-center justify-center w-20 h-20 rounded-full mb-6
            ${config.color === 'cyan' ? 'bg-cyan-500/10 border-2 border-cyan-500/30' : 'bg-teal-500/10 border-2 border-teal-500/30'}
          `}>
            <Icon
              size={40}
              className={config.color === 'cyan' ? 'text-cyan-400' : 'text-teal-400'}
            />
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
            {page}
          </h1>

          {/* Coming Soon Badge */}
          <span className={`
            inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide mb-4
            ${config.color === 'cyan' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-teal-500/20 text-teal-400'}
          `}>
            Coming Soon
          </span>

          {/* Description */}
          <p className="text-gray-400 text-base mb-8 leading-relaxed">
            {config.description}
          </p>

          {/* CTA Button */}
          <Link
            to="/events"
            className={`
              inline-flex items-center gap-2 px-6 py-3 rounded-md font-semibold text-sm
              transition-all duration-300
              ${config.color === 'cyan'
                ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/30 hover:border-cyan-500/50'
                : 'bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 border border-teal-500/30 hover:border-teal-500/50'
              }
            `}
          >
            Browse Events
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Subtle hint */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Event-level stats are available now on individual event pages
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;
