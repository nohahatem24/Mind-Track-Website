import { motion } from "framer-motion";
import { AlertCircle, BookmarkPlus, Brain, Check, ChevronDown, Edit, Heart, MessageSquare, MoreHorizontal, Trash2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { CognitiveRestructuringExercise, GroundingExercise, BreathingExercise } from "./CBTExercise";
import ThoughtRecord from "./ThoughtRecord";
import BehavioralActivation from "./BehavioralActivation";

interface Technique {
  id: string;
  title: string;
  description: string;
  steps: string[];
  category: "cognitive" | "behavioral" | "mindfulness";
  isFavorite?: boolean;
}

// Enhanced interfaces to store detailed exercise data
interface ExerciseData {
  id: string;
  techniqueId: string;
  date: string;
  notes?: string;
  data: Record<string, any>; // To store all user inputs
}

interface CBTTechniquesProps {
  showOnlyFavorites?: boolean;
}

const FAVORITES_STORAGE_KEY = 'mindtrack_cbt_favorites';
const COMPLETED_STORAGE_KEY = 'mindtrack_cbt_completed';
const HISTORY_STORAGE_KEY = 'mindtrack_cbt_history';
const DAILY_COUNTS_STORAGE_KEY = 'mindtrack_cbt_daily_counts';

const CBTTechniques = ({ showOnlyFavorites = false }: CBTTechniquesProps) => {
  const [techniques] = useState<Technique[]>([
    {
      id: "cog-restructuring",
      title: "Cognitive Restructuring",
      description: "Challenge and change negative thought patterns that contribute to emotional distress.",
      category: "cognitive",
      steps: [
        "Identify the negative thought or belief",
        "Recognize the cognitive distortion (e.g., all-or-nothing thinking, catastrophizing)",
        "Challenge the thought with evidence",
        "Replace with a more balanced, realistic thought"
      ],
      isFavorite: false
    },
    {
      id: "behav-activation",
      title: "Behavioral Activation",
      description: "Increase engagement in positive activities to improve mood and break negative cycles.",
      category: "behavioral",
      steps: [
        "Identify activities that bring you joy or a sense of accomplishment",
        "Schedule these activities into your weekly routine",
        "Start with small, manageable tasks",
        "Track your mood before and after the activity"
      ],
      isFavorite: false
    },
    {
      id: "thought-record",
      title: "Thought Record",
      description: "Document and analyze negative thoughts to develop a more balanced perspective.",
      category: "cognitive",
      steps: [
        "Write down the situation that triggered negative feelings",
        "Note your automatic thoughts and emotional response",
        "Identify evidence that supports and contradicts these thoughts",
        "Develop a balanced alternative perspective",
        "Rate how you feel after considering the balanced view"
      ],
      isFavorite: false
    },
    {
      id: "grounding",
      title: "5-4-3-2-1 Grounding Technique",
      description: "A mindfulness exercise to manage anxiety by engaging your five senses.",
      category: "mindfulness",
      steps: [
        "Acknowledge 5 things you can see",
        "Acknowledge 4 things you can touch/feel",
        "Acknowledge 3 things you can hear",
        "Acknowledge 2 things you can smell",
        "Acknowledge 1 thing you can taste"
      ],
      isFavorite: false
    },
    {
      id: "deep-breathing",
      title: "Deep Breathing Exercise",
      description: "A simple technique to reduce stress and anxiety through controlled breathing.",
      category: "mindfulness",
      steps: [
        "Find a comfortable position",
        "Breathe in slowly through your nose for 4 counts",
        "Hold your breath for 1-2 counts",
        "Exhale slowly through your mouth for 6 counts",
        "Repeat 5-10 times or until you feel calmer"
      ],
      isFavorite: false
    },
    {
      id: "progressive-relaxation",
      title: "Progressive Muscle Relaxation",
      description: "Reduce physical tension by systematically tensing and relaxing muscle groups.",
      category: "behavioral",
      steps: [
        "Start in a comfortable position",
        "Tense a muscle group (e.g., fists) for 5-10 seconds",
        "Release the tension and notice the feeling of relaxation",
        "Wait 10-20 seconds before moving to the next muscle group",
        "Progress through major muscle groups from feet to head"
      ],
      isFavorite: false
    }
  ]);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [exerciseHistory, setExerciseHistory] = useState<ExerciseData[]>([]);
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historyDetails, setHistoryDetails] = useState<string | null>(null);
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

  // Updated function to track daily completions
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

    setHistoryDetails(null);
  };

  const editHistoryEntry = (entryId: string) => {
    const entry = exerciseHistory.find(entry => entry.id === entryId);
    if (!entry) return;

    setEditingHistoryEntry(entryId);
    setActiveExercise(entry.techniqueId);
    setHistoryDetails(null);
  };

  const viewHistoryDetails = (entryId: string) => {
    setHistoryDetails(historyDetails === entryId ? null : entryId);
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

  // Helper function to render exercise data for history view
  const renderExerciseData = (entry: ExerciseData) => {
    const technique = techniques.find(t => t.id === entry.techniqueId);
    if (!technique) return null;

    switch (entry.techniqueId) {
      case "cog-restructuring":
        return (
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Negative thought:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.negativeThought || "Not provided"}</p>
            </div>
            
            {entry.data.selectedDistortions?.length > 0 && (
              <div>
                <span className="font-medium">Cognitive distortions:</span>
                <ul className="ml-2 list-disc pl-5">
                  {entry.data.selectedDistortions.map((id: string) => (
                    <li key={id} className="text-mindtrack-stone/80">
                      {getDistortionName(id)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {entry.data.evidence?.supporting && (
              <div>
                <span className="font-medium">Supporting evidence:</span>
                <p className="ml-2 text-mindtrack-stone/80">{entry.data.evidence.supporting}</p>
              </div>
            )}
            
            {entry.data.evidence?.contradicting && (
              <div>
                <span className="font-medium">Contradicting evidence:</span>
                <p className="ml-2 text-mindtrack-stone/80">{entry.data.evidence.contradicting}</p>
              </div>
            )}
            
            {entry.data.balancedThought && (
              <div>
                <span className="font-medium">Balanced thought:</span>
                <p className="ml-2 text-mindtrack-stone/80">{entry.data.balancedThought}</p>
              </div>
            )}
          </div>
        );
        
      case "thought-record":
        return (
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Situation:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.situation || "Not provided"}</p>
            </div>
            
            {entry.data.automaticThoughts && (
              <div>
                <span className="font-medium">Automatic thoughts:</span>
                <p className="ml-2 text-mindtrack-stone/80">{entry.data.automaticThoughts}</p>
              </div>
            )}
            
            {entry.data.emotions && (
              <div>
                <span className="font-medium">Emotions:</span>
                <p className="ml-2 text-mindtrack-stone/80">{entry.data.emotions}</p>
              </div>
            )}
            
            {entry.data.balancedPerspective && (
              <div>
                <span className="font-medium">Balanced perspective:</span>
                <p className="ml-2 text-mindtrack-stone/80">{entry.data.balancedPerspective}</p>
              </div>
            )}
            
            <div className="flex gap-4">
              <div>
                <span className="font-medium">Before rating:</span>
                <span className="ml-2 text-mindtrack-stone/80">{entry.data.beforeRating}/10</span>
              </div>
              <div>
                <span className="font-medium">After rating:</span>
                <span className="ml-2 text-mindtrack-stone/80">{entry.data.afterRating}/10</span>
              </div>
            </div>
          </div>
        );
        
      case "grounding":
        return (
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">5 things seen:</span>
              <ul className="ml-2 list-disc pl-5">
                {entry.data.see?.map((item: string, index: number) => (
                  <li key={index} className="text-mindtrack-stone/80">{item}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <span className="font-medium">4 things felt:</span>
              <ul className="ml-2 list-disc pl-5">
                {entry.data.touch?.map((item: string, index: number) => (
                  <li key={index} className="text-mindtrack-stone/80">{item}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <span className="font-medium">3 things heard:</span>
              <ul className="ml-2 list-disc pl-5">
                {entry.data.hear?.map((item: string, index: number) => (
                  <li key={index} className="text-mindtrack-stone/80">{item}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <span className="font-medium">2 things smelled:</span>
              <ul className="ml-2 list-disc pl-5">
                {entry.data.smell?.map((item: string, index: number) => (
                  <li key={index} className="text-mindtrack-stone/80">{item}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <span className="font-medium">1 thing tasted:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.taste?.[0] || "Not provided"}</p>
            </div>
          </div>
        );
        
      case "progressive-relaxation":
        return (
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Completed muscle groups:</span>
              <ul className="ml-2 list-disc pl-5">
                {Object.entries(entry.data.completedGroups || {}).map(([group, completed]) => 
                  completed ? <li key={group} className="text-mindtrack-stone/80">{group}</li> : null
                )}
              </ul>
            </div>
            {entry.data.totalTime && (
              <div>
                <span className="font-medium">Total time:</span>
                <p className="ml-2 text-mindtrack-stone/80">{formatTime(entry.data.totalTime)}</p>
              </div>
            )}
          </div>
        );
        
      case "deep-breathing":
        return (
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Completed cycles:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.cycles || 0}</p>
            </div>
            {entry.data.totalTime && (
              <div>
                <span className="font-medium">Total time:</span>
                <p className="ml-2 text-mindtrack-stone/80">{formatTime(entry.data.totalTime)}</p>
              </div>
            )}
          </div>
        );
        
      default:
        return (
          <div className="text-sm text-mindtrack-stone/80">
            Exercise completed. No detailed data available.
          </div>
        );
    }
  };

  // Helper to get cognitive distortion name from id
  const getDistortionName = (id: string) => {
    const distortions: Record<string, string> = {
      "all-or-nothing": "All-or-Nothing Thinking",
      "overgeneralization": "Overgeneralization",
      "mental-filter": "Mental Filter",
      "disqualifying-positive": "Disqualifying the Positive",
      "jumping-conclusions": "Jumping to Conclusions",
      "catastrophizing": "Catastrophizing",
      "emotional-reasoning": "Emotional Reasoning",
      "should-statements": "Should Statements",
      "labeling": "Labeling",
      "personalization": "Personalization"
    };
    
    return distortions[id] || id;
  };

  // Format seconds into minutes and seconds
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
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
            <div className="flex flex-wrap gap-2">
              <CategoryButton 
                active={selectedCategory === "all"}
                onClick={() => setSelectedCategory("all")}
              >
                All Techniques
              </CategoryButton>
              <CategoryButton 
                active={selectedCategory === "cognitive"}
                onClick={() => setSelectedCategory("cognitive")}
              >
                Cognitive
              </CategoryButton>
              <CategoryButton 
                active={selectedCategory === "behavioral"}
                onClick={() => setSelectedCategory("behavioral")}
              >
                Behavioral
              </CategoryButton>
              <CategoryButton 
                active={selectedCategory === "mindfulness"}
                onClick={() => setSelectedCategory("mindfulness")}
              >
                Mindfulness
              </CategoryButton>
            </div>
            
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
            
            {filteredHistory.length > 0 ? (
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {filteredHistory.map(entry => {
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
                          {renderExerciseData(entry)}
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

        <div className="space-y-4">
          {!activeExercise && filteredTechniques.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mindtrack-card flex items-center gap-3 text-mindtrack-stone/70"
            >
              <AlertCircle className="w-5 h-5" />
              <p>No techniques match your current filter.</p>
            </motion.div>
          )}

          {!activeExercise && filteredTechniques.map((technique, index) => {
            const todayCount = getTodayCompletionCount(technique.id);
            
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
                    >
                      <Heart 
                        className={`w-4 h-4 ${favorites.includes(technique.id) ? 'fill-mindtrack-sage text-mindtrack-sage' : 'text-mindtrack-sage'}`} 
                      />
                    </button>
                    <button
                      onClick={() => setExpandedId(expandedId === technique.id ? null : technique.id)}
                      className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
                    >
                      <ChevronDown 
                        className={`w-4 h-4 text-mindtrack-sage transform transition-transform ${expandedId === technique.id ? 'rotate-180' : ''}`} 
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
                
                {expandedId === technique.id && (
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
      </div>
    </section>
  );
};

// A updated progressive muscle relaxation exercise that tracks and saves data
const ProgressiveMuscleRelaxationExercise = ({ 
  onComplete,
  onCancel,
  initialData,
  isEditing = false
}: { 
  onComplete: (data: Record<string, any>) => void;
  onCancel: () => void;
  initialData?: Record<string, any>;
  isEditing?: boolean;
}) => {
  const muscleGroups = [
    "Feet and toes",
    "Calves",
    "Thighs",
    "Buttocks",
    "Abdomen",
    "Chest",
    "Back",
    "Arms and hands",
    "Shoulders",
    "Neck",
    "Face"
  ];
  
  const [currentStep, setCurrentStep] = useState(0);
  const [completedGroups, setCompletedGroups] = useState<Record<string, boolean>>(
    initialData?.completedGroups || {}
  );
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [relaxing, setRelaxing] = useState(false);
  const [totalTime, setTotalTime] = useState(initialData?.totalTime || 0);
  const [sessionTimer, setSessionTimer] = useState(0);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          const nextValue = prev + 1;
          
          // Auto-switch to relaxation after 10 seconds of tension
          if (!relaxing && nextValue >= 10) {
            setRelaxing(true);
            return 0;
          }
          
          // Auto-mark group as complete after 15 seconds of relaxation
          if (relaxing && nextValue >= 15) {
            completeCurrentStep();
            return 0;
          }
          
          return nextValue;
        });
        
        // Update both timers
        setSessionTimer(prev => prev + 1);
        setTotalTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, relaxing]);
  
  const startMuscleGroup = () => {
    setTimerActive(true);
    setTimerSeconds(0);
    setRelaxing(false);
  };
  
  const switchToRelaxation = () => {
    setTimerSeconds(0);
    setRelaxing(true);
  };
  
  const completeCurrentStep = () => {
    // Mark the current muscle group as completed
    const updatedGroups = { ...completedGroups };
    updatedGroups[muscleGroups[currentStep]] = true;
    setCompletedGroups(updatedGroups);
    
    setTimerActive(false);
    
    // Move to next step if not at the end
    if (currentStep < muscleGroups.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const resetExercise = () => {
    setCurrentStep(0);
    setCompletedGroups({});
    setTimerActive(false);
    setTimerSeconds(0);
    setRelaxing(false);
    setSessionTimer(0);
  };
  
  const handleComplete = () => {
    onComplete({
      completedGroups,
      totalTime,
      sessionTime: sessionTimer,
      date: new Date().toISOString()
    });
  };
  
  const isExerciseComplete = Object.keys(completedGroups).length === muscleGroups.length;
  
  // Format seconds into minutes and seconds
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-mindtrack-stone mb-2">
          Progressive Muscle Relaxation
        </h3>
        <p className="text-mindtrack-stone/80">
          Systematically tense and relax each muscle group to reduce physical tension and promote relaxation.
        </p>
        <div className="mt-2 text-sm text-mindtrack-sage">
          Session time: {formatTime(sessionTimer)}
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h4 className="font-medium text-mindtrack-stone">Muscle Groups</h4>
          <div className="space-y-2 max-h-[400px] overflow-y-auto p-1">
            {muscleGroups.map((group, index) => (
              <div 
                key={index}
                className={`p-3 border rounded-md ${
                  currentStep === index 
                    ? "border-mindtrack-sage bg-mindtrack-sage/5" 
                    : completedGroups[group]
                      ? "border-green-300 bg-green-50"
                      : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {completedGroups[group] && (
                      <Check className="w-4 h-4 text-green-500" />
                    )}
                    <span className={completedGroups[group] ? "line-through text-gray-500" : ""}>
                      {group}
                    </span>
                  </div>
                  
                  {currentStep === index && !completedGroups[group] && (
                    <span className="text-xs px-2 py-1 bg-mindtrack-sage/10 text-mindtrack-sage rounded-full">
                      Current
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="p-6 border border-mindtrack-sage/20 rounded-lg bg-mindtrack-sage/5">
            <h4 className="font-medium text-mindtrack-stone mb-4">
              {currentStep < muscleGroups.length ? `Current: ${muscleGroups[currentStep]}` : "Exercise Complete!"}
            </h4>
            
            {!isExerciseComplete && (
              <>
                {!timerActive ? (
                  <button
                    onClick={startMuscleGroup}
                    className="w-full py-3 mb-4 bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors"
                  >
                    Start Tensing This Muscle Group
                  </button>
                ) : (
                  <div className="mb-4 space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{timerSeconds}s</div>
                      <p className="text-sm text-mindtrack-stone/70">
                        {relaxing 
                          ? "Feel the relaxation... breathe deeply..." 
                          : "Tense the muscles... hold..."}
                      </p>
                    </div>
                    
                    {!relaxing && (
                      <button
                        onClick={switchToRelaxation}
                        className="w-full py-2 border border-mindtrack-sage text-mindtrack-sage rounded-md hover:bg-mindtrack-sage/5 transition-colors"
                      >
                        Release & Relax Now
                      </button>
                    )}
                    
                    {relaxing && (
                      <button
                        onClick={completeCurrentStep}
                        className="w-full py-2 bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors"
                      >
                        Complete & Move to Next
                      </button>
                    )}
                  </div>
                )}
                
                <div className="space-y-2">
                  <h5 className="font-medium text-sm text-mindtrack-stone">Instructions:</h5>
                  <ol className="list-decimal text-sm pl-5 space-y-1 text-mindtrack-stone/80">
                    <li>Get into a comfortable position</li>
                    <li>Focus on the current muscle group</li>
                    <li>Tense the muscles for 5-10 seconds</li>
                    <li>Release and notice the feeling of relaxation</li>
                    <li>Rest for 15-20 seconds before moving to the next group</li>
                  </ol>
                </div>
              </>
            )}
            
            {isExerciseComplete && (
              <div className="text-center space-y-4">
                <p className="text-mindtrack-stone/80">
                  Great job! You've completed the full progressive muscle relaxation exercise.
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={resetExercise}
                    className="px-4 py-2 border border-mindtrack-sage text-mindtrack-sage rounded-md hover:bg-mindtrack-sage/5 transition-colors"
                  >
                    Start Over
                  </button>
                  <button
                    onClick={handleComplete}
                    className="px-4 py-2 bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors"
                  >
                    {isEditing ? "Save Changes" : "Complete Exercise"}
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={onCancel}
              className="text-mindtrack-stone/70 hover:text-mindtrack-stone underline"
            >
              Cancel Exercise
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CategoryButton = ({ 
  children, 
  active, 
  onClick 
}: { 
  children: React.ReactNode; 
  active: boolean; 
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
      active 
        ? "bg-mindtrack-sage text-white" 
        : "bg-white text-mindtrack-stone hover:bg-mindtrack-sage/5"
    }`}
  >
    {children}
  </button>
);

export default CBTTechniques;
