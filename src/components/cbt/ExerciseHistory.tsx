
import { motion } from "framer-motion";
import { ChevronDown, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { ExerciseData, Technique } from "./types";
import { HistoryRenderer } from "./HistoryRenderer";

interface ExerciseHistoryProps {
  history: ExerciseData[];
  techniques: Technique[];
  editHistoryEntry: (entryId: string) => void;
  deleteHistoryEntry: (entryId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ExerciseHistory = ({
  history,
  techniques,
  editHistoryEntry,
  deleteHistoryEntry,
  searchQuery,
  setSearchQuery
}: ExerciseHistoryProps) => {
  const [historyDetails, setHistoryDetails] = useState<string | null>(null);

  const viewHistoryDetails = (entryId: string) => {
    setHistoryDetails(historyDetails === entryId ? null : entryId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="mindtrack-card mb-8"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-mindtrack-stone">Exercise History</h3>
        
        <div className="relative w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search history..."
            className="w-full p-2 pl-8 rounded-md border border-mindtrack-sage/20 text-sm focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-2 top-3 text-mindtrack-stone/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      {history.length > 0 ? (
        <div className="space-y-4 max-h-[500px] overflow-y-auto">
          {history.map(entry => {
            const technique = techniques.find(t => t.id === entry.techniqueId);
            
            return (
              <div key={entry.id} className="p-4 border border-mindtrack-sage/10 rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-mindtrack-stone flex items-center gap-2">
                      {technique?.title || "Unknown Exercise"}
                      <span className="px-2 py-0.5 bg-mindtrack-sage/10 text-mindtrack-sage rounded-full text-xs">
                        {technique?.category || "unknown"}
                      </span>
                    </h4>
                    <p className="text-sm text-mindtrack-stone/60">{entry.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editHistoryEntry(entry.id)}
                      className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
                      title="Edit entry"
                    >
                      <Edit className="w-4 h-4 text-mindtrack-sage" />
                    </button>
                    <button
                      onClick={() => deleteHistoryEntry(entry.id)}
                      className="p-1 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                    <button
                      onClick={() => viewHistoryDetails(entry.id)}
                      className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
                      title={historyDetails === entry.id ? "Hide details" : "Show details"}
                    >
                      <ChevronDown 
                        className={`w-4 h-4 text-mindtrack-sage transform transition-transform ${
                          historyDetails === entry.id ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                  </div>
                </div>
                
                {historyDetails === entry.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 pt-3 border-t border-mindtrack-sage/10"
                  >
                    <HistoryRenderer entry={entry} />
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 text-mindtrack-stone/70">
          {searchQuery ? "No results match your search." : "No exercise history yet. Complete exercises to build your history."}
        </div>
      )}
    </motion.div>
  );
};

export default ExerciseHistory;
