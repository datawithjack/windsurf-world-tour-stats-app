import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

interface HeatScoreData {
  roundName: string;
  score: number;
  type: 'Single' | 'Double';
}

interface AthleteHeatScoresChartProps {
  data: HeatScoreData[];
  isLoading?: boolean;
}

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

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700/50 rounded-lg p-3 shadow-xl">
          <p className="text-sm font-semibold text-white mb-1">
            {data.roundName}
            {data.type && <span className="text-gray-400 ml-2">({data.type})</span>}
          </p>
          <p className="text-lg font-bold text-teal-400">{data.score.toFixed(2)} pts</p>
        </div>
      );
    }
    return null;
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
        fontSize={12}
        fontWeight={600}
      >
        {value.toFixed(2)}
      </text>
    );
  };

  return (
    <div>
      {/* Legend */}
      <div className="flex justify-center gap-6 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[#14b8a6]"></div>
          <span className="text-gray-400">Double Elimination</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[#2dd4bf]"></div>
          <span className="text-gray-400">Single Elimination</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 30, right: 30, left: 20, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
          <XAxis
            dataKey="roundName"
            stroke="#94a3b8"
            fontSize={12}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            label={{ value: 'Score (pts)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(45, 212, 191, 0.1)' }} />
          <Bar dataKey="score" radius={[4, 4, 0, 0]}>
            <LabelList dataKey="score" content={renderCustomLabel} />
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.type === 'Double' ? '#14b8a6' : '#2dd4bf'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AthleteHeatScoresChart;
