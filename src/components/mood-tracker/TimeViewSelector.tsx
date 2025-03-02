
import { motion } from "framer-motion";
import { 
  Clock, 
  Calendar, 
  BarChart3, 
  LineChart, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { TimeView } from "./types";
import { format, addDays, addWeeks, addMonths, addYears, subDays, subWeeks, subMonths, subYears } from "date-fns";

interface TimeViewSelectorProps {
  currentView: TimeView;
  onSelectView: (view: TimeView) => void;
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

const TimeViewSelector = ({ 
  currentView, 
  onSelectView, 
  currentDate, 
  onDateChange 
}: TimeViewSelectorProps) => {
  const views: { value: TimeView; label: string; icon: React.ReactNode }[] = [
    { value: "day", label: "Day", icon: <Clock className="w-4 h-4" /> },
    { value: "week", label: "Week", icon: <BarChart3 className="w-4 h-4" /> },
    { value: "month", label: "Month", icon: <Calendar className="w-4 h-4" /> },
    { value: "year", label: "Year", icon: <LineChart className="w-4 h-4" /> },
  ];

  const handlePrevious = () => {
    switch (currentView) {
      case "day":
        onDateChange(subDays(currentDate, 1));
        break;
      case "week":
        onDateChange(subWeeks(currentDate, 1));
        break;
      case "month":
        onDateChange(subMonths(currentDate, 1));
        break;
      case "year":
        onDateChange(subYears(currentDate, 1));
        break;
    }
  };

  const handleNext = () => {
    switch (currentView) {
      case "day":
        onDateChange(addDays(currentDate, 1));
        break;
      case "week":
        onDateChange(addWeeks(currentDate, 1));
        break;
      case "month":
        onDateChange(addMonths(currentDate, 1));
        break;
      case "year":
        onDateChange(addYears(currentDate, 1));
        break;
    }
  };

  const getDateLabel = () => {
    switch (currentView) {
      case "day":
        return format(currentDate, "MMMM d, yyyy");
      case "week":
        return `Week of ${format(currentDate, "MMMM d, yyyy")}`;
      case "month":
        return format(currentDate, "MMMM yyyy");
      case "year":
        return format(currentDate, "yyyy");
    }
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  return (
    <div className="mb-6">
      <div className="flex justify-center">
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
      
      <div className="flex items-center justify-between mt-4">
        <button 
          onClick={handlePrevious}
          className="p-2 rounded-full hover:bg-gray-100 text-mindtrack-stone"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-medium">{getDateLabel()}</h3>
          <button
            onClick={goToToday}
            className="text-sm px-3 py-1 bg-mindtrack-sage/10 text-mindtrack-sage rounded-md hover:bg-mindtrack-sage/20"
          >
            Today
          </button>
        </div>
        
        <button 
          onClick={handleNext}
          className="p-2 rounded-full hover:bg-gray-100 text-mindtrack-stone"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TimeViewSelector;
