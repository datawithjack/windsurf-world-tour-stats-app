import Select from './ui/Select';

interface StatsFilterBarProps {
  rounds: string[];
  heats: string[];
  roundFilter: string;
  heatFilter: string;
  onRoundChange: (value: string) => void;
  onHeatChange: (value: string) => void;
  onClear: () => void;
}

const StatsFilterBar = ({
  rounds,
  heats,
  roundFilter,
  heatFilter,
  onRoundChange,
  onHeatChange,
  onClear,
}: StatsFilterBarProps) => {
  if (rounds.length === 0 && heats.length === 0) {
    return null;
  }

  const hasActiveFilters = roundFilter || heatFilter;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {rounds.length > 0 && (
        <Select
          value={roundFilter}
          onChange={(e) => onRoundChange(e.target.value)}
        >
          <option value="">All Rounds</option>
          {rounds.map((round) => (
            <option key={round} value={round}>{round}</option>
          ))}
        </Select>
      )}
      {heats.length > 0 && (
        <Select
          value={heatFilter}
          onChange={(e) => onHeatChange(e.target.value)}
        >
          <option value="">All Heats</option>
          {heats.map((heat) => (
            <option key={heat} value={heat}>Heat {heat}</option>
          ))}
        </Select>
      )}
      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors px-2"
        >
          Clear
        </button>
      )}
    </div>
  );
};

export default StatsFilterBar;
