
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps, Dot, Area, ReferenceLine } from 'recharts';
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
      <div className="bg-white p-3 border border-mindtrack-sage/10 rounded-md shadow-sm">
        <p className="text-sm font-medium">{label}</p>
        {payload[0].payload.time && (
          <p className="text-sm text-mindtrack-stone/70">{payload[0].payload.time}</p>
        )}
        <p className="text-sm text-mindtrack-stone">
          Mood: <span className="font-medium">{payload[0].value}</span>
        </p>
        <p className="text-sm text-mindtrack-stone/70">{payload[0].payload.category}</p>
        {payload[0].payload.note && (
          <p className="text-sm text-mindtrack-stone/70 mt-1">
            Note: {payload[0].payload.note.length > 50 ? payload[0].payload.note.substring(0, 50) + '...' : payload[0].payload.note}
          </p>
        )}
      </div>
    );
  }

  return null;
};

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  
  // Make sure we have all required properties
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
    
    if (timeframe === 'day') {
      return value.split(' ')[1] || value;
    } else if (timeframe === 'week' || timeframe === 'month') {
      return value.split(' ')[0] || value;
    }
    return value;
  };

  const getFilteredData = () => {
    if (chartData.length === 0) return [];
    
    // Sort data chronologically by timestamp to ensure correct left-to-right flow
    return [...chartData].sort((a, b) => a.timestamp - b.timestamp);
  };

  const filteredData = getFilteredData();

  // Always use monotone curve type for smoothness unless there's only 1 point
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
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart 
              data={filteredData} 
              margin={{ top: 5, right: 20, bottom: 20, left: 20 }}
            >
              <defs>
                <pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="4" style={{ stroke: '#8A9A5B', strokeWidth: 1 }} />
                </pattern>
                <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8A9A5B" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#8A9A5B" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="negativeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity={0.05} />
                  <stop offset="100%" stopColor="#f97316" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxis} 
                interval="preserveStartEnd"
                minTickGap={10}
              />
              <YAxis 
                domain={[-10, 10]} 
                ticks={[-10, -5, 0, 5, 10]} 
                padding={{ top: 10, bottom: 10 }}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Reference line at y=0 */}
              <ReferenceLine y={0} stroke="#ccc" strokeWidth={1.5} />
              
              {/* Area for positive values, above zero line */}
              <Area 
                type={getCurveType()} 
                dataKey="mood" 
                fill="url(#positiveGradient)"
                stroke="transparent"
                activeDot={false}
                baseLine={0}
                fillOpacity={1}
                legendType="none"
                isAnimationActive={true}
                connectNulls={true}
                animationDuration={1000}
                animationEasing="ease-in-out"
                baseValue={0}
              />
              
              {/* Area for negative values, below zero line */}
              <Area 
                type={getCurveType()} 
                dataKey="mood" 
                fill="url(#negativeGradient)"
                stroke="transparent"
                activeDot={false}
                baseLine={0}
                fillOpacity={1}
                legendType="none"
                isAnimationActive={true}
                connectNulls={true}
                animationDuration={1000}
                animationEasing="ease-in-out"
                baseValue={0}
              />
              
              {/* Main line that shows the actual mood values */}
              <Line 
                type={getCurveType()}
                dataKey="mood" 
                stroke="#8A9A5B" 
                strokeWidth={2}
                dot={<CustomDot />}
                isAnimationActive={true}
                activeDot={{ r: 6, stroke: "#8A9A5B", strokeWidth: 2 }}
                connectNulls={true}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 w-full flex items-center justify-center text-mindtrack-stone/70">
          No mood data available yet. Add your first mood entry to see your chart!
        </div>
      )}
      
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        {moodCategories.map((category) => (
          <div key={category.label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
            <span className="text-sm text-mindtrack-stone">{category.label} ({category.range[0]} to {category.range[1]})</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default MoodChart;
