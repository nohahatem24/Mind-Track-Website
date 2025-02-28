
import { motion } from "framer-motion";
import { AlertCircle, BookmarkPlus, Brain, Check, ChevronDown, Heart, MessageSquare, MoreHorizontal, X } from "lucide-react";
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

interface CBTHistoryEntry {
  id: string;
  techniqueId: string;
  date: string;
  notes?: string;
}

interface CBTTechniquesProps {
  showOnlyFavorites?: boolean;
}

const FAVORITES_STORAGE_KEY = 'mindtrack_cbt_favorites';
const COMPLETED_STORAGE_KEY = 'mindtrack_cbt_completed';
const HISTORY_STORAGE_KEY = 'mindtrack_cbt_history';

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
  const [exerciseHistory, setExerciseHistory] = useState<CBTHistoryEntry[]>([]);
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    const savedCompleted = localStorage.getItem(COMPLETED_STORAGE_KEY);
    const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);

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
      
      // Add to history
      const now = new Date();
      const historyEntry: CBTHistoryEntry = {
        id: Date.now().toString(),
        techniqueId: id,
        date: now.toLocaleString(),
        notes: "Completed exercise"
      };
      
      setExerciseHistory([historyEntry, ...exerciseHistory]);
    }
  };

  const unmarkAsCompleted = (id: string) => {
    setCompletedExercises(completedExercises.filter(exerciseId => exerciseId !== id));
  };

  const startExercise = (id: string) => {
    setActiveExercise(id);
  };

  const completeExercise = (id: string) => {
    markAsCompleted(id);
    setActiveExercise(null);
  };

  const cancelExercise = () => {
    setActiveExercise(null);
  };

  const filteredTechniques = techniques
    .filter(technique => showOnlyFavorites ? favorites.includes(technique.id) : true)
    .filter(technique => selectedCategory === "all" ? true : technique.category === selectedCategory);

  const renderExerciseContent = (techniqueId: string) => {
    switch (techniqueId) {
      case "cog-restructuring":
        return (
          <CognitiveRestructuringExercise 
            onComplete={() => completeExercise(techniqueId)}
            onCancel={cancelExercise}
          />
        );
      case "thought-record":
        return (
          <ThoughtRecord 
            onComplete={() => completeExercise(techniqueId)}
            onCancel={cancelExercise}
          />
        );
      case "behav-activation":
        return (
          <BehavioralActivation 
            onComplete={() => completeExercise(techniqueId)}
            onCancel={cancelExercise}
          />
        );
      case "grounding":
        return (
          <GroundingExercise 
            onComplete={() => completeExercise(techniqueId)}
            onCancel={cancelExercise}
          />
        );
      case "deep-breathing":
        return (
          <BreathingExercise
            onComplete={() => completeExercise(techniqueId)}
            onCancel={cancelExercise}
          />
        );
      case "progressive-relaxation":
        return (
          <ProgressiveMuscleRelaxationExercise
            onComplete={() => completeExercise(techniqueId)}
            onCancel={cancelExercise}
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

        {/* Exercise History */}
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mindtrack-card mb-8"
          >
            <h3 className="text-xl font-semibold text-mindtrack-stone mb-4">Exercise History</h3>
            
            {exerciseHistory.length > 0 ? (
              <div className="space-y-4">
                {exerciseHistory.map(entry => {
                  const technique = techniques.find(t => t.id === entry.techniqueId);
                  
                  return (
                    <div key={entry.id} className="p-3 border-b border-mindtrack-sage/10">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-mindtrack-stone">{technique?.title || "Unknown Exercise"}</h4>
                          <p className="text-sm text-mindtrack-stone/60">{entry.date}</p>
                        </div>
                        <span className="px-2 py-1 bg-mindtrack-sage/10 text-mindtrack-sage rounded-full text-xs">
                          {technique?.category || "unknown"}
                        </span>
                      </div>
                      {entry.notes && (
                        <p className="mt-2 text-sm text-mindtrack-stone/80">{entry.notes}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-mindtrack-stone/70">
                No exercise history yet. Complete exercises to build your history.
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
              {techniques.find(t => t.id === activeExercise)?.title}
            </h3>
            {renderExerciseContent(activeExercise)}
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

          {!activeExercise && filteredTechniques.map((technique, index) => (
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
                  <h3 className="text-lg font-semibold text-mindtrack-stone">{technique.title}</h3>
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
          ))}
        </div>
      </div>
    </section>
  );
};

// A simple implementation for Progressive Muscle Relaxation
const ProgressiveMuscleRelaxationExercise = ({ 
  onComplete,
  onCancel
}: { 
  onComplete: () => void;
  onCancel: () => void;
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
  const [stepStatus, setStepStatus] = useState<Record<number, boolean>>({});
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [relaxing, setRelaxing] = useState(false);
  
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
    setStepStatus({ ...stepStatus, [currentStep]: true });
    setTimerActive(false);
    
    // Move to next step if not at the end
    if (currentStep < muscleGroups.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const resetExercise = () => {
    setCurrentStep(0);
    setStepStatus({});
    setTimerActive(false);
    setTimerSeconds(0);
    setRelaxing(false);
  };
  
  const isExerciseComplete = Object.keys(stepStatus).length === muscleGroups.length;
  
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
                    : stepStatus[index]
                      ? "border-green-300 bg-green-50"
                      : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {stepStatus[index] && (
                      <Check className="w-4 h-4 text-green-500" />
                    )}
                    <span className={stepStatus[index] ? "line-through text-gray-500" : ""}>
                      {group}
                    </span>
                  </div>
                  
                  {currentStep === index && !stepStatus[index] && (
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
                    onClick={onComplete}
                    className="px-4 py-2 bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors"
                  >
                    Complete Exercise
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
