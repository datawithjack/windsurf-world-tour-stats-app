import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

interface MoveTypeData {
  type: string;
  best: number;
  average: number;
  fleetAverage: number;
  bestBy: {
    athlete: string;
    heat: string;
    score: number;
  } | null;
}

interface EventStatsChartProps {
  data: MoveTypeData[];
}

// Custom Tooltip Component
const CustomTooltip = (props: any) => {
  const { active, payload, label } = props;

  if (active && payload && payload.length > 0) {
    const data = payload[0].payload as MoveTypeData;
    const isBest = payload[0].dataKey === 'best';

    return (
      <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 shadow-lg">
        <p className="font-semibold text-white mb-2">{label}</p>
        {isBest && data.bestBy !== null ? (
          <>
            <p className="text-sm text-gray-300 mb-1">
              Best: {data.best != null ? data.best.toFixed(2) : '0.00'} pts
            </p>
            <p className="text-xs text-gray-400">
              {data.bestBy.athlete}
            </p>
            <p className="text-xs text-gray-400">
              Heat {data.bestBy.heat}
            </p>
          </>
        ) : (
          <p className="text-sm text-gray-400">
            {payload[0].name}: {payload[0].value != null ? payload[0].value.toFixed(2) : '0.00'} pts
          </p>
        )}
              </div>
    );
  }

  return null;
};


const EventStatsChart = ({ data }: EventStatsChartProps) => {
  return (
    <div className="w-full space-y-4">
      {/* Custom Legend at Top */}
      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-teal-400"></div>
          <span className="text-gray-400">Best Score</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-600"></div>
          <span className="text-gray-400">Average Score</span>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          barCategoryGap="30%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
          <XAxis
            type="number"
            stroke="#9ca3af"
            style={{ fontSize: '14px', fontWeight: 500 }}
            domain={[0, 'auto']}
          />
          <YAxis
            type="category"
            dataKey="type"
            stroke="#9ca3af"
            style={{ fontSize: '14px', fontWeight: 600 }}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(45, 212, 191, 0.1)' }} />
          <Bar
            dataKey="best"
            name="Best Score"
            fill="#2dd4bf"
            radius={[0, 4, 4, 0]}
            animationDuration={800}
          >
            <LabelList
              dataKey="best"
              position="right"
              style={{ fill: '#f1f5f9', fontSize: '12px', fontWeight: 600 }}
              formatter={(value: any) => typeof value === 'number' ? value.toFixed(2) : value}
            />
          </Bar>
          <Bar
            dataKey="average"
            name="Average Score"
            fill="#64748b"
            radius={[0, 4, 4, 0]}
            animationDuration={800}
          >
            <LabelList
              dataKey="average"
              position="right"
              style={{ fill: '#cbd5e1', fontSize: '12px', fontWeight: 500 }}
              formatter={(value: any) => typeof value === 'number' ? value.toFixed(2) : value}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EventStatsChart;
