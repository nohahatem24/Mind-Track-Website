
import React from "react";
import { motion } from "framer-motion";
import { Technique } from "./types";
import { ChevronDown, ChevronUp, Heart, BookOpen } from "lucide-react";

interface TechniquesListProps {
  techniques: Technique[];
  expandedId: string | null;
  favorites: string[];
  completedExercises: Record<string, number>;
  toggleFavorite: (id: string) => void;
  setExpandedId: (id: string | null) => void;
  startExercise: (id: string) => void;
  getTodayCompletionCount: (id: string) => number;
}

const TechniquesList: React.FC<TechniquesListProps> = ({
  techniques,
  expandedId,
  favorites,
  completedExercises,
  toggleFavorite,
  setExpandedId,
  startExercise,
  getTodayCompletionCount
}) => {
  if (techniques.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mindtrack-card flex items-center gap-3 text-mindtrack-stone/70"
      >
        <p>No techniques match your current filters.</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {techniques.map((technique) => {
        const isExpanded = expandedId === technique.id;
        const isFavorite = favorites.includes(technique.id);
        const timesCompleted = completedExercises[technique.id] || 0;
        const todayCount = getTodayCompletionCount(technique.id);

        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={technique.id}
            className="mindtrack-card"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-mindtrack-stone mb-1">
                  {technique.title}
                </h3>
                <p className="text-mindtrack-stone/70 mb-3">{technique.description}</p>
                
                {!isExpanded && (
                  <button
                    type="button"
                    onClick={() => setExpandedId(technique.id)}
                    className="w-full py-2 text-center text-sm font-medium text-mindtrack-sage hover:bg-mindtrack-sage/5 rounded-md transition-colors border border-mindtrack-sage/20 hover:border-mindtrack-sage/40"
                  >
                    Show more
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(technique.id);
                  }}
                  className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
                  aria-label={isFavorite ? `Remove ${technique.title} from favorites` : `Add ${technique.title} to favorites`}
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFavorite
                        ? "fill-mindtrack-sage text-mindtrack-sage"
                        : "text-mindtrack-sage"
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : technique.id)}
                  className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
                  aria-label={isExpanded ? `Collapse ${technique.title} details` : `Expand ${technique.title} details`}
                  title={isExpanded ? 'Collapse' : 'Expand'}
                >
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-mindtrack-sage" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-mindtrack-sage" />
                  )}
                </button>
              </div>
            </div>

            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-mindtrack-sage/10"
              >
                <div className="flex flex-col space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-mindtrack-stone mb-2">
                      Steps:
                    </h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {technique.steps.map((step, index) => (
                        <li key={index} className="text-mindtrack-stone/80 text-sm">
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-mindtrack-stone mb-2">
                      Benefits:
                    </h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {technique.benefits.map((benefit, index) => (
                        <li key={index} className="text-mindtrack-stone/80 text-sm">
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap items-center justify-between pt-3 mt-2 border-t border-mindtrack-sage/10">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-mindtrack-stone/70">
                        Category:{" "}
                        <span className="font-medium text-mindtrack-sage">
                          {technique.category.charAt(0).toUpperCase() + technique.category.slice(1)}
                        </span>
                      </span>
                      <span className="text-xs text-mindtrack-stone/70">
                        Completed: {timesCompleted} time{timesCompleted !== 1 ? "s" : ""}
                        {todayCount > 0 && ` (${todayCount} today)`}
                      </span>
                    </div>

                    <button
                      onClick={() => startExercise(technique.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-mindtrack-sage text-white rounded-md text-xs font-medium hover:bg-mindtrack-sage/90 transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Start Exercise
                    </button>
                  </div>
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
