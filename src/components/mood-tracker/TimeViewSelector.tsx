
import { motion } from "framer-motion";
import { Clock, Calendar, BarChart3, LineChart } from "lucide-react";
import { TimeView } from "./types";

interface TimeViewSelectorProps {
  currentView: TimeView;
  onSelectView: (view: TimeView) => void;
}

const TimeViewSelector = ({ currentView, onSelectView }: TimeViewSelectorProps) => {
  const views: { value: TimeView; label: string; icon: React.ReactNode }[] = [
    { value: "day", label: "Day", icon: <Clock className="w-4 h-4" /> },
    { value: "week", label: "Week", icon: <BarChart3 className="w-4 h-4" /> },
    { value: "month", label: "Month", icon: <Calendar className="w-4 h-4" /> },
    { value: "year", label: "Year", icon: <LineChart className="w-4 h-4" /> },
  ];

  return (
    <div className="flex justify-center mb-6">
      <div className="inline-flex rounded-md shadow-sm">
        {views.map((view) => (
          <button
            key={view.value}
            onClick={() => onSelectView(view.value)}
            className={`flex items-center gap-1 px-4 py-2 text-sm font-medium ${
              currentView === view.value
                ? "bg-mindtrack-sage text-white"
                : "bg-white text-mindtrack-stone hover:bg-gray-50"
            } ${
              view.value === "day"
                ? "rounded-l-md"
                : view.value === "year"
                ? "rounded-r-md"
                : ""
            } border border-mindtrack-sage/30`}
          >
            {view.icon}
            {view.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeViewSelector;
