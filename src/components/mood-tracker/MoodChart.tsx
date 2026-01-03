import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps, Dot, Area, ReferenceLine, AreaChart, ComposedChart, Bar } from 'recharts';
import { LineChart } from "lucide-react";
import { motion } from "framer-motion";
import { moodCategories } from "./types";

interface ChartDataPoint {
  date: string;
  time: string;
  mood: number;
  category: string;
  color: string;
  note: string;
  fullTimestamp: string;
  timestamp: number;
}

interface MoodChartProps {
  chartData: ChartDataPoint[];
  timeframe: 'day' | 'week' | 'month' | 'year';
  selectedDate: string | null;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-mindtrack-sage/20 rounded-lg shadow-lg">
        <p className="text-sm font-semibold text-mindtrack-stone mb-1">{label}</p>
        {payload[0].payload.time && (
          <p className="text-xs text-mindtrack-stone/60 mb-2">{payload[0].payload.time}</p>
        )}
        <p className="text-sm text-mindtrack-stone mb-1">
          Mood: <span className="font-semibold" style={{ color: payload[0].payload.color }}>{payload[0].value}</span>
        </p>
        <p className="text-sm text-mindtrack-stone/70 mb-2">{payload[0].payload.category}</p>
        {payload[0].payload.note && (
          <p className="text-xs text-mindtrack-stone/70 mt-2 pt-2 border-t border-mindtrack-sage/10">
            {payload[0].payload.note.length > 60 ? payload[0].payload.note.substring(0, 60) + '...' : payload[0].payload.note}
          </p>
        )}
      </div>
    );
  }

  return null;
};

interface CustomDotProps {
  cx?: number;
  cy?: number;
  payload?: ChartDataPoint;
}

const CustomDot = (props: CustomDotProps) => {
  const { cx, cy, payload } = props;
  
  if (!cx || !cy || !payload) return null;
  
  return (
    <Dot 
      cx={cx} 
      cy={cy} 
      r={5} 
      fill={payload.color || "#8A9A5B"} 
      stroke="#fff" 
      strokeWidth={2} 
    />
  );
};

const MoodChart = ({ chartData, timeframe, selectedDate }: MoodChartProps) => {
  const formatXAxis = (value: string) => {
    if (!value) return '';
    
    // For day view, show time
    if (timeframe === 'day') {
      return value.split(' ')[1] || value;
    } 
    // For week/month, show date without year
    else if (timeframe === 'week' || timeframe === 'month') {
      const parts = value.split(',');
      return parts[0] || value;
    }
    // For year, show month
    return value;
  };

  // Data is already sorted oldest to newest from MoodData component
  const filteredData = chartData;

  // Use monotone curve for smooth lines
  const getCurveType = () => {
    return filteredData.length <= 1 ? "linear" : "monotone";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mindtrack-card mb-8"
    >
      <h3 className="text-xl font-semibold text-mindtrack-stone mb-6 flex items-center gap-2">
        <LineChart className="w-5 h-5 text-mindtrack-sage" />
        Your Mood Over Time
      </h3>
      
      {filteredData.length > 0 ? (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart 
              data={filteredData} 
              margin={{ top: 20, right: 30, bottom: 30, left: 10 }}
            >
              <defs>
                {/* Gradient for positive mood area - GREEN */}
                <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A3ED82" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#A3ED82" stopOpacity={0.09} />
                </linearGradient>
                
                {/* Gradient for negative mood area - RED */}
                <linearGradient id="negativeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E36344" stopOpacity={0.02} />
                  <stop offset="100%" stopColor="#E36344" stopOpacity={0.9} />
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" vertical={false} />
              
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxis} 
                interval="preserveStartEnd"
                minTickGap={30}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              
              <YAxis 
                domain={[-10, 10]} 
                ticks={[-10, -5, 0, 5, 10]}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
                label={{ value: 'Mood', angle: -90, position: 'insideLeft', style: { fill: '#6b7280', fontSize: 12 } }}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              {/* Reference line at y=0 (neutral baseline) - clear visual anchor */}
              <ReferenceLine 
                y={0} 
                stroke="#d1d5db" 
                strokeWidth={2}
                label={{ value: 'Neutral', position: 'right', fill: '#9ca3af', fontSize: 11, offset: 8 }}
              />
              
              {/* Area with split gradient - RED for negative moods, GREEN for positive moods */}
              <Area 
                type={getCurveType()} 
                dataKey="mood" 
                fill="url(#positiveGradient)"
                stroke="transparent"
                fillOpacity={1}
                isAnimationActive={true}
                animationDuration={1000}
                animationEasing="ease-in-out"
                baseLine={0}
              />
              
              {/* Main mood line - smooth curve for clear mood tracking */}
              <Line 
                type={getCurveType()}
                dataKey="mood" 
                stroke="#8A9A5B" 
                strokeWidth={3}
                dot={<CustomDot />}
                isAnimationActive={true}
                activeDot={{ r: 7, stroke: "#8A9A5B", strokeWidth: 3, fill: "#fff" }}
                connectNulls={true}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-80 w-full flex flex-col items-center justify-center text-mindtrack-stone/70 bg-mindtrack-sage/5 rounded-lg">
          <LineChart className="w-12 h-12 text-mindtrack-sage/30 mb-3" />
          <p className="text-center px-6">
            No mood data available yet. Add your first mood entry to see your chart!
          </p>
        </div>
      )}
      
      <div className="flex flex-wrap justify-center gap-4 mt-8 pt-6 border-t border-mindtrack-sage/10">
        {moodCategories.map((category) => (
          <div key={category.label} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: category.color }}
            ></div>
            <span className="text-xs text-mindtrack-stone/70">
              {category.label} <span className="text-mindtrack-stone/50">({category.range[0]} to {category.range[1]})</span>
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default MoodChart;