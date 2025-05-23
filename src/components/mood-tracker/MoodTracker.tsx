
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import { MoodEntry, STORAGE_KEY } from "./types";
import MoodForm from "./MoodForm";
import MoodChart from "./MoodChart";
import MoodEntryComponent from "./MoodEntry";
import CalendarView from "./CalendarView";
import FavoritesToggle from "./FavoritesToggle";
import EmptyState from "./EmptyState";
import AddMoodButton from "./AddMoodButton";
import DateFilter from "./DateFilter";
import ViewToggle from "./ViewToggle";
import MoodData from "./MoodData";
import MoodInsights from "./MoodInsights";

interface MoodTrackerProps {
  showOnlyFavorites?: boolean;
}

const MoodTracker = ({ showOnlyFavorites = false }: MoodTrackerProps) => {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [calendarView, setCalendarView] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showFavoritesState, setShowFavoritesState] = useState(showOnlyFavorites);
  
  // Always use 'day' timeframe for consistent display
  const timeframe = 'day';
  
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    setShowFavoritesState(showOnlyFavorites);
  }, [showOnlyFavorites]);

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

        <div className="flex justify-between items-center mb-6">
          <ViewToggle 
            calendarView={calendarView} 
            setCalendarView={setCalendarView} 
          />
          
          {selectedDate && (
            <DateFilter 
              selectedDate={selectedDate} 
              clearDateFilter={() => setSelectedDate(null)} 
            />
          )}
        </div>

        {calendarView && (
          <CalendarView 
            uniqueDates={uniqueDates} 
            entries={entries} 
            selectedDate={selectedDate} 
            onSelectDate={setSelectedDate} 
          />
        )}

        <MoodData 
          entries={entries} 
          showOnlyFavorites={showFavoritesState} 
          selectedDate={selectedDate}
        >
          {({ visibleEntries, chartData, moodInsights }) => (
            <>
              {entries.length > 0 && (
                <>
                  <MoodChart 
                    chartData={chartData} 
                    timeframe={timeframe}
                    selectedDate={selectedDate}
                  />
                  
                  <MoodInsights insights={moodInsights} />
                </>
              )}

              <div className="mindtrack-container">
                <div className="flex justify-between items-center">
                  <FavoritesToggle 
                    showOnlyFavorites={showFavoritesState} 
                    setShowOnlyFavorites={setShowFavoritesState}
                  />
                  
                  {!isAdding && (
                    <AddMoodButton onClick={() => setIsAdding(true)} />
                  )}
                </div>
              </div>

              <div className="space-y-6 mt-6">
                {isAdding && (
                  <MoodForm onSubmit={addEntry} onCancel={() => setIsAdding(false)} />
                )}

                {/* Display entries in reverse order (newest first) */}
                {[...visibleEntries].reverse().map((entry, index) => (
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
                  <EmptyState message="No mood entries logged yet. Start tracking how you feel to see patterns over time." />
                )}
                
                {entries.length > 0 && visibleEntries.length === 0 && !isAdding && (
                  <EmptyState message="No entries match your current filters." />
                )}
              </div>
            </>
          )}
        </MoodData>
      </div>
    </section>
  );
};

export default MoodTracker;
