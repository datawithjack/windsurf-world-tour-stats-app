import type { AthleteResult } from '../types';
import { useState } from 'react';
import EmptyState from './ui/EmptyState';

interface ResultsTableProps {
  results: AthleteResult[];
  isLoading?: boolean;
  onAthleteClick?: (athleteId: number) => void;
}

interface AthleteAvatarProps {
  src: string;
  name: string;
}

const AthleteAvatar = ({ src, name }: AthleteAvatarProps) => {
  const [imageError, setImageError] = useState(false);

  // Get initials from name
  const getInitials = (fullName: string) => {
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  if (!src || imageError) {
    return (
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold border-2 border-slate-700">
        {getInitials(name)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className="w-10 h-10 rounded-lg object-cover border-2 border-slate-700"
      onError={() => setImageError(true)}
    />
  );
};

const ResultsTable = ({ results, isLoading = false, onAthleteClick }: ResultsTableProps) => {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-10 bg-slate-700 rounded"></div>
        <div className="h-10 bg-slate-700 rounded"></div>
        <div className="h-10 bg-slate-700 rounded"></div>
        <div className="h-10 bg-slate-700 rounded"></div>
        <div className="h-10 bg-slate-700 rounded"></div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <EmptyState
        variant="no-results"
        title="No Results Available"
        description="Results for this event will appear here."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed">
        <thead>
          <tr className="border-b border-slate-700/50">
            <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-12 sm:w-16">
              Rank
            </th>
            <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
              Athlete
            </th>
            <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-32 hidden sm:table-cell">
              Nationality
            </th>
            <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">
              Sponsor
            </th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr
              key={result.id || `result-${index}`}
              className="border-b border-slate-700/30 hover:bg-slate-800/40 transition-colors duration-200"
            >
              <td className="py-3 px-2 sm:py-4 sm:px-4">
                <div className="flex items-center">
                  <span
                    className={`text-base sm:text-lg font-bold ${
                      result.placement === 1
                        ? 'text-yellow-400'
                        : result.placement === 2
                        ? 'text-gray-300'
                        : result.placement === 3
                        ? 'text-amber-600'
                        : 'text-white'
                    }`}
                  >
                    {result.placement}
                  </span>
                </div>
              </td>
              <td className="py-3 px-2 sm:py-4 sm:px-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <AthleteAvatar
                    src={result.profile_picture_url}
                    name={result.athlete_name}
                  />
                  <button
                      onClick={() => onAthleteClick?.(result.athlete_id)}
                      className="text-white font-medium hover:text-cyan-400 transition-colors cursor-pointer text-left"
                    >
                      {result.athlete_name}
                    </button>
                </div>
              </td>
              <td className="py-3 px-2 sm:py-4 sm:px-4 hidden sm:table-cell">
                <span className="text-gray-300">{result.nationality}</span>
              </td>
              <td className="py-3 px-2 sm:py-4 sm:px-4 hidden md:table-cell">
                {result.pwa_sponsors && (
                  <span className="text-gray-400 italic text-sm">{result.pwa_sponsors}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;
