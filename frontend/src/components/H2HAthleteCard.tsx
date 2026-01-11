import { User } from 'lucide-react';

interface H2HAthleteCardProps {
  name: string;
  nationality: string;
  profileImage?: string | null;
  imageError: boolean;
  onImageError: () => void;
  color: 'cyan' | 'teal';
}

const H2HAthleteCard = ({
  name,
  nationality,
  profileImage,
  imageError,
  onImageError,
  color,
}: H2HAthleteCardProps) => {
  const borderColor = color === 'cyan' ? 'border-cyan-400' : 'border-teal-400';
  const textColor = color === 'cyan' ? 'text-cyan-400' : 'text-teal-400';

  return (
    <div className="flex flex-col items-center text-center gap-3">
      {profileImage && !imageError ? (
        <img
          src={profileImage}
          alt={name}
          className={`w-28 h-28 rounded-lg object-cover border-4 ${borderColor}`}
          onError={onImageError}
        />
      ) : (
        <div className={`w-28 h-28 bg-slate-700/50 rounded-lg flex items-center justify-center border-4 ${borderColor}`}>
          <User className={textColor} size={44} />
        </div>
      )}
      <div>
        <h3 className={`text-xl font-bold ${textColor} mb-1`} style={{ fontFamily: 'var(--font-inter)' }}>
          {name}
        </h3>
        <p className="text-sm text-gray-400" style={{ fontFamily: 'var(--font-inter)' }}>
          {nationality}
        </p>
      </div>
    </div>
  );
};

export default H2HAthleteCard;
