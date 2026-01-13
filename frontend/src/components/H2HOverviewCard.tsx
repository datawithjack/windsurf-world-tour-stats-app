import FeatureCard from './FeatureCard';

interface ComparisonStat {
  athlete1_value: number;
  athlete2_value: number;
  winner: 'athlete1' | 'athlete2' | 'tie';
  difference: number;
}

interface H2HOverviewCardProps {
  athlete1Name: string;
  athlete2Name: string;
  athlete1Place: number;
  athlete2Place: number;
  heatWins: ComparisonStat;
}

// Helper to get ordinal suffix
const getPlacementSuffix = (placement: number): string => {
  const lastTwo = placement % 100;
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

const H2HOverviewCard = ({
  athlete1Name,
  athlete2Name,
  athlete1Place,
  athlete2Place,
  heatWins,
}: H2HOverviewCardProps) => {
  const athlete1Surname = athlete1Name.split(' ').pop() || athlete1Name;
  const athlete2Surname = athlete2Name.split(' ').pop() || athlete2Name;

  return (
    <FeatureCard title="Overview">
      <div className="space-y-6">
        {/* Placement Comparison */}
        <div>
          <h5 className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-4 text-center">
            Final Placement
          </h5>
          <div className="flex items-center justify-center gap-8 py-2">
            <div className="text-center">
              <div
                className={`text-4xl sm:text-5xl font-bold mb-2 font-bebas ${
                  athlete1Place < athlete2Place ? 'text-cyan-400' : 'text-gray-400'
                }`}
              >
                {athlete1Place}{getPlacementSuffix(athlete1Place)}
              </div>
              <p className={`text-xs font-medium ${
                athlete1Place < athlete2Place ? 'text-cyan-400' : 'text-gray-500'
              }`}>
                {athlete1Surname}
              </p>
            </div>
            <div className="text-xl text-gray-600 font-bold font-bebas">VS</div>
            <div className="text-center">
              <div
                className={`text-4xl sm:text-5xl font-bold mb-2 font-bebas ${
                  athlete2Place < athlete1Place ? 'text-teal-400' : 'text-gray-400'
                }`}
              >
                {athlete2Place}{getPlacementSuffix(athlete2Place)}
              </div>
              <p className={`text-xs font-medium ${
                athlete2Place < athlete1Place ? 'text-teal-400' : 'text-gray-500'
              }`}>
                {athlete2Surname}
              </p>
            </div>
          </div>
        </div>

        {/* Heat Wins */}
        <div className="border-t border-slate-700/30 pt-4">
          <h5 className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-4 text-center">
            Heat Wins
          </h5>
          <div className="flex items-center justify-center gap-8 py-2">
            <div className="text-center">
              <div
                className={`text-4xl sm:text-5xl font-bold mb-2 font-bebas ${
                  heatWins.winner === 'athlete1' ? 'text-cyan-400' : 'text-gray-400'
                }`}
              >
                {heatWins.athlete1_value}
              </div>
              <p className={`text-xs font-medium ${
                heatWins.winner === 'athlete1' ? 'text-cyan-400' : 'text-gray-500'
              }`}>
                {athlete1Surname}
              </p>
            </div>
            <div className="text-xl text-gray-600 font-bold font-bebas">VS</div>
            <div className="text-center">
              <div
                className={`text-4xl sm:text-5xl font-bold mb-2 font-bebas ${
                  heatWins.winner === 'athlete2' ? 'text-teal-400' : 'text-gray-400'
                }`}
              >
                {heatWins.athlete2_value}
              </div>
              <p className={`text-xs font-medium ${
                heatWins.winner === 'athlete2' ? 'text-teal-400' : 'text-gray-500'
              }`}>
                {athlete2Surname}
              </p>
            </div>
          </div>
        </div>
      </div>
    </FeatureCard>
  );
};

export default H2HOverviewCard;
