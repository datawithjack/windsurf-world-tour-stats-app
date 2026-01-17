import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

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

// Colors for elimination types
const COLORS = {
  Single: '#22d3ee', // cyan-400
  Double: '#6366f1', // indigo-500 (muted blue-purple, complements cyan)
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

  // Sort data by heat number (smallest on left: 19a, 22a, 23a, 49a, 50a)
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const aHeatNum = parseInt(a.heatNumber?.replace(/[^\d]/g, '') || '0', 10);
      const bHeatNum = parseInt(b.heatNumber?.replace(/[^\d]/g, '') || '0', 10);
      return aHeatNum - bHeatNum;
    });
  }, [data]);

  // Add index for unique identification and prepare chart data
  const chartData = sortedData.map((item, index) => ({
    ...item,
    index,
    // Create a unique identifier for x-axis
    label: item.heatNumber || `Heat ${index + 1}`,
  }));

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
        {`${value.toFixed(2)} pts`}
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
        {/* Heat number - top row (larger) */}
        <text
          x={0}
          y={0}
          dy={14}
          textAnchor="middle"
          fill="#e2e8f0"
          fontSize={16}
          fontWeight={700}
        >
          {item.heatNumber || '-'}
        </text>
        {/* Round name - bottom row (larger) */}
        <text
          x={0}
          y={0}
          dy={32}
          textAnchor="middle"
          fill="#94a3b8"
          fontSize={13}
          fontWeight={500}
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
      {/* Legend - dots only, no text labels */}
      <div className="flex items-center justify-center gap-6 mb-4 text-sm">
        {hasSingle && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.Single }}></div>
            <span className="text-gray-400 text-sm">Single</span>
          </div>
        )}
        {hasDouble && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.Double }}></div>
            <span className="text-gray-400 text-sm">Double</span>
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={chartData}
          margin={{ top: 30, right: 20, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
          <XAxis
            dataKey="label"
            stroke="#94a3b8"
            tick={<HierarchicalTick />}
            interval={0}
            height={55}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }} />

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
    </div>
  );
};

export default AthleteHeatScoresChart;
