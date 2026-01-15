import EmptyState from './EmptyState';

interface BaseScoreEntry {
  athlete: string;
  athleteId: number;
  score: number;
  round: string;
  heatNo: string;
}

interface ScoreWithMove extends BaseScoreEntry {
  move: string;
}

type ScoreEntry = BaseScoreEntry | ScoreWithMove;

interface Column<T> {
  key: keyof T | 'rank';
  header: string;
  align?: 'left' | 'right';
  render?: (value: unknown, entry: T, index: number) => React.ReactNode;
}

interface ScoreTableProps<T extends ScoreEntry> {
  data: T[];
  columns: Column<T>[];
  visibleCount: number;
  onAthleteClick: (athleteId: number) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  isFiltered?: boolean;
}

function ScoreTable<T extends ScoreEntry>({
  data,
  columns,
  visibleCount,
  onAthleteClick,
  emptyTitle = 'No Data',
  emptyDescription = 'No data available.',
  isFiltered = false,
}: ScoreTableProps<T>) {
  if (data.length === 0) {
    return (
      <EmptyState
        variant={isFiltered ? 'filtered' : 'no-data'}
        title={isFiltered ? 'No Matches Found' : emptyTitle}
        description={isFiltered ? 'Try adjusting your filters.' : emptyDescription}
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-700/50">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide ${
                  col.align === 'right' ? 'text-right' : 'text-left'
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(0, visibleCount).map((entry, index) => (
            <tr
              key={index}
              className="border-b border-slate-700/30 hover:bg-slate-800/40 transition-colors duration-200"
            >
              {columns.map((col) => {
                // Handle custom render
                if (col.render) {
                  const value = col.key === 'rank' ? index + 1 : entry[col.key as keyof T];
                  return (
                    <td
                      key={String(col.key)}
                      className={`py-3 px-4 text-sm ${
                        col.align === 'right' ? 'text-right' : ''
                      }`}
                    >
                      {col.render(value, entry, index)}
                    </td>
                  );
                }

                // Handle rank column
                if (col.key === 'rank') {
                  return (
                    <td key="rank" className="py-3 px-4 text-sm text-gray-400 font-semibold">
                      {index + 1}
                    </td>
                  );
                }

                // Handle athlete column with click
                if (col.key === 'athlete') {
                  return (
                    <td key="athlete" className="py-3 px-4 text-sm">
                      <button
                        onClick={() => onAthleteClick(entry.athleteId)}
                        className="text-white hover:text-cyan-400 transition-colors cursor-pointer text-left"
                      >
                        {entry.athlete}
                      </button>
                    </td>
                  );
                }

                // Handle score column
                if (col.key === 'score') {
                  return (
                    <td
                      key="score"
                      className={`py-3 px-4 text-sm text-white font-semibold ${
                        col.align === 'right' ? 'text-right' : ''
                      }`}
                    >
                      {entry.score != null ? entry.score.toFixed(2) : '0.00'}
                    </td>
                  );
                }

                // Default text rendering
                const value = entry[col.key as keyof T];
                return (
                  <td
                    key={String(col.key)}
                    className={`py-3 px-4 text-sm text-gray-400 ${
                      col.align === 'right' ? 'text-right' : ''
                    }`}
                  >
                    {value != null ? String(value) : '-'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ScoreTable;
