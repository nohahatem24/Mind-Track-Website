
import { TooltipProps } from "recharts";

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-mindtrack-sage/10 rounded-md shadow-sm">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-mindtrack-stone">
          Mood: <span className="font-medium">{payload[0].value}</span>
        </p>
        <p className="text-sm text-mindtrack-stone/70">{payload[0].payload.category}</p>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
