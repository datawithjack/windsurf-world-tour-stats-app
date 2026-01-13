interface ShowMoreButtonProps {
  currentCount: number;
  totalCount: number;
  increment?: number;
  onShowMore: () => void;
}

const ShowMoreButton = ({
  currentCount,
  totalCount,
  increment = 10,
  onShowMore,
}: ShowMoreButtonProps) => {
  const remaining = totalCount - currentCount;
  if (remaining <= 0) return null;

  return (
    <button
      onClick={onShowMore}
      className="w-full py-2 text-xs text-cyan-400 hover:text-cyan-300 hover:bg-slate-800/40 transition-colors rounded-b-lg border-t border-slate-700/30"
    >
      Show More ({Math.min(remaining, increment)} more, {remaining} remaining)
    </button>
  );
};

export default ShowMoreButton;
