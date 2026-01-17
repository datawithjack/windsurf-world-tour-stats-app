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
  fleetBest: number;
  bestBy: {
    athlete: string;
    heat: string;
    round: string;
    score: number;
  } | null;
}

interface EventStatsChartProps {
  data: MoveTypeData[];
  isLoading?: boolean;
  /** Show fleet comparison markers (yellow=fleet avg, red=fleet best). Default false. */
  showFleetComparison?: boolean;
}

// Helper to safely format numbers
const safeToFixed = (value: any, decimals: number = 2): string => {
  if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
    return value.toFixed(decimals);
  }
  return '0.00';
};

// Custom bar shape that includes fleet marker overlaid on the bar
const BarWithFleetMarker = (props: any) => {
  const { x, y, width, height, fill, payload, dataKey, showFleetComparison } = props;

  if (!width || width < 0) return null;

  // Calculate the scale factor (pixels per point)
  const value = payload?.[dataKey] || 0;
  const pixelsPerPoint = value > 0 ? width / value : 0;

  // Determine which fleet marker to show based on which bar this is
  const isBestBar = dataKey === 'best';
  const isAvgBar = dataKey === 'average';

  // Fleet Best marker on Best bar, Fleet Avg marker on Average bar
  const fleetValue = isBestBar ? payload?.fleetBest : (isAvgBar ? payload?.fleetAverage : 0);
  const fleetX = fleetValue > 0 ? x + (fleetValue * pixelsPerPoint) : null;
  const markerColor = isBestBar ? '#ef4444' : '#facc15'; // red for best, yellow for avg

  const showMarker = showFleetComparison && fleetX !== null;

  return (
    <g>
      {/* Main bar */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        rx={4}
        ry={4}
      />
      {/* Fleet marker - spans only this bar's height */}
      {showMarker && (
        <rect
          x={fleetX - 1.5}
          y={y}
          width={3}
          height={height}
          fill={markerColor}
          rx={1}
        />
      )}
    </g>
  );
};

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
            <p className="text-sm text-teal-400 mb-1">
              Best: {safeToFixed(data.best)} pts
            </p>
            <p className="text-xs text-gray-400">
              by {data.bestBy.athlete}
            </p>
            <p className="text-xs text-gray-400">
              {data.bestBy.round ? `${data.bestBy.round} (Heat ${data.bestBy.heat})` : `Heat ${data.bestBy.heat}`}
            </p>
          </>
        ) : (
          <p className="text-sm text-gray-400">
            Avg: {safeToFixed(data.average)} pts
          </p>
        )}
        {/* Fleet comparison section */}
        {(data.fleetBest > 0 || data.fleetAverage > 0) && (
          <div className="border-t border-slate-700 pt-2 mt-2">
            <p className="text-xs text-gray-500 mb-1">Fleet Comparison:</p>
            {data.fleetBest > 0 && (
              <p className="text-xs text-red-400">
                Fleet Best: {safeToFixed(data.fleetBest)} pts
              </p>
            )}
            {data.fleetAverage > 0 && (
              <p className="text-xs text-yellow-400">
                Fleet Avg: {safeToFixed(data.fleetAverage)} pts
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  return null;
};


const EventStatsChart = ({ data, isLoading = false, showFleetComparison = false }: EventStatsChartProps) => {
  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        {/* Legend skeleton */}
        <div className="flex items-center justify-center gap-6">
          <div className="animate-pulse flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-700"></div>
            <div className="h-4 w-20 bg-slate-700 rounded"></div>
          </div>
          <div className="animate-pulse flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-700"></div>
            <div className="h-4 w-20 bg-slate-700 rounded"></div>
          </div>
        </div>
        {/* Chart skeleton */}
        <div className="animate-pulse h-[350px] bg-slate-700/50 rounded-lg flex items-end justify-around p-4 gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-1">
              <div className="w-full bg-slate-600 rounded" style={{ height: `${40 + Math.random() * 60}%` }}></div>
              <div className="h-3 w-12 bg-slate-600 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Custom Legend at Top */}
      <div className="flex items-center justify-center gap-4 text-sm flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-teal-400"></div>
          <span className="text-gray-400">Best Score</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-600"></div>
          <span className="text-gray-400">Avg Counting Score</span>
        </div>
        {showFleetComparison && (
          <>
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-red-500"></div>
              <span className="text-gray-400">Fleet Best</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-yellow-400"></div>
              <span className="text-gray-400">Fleet Avg</span>
            </div>
          </>
        )}
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
          <XAxis type="number" hide domain={[0, 10]} />
          <YAxis
            type="category"
            dataKey="type"
            stroke="#9ca3af"
            style={{ fontSize: '14px', fontWeight: 600 }}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(45, 212, 191, 0.1)' }} />
          {/* Best score bar with Fleet Best marker */}
          <Bar
            dataKey="best"
            name="Best Score"
            fill="#2dd4bf"
            animationDuration={800}
            shape={(props: any) => <BarWithFleetMarker {...props} showFleetComparison={showFleetComparison} />}
          >
            <LabelList
              dataKey="best"
              position="right"
              style={{ fill: '#f1f5f9', fontSize: '12px', fontWeight: 600 }}
              formatter={(value: any) => (typeof value === 'number' && !isNaN(value) && isFinite(value)) ? `${value.toFixed(2)} pts` : ''}
            />
          </Bar>
          {/* Average score bar with Fleet Avg marker */}
          <Bar
            dataKey="average"
            name="Average Score"
            fill="#64748b"
            animationDuration={800}
            shape={(props: any) => <BarWithFleetMarker {...props} showFleetComparison={showFleetComparison} />}
          >
            <LabelList
              dataKey="average"
              position="right"
              style={{ fill: '#cbd5e1', fontSize: '12px', fontWeight: 500 }}
              formatter={(value: any) => (typeof value === 'number' && !isNaN(value) && isFinite(value)) ? `${value.toFixed(2)} pts` : ''}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EventStatsChart;
