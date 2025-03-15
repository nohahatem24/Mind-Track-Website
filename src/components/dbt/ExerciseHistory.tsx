
import React from "react";
import { motion } from "framer-motion";
import { Search, Trash2, Edit } from "lucide-react";
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
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mindtrack-card mb-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-mindtrack-stone">Exercise History</h3>
        <div className="relative">
          <Search className="w-4 h-4 text-mindtrack-stone/50 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search history..."
            className="pl-9 pr-3 py-1.5 border border-mindtrack-sage/20 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-mindtrack-sage/30 focus:border-mindtrack-sage/30"
          />
        </div>
      </div>

      {history.length === 0 ? (
        <p className="text-mindtrack-stone/70 text-sm italic">
          {searchQuery
            ? "No exercise history matching your search."
            : "No completed exercises yet. Start an exercise to see your history."}
        </p>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {history.map((entry) => {
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
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteHistoryEntry(entry.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
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
