
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import TechniquesList from "./TechniquesList";
import ExerciseHistory from "./ExerciseHistory";
import CategoryFilter from "./CategoryFilter";
import { CognitiveRestructuringExercise, GroundingExercise, BreathingExercise } from "../CBTExercise";
import ThoughtRecord from "../ThoughtRecord";
import BehavioralActivation from "../BehavioralActivation";
import ProgressiveMuscleRelaxationExercise from "./ProgressiveMuscleRelaxation";
import { techniquesData } from "./techniqueData";
import { CBTTechniquesProps, ExerciseData, FAVORITES_STORAGE_KEY, COMPLETED_STORAGE_KEY, HISTORY_STORAGE_KEY, DAILY_COUNTS_STORAGE_KEY } from "./types";

const CBTTechniques = ({ showOnlyFavorites = false }: CBTTechniquesProps) => {
  const [techniques] = useState(techniquesData);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [exerciseHistory, setExerciseHistory] = useState<ExerciseData[]>([]);
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [editingHistoryEntry, setEditingHistoryEntry] = useState<string | null>(null);
  const [dailyCompletionCounts, setDailyCompletionCounts] = useState<Record<string, Record<string, number>>>({});
  const [searchQuery, setSearchQuery] = useState("");

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    const savedCompleted = localStorage.getItem(COMPLETED_STORAGE_KEY);
    const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
    const savedDailyCounts = localStorage.getItem(DAILY_COUNTS_STORAGE_KEY);

    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error("Error parsing saved favorites:", e);
      }
    }

    if (savedCompleted) {
      try {
        setCompletedExercises(JSON.parse(savedCompleted));
      } catch (e) {
        console.error("Error parsing saved completed exercises:", e);
      }
    }

    if (savedHistory) {
      try {
        setExerciseHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Error parsing saved exercise history:", e);
      }
    }

    if (savedDailyCounts) {
      try {
        setDailyCompletionCounts(JSON.parse(savedDailyCounts));
      } catch (e) {
        console.error("Error parsing saved daily counts:", e);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(COMPLETED_STORAGE_KEY, JSON.stringify(completedExercises));
  }, [completedExercises]);

  useEffect(() => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(exerciseHistory));
  }, [exerciseHistory]);

  useEffect(() => {
    localStorage.setItem(DAILY_COUNTS_STORAGE_KEY, JSON.stringify(dailyCompletionCounts));
  }, [dailyCompletionCounts]);

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const markAsCompleted = (id: string) => {
    if (!completedExercises.includes(id)) {
      setCompletedExercises([...completedExercises, id]);
    }
  };

  const unmarkAsCompleted = (id: string) => {
    setCompletedExercises(completedExercises.filter(exerciseId => exerciseId !== id));
  };

  const startExercise = (id: string) => {
    setActiveExercise(id);
    setEditingHistoryEntry(null);
  };

  // Function to get today's date in YYYY-MM-DD format for counting
  const getTodayDateKey = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  // Function to track daily completions
  const updateDailyCompletionCount = (techniqueId: string) => {
    const today = getTodayDateKey();
    const currentCounts = { ...dailyCompletionCounts };
    
    if (!currentCounts[today]) {
      currentCounts[today] = {};
    }
    
    currentCounts[today][techniqueId] = (currentCounts[today][techniqueId] || 0) + 1;
    setDailyCompletionCounts(currentCounts);
  };

  // Get completion count for a technique today
  const getTodayCompletionCount = (techniqueId: string) => {
    const today = getTodayDateKey();
    return dailyCompletionCounts[today]?.[techniqueId] || 0;
  };

  const completeExercise = (id: string, exerciseData: Record<string, any>) => {
    markAsCompleted(id);
    updateDailyCompletionCount(id);
    
    // Add to history with detailed data
    const now = new Date();
    const historyEntry: ExerciseData = {
      id: Date.now().toString(),
      techniqueId: id,
      date: now.toLocaleString(),
      notes: "Completed exercise",
      data: exerciseData
    };
    
    setExerciseHistory([historyEntry, ...exerciseHistory]);
    setActiveExercise(null);
  };

  const updateExercise = (entryId: string, exerciseData: Record<string, any>) => {
    const updatedHistory = exerciseHistory.map(entry => 
      entry.id === entryId 
        ? { ...entry, data: exerciseData, notes: "Updated exercise" }
        : entry
    );
    
    setExerciseHistory(updatedHistory);
    setEditingHistoryEntry(null);
    setActiveExercise(null);
  };

  const cancelExercise = () => {
    setActiveExercise(null);
    setEditingHistoryEntry(null);
  };

  const deleteHistoryEntry = (entryId: string) => {
    const entryToDelete = exerciseHistory.find(entry => entry.id === entryId);
    if (!entryToDelete) return;

    // Remove the entry from history
    const updatedHistory = exerciseHistory.filter(entry => entry.id !== entryId);
    setExerciseHistory(updatedHistory);

    // Check if this technique has any other entries
    const hasTechniqueEntries = updatedHistory.some(entry => entry.techniqueId === entryToDelete.techniqueId);
    
    // If no entries left for this technique, mark it as incomplete
    if (!hasTechniqueEntries) {
      unmarkAsCompleted(entryToDelete.techniqueId);
    }
  };

  const editHistoryEntry = (entryId: string) => {
    const entry = exerciseHistory.find(entry => entry.id === entryId);
    if (!entry) return;

    setEditingHistoryEntry(entryId);
    setActiveExercise(entry.techniqueId);
  };

  const filteredTechniques = techniques
    .filter(technique => showOnlyFavorites ? favorites.includes(technique.id) : true)
    .filter(technique => selectedCategory === "all" ? true : technique.category === selectedCategory);

  const filteredHistory = exerciseHistory
    .filter(entry => {
      if (searchQuery.trim() === "") return true;
      
      const technique = techniques.find(t => t.id === entry.techniqueId);
      const lowerQuery = searchQuery.toLowerCase();
      
      return technique?.title.toLowerCase().includes(lowerQuery) || 
             entry.date.toLowerCase().includes(lowerQuery) ||
             Object.values(entry.data || {}).some(
               value => typeof value === 'string' && value.toLowerCase().includes(lowerQuery)
             );
    });

  const renderExerciseContent = (techniqueId: string, editData?: Record<string, any>) => {
    switch (techniqueId) {
      case "cog-restructuring":
        return (
          <CognitiveRestructuringExercise 
            onComplete={(data) => editingHistoryEntry 
              ? updateExercise(editingHistoryEntry, data) 
              : completeExercise(techniqueId, data)}
            onCancel={cancelExercise}
            initialData={editData}
            isEditing={!!editingHistoryEntry}
          />
        );
      case "thought-record":
        return (
          <ThoughtRecord 
            onComplete={(data) => editingHistoryEntry 
              ? updateExercise(editingHistoryEntry, data) 
              : completeExercise(techniqueId, data)}
            onCancel={cancelExercise}
            initialData={editData}
            isEditing={!!editingHistoryEntry}
          />
        );
      case "behav-activation":
        return (
          <BehavioralActivation 
            onComplete={(data) => editingHistoryEntry 
              ? updateExercise(editingHistoryEntry, data) 
              : completeExercise(techniqueId, data)}
            onCancel={cancelExercise}
            initialData={editData}
            isEditing={!!editingHistoryEntry}
          />
        );
      case "grounding":
        return (
          <GroundingExercise 
            onComplete={(data) => editingHistoryEntry 
              ? updateExercise(editingHistoryEntry, data) 
              : completeExercise(techniqueId, data)}
            onCancel={cancelExercise}
            initialData={editData}
            isEditing={!!editingHistoryEntry}
          />
        );
      case "deep-breathing":
        return (
          <BreathingExercise
            onComplete={(data) => editingHistoryEntry 
              ? updateExercise(editingHistoryEntry, data) 
              : completeExercise(techniqueId, data)}
            onCancel={cancelExercise}
            initialData={editData}
            isEditing={!!editingHistoryEntry}
          />
        );
      case "progressive-relaxation":
        return (
          <ProgressiveMuscleRelaxationExercise
            onComplete={(data) => editingHistoryEntry 
              ? updateExercise(editingHistoryEntry, data) 
              : completeExercise(techniqueId, data)}
            onCancel={cancelExercise}
            initialData={editData}
            isEditing={!!editingHistoryEntry}
          />
        );
      default:
        return (
          <div className="text-center py-8">
            <p className="text-mindtrack-stone/70">
              This interactive exercise is coming soon!
            </p>
            <button 
              onClick={cancelExercise}
              className="mt-4 px-4 py-2 text-mindtrack-stone hover:bg-mindtrack-sage/5 rounded-md transition-colors"
            >
              Go Back
            </button>
          </div>
        );
    }
  };

  return (
    <section id="cbt" className="py-16 bg-mindtrack-cream/30">
      <div className="mindtrack-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="section-title">CBT Techniques & Exercises</h2>
          <p className="text-mindtrack-stone/80 max-w-2xl mb-6">
            Evidence-based cognitive behavioral therapy exercises to help manage emotions, change unhelpful thinking patterns, and develop healthier behaviors.
          </p>
          
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <CategoryFilter 
              selectedCategory={selectedCategory} 
              setSelectedCategory={setSelectedCategory} 
            />
            
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-4 py-2 border border-mindtrack-sage text-mindtrack-sage rounded-md hover:bg-mindtrack-sage/5"
            >
              {showHistory ? "Hide History" : "View History"}
            </button>
          </div>
        </motion.div>

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
            {renderExerciseContent(
              activeExercise, 
              editingHistoryEntry 
                ? exerciseHistory.find(e => e.id === editingHistoryEntry)?.data 
                : undefined
            )}
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
