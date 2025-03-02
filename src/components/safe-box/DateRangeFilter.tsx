
import { useState } from "react";
import { Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { DateRangeFilter } from "./types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

interface DateRangeFilterProps {
  dateRange: DateRangeFilter;
  onDateRangeChange: (dateRange: DateRangeFilter) => void;
}

const DateRangeFilterComponent = ({ dateRange, onDateRangeChange }: DateRangeFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClearDates = () => {
    onDateRangeChange({ startDate: null, endDate: null });
    setIsOpen(false);
  };

  const formatDisplayDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const displayText = dateRange.startDate || dateRange.endDate
    ? `${formatDisplayDate(dateRange.startDate)} - ${formatDisplayDate(dateRange.endDate)}`
    : "Filter by date";

  const isDateSelected = dateRange.startDate || dateRange.endDate;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button 
          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors
            ${isDateSelected 
              ? 'bg-mindtrack-sage text-white' 
              : 'border border-mindtrack-sage/30 text-mindtrack-stone/70 hover:bg-gray-50'
            }`}
        >
          <Calendar className="w-4 h-4" />
          <span className="max-w-[150px] truncate">{displayText}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 space-y-4"
        >
          <div className="grid grid-cols-1 gap-4">
            <div>
              <p className="mb-2 text-sm font-medium">Start Date</p>
              <CalendarComponent
                mode="single"
                selected={dateRange.startDate || undefined}
                onSelect={(date) => onDateRangeChange({ 
                  ...dateRange, 
                  startDate: date,
                  // If end date is before start date, reset it
                  endDate: date && dateRange.endDate && date > dateRange.endDate 
                    ? date 
                    : dateRange.endDate
                })}
              />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">End Date</p>
              <CalendarComponent
                mode="single"
                selected={dateRange.endDate || undefined}
                onSelect={(date) => onDateRangeChange({ 
                  ...dateRange, 
                  endDate: date 
                })}
                disabled={(date) => 
                  dateRange.startDate ? date < dateRange.startDate : false
                }
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              onClick={handleClearDates}
              className="text-sm"
            >
              Clear
            </Button>
          </div>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
};

export default DateRangeFilterComponent;
