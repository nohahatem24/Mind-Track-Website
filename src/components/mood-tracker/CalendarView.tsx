
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { format, getMonth, getYear, getDaysInMonth, startOfMonth } from "date-fns";
import { MoodEntry, getMoodCategory } from "./types";

interface CalendarViewProps {
  uniqueDates: string[];
  entries: MoodEntry[];
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
}

const CalendarView = ({ uniqueDates, entries, selectedDate, onSelectDate }: CalendarViewProps) => {
  // Group entries by date
  const entriesByDate = entries.reduce((acc, entry) => {
    if (!acc[entry.date]) {
      acc[entry.date] = [];
    }
    acc[entry.date].push(entry);
    return acc;
  }, {} as Record<string, MoodEntry[]>);

  // Calculate average mood for each date
  const averageMoodByDate = Object.keys(entriesByDate).reduce((acc, date) => {
    const dateEntries = entriesByDate[date];
    const sum = dateEntries.reduce((total, entry) => total + entry.mood, 0);
    acc[date] = sum / dateEntries.length;
    return acc;
  }, {} as Record<string, number>);

  // Get the current month calendar
  const currentDate = new Date();
  const currentMonth = getMonth(currentDate);
  const currentYear = getYear(currentDate);
  
  const daysInMonth = getDaysInMonth(new Date(currentYear, currentMonth));
  const firstDayOfMonth = startOfMonth(new Date(currentYear, currentMonth)).getDay();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => null);
  
  const calendarDays = [...emptyDays, ...days];
  
  // Format a day number to match the date format used in entries
  const formatDayToDateString = (day: number) => {
    if (!day) return "";
    const date = new Date(currentYear, currentMonth, day);
    return format(date, "MMM d");
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mindtrack-card mb-8"
    >
      <h3 className="text-xl font-semibold text-mindtrack-stone mb-6 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-mindtrack-sage" />
        {format(new Date(currentYear, currentMonth), "MMMM yyyy")}
      </h3>
      
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="font-medium text-mindtrack-stone/70">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="h-12"></div>;
          }
          
          const dateString = formatDayToDateString(day);
          const hasMood = uniqueDates.includes(dateString);
          const isSelected = selectedDate === dateString;
          const averageMood = hasMood ? averageMoodByDate[dateString] : 0;
          const moodCategory = getMoodCategory(averageMood);
          
          return (
            <motion.div
              key={`day-${day}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectDate(hasMood ? (isSelected ? null : dateString) : null)}
              className={`h-12 rounded-md flex items-center justify-center cursor-pointer relative ${
                hasMood 
                  ? `${isSelected ? 'ring-2 ring-mindtrack-sage' : ''}`
                  : 'text-mindtrack-stone/50'
              }`}
              style={hasMood ? { backgroundColor: `${moodCategory.color}20` } : {}}
            >
              <span className={isSelected ? 'font-bold' : ''}>{day}</span>
              {hasMood && (
                <div 
                  className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: moodCategory.color }}
                ></div>
              )}
            </motion.div>
          );
        })}
      </div>
      
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {selectedDate ? (
          <div className="text-center">
            <p className="text-mindtrack-stone">
              Showing mood entries for <span className="font-medium">{selectedDate}</span>
            </p>
            <p className="text-sm text-mindtrack-stone/70">
              Average mood: <span style={{ color: getMoodCategory(averageMoodByDate[selectedDate]).color }}>
                {averageMoodByDate[selectedDate].toFixed(1)}
              </span>
            </p>
          </div>
        ) : (
          <p className="text-center text-mindtrack-stone/70">
            Click on a highlighted date to view mood entries
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default CalendarView;
