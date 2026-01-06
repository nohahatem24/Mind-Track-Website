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
import DateRangeFilter from "./DateRangeFilter";

interface MoodTrackerProps {
  showOnlyFavorites?: boolean;
}

const MoodTracker = ({ showOnlyFavorites = false }: MoodTrackerProps) => {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [calendarView, setCalendarView] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showFavoritesState, setShowFavoritesState] = useState(showOnlyFavorites);
  const [dateRange, setDateRange] = useState<{ startDate: string | null; endDate: string | null }>({
    startDate: null,
    endDate: null
  });
  
  // Always use 'day' timeframe for consistent display
  const timeframe = 'day';
  
  // Load entries from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem(STORAGE_KEY);
    if (savedEntries) {
      try {
        const parsed = JSON.parse(savedEntries);
        setEntries(parsed);
      } catch (e) {
        console.error("Error parsing saved mood entries:", e);
      }
    }
  }, []);

  // Save entries to localStorage
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
  }, [entries]);

  // Sync with external favorites toggle
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

  const clearAllFilters = () => {
    setSelectedDate(null);
    setDateRange({ startDate: null, endDate: null });
    setShowFavoritesState(false);
  };

  const hasActiveFilters = selectedDate !== null || dateRange.startDate !== null || dateRange.endDate !== null || showFavoritesState;

  return (
    <section id="mood" className="py-16 bg-gradient-to-b from-white to-mindtrack-sage/5">
      <div className="mindtrack-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="section-title">Mood Tracking</h2>
          <p className="text-mindtrack-stone/80 max-w-2xl">
            Track your daily mood on a scale from -10 (extremely low) to +10 (extremely high) to identify patterns and monitor your emotional well-being.
          </p>
        </motion.div>

        {/* Action Section - Log Mood Button at the TOP */}
        <div className="mb-8">
          {!isAdding && (
            <AddMoodButton onClick={() => setIsAdding(true)} />
          )}
          
          {isAdding && (
            <MoodForm onSubmit={addEntry} onCancel={() => setIsAdding(false)} />
          )}
        </div>

        {/* Filters and View Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <FavoritesToggle 
              showOnlyFavorites={showFavoritesState} 
              setShowOnlyFavorites={setShowFavoritesState}
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <DateRangeFilter 
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
            
            {selectedDate && (
              <DateFilter 
                selectedDate={selectedDate} 
                clearDateFilter={() => setSelectedDate(null)} 
              />
            )}
            
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-mindtrack-sage hover:text-mindtrack-sage/80 underline transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Calendar View - Always Visible */}
        {entries.length > 0 && (
          <CalendarView 
            uniqueDates={uniqueDates} 
            entries={entries} 
            selectedDate={selectedDate} 
            onSelectDate={setSelectedDate} 
          />
        )}

        {/* Main Content with Data Processing */}
        <MoodData 
          entries={entries} 
          showOnlyFavorites={showFavoritesState} 
          selectedDate={selectedDate}
          dateRange={dateRange}
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

              {/* Mood Entries List - Scrollable Container */}
              <div className="space-y-4 mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-mindtrack-stone">
                    Your Mood Entries {visibleEntries.length > 0 && `(${visibleEntries.length})`}
                  </h3>
                  {!selectedDate && dateRange.startDate === null && dateRange.endDate === null && (
                    <p className="text-xs text-mindtrack-stone/60">Today's entries</p>
                  )}
                  {selectedDate && (
                    <p className="text-xs text-mindtrack-stone/60">{selectedDate}</p>
                  )}
                  {(dateRange.startDate || dateRange.endDate) && !selectedDate && (
                    <p className="text-xs text-mindtrack-stone/60">Filtered range</p>
                  )}
                </div>

                {/* Scrollable entries container */}
                <div className="bg-white rounded-lg border border-mindtrack-sage/10 overflow-hidden">
                  {visibleEntries.length > 0 ? (
                    <div className="max-h-[600px] overflow-y-auto scrollbar-thin">
                      <div className="space-y-4 p-4">
                        {[...visibleEntries].sort((a, b) => 
                          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                        ).map((entry, index) => (
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
                      </div>
                    </div>
                  ) : entries.length === 0 ? (
                    <div className="p-6">
                      <EmptyState message="No mood entries logged yet. Click the button above to start tracking how you feel!" />
                    </div>
                  ) : (
                    <div className="p-6">
                      <EmptyState message="No entries match your current filters. Try adjusting your filter settings." />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </MoodData>
      </div>
    </section>
  );
};

export default MoodTracker;