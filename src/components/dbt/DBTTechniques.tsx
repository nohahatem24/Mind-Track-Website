
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import DBTTechniqueHeader from "./DBTTechniqueHeader";
import TechniquesList from "./TechniquesList";
import ExerciseRenderer from "./ExerciseRenderer";
import ExerciseHistory from "./ExerciseHistory";
import useDBTTechniques from "./hooks/useDBTTechniques";
import { DBTTechniquesProps } from "./types";

const DBTTechniques = ({ showOnlyFavorites = false }: DBTTechniquesProps) => {
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const exerciseFormRef = useRef<HTMLDivElement>(null);
  const {
    expandedId,
    setExpandedId,
    favorites,
    completedExercises,
    activeExercise,
    showHistory,
    setShowHistory,
    editingHistoryEntry,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredTechniques,
    filteredHistory,
    toggleFavorite,
    markAsCompleted,
    unmarkAsCompleted,
    startExercise,
    completeExercise,
    updateExercise,
    cancelExercise,
    deleteHistoryEntry,
    editHistoryEntry,
    getTodayCompletionCount,
    techniques
  } = useDBTTechniques(showOnlyFavorites);

  // Filter by favorites if toggled
  const displayTechniques = showFavoritesOnly 
    ? filteredTechniques.filter(t => favorites.includes(t.id))
    : filteredTechniques;

  return (
    <section id="dbt" className="py-16 bg-mindtrack-cream/30">
      <div className="mindtrack-container">
        <DBTTechniqueHeader
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          showHistory={showHistory}
          setShowHistory={setShowHistory}
          showFavoritesOnly={showFavoritesOnly}
          setShowFavoritesOnly={setShowFavoritesOnly}
        />

        {/* Exercise History with search */}
        {showHistory && (
          <ExerciseHistory 
            history={filteredHistory}
            techniques={techniques}
            editHistoryEntry={editHistoryEntry}
            deleteHistoryEntry={deleteHistoryEntry}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            exerciseFormRef={exerciseFormRef}
          />
        )}

        {activeExercise && (
          <motion.div
            ref={exerciseFormRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mindtrack-card mb-6"
          >
            <h3 className="text-xl font-semibold text-mindtrack-stone mb-4">
              {editingHistoryEntry ? "Edit " : ""}
              {techniques.find(t => t.id === activeExercise)?.title}
            </h3>
            <ExerciseRenderer
              techniqueId={activeExercise}
              editingHistoryEntry={editingHistoryEntry}
              completeExercise={completeExercise}
              updateExercise={updateExercise}
              cancelExercise={cancelExercise}
              initialData={editingHistoryEntry 
                ? filteredHistory.find(e => e.id === editingHistoryEntry)?.data 
                : undefined}
            />
          </motion.div>
        )}

        {!activeExercise && (
          <TechniquesList
            techniques={displayTechniques}
            expandedId={expandedId}
            favorites={favorites}
            completedExercises={completedExercises}
            toggleFavorite={toggleFavorite}
            setExpandedId={setExpandedId}
            startExercise={startExercise}
            getTodayCompletionCount={getTodayCompletionCount}
          />
        )}
      </div>
    </section>
  );
};

export default DBTTechniques;
