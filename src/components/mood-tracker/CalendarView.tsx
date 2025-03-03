
import { motion } from "framer-motion";
import { getMoodCategory, MoodEntry } from "./types";

interface CalendarViewProps {
  uniqueDates: string[];
  entries: MoodEntry[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

const CalendarView = ({ 
  uniqueDates, 
  entries, 
  selectedDate, 
  onSelectDate 
}: CalendarViewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mindtrack-card mb-8 grid grid-cols-7 gap-2"
    >
      {uniqueDates.length > 0 ? (
        uniqueDates.map(date => {
          const dateEntries = entries.filter(e => e.date === date);
          const avgMood = dateEntries.reduce((sum, entry) => sum + entry.mood, 0) / dateEntries.length;
          const category = getMoodCategory(avgMood);
          
          return (
            <div
              key={date}
              onClick={() => onSelectDate(date)}
              className={`p-3 rounded-md cursor-pointer border ${
                selectedDate === date 
                  ? 'border-mindtrack-sage' 
                  : 'border-gray-100 hover:border-mindtrack-sage/50'
              }`}
              style={{ backgroundColor: `${category.color}10` }}
            >
              <p className="font-medium text-mindtrack-stone">{date}</p>
              <p className="text-sm text-mindtrack-stone/70">{dateEntries.length} entries</p>
              <div 
                className="mt-2 h-2 rounded-full" 
                style={{ backgroundColor: category.color }}
              ></div>
            </div>
          );
        })
      ) : (
        <div className="col-span-7 text-center py-6 text-mindtrack-stone/70">
          No mood entries yet. Start tracking to build your calendar.
        </div>
      )}
    </motion.div>
  );
};

export default CalendarView;
