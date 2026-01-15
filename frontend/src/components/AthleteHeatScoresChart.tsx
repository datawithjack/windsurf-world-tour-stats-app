import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList, ReferenceLine } from 'recharts';

interface HeatScoreData {
  roundName: string;
  heatNumber?: string;
  score: number;
  type?: string | null;
}

interface AthleteHeatScoresChartProps {
  data: HeatScoreData[];
  isLoading?: boolean;
}

// Colors for elimination types - high contrast
const COLORS = {
  Single: '#22d3ee', // cyan-400
  Double: '#8b5cf6', // violet-500
  Default: '#64748b', // slate-500 for null/unknown
};

const AthleteHeatScoresChart = ({ data, isLoading = false }: AthleteHeatScoresChartProps) => {
  // Loading skeleton
  if (isLoading) {
    return (
      <div>
        {/* Legend skeleton */}
        <div className="flex justify-center gap-6 mb-4">
          <div className="animate-pulse flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-slate-700"></div>
            <div className="h-4 w-28 bg-slate-700 rounded"></div>
          </div>
          <div className="animate-pulse flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-slate-700"></div>
            <div className="h-4 w-28 bg-slate-700 rounded"></div>
          </div>
        </div>
        {/* Chart skeleton */}
        <div className="animate-pulse h-[300px] bg-slate-700/50 rounded-lg flex items-end justify-around p-4 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-1">
              <div className="w-full bg-slate-600 rounded-t" style={{ height: `${30 + Math.random() * 50}%` }}></div>
              <div className="h-3 w-10 bg-slate-600 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Handle empty or invalid data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-gray-500">
        No heat score data available
      </div>
    );
  }

  // Sort data by elimination type (Single first), then by round order
  const sortedData = useMemo(() => {
    const getRoundOrder = (roundName: string): number => {
      const lowerRound = roundName?.toLowerCase() || '';
      if (lowerRound.includes('final')) {
        if (lowerRound.includes('quarter')) return 900;
        if (lowerRound.includes('semi')) return 950;
        if (lowerRound === 'final' || lowerRound === 'finals') return 1000;
      }
      const roundMatch = roundName?.match(/round\s*(\d+)/i);
      if (roundMatch) return parseInt(roundMatch[1], 10);
      return 500;
    };

    return [...data].sort((a, b) => {
      // Sort by elimination type first (Single before Double, null last)
      const typeOrder = { 'Single': 0, 'Double': 1, 'null': 2, 'undefined': 2 };
      const aTypeOrder = typeOrder[a.type as keyof typeof typeOrder] ?? 2;
      const bTypeOrder = typeOrder[b.type as keyof typeof typeOrder] ?? 2;
      if (aTypeOrder !== bTypeOrder) return aTypeOrder - bTypeOrder;

      // Then by round order
      return getRoundOrder(a.roundName) - getRoundOrder(b.roundName);
    });
  }, [data]);

  // Add index for unique identification and prepare chart data
  const chartData = sortedData.map((item, index) => ({
    ...item,
    index,
    // Create a unique identifier for x-axis
    label: item.heatNumber || `Heat ${index + 1}`,
  }));

  // Find the boundary between Single and Double elimination for the reference line
  const eliminationBoundaryIndex = useMemo(() => {
    for (let i = 0; i < chartData.length - 1; i++) {
      if (chartData[i].type !== chartData[i + 1].type && chartData[i].type && chartData[i + 1].type) {
        return i + 0.5;
      }
    }
    return null;
  }, [chartData]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700/50 rounded-lg p-3 shadow-xl">
          <p className="text-sm font-semibold text-white mb-1">
            {item.heatNumber && <span>Heat {item.heatNumber} • </span>}
            {item.roundName}
          </p>
          {item.type && (
            <p className="text-xs text-gray-400 mb-2">{item.type} Elimination</p>
          )}
          <p className="text-lg font-bold" style={{ color: getBarColor(item.type) }}>
            {item.score?.toFixed(2)} pts
          </p>
        </div>
      );
    }
    return null;
  };

  // Get bar color based on elimination type
  const getBarColor = (type: string | null | undefined): string => {
    if (type === 'Single') return COLORS.Single;
    if (type === 'Double') return COLORS.Double;
    return COLORS.Default;
  };

  // Custom label renderer
  const renderCustomLabel = (props: any) => {
    const { x, y, width, value } = props;
    if (!value && value !== 0) return null;

    return (
      <text
        x={x + width / 2}
        y={y - 5}
        fill="#f1f5f9"
        textAnchor="middle"
        fontSize={11}
        fontWeight={600}
      >
        {value.toFixed(2)}
      </text>
    );
  };

  // Custom hierarchical tick renderer
  const HierarchicalTick = (props: any) => {
    const { x, y, payload } = props;
    const item = chartData.find(d => d.label === payload.value);

    if (!item) return null;

    return (
      <g transform={`translate(${x},${y})`}>
        {/* Heat number - top row */}
        <text
          x={0}
          y={0}
          dy={12}
          textAnchor="middle"
          fill="#e2e8f0"
          fontSize={11}
          fontWeight={500}
        >
          {item.heatNumber || '-'}
        </text>
        {/* Round name - middle row */}
        <text
          x={0}
          y={0}
          dy={26}
          textAnchor="middle"
          fill="#94a3b8"
          fontSize={9}
        >
          {item.roundName?.replace('Round ', 'R') || ''}
        </text>
      </g>
    );
  };

  // Check which elimination types are present
  const hasDouble = chartData.some(d => d.type === 'Double');
  const hasSingle = chartData.some(d => d.type === 'Single');

  return (
    <div>
      {/* Legend */}
      <div className="flex justify-center gap-6 mb-4 text-sm">
        {hasSingle && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.Single }}></div>
            <span className="text-gray-400">Single Elimination</span>
          </div>
        )}
        {hasDouble && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.Double }}></div>
            <span className="text-gray-400">Double Elimination</span>
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={chartData}
          margin={{ top: 30, right: 20, left: 20, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
          <XAxis
            dataKey="label"
            stroke="#94a3b8"
            tick={<HierarchicalTick />}
            interval={0}
            height={50}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={11}
            label={{ value: 'Score (pts)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }} />

          {/* Reference line between elimination types */}
          {eliminationBoundaryIndex !== null && (
            <ReferenceLine
              x={chartData[Math.floor(eliminationBoundaryIndex)]?.label}
              stroke="#475569"
              strokeDasharray="4 4"
              strokeWidth={2}
            />
          )}

          <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={50}>
            <LabelList dataKey="score" content={renderCustomLabel} />
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getBarColor(entry.type)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Elimination type labels at bottom */}
      {(hasSingle || hasDouble) && (
        <div className="flex justify-center gap-8 mt-2 text-xs text-gray-500">
          {hasSingle && hasDouble ? (
            <>
              <span style={{ color: COLORS.Single }}>← Single Elimination</span>
              <span style={{ color: COLORS.Double }}>Double Elimination →</span>
            </>
          ) : hasSingle ? (
            <span style={{ color: COLORS.Single }}>Single Elimination</span>
          ) : (
            <span style={{ color: COLORS.Double }}>Double Elimination</span>
          )}
        </div>
      )}
    </div>
  );
};

export default AthleteHeatScoresChart;
