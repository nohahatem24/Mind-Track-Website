
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps, Dot } from 'recharts';
import { LineChart, CalendarClock } from "lucide-react";
import { motion } from "framer-motion";
import { format, subDays, subMonths, subYears, isAfter, startOfDay, startOfWeek, startOfMonth, startOfYear } from "date-fns";
import { moodCategories, TimeView } from "./types";

interface ChartDataPoint {
  date: string;
  time: string;
  mood: number;
  category: string;
  color: string;
  note: string;
  fullTimestamp: string;
  exactTimestamp?: number;
}

interface MoodChartProps {
  chartData: ChartDataPoint[];
  timeView: TimeView;
  selectedDate: Date;
}

// Custom tooltip component for the chart
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-mindtrack-sage/10 rounded-md shadow-sm">
        <p className="text-sm font-medium">{label}</p>
        {data.time && (
          <p className="text-sm text-mindtrack-stone/70">{data.time}</p>
        )}
        <p className="text-sm text-mindtrack-stone">
          Mood: <span className="font-medium">{payload[0].value}</span>
        </p>
        <p className="text-sm text-mindtrack-stone/70">{data.category}</p>
        {data.note && (
          <p className="text-sm text-mindtrack-stone/70 mt-1">
            Note: {data.note.length > 50 ? data.note.substring(0, 50) + '...' : data.note}
          </p>
        )}
      </div>
    );
  }
  return null;
};

// Custom dot component for rendering colored points on the chart
const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  return (
    <Dot 
      cx={cx} 
      cy={cy} 
      r={5} 
      fill={payload.color} 
      stroke="#fff" 
      strokeWidth={1} 
    />
  );
};

const MoodChart = ({ chartData, timeView, selectedDate }: MoodChartProps) => {
  // Filter data based on time view
  const getFilteredData = () => {
    if (!chartData.length) return [];
    
    // Ensure all data points have exactTimestamp
    const dataWithTimestamps = chartData.filter(point => point.exactTimestamp);
    
    const now = new Date();
    let startDate;
    
    switch(timeView) {
      case 'day':
        startDate = startOfDay(selectedDate);
        break;
      case 'week':
        startDate = startOfWeek(selectedDate);
        break;
      case 'month':
        startDate = startOfMonth(selectedDate);
        break;
      case 'year':
        startDate = startOfYear(selectedDate);
        break;
      default:
        startDate = subDays(now, 7);
    }
    
    return dataWithTimestamps
      .filter(point => point.exactTimestamp && point.exactTimestamp >= startDate.getTime())
      .sort((a, b) => (a.exactTimestamp || 0) - (b.exactTimestamp || 0));
  };

  const filteredData = getFilteredData();
  
  // Format x-axis ticks based on time view
  const formatXAxis = (timestamp: number) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    switch (timeView) {
      case 'day':
        return format(date, 'HH:mm');
      case 'week':
        return format(date, 'EEE');
      case 'month':
        return format(date, 'MMM d');
      case 'year':
        return format(date, 'MMM');
      default:
        return format(date, 'MMM d');
    }
  };

  // Get chart title based on time view
  const getChartTitle = () => {
    switch (timeView) {
      case 'day':
        return `Your Mood on ${format(selectedDate, 'MMMM d, yyyy')}`;
      case 'week':
        return `Your Mood This Week (${format(startOfWeek(selectedDate), 'MMM d')} - ${format(selectedDate, 'MMM d')})`;
      case 'month':
        return `Your Mood This Month (${format(selectedDate, 'MMMM yyyy')})`;
      case 'year':
        return `Your Mood This Year (${format(selectedDate, 'yyyy')})`;
      default:
        return 'Your Mood Over Time';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mindtrack-card mb-8"
    >
      <h3 className="text-xl font-semibold text-mindtrack-stone mb-6 flex items-center gap-2">
        <LineChart className="w-5 h-5 text-mindtrack-sage" />
        {getChartTitle()}
      </h3>
      
      {filteredData.length === 0 ? (
        <div className="h-64 w-full flex flex-col items-center justify-center text-mindtrack-stone/70">
          <CalendarClock className="w-12 h-12 mb-3 text-mindtrack-sage/40" />
          <p>No mood data available for this time period.</p>
          <p className="text-sm mt-2">Try selecting a different time view or log a new mood entry.</p>
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart 
              data={filteredData} 
              margin={{ top: 5, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
              <XAxis 
                dataKey="exactTimestamp" 
                type="number"
                scale="time"
                domain={['dataMin', 'dataMax']}
                tickFormatter={formatXAxis}
              />
              <YAxis domain={[-10, 10]} ticks={[-10, -5, 0, 5, 10]} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="#8A9A5B" 
                strokeWidth={2}
                dot={<CustomDot />} 
                activeDot={{ r: 6, stroke: "#8A9A5B", strokeWidth: 2 }} 
                isAnimationActive={true}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
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
