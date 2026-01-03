import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import { useState } from "react";
import { useCategoryManager } from "@/hooks/trigger-tracker/useCategoryManager";

export interface FilterState {
  searchTrigger: string;
  searchCoping: string;
  searchAlternatives: string;
  selectedCategory: string | null;
  dateStart: string | null;
  dateEnd: string | null;
}

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  entryCount: number;
}

const FilterPanel = ({ filters, onFilterChange, entryCount }: FilterPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { categories } = useCategoryManager();

  const hasActiveFilters = 
    filters.searchTrigger || 
    filters.searchCoping || 
    filters.searchAlternatives || 
    filters.selectedCategory ||
    filters.dateStart ||
    filters.dateEnd;

  const handleClearAll = () => {
    onFilterChange({
      searchTrigger: "",
      searchCoping: "",
      searchAlternatives: "",
      selectedCategory: null,
      dateStart: null,
      dateEnd: null,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mindtrack-card"
    >
      {/* Filter Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between pb-4 border-b border-mindtrack-sage/10"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-mindtrack-stone">
            Filters {hasActiveFilters && <span className="text-mindtrack-sage font-bold">({Object.values(filters).filter(f => f).length})</span>}
          </span>
          {entryCount > 0 && (
            <span className="text-sm text-mindtrack-stone/60">{entryCount} entries</span>
          )}
        </div>
        <ChevronDown
          className={`w-5 h-5 text-mindtrack-sage transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Filter Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-4 space-y-4"
          >
            {/* Search Fields */}
            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-mindtrack-stone/70 mb-1 block">
                  Search triggers
                </label>
                <input
                  type="text"
                  value={filters.searchTrigger}
                  onChange={(e) => 
                    onFilterChange({ ...filters, searchTrigger: e.target.value })
                  }
                  placeholder="Find triggers..."
                  className="w-full p-2 text-sm rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/30"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-mindtrack-stone/70 mb-1 block">
                  Search coping strategies
                </label>
                <input
                  type="text"
                  value={filters.searchCoping}
                  onChange={(e) => 
                    onFilterChange({ ...filters, searchCoping: e.target.value })
                  }
                  placeholder="Find coping..."
                  className="w-full p-2 text-sm rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/30"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-mindtrack-stone/70 mb-1 block">
                  Search alternatives
                </label>
                <input
                  type="text"
                  value={filters.searchAlternatives}
                  onChange={(e) => 
                    onFilterChange({ ...filters, searchAlternatives: e.target.value })
                  }
                  placeholder="Find alternatives..."
                  className="w-full p-2 text-sm rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/30"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-xs font-medium text-mindtrack-stone/70 mb-2 block">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => 
                      onFilterChange({
                        ...filters,
                        selectedCategory: filters.selectedCategory === cat.name ? null : cat.name,
                      })
                    }
                    className={`px-3 py-1.5 text-sm rounded-md border transition-all ${
                      filters.selectedCategory === cat.name
                        ? 'bg-white'
                        : 'bg-transparent'
                    }`}
                    style={{
                      borderColor: cat.color,
                      color: filters.selectedCategory === cat.name ? cat.color : cat.color,
                      backgroundColor: filters.selectedCategory === cat.name ? `${cat.color}15` : 'transparent',
                    }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label htmlFor="date-start" className="text-xs font-medium text-mindtrack-stone/70 mb-1 block">
                  From date
                </label>
                <input
                  id="date-start"
                  type="date"
                  value={filters.dateStart || ""}
                  onChange={(e) => 
                    onFilterChange({ ...filters, dateStart: e.target.value || null })
                  }
                  className="w-full p-2 text-sm rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/30"
                />
              </div>

              <div>
                <label htmlFor="date-end" className="text-xs font-medium text-mindtrack-stone/70 mb-1 block">
                  To date
                </label>
                <input
                  id="date-end"
                  type="date"
                  value={filters.dateEnd || ""}
                  onChange={(e) => 
                    onFilterChange({ ...filters, dateEnd: e.target.value || null })
                  }
                  className="w-full p-2 text-sm rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/30"
                />
              </div>
            </div>

            {/* Clear Button */}
            {hasActiveFilters && (
              <div className="flex justify-end pt-2 border-t border-mindtrack-sage/10">
                <button
                  onClick={handleClearAll}
                  className="text-sm text-mindtrack-sage hover:text-mindtrack-sage/80 transition-colors flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear all filters
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FilterPanel;
