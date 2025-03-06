
import { motion } from "framer-motion";
import { AlertCircle, Calendar, Heart, LineChart, List, Pencil, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

import { MoodEntry, MoodCategory, STORAGE_KEY, getMoodCategory } from "./types";
import MoodForm from "./MoodForm";
import MoodChart from "./MoodChart";
import MoodEntryComponent from "./MoodEntry";
import CalendarView from "./CalendarView";

interface MoodTrackerProps {
  showOnlyFavorites?: boolean;
}

const MoodTracker = ({ showOnlyFavorites = false }: MoodTrackerProps) => {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [calendarView, setCalendarView] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('week');
  
  // Load entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem(STORAGE_KEY);
    if (savedEntries) {
      try {
        setEntries(JSON.parse(savedEntries));
      } catch (e) {
        console.error("Error parsing saved mood entries:", e);
      }
    }
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const visibleEntries = showOnlyFavorites
    ? entries.filter(entry => entry.isFavorite)
    : selectedDate 
      ? entries.filter(entry => entry.date === selectedDate)
      : entries;

  const chartData = [...entries]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map(entry => ({
      date: entry.date,
      time: entry.time || "",
      mood: entry.mood,
      category: getMoodCategory(entry.mood).label,
      color: getMoodCategory(entry.mood).color,
      note: entry.note || "",
      fullTimestamp: entry.timestamp,
      timestamp: new Date(entry.timestamp).getTime() // Add numeric timestamp for sorting
    }));

  const addEntry = (entry: MoodEntry) => {
    setEntries([entry, ...entries]);
    setIsAdding(false);
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
              <List className="w-4 h-4 inline mr-1" />
              List View
            </button>
            <button
              onClick={() => setCalendarView(true)}
              className={`px-4 py-2 rounded-md ${calendarView ? 'bg-mindtrack-sage text-white' : 'bg-gray-100 text-mindtrack-stone'}`}
            >
              <Calendar className="w-4 h-4 inline mr-1" />
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

        {/* Calendar View */}
        {calendarView && (
          <CalendarView 
            uniqueDates={uniqueDates} 
            entries={entries} 
            selectedDate={selectedDate} 
            onSelectDate={setSelectedDate} 
          />
        )}

        {/* Timeframe Selection */}
        {entries.length > 0 && (
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setTimeframe('day')}
              className={`px-3 py-1 text-sm rounded-md ${timeframe === 'day' ? 'bg-mindtrack-sage text-white' : 'bg-gray-100 text-mindtrack-stone'}`}
            >
              Day
            </button>
            <button
              onClick={() => setTimeframe('week')}
              className={`px-3 py-1 text-sm rounded-md ${timeframe === 'week' ? 'bg-mindtrack-sage text-white' : 'bg-gray-100 text-mindtrack-stone'}`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeframe('month')}
              className={`px-3 py-1 text-sm rounded-md ${timeframe === 'month' ? 'bg-mindtrack-sage text-white' : 'bg-gray-100 text-mindtrack-stone'}`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeframe('year')}
              className={`px-3 py-1 text-sm rounded-md ${timeframe === 'year' ? 'bg-mindtrack-sage text-white' : 'bg-gray-100 text-mindtrack-stone'}`}
            >
              Year
            </button>
          </div>
        )}

        {/* Mood Chart */}
        {entries.length > 0 && (
          <MoodChart 
            chartData={chartData} 
            timeframe={timeframe}
            selectedDate={selectedDate}
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
