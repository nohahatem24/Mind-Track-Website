
import { motion } from "framer-motion";
import ExerciseHistory from "./ExerciseHistory";
import TechniquesList from "./TechniquesList";
import CBTTechniqueHeader from "./CBTTechniqueHeader";
import ExerciseRenderer from "./ExerciseRenderer";
import useCBTTechniques from "./hooks/useCBTTechniques";
import { CBTTechniquesProps } from "./types";

const CBTTechniques = ({ showOnlyFavorites = false }: CBTTechniquesProps) => {
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
  } = useCBTTechniques(showOnlyFavorites);

  return (
    <section id="cbt" className="py-16 bg-mindtrack-cream/30">
      <div className="mindtrack-container">
        <CBTTechniqueHeader
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          showHistory={showHistory}
          setShowHistory={setShowHistory}
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
          />
        )}

        {activeExercise && (
          <motion.div
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
            techniques={filteredTechniques}
            expandedId={expandedId}
            favorites={favorites}
            completedExercises={completedExercises}
            toggleFavorite={toggleFavorite}
            setExpandedId={setExpandedId}
            markAsCompleted={markAsCompleted}
            unmarkAsCompleted={unmarkAsCompleted}
            startExercise={startExercise}
            getTodayCompletionCount={getTodayCompletionCount}
          />
        )}
      </div>
    </section>
  );
};

export default CBTTechniques;
