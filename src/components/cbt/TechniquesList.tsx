import { motion } from "framer-motion";
import { Brain, Check, ChevronDown, Heart, X } from "lucide-react";
import { Technique } from "./types";

interface TechniquesListProps {
  techniques: Technique[];
  expandedId: string | null;
  favorites: string[];
  completedExercises: string[];
  toggleFavorite: (id: string) => void;
  setExpandedId: (id: string | null) => void;
  markAsCompleted: (id: string) => void;
  unmarkAsCompleted: (id: string) => void;
  startExercise: (id: string) => void;
  getTodayCompletionCount: (id: string) => number;
}

const TechniquesList = ({
  techniques,
  expandedId,
  favorites,
  completedExercises,
  toggleFavorite,
  setExpandedId,
  markAsCompleted,
  unmarkAsCompleted,
  startExercise,
  getTodayCompletionCount
}: TechniquesListProps) => {
  if (techniques.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mindtrack-card flex items-center gap-3 text-mindtrack-stone/70"
      >
        <div className="flex items-center gap-2">
          <span className="text-mindtrack-stone/70">No techniques match your current filter.</span>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {techniques.map((technique, index) => {
        const todayCount = getTodayCompletionCount(technique.id);
        const isFavorite = favorites.includes(technique.id);
        const isExpanded = expandedId === technique.id;
        
        return (
          <motion.div
            key={technique.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`mindtrack-card ${
              completedExercises.includes(technique.id) ? "border-l-4 border-l-mindtrack-sage" : ""
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5 text-mindtrack-sage flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-mindtrack-stone">{technique.title}</h3>
                  {todayCount > 0 && (
                    <span className="text-xs text-mindtrack-sage">
                      Completed {todayCount} time{todayCount !== 1 ? 's' : ''} today
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleFavorite(technique.id)}
                  className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
                  aria-label={isFavorite ? `Remove ${technique.title} from favorites` : `Add ${technique.title} to favorites`}
                >
                  <Heart 
                    className={`w-4 h-4 ${isFavorite ? 'fill-mindtrack-sage text-mindtrack-sage' : 'text-mindtrack-sage'}`}
                    aria-hidden="true"
                  />
                </button>
                <button
                  onClick={() => setExpandedId(isExpanded ? null : technique.id)}
                  className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
                  aria-label={isExpanded ? `Collapse ${technique.title} details` : `Expand ${technique.title} details`}
                  aria-expanded={String(isExpanded)? "true" : "false"}
                >
                  <ChevronDown 
                    className={`w-4 h-4 text-mindtrack-sage transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
            <p className="text-mindtrack-stone/80 mb-2">{technique.description}</p>
            <div className="flex gap-2 text-xs">
              <span className="px-2 py-1 bg-mindtrack-sage/10 text-mindtrack-sage rounded-full">
                {technique.category}
              </span>
              {completedExercises.includes(technique.id) && (
                <span className="px-2 py-1 bg-mindtrack-sage/10 text-mindtrack-sage rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" /> Completed
                </span>
              )}
            </div>
            
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 pt-4 border-t border-mindtrack-sage/10"
              >
                <h4 className="font-medium text-mindtrack-stone mb-2">Steps:</h4>
                <ol className="list-decimal pl-5 space-y-2 mb-4">
                  {technique.steps.map((step, i) => (
                    <li key={i} className="text-mindtrack-stone/80">{step}</li>
                  ))}
                </ol>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => startExercise(technique.id)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors"
                  >
                    <Brain className="w-4 h-4" />
                    Try Exercise
                  </button>
                  {!completedExercises.includes(technique.id) ? (
                    <button
                      onClick={() => markAsCompleted(technique.id)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-mindtrack-sage text-mindtrack-sage rounded-md hover:bg-mindtrack-sage/5 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Mark as Completed
                    </button>
                  ) : (
                    <button
                      onClick={() => unmarkAsCompleted(technique.id)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-mindtrack-sage text-mindtrack-sage rounded-md hover:bg-mindtrack-sage/5 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Unmark as Completed
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default TechniquesList;