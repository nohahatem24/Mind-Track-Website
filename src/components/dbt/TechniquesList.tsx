
import React from "react";
import { motion } from "framer-motion";
import { Technique } from "./types";
import { ChevronDown, ChevronUp, Heart, BookOpen, CheckCircle, XCircle } from "lucide-react";

interface TechniquesListProps {
  techniques: Technique[];
  expandedId: string | null;
  favorites: string[];
  completedExercises: Record<string, number>;
  toggleFavorite: (id: string) => void;
  setExpandedId: (id: string | null) => void;
  markAsCompleted: (id: string) => void;
  unmarkAsCompleted: (id: string) => void;
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
  markAsCompleted,
  unmarkAsCompleted,
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
            <div
              className="flex justify-between items-start cursor-pointer"
              onClick={() => setExpandedId(isExpanded ? null : technique.id)}
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-mindtrack-stone mb-1">
                  {technique.title}
                </h3>
                <p className="text-mindtrack-stone/70">{technique.description}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(technique.id);
                  }}
                  className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFavorite
                        ? "fill-mindtrack-sage text-mindtrack-sage"
                        : "text-mindtrack-sage"
                    }`}
                  />
                </button>
                <div className="flex items-center justify-center w-6 h-6">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-mindtrack-sage" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-mindtrack-sage" />
                  )}
                </div>
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

                    <div className="flex gap-2 mt-2 sm:mt-0">
                      {!technique.interactive ? (
                        <>
                          <button
                            onClick={() => markAsCompleted(technique.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-mindtrack-sage/10 hover:bg-mindtrack-sage/20 text-mindtrack-sage rounded-md text-xs font-medium transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Mark Done
                          </button>
                          <button
                            onClick={() => unmarkAsCompleted(technique.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-md text-xs font-medium transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Undo
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => startExercise(technique.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-mindtrack-sage text-white rounded-md text-xs font-medium hover:bg-mindtrack-sage/90 transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          Start Exercise
                        </button>
                      )}
                    </div>
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
