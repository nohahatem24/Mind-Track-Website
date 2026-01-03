
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Trash2, Edit, Calendar } from "lucide-react";
import { Technique, ExerciseEntry } from "./types";

interface ExerciseHistoryProps {
  history: ExerciseEntry[];
  techniques: Technique[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  editHistoryEntry: (id: string) => void;
  deleteHistoryEntry: (id: string) => void;
}

const ExerciseHistory: React.FC<ExerciseHistoryProps> = ({
  history,
  techniques,
  searchQuery,
  setSearchQuery,
  editHistoryEntry,
  deleteHistoryEntry
}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Filter history by date range
  const filteredByDate = history.filter(entry => {
    if (!startDate && !endDate) return true;
    
    const entryDate = new Date(entry.date);
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      if (entryDate < start) return false;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (entryDate > end) return false;
    }
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mindtrack-card mb-6"
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-mindtrack-stone mb-4">Exercise History</h3>

        {/* Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search Filter */}
          <div className="relative">
            <Search className="w-4 h-4 text-mindtrack-stone/50 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history..."
              className="w-full pl-9 pr-3 py-1.5 border border-mindtrack-sage/20 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-mindtrack-sage/30 focus:border-mindtrack-sage/30"
            />
          </div>

          {/* Start Date Filter */}
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-mindtrack-stone/50" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-mindtrack-sage/20 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-mindtrack-sage/30 focus:border-mindtrack-sage/30"
              title="Start date"
            />
          </div>

          {/* End Date Filter */}
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-mindtrack-stone/50" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-mindtrack-sage/20 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-mindtrack-sage/30 focus:border-mindtrack-sage/30"
              title="End date"
            />
            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-mindtrack-sage/60 hover:text-mindtrack-sage text-xs font-medium"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {filteredByDate.length === 0 ? (
        <p className="text-mindtrack-stone/70 text-sm italic">
          {searchQuery || startDate || endDate
            ? "No exercise history matching your filters."
            : "No completed exercises yet. Start an exercise to see your history."}
        </p>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {filteredByDate.map((entry) => {
            const technique = techniques.find((t) => t.id === entry.techniqueId);
            return (
              <div key={entry.id} className="border-b border-mindtrack-sage/10 pb-3 last:border-0">
                <div className="flex justify-between">
                  <div>
                    <h4 className="text-mindtrack-stone font-medium">
                      {technique?.title || "Unknown Exercise"}
                    </h4>
                    <span className="text-xs text-mindtrack-stone/60">{entry.date}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editHistoryEntry(entry.id)}
                      className="p-1.5 text-mindtrack-sage hover:bg-mindtrack-sage/5 rounded-full transition-colors"
                      title="Edit entry"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteHistoryEntry(entry.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default ExerciseHistory;
