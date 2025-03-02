
import { motion } from "framer-motion";
import { AlertCircle, Heart, LineChart, Pencil, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";

import { MoodEntry, MoodCategory, STORAGE_KEY, getMoodCategory, TimeView, getFormattedDateFromTimestamp, getFormattedTimeFromTimestamp } from "./types";
import MoodForm from "./MoodForm";
import MoodChart from "./MoodChart";
import MoodEntryComponent from "./MoodEntry";
import CalendarView from "./CalendarView";
import MoodInsights from "./MoodInsights";
import TimeViewSelector from "./TimeViewSelector";

interface MoodTrackerProps {
  showOnlyFavorites?: boolean;
}

const MoodTracker = ({ showOnlyFavorites = false }: MoodTrackerProps) => {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [calendarView, setCalendarView] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [timeView, setTimeView] = useState<TimeView>("day");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
  // Load entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem(STORAGE_KEY);
    if (savedEntries) {
      try {
        const parsed = JSON.parse(savedEntries);
        
        // If old entries don't have exactTimestamp, add it
        const updatedEntries = parsed.map((entry: MoodEntry) => {
          if (!entry.exactTimestamp) {
            // Create an approximate timestamp from the date string
            const date = new Date(entry.timestamp);
            return {
              ...entry,
              exactTimestamp: date.getTime()
            };
          }
          return entry;
        });
        
        setEntries(updatedEntries);
      } catch (e) {
        console.error("Error parsing saved mood entries:", e);
      }
    }
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  // Filter entries based on selected view and date
  const getVisibleEntries = () => {
    if (showOnlyFavorites) {
      return entries.filter(entry => entry.isFavorite);
    }
    
    if (selectedDate) {
      return entries.filter(entry => entry.date === selectedDate);
    }
    
    if (timeView === "day" && !calendarView) {
      const today = format(currentDate, "MMM d");
      return entries.filter(entry => entry.date === today);
    }
    
    return entries;
  };

  const visibleEntries = getVisibleEntries();

  // Prepare data for the chart
  const prepareChartData = () => {
    return [...entries]
      .filter(entry => entry.exactTimestamp) // Ensure we have timestamp data
      .sort((a, b) => {
        const aTime = a.exactTimestamp || new Date(a.timestamp).getTime();
        const bTime = b.exactTimestamp || new Date(b.timestamp).getTime();
        return aTime - bTime;
      })
      .map(entry => ({
        date: entry.date,
        time: entry.time || "",
        mood: entry.mood,
        category: getMoodCategory(entry.mood).label,
        color: getMoodCategory(entry.mood).color,
        note: entry.note || "",
        fullTimestamp: entry.timestamp,
        exactTimestamp: entry.exactTimestamp
      }));
  };

  const chartData = prepareChartData();

  const addEntry = (entry: MoodEntry) => {
    setEntries([entry, ...entries]);
    setIsAdding(false);
    
    // If adding an entry for today, ensure day view is selected
    if (entry.date === format(new Date(), "MMM d")) {
      setTimeView("day");
      setCurrentDate(new Date());
    }
  };

  const updateEntry = (updatedEntry: MoodEntry) => {
    setEntries(entries.map(e => e.id === updatedEntry.id ? updatedEntry : e));
    setEditingId(null);
  };

  const deleteEntry = (entryId: number) => {
    setEntries(entries.filter(entry => entry.id !== entryId));
  };

  const toggleFavorite = (entryId: number) => {
    setEntries(entries.map(entry => 
      entry.id === entryId 
        ? { ...entry, isFavorite: !entry.isFavorite } 
        : entry
    ));
  };

  // Get unique dates for the calendar view
  const uniqueDates = [...new Set(entries.map(entry => entry.date))];

  // Handle time view change
  const handleTimeViewChange = (view: TimeView) => {
    setTimeView(view);
    setCalendarView(false);
  };

  return (
    <section id="mood" className="py-16">
      <div className="mindtrack-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="section-title">Mood Tracking</h2>
          <p className="text-mindtrack-stone/80 max-w-2xl">
            Track your daily mood on a scale from -10 (extremely low) to +10 (extremely high) to identify patterns and monitor your emotional well-being.
          </p>
        </motion.div>

        {/* View Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setCalendarView(false)}
              className={`px-4 py-2 rounded-md ${!calendarView ? 'bg-mindtrack-sage text-white' : 'bg-gray-100 text-mindtrack-stone'}`}
            >
              List View
            </button>
            <button
              onClick={() => setCalendarView(true)}
              className={`px-4 py-2 rounded-md ${calendarView ? 'bg-mindtrack-sage text-white' : 'bg-gray-100 text-mindtrack-stone'}`}
            >
              Calendar View
            </button>
          </div>
          
          {selectedDate && (
            <button
              onClick={() => setSelectedDate(null)}
              className="text-mindtrack-sage hover:underline"
            >
              Clear Date Filter
            </button>
          )}
        </div>

        {/* Time View Selector (only show in list view) */}
        {!calendarView && entries.length > 0 && (
          <TimeViewSelector currentView={timeView} onSelectView={handleTimeViewChange} />
        )}

        {/* Calendar View */}
        {calendarView && (
          <CalendarView 
            uniqueDates={uniqueDates} 
            entries={entries} 
            selectedDate={selectedDate} 
            onSelectDate={setSelectedDate} 
          />
        )}

        {/* Mood Insights */}
        {entries.length > 0 && (
          <MoodInsights entries={entries} />
        )}

        {/* Mood Chart */}
        {entries.length > 0 && !calendarView && (
          <MoodChart 
            chartData={chartData} 
            timeView={timeView}
            selectedDate={currentDate}
          />
        )}

        <div className="space-y-6">
          {!isAdding && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAdding(true)}
              className="w-full mindtrack-card flex items-center justify-center gap-2 text-mindtrack-sage hover:text-mindtrack-sage/80"
            >
              <Plus className="w-5 h-5" />
              Log Your Current Mood
            </motion.button>
          )}

          {isAdding && (
            <MoodForm onSubmit={addEntry} onCancel={() => setIsAdding(false)} />
          )}

          {visibleEntries.map((entry, index) => (
            <MoodEntryComponent
              key={entry.id}
              entry={entry}
              editingId={editingId}
              onDelete={deleteEntry}
              onToggleFavorite={toggleFavorite}
              onEdit={setEditingId}
              onUpdate={updateEntry}
              onCancelEdit={() => setEditingId(null)}
              index={index}
            />
          ))}

          {entries.length === 0 && !isAdding && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mindtrack-card flex items-center gap-3 text-mindtrack-stone/70"
            >
              <AlertCircle className="w-5 h-5" />
              <p>No mood entries logged yet. Start tracking how you feel to see patterns over time.</p>
            </motion.div>
          )}
          
          {entries.length > 0 && visibleEntries.length === 0 && !isAdding && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mindtrack-card flex items-center gap-3 text-mindtrack-stone/70"
            >
              <AlertCircle className="w-5 h-5" />
              <p>No entries match your current filters.</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MoodTracker;
