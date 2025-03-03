
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps, Dot } from 'recharts';
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
}

interface MoodChartProps {
  chartData: ChartDataPoint[];
}

// Custom tooltip component for the chart
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

const MoodChart = ({ chartData }: MoodChartProps) => {
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
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart data={chartData} margin={{ top: 5, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
            <XAxis dataKey="date" />
            <YAxis domain={[-10, 10]} ticks={[-10, -5, 0, 5, 10]} />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="mood" 
              stroke="#8A9A5B" 
              strokeWidth={2}
              dot={<CustomDot />} 
              activeDot={{ r: 6, stroke: "#8A9A5B", strokeWidth: 2 }} 
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
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
