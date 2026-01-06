
import { motion } from "framer-motion";
import { AlertCircle, Heart, Pencil, Plus, Trash2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import TriggerCategoryAnalysis from "./trigger-tracker/TriggerCategoryAnalysis";
import TriggerForm, { Trigger } from "./trigger-tracker/TriggerForm";
import FilterPanel, { FilterState } from "./trigger-tracker/FilterPanel";
import CategoryChart from "./trigger-tracker/CategoryChart";

interface TriggerTrackerProps {
  showOnlyFavorites?: boolean;
}

const STORAGE_KEY = 'mindtrack_triggers';

const TriggerTracker = ({ showOnlyFavorites = false }: TriggerTrackerProps) => {
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showFavoritesState, setShowFavoritesState] = useState(showOnlyFavorites);
  const [filters, setFilters] = useState<FilterState>({
    searchTrigger: "",
    searchCoping: "",
    searchAlternatives: "",
    selectedCategory: null,
    dateStart: null,
    dateEnd: null,
  });

  // Load saved triggers from localStorage
  useEffect(() => {
    const savedTriggers = localStorage.getItem(STORAGE_KEY);
    if (savedTriggers) {
      try {
        setTriggers(JSON.parse(savedTriggers));
      } catch (e) {
        console.error("Error parsing saved triggers:", e);
      }
    }
  }, []);

  // Save triggers to localStorage when they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(triggers));
  }, [triggers]);

  // Update showFavorites state when prop changes
  useEffect(() => {
    setShowFavoritesState(showOnlyFavorites);
  }, [showOnlyFavorites]);

  // Scroll to top when filters change
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    // Scroll to the filter section
    const emotionSection = document.getElementById('trigger');
    if (emotionSection) {
      setTimeout(() => {
        emotionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  // Filter and search logic
  const filteredTriggers = useMemo(() => {
    let result = triggers;

    // Favorites filter
    if (showFavoritesState) {
      result = result.filter(trigger => trigger.isFavorite);
    }

    // Search filters
    if (filters.searchTrigger) {
      result = result.filter(trigger =>
        trigger.trigger?.toLowerCase().includes(filters.searchTrigger.toLowerCase())
      );
    }

    if (filters.searchCoping) {
      result = result.filter(trigger =>
        trigger.coping?.toLowerCase().includes(filters.searchCoping.toLowerCase())
      );
    }

    if (filters.searchAlternatives) {
      result = result.filter(trigger =>
        trigger.alternatives?.toLowerCase().includes(filters.searchAlternatives.toLowerCase())
      );
    }

    // Category filter
    if (filters.selectedCategory) {
      result = result.filter(trigger => trigger.category === filters.selectedCategory);
    }

    // Date range filter
    if (filters.dateStart || filters.dateEnd) {
      result = result.filter(trigger => {
        const triggerDate = new Date(trigger.timestamp);
        if (filters.dateStart) {
          const startDate = new Date(filters.dateStart);
          if (triggerDate < startDate) return false;
        }
        if (filters.dateEnd) {
          const endDate = new Date(filters.dateEnd);
          endDate.setHours(23, 59, 59, 999);
          if (triggerDate > endDate) return false;
        }
        return true;
      });
    }

    return result.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [triggers, showFavoritesState, filters]);

  const addTrigger = (trigger: Trigger) => {
    setTriggers([trigger, ...triggers]);
    setIsAdding(false);
  };

  const updateTrigger = (updatedTrigger: Trigger) => {
    setTriggers(triggers.map(t => t.id === updatedTrigger.id ? updatedTrigger : t));
    setEditingId(null);
  };

  const deleteTrigger = (triggerId: number) => {
    setTriggers(triggers.filter(trigger => trigger.id !== triggerId));
  };

  const toggleFavorite = (triggerId: number) => {
    setTriggers(triggers.map(trigger => 
      trigger.id === triggerId 
        ? { ...trigger, isFavorite: !trigger.isFavorite } 
        : trigger
    ));
  };

  const visibleTriggers = filteredTriggers;

  return (
    <section id="trigger" className="py-16">
      <div className="mindtrack-container">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="section-title">Trigger Tracking</h2>
          <p className="text-mindtrack-stone/80 max-w-2xl">
            Track your emotional experiences. Fill in any aspect that feels relevant — whether it's a specific trigger, your thoughts, feelings, or coping strategies. Your reflections help you understand patterns at your own pace.
          </p>
        </motion.div>

        {/* Add Entry Button - TOP */}
        {!isAdding && triggers.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAdding(true)}
            className="mb-6 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-mindtrack-sage text-white rounded-lg hover:bg-mindtrack-sage/90 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Add New Entry
          </motion.button>
        )}

        {/* Add Form if Adding */}
        {isAdding && (
          <div className="mb-8">
            <TriggerForm onSubmit={addTrigger} onCancel={() => setIsAdding(false)} />
          </div>
        )}

        {/* Reflections - Full Width */}
        {triggers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mindtrack-card mb-8"
          >
            <TriggerCategoryAnalysis 
              triggers={triggers}
              filteredTriggers={filteredTriggers}
              reflectionsOnly={true}
            />
          </motion.div>
        )}

        {/* Filters and Chart Side by Side */}
        {triggers.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Filters - More Prominent */}
            <div>
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                entryCount={visibleTriggers.length}
              />
            </div>

            {/* Category Chart */}
            <div>
              <CategoryChart 
                triggers={triggers}
                filteredTriggers={filteredTriggers}
              />
            </div>
          </div>
        )}

        {/* Favorites Toggle */}
        {triggers.length > 0 && (
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setShowFavoritesState(!showFavoritesState)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md ${
                showFavoritesState 
                  ? 'bg-mindtrack-sage text-white' 
                  : 'text-mindtrack-sage hover:bg-mindtrack-sage/5'
              } transition-colors`}
            >
              <Heart className="w-4 h-4" />
              <span className="text-sm">Favorites</span>
            </button>
          </div>
        )}

        {/* Entries List - Scrollable Container */}
        <div className="max-h-[600px] overflow-y-auto border border-mindtrack-sage/10 rounded-lg bg-mindtrack-cream/30">
          <div className="space-y-6 p-6">
            {visibleTriggers.map((trigger, index) => (
              <motion.div
                key={trigger.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="mindtrack-card"
              >
                {editingId === trigger.id ? (
                  <TriggerForm 
                    onSubmit={updateTrigger} 
                    onCancel={() => setEditingId(null)}
                    initialData={trigger}
                  />
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-sm text-mindtrack-stone/60">
                          {trigger.timestamp}
                        </div>
                        {trigger.category && (
                          <div className="mt-2 flex items-center gap-2">
                            <div
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ 
                                backgroundColor: getCategoryColor(trigger.category) 
                              }}
                            />
                            <span className="text-xs font-medium text-mindtrack-stone/70">
                              {trigger.category}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleFavorite(trigger.id)}
                          className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
                          title={trigger.isFavorite ? "Remove from favorites" : "Add to favorites"}
                        >
                          <Heart 
                            className={`w-4 h-4 ${trigger.isFavorite ? 'fill-mindtrack-sage text-mindtrack-sage' : 'text-mindtrack-sage'}`} 
                          />
                        </button>
                        <button
                          onClick={() => setEditingId(trigger.id)}
                          className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
                          title="Edit this entry"
                        >
                          <Pencil className="w-4 h-4 text-mindtrack-sage" />
                        </button>
                        <button
                          onClick={() => deleteTrigger(trigger.id)}
                          className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
                          title="Delete this entry"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {trigger.trigger && (
                        <div>
                          <h3 className="font-medium text-mindtrack-stone text-sm">Trigger</h3>
                          <p className="mt-1 text-mindtrack-stone/80 text-sm">{trigger.trigger}</p>
                        </div>
                      )}
                      {trigger.thoughts && (
                        <div>
                          <h3 className="font-medium text-mindtrack-stone text-sm">Thoughts & Feelings</h3>
                          <p className="mt-1 text-mindtrack-stone/80 text-sm">{trigger.thoughts}</p>
                        </div>
                      )}
                      {trigger.coping && (
                        <div>
                          <h3 className="font-medium text-mindtrack-stone text-sm">Current Coping</h3>
                          <p className="mt-1 text-mindtrack-stone/80 text-sm">{trigger.coping}</p>
                        </div>
                      )}
                      {trigger.alternatives && (
                        <div>
                          <h3 className="font-medium text-mindtrack-stone text-sm">Alternative</h3>
                          <p className="mt-1 text-mindtrack-stone/80 text-sm">{trigger.alternatives}</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            ))}

            {/* Empty States */}
            {triggers.length === 0 && !isAdding && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mindtrack-card flex items-center gap-3 text-mindtrack-stone/70"
              >
                <AlertCircle className="w-5 h-5" />
                <p>No entries logged yet. Add your first one to start tracking your emotional patterns.</p>
              </motion.div>
            )}

            {visibleTriggers.length === 0 && triggers.length > 0 && !isAdding && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mindtrack-card flex items-center gap-3 text-mindtrack-stone/70"
              >
                <AlertCircle className="w-5 h-5" />
                <p>No entries match your filters. Try adjusting your search or category selection.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// Helper to get category color
const getCategoryColor = (categoryName: string): string => {
  const defaultColors: { [key: string]: string } = {
    'Work': '#3b82f6',
    'Relationships': '#ec4899',
    'Health': '#22c55e',
    'Finances': '#f59e0b',
    'Self-image': '#8b5cf6',
  };
  return defaultColors[categoryName] || '#6b7280';
};

export default TriggerTracker;
