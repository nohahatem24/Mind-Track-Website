
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
        [...uniqueDates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime()).map(date => {
          const dateEntries = entries.filter(e => e.date === date);
          const avgMood = dateEntries.reduce((sum, entry) => sum + entry.mood, 0) / dateEntries.length;
          const category = getMoodCategory(avgMood);
          
          return (
            <motion.div
              key={date}
              onClick={() => onSelectDate(date)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-lg cursor-pointer border transition-all ${
                selectedDate === date 
                  ? 'border-mindtrack-sage bg-mindtrack-sage/10' 
                  : 'border-mindtrack-sage/20 hover:border-mindtrack-sage/50 hover:bg-mindtrack-sage/5'
              }`}
            >
              <p className="font-semibold text-mindtrack-stone text-sm">{date}</p>
              <p className="text-xs text-mindtrack-stone/60 mt-1">{dateEntries.length} {dateEntries.length === 1 ? 'entry' : 'entries'}</p>
              <div className="flex items-end gap-1 mt-2">
                <div 
                  className="flex-1 rounded-full transition-all" 
                  style={{ 
                    backgroundColor: category.color,
                    height: `${Math.abs(avgMood) * 2 + 4}px`
                  }}
                  title={`Avg mood: ${avgMood.toFixed(1)} - ${category.label}`}
                ></div>
              </div>
            </motion.div>
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
