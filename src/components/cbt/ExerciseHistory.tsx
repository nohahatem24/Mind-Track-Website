
import { motion } from "framer-motion";
import { ChevronDown, Edit, Trash2, Calendar } from "lucide-react";
import { useState, useRef, forwardRef } from "react";
import { ExerciseData, Technique } from "./types";
import { HistoryRenderer } from "./HistoryRenderer";
import { BehavioralActivationHistoryRenderer } from "../behavioral-activation/HistoryRenderer";

interface ExerciseHistoryProps {
  history: ExerciseData[];
  techniques: Technique[];
  editHistoryEntry: (entryId: string) => void;
  deleteHistoryEntry: (entryId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  exerciseFormRef?: React.RefObject<HTMLDivElement>;
}

const ExerciseHistory = ({
  history,
  techniques,
  editHistoryEntry,
  deleteHistoryEntry,
  searchQuery,
  setSearchQuery,
  exerciseFormRef
}: ExerciseHistoryProps) => {
  const [historyDetails, setHistoryDetails] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const viewHistoryDetails = (entryId: string) => {
    setHistoryDetails(historyDetails === entryId ? null : entryId);
  };

  // Handle edit with scroll to form
  const handleEditClick = (entryId: string) => {
    editHistoryEntry(entryId);
    // Scroll to exercise form after a small delay to ensure it renders
    if (exerciseFormRef) {
      setTimeout(() => {
        exerciseFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

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
      className="mindtrack-card mb-8"
    >
      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-mindtrack-stone">Exercise History</h3>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Search Filter */}
          <div className="relative">
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

          {/* Start Date Filter */}
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-2 top-3 text-mindtrack-stone/60" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 pl-8 rounded-md border border-mindtrack-sage/20 text-sm focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20"
              title="Start date"
            />
          </div>

          {/* End Date Filter */}
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-2 top-3 text-mindtrack-stone/60" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 pl-8 rounded-md border border-mindtrack-sage/20 text-sm focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20"
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
      
      {filteredByDate.length > 0 ? (
        <div className="space-y-4 max-h-[500px] overflow-y-auto">
          {filteredByDate.map(entry => {
            const technique = techniques.find(t => t.id === entry.techniqueId);
            const isExpanded = historyDetails === entry.id;
            
            // Check if behavioral activation entry has pending activities
            const hasPendingActivities = entry.techniqueId === 'behav-activation' && 
              ((entry.data?.activities as any[]) || []).some((a: any) => a.status === 'pending');
            
            return (
              <motion.div 
                key={entry.id} 
                className={`border rounded-md overflow-hidden ${
                  isExpanded ? 'border-mindtrack-sage/20' : 'border-mindtrack-sage/10'
                }`}
                layout
              >
                {/* Header - Gray background, clickable */}
                <div
                  onClick={() => viewHistoryDetails(entry.id)}
                  className={`p-4 cursor-pointer transition-colors ${
                    hasPendingActivities 
                      ? 'bg-amber-50 hover:bg-amber-100' 
                      : 'bg-mindtrack-stone/5 hover:bg-mindtrack-stone/10'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-mindtrack-stone flex items-center gap-2">
                          {technique?.title || "Unknown Exercise"}
                          <span className="px-2 py-0.5 bg-mindtrack-sage/10 text-mindtrack-sage rounded-full text-xs">
                            {technique?.category || "unknown"}
                          </span>
                        </h4>
                        {hasPendingActivities && (
                          <span className="px-2 py-0.5 bg-amber-200 text-amber-800 rounded-full text-xs font-medium">
                            ⏳ Not Completed
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-mindtrack-stone/60">{entry.date}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(entry.id);
                        }}
                        className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
                        title="Edit entry"
                      >
                        <Edit className="w-4 h-4 text-mindtrack-sage" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteHistoryEntry(entry.id);
                        }}
                        className="p-1 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          viewHistoryDetails(entry.id);
                        }}
                        className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
                        title={isExpanded ? "Hide details" : "Show details"}
                      >
                        <ChevronDown 
                          className={`w-4 h-4 text-mindtrack-sage transform transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`} 
                        />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Details - White background */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white border-t border-mindtrack-sage/10 p-4"
                  >
                    {entry.techniqueId === 'behav-activation' ? (
                      <BehavioralActivationHistoryRenderer entry={entry} data={entry.data} />
                    ) : (
                      <HistoryRenderer entry={entry} />
                    )}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 text-mindtrack-stone/70">
          {searchQuery || startDate || endDate 
            ? "No results match your filters. Try adjusting your search or dates." 
            : "No exercise history yet. Complete exercises to build your history."}
        </div>
      )}
    </motion.div>
  );
};

export default ExerciseHistory;
