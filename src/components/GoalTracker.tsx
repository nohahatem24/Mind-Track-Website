import { motion } from "framer-motion";
import { AlertCircle, Calendar, CheckSquare, Clock, Heart, Pencil, PlusCircle, Target, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useI18n } from "@/i18n/I18nProvider";

interface Goal {
  id: number;
  title: string;
  description?: string;
  deadline?: string;
  progress: number; // 0-100
  steps: { id: number; text: string; completed: boolean }[];
  createdAt: string;
  category: "mental" | "physical" | "social" | "other";
  isFavorite?: boolean;
}

interface TimeRemaining {
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isExpired: boolean;
}

interface GoalTrackerProps {
  showOnlyFavorites?: boolean;
}

const GoalTracker = ({ showOnlyFavorites = false }: GoalTrackerProps) => {
  const { t, isRTL } = useI18n();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [timeRemainingMap, setTimeRemainingMap] = useState<Record<number, TimeRemaining>>({});

  useEffect(() => {
    // Load goals from localStorage if available
    const savedGoals = localStorage.getItem('mindtrack-goals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  useEffect(() => {
    // Save goals to localStorage whenever they change
    localStorage.setItem('mindtrack-goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    // Set up interval to update countdown timers every second
    const timerId = setInterval(() => {
      const updatedTimeMap: Record<number, TimeRemaining> = {};
      
      goals.forEach(goal => {
        if (goal.deadline) {
          updatedTimeMap[goal.id] = calculateTimeRemaining(goal.deadline);
        }
      });
      
      setTimeRemainingMap(updatedTimeMap);
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(timerId);
  }, [goals]);

  const visibleGoals = showOnlyFavorites
    ? goals.filter(goal => goal.isFavorite)
    : goals;

  const addGoal = (goal: Goal) => {
    setGoals([goal, ...goals]);
    setIsAdding(false);
  };

  const updateGoal = (updatedGoal: Goal) => {
    setGoals(goals.map(g => g.id === updatedGoal.id ? updatedGoal : g));
    setEditingId(null);
  };

  const updateProgress = (goalId: number) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const completedSteps = goal.steps.filter(step => step.completed).length;
        const totalSteps = goal.steps.length;
        const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
        return { ...goal, progress };
      }
      return goal;
    }));
  };

  const toggleStep = (goalId: number, stepId: number) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const updatedSteps = goal.steps.map(step => 
          step.id === stepId ? { ...step, completed: !step.completed } : step
        );
        const completedSteps = updatedSteps.filter(step => step.completed).length;
        const progress = Math.round((completedSteps / updatedSteps.length) * 100);
        return { ...goal, steps: updatedSteps, progress };
      }
      return goal;
    }));
  };

  const deleteGoal = (goalId: number) => {
    setGoals(goals.filter(g => g.id !== goalId));
  };

  const calculateTimeRemaining = (deadlineString: string): TimeRemaining => {
    const now = new Date();
    const deadline = new Date(deadlineString);
    const totalSeconds = Math.floor((deadline.getTime() - now.getTime()) / 1000);
    
    if (totalSeconds <= 0) {
      return {
        years: 0, months: 0, weeks: 0, days: 0, 
        hours: 0, minutes: 0, seconds: 0, 
        totalSeconds: 0, isExpired: true
      };
    }
    
    let secondsLeft = totalSeconds;
    
    // Calculate time units
    const years = Math.floor(secondsLeft / (365 * 24 * 60 * 60));
    secondsLeft -= years * 365 * 24 * 60 * 60;
    
    const months = Math.floor(secondsLeft / (30 * 24 * 60 * 60));
    secondsLeft -= months * 30 * 24 * 60 * 60;
    
    const weeks = Math.floor(secondsLeft / (7 * 24 * 60 * 60));
    secondsLeft -= weeks * 7 * 24 * 60 * 60;
    
    const days = Math.floor(secondsLeft / (24 * 60 * 60));
    secondsLeft -= days * 24 * 60 * 60;
    
    const hours = Math.floor(secondsLeft / (60 * 60));
    secondsLeft -= hours * 60 * 60;
    
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft - (minutes * 60);
    
    return {
      years, months, weeks, days, hours, minutes, seconds,
      totalSeconds, isExpired: false
    };
  };

  const getDeadlineColor = (timeRemaining: TimeRemaining | undefined): string => {
    if (!timeRemaining) return "text-mindtrack-stone/60";
    if (timeRemaining.isExpired) return "text-red-500";
    
    const { totalSeconds } = timeRemaining;
    const dayInSeconds = 24 * 60 * 60;
    
    if (totalSeconds < dayInSeconds) return "text-red-500"; // Less than 1 day
    if (totalSeconds < 7 * dayInSeconds) return "text-amber-500"; // Less than 1 week
    return "text-green-500"; // More than 1 week
  };

  const getProgressColor = (progress: number, timeRemaining?: TimeRemaining): string => {
    // Deadline expired or very close with low progress
    if (timeRemaining?.isExpired || 
        (timeRemaining && timeRemaining.totalSeconds < 24 * 60 * 60 && progress < 70)) {
      return "bg-red-500";
    }
    
    // Approaching deadline with medium progress
    if (timeRemaining && 
        timeRemaining.totalSeconds < 7 * 24 * 60 * 60 && 
        progress < 50) {
      return "bg-amber-500";
    }
    
    // Default color for good progress or plenty of time
    return "bg-mindtrack-sage";
  };

  return (
    <section id="goals" className="py-16">
      <div className="mindtrack-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="section-title">Goal Tracker</h2>
          <p className="text-mindtrack-stone/80 max-w-2xl">
            Set meaningful goals aligned with your mental health journey, break them down into achievable steps, and track your progress.
          </p>
        </motion.div>

        <div className="space-y-6">
          {!isAdding && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAdding(true)}
              className="w-full mindtrack-card flex items-center justify-center gap-2 text-mindtrack-sage hover:text-mindtrack-sage/80"
              title="Create New Goal"
              aria-label="Create New Goal"
            >
              <PlusCircle className="w-5 h-5" />
              Create New Goal
            </motion.button>
          )}

          {isAdding && (
            <GoalForm onSubmit={addGoal} onCancel={() => setIsAdding(false)} />
          )}

          {visibleGoals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="mindtrack-card"
            >
              {editingId === goal.id ? (
                <GoalForm 
                  onSubmit={updateGoal} 
                  onCancel={() => setEditingId(null)}
                  initialData={goal}
                />
              ) : (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-full bg-mindtrack-sage/10">
                        <Target className="w-4 h-4 text-mindtrack-sage" />
                      </div>
                      <div>
                        <h3 className="font-medium text-mindtrack-stone">{goal.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-mindtrack-stone/60">
                          <span>{getCategory(goal.category)}</span>
                          <span>•</span>
                          <span>Created {goal.createdAt}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const updatedGoals = goals.map(g => 
                            g.id === goal.id ? { ...g, isFavorite: !g.isFavorite } : g
                          );
                          setGoals(updatedGoals);
                        }}
                        className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
                        title={goal.isFavorite ? "Remove from favorites" : "Add to favorites"}
                        aria-label={goal.isFavorite ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Heart 
                          className={`w-4 h-4 ${goal.isFavorite ? 'fill-mindtrack-sage text-mindtrack-sage' : 'text-mindtrack-sage'}`} 
                        />
                      </button>
                      <button
                        onClick={() => setEditingId(goal.id)}
                        className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
                        title="Edit goal"
                        aria-label="Edit goal"
                      >
                        <Pencil className="w-4 h-4 text-mindtrack-sage" />
                      </button>
                    </div>
                  </div>

                  {goal.description && (
                    <p className="text-mindtrack-stone/80 mb-4">{goal.description}</p>
                  )}

                  {goal.deadline && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 text-sm mb-2">
                        <Clock className={`w-4 h-4 ${getDeadlineColor(timeRemainingMap[goal.id])}`} />
                        <span className="font-medium">
                          {timeRemainingMap[goal.id]?.isExpired ? 'Deadline passed' : 'Time remaining'}:
                        </span>
                        <span className={getDeadlineColor(timeRemainingMap[goal.id])}>
                          {formatTimeRemaining(timeRemainingMap[goal.id])}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-mindtrack-stone">Progress</span>
                      <span className="text-sm font-medium text-mindtrack-stone">{goal.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-mindtrack-sage/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${goal.progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full ${getProgressColor(goal.progress, timeRemainingMap[goal.id])}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-mindtrack-stone mb-2">Steps</h4>
                    {goal.steps.map(step => (
                      <div key={step.id} className="flex items-center gap-2">
                        <button
                          onClick={() => toggleStep(goal.id, step.id)}
                          className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                            step.completed 
                              ? 'bg-mindtrack-sage border-mindtrack-sage text-white' 
                              : 'border-mindtrack-sage/30 text-transparent hover:border-mindtrack-sage'
                          }`}
                          aria-label={step.completed ? `Mark "${step.text}" as incomplete` : `Mark "${step.text}" as complete`}
                        >
                          <CheckSquare className="w-3.5 h-3.5" />
                        </button>
                        <span className={`text-sm ${step.completed ? 'text-mindtrack-stone/40 line-through' : 'text-mindtrack-stone/80'}`}>
                          {step.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-mindtrack-sage/10 flex justify-end">
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors"
                      title="Delete goal"
                      aria-label="Delete goal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Goal
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ))}

          {visibleGoals.length === 0 && !isAdding && (
            <div className="text-center py-12 mindtrack-card border-dashed">
              <Target className="w-12 h-12 text-mindtrack-sage/20 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-mindtrack-stone mb-2">No goals yet</h3>
              <p className="text-mindtrack-stone/60 mb-6">Start your journey by setting your first goal.</p>
              <button
                onClick={() => setIsAdding(true)}
                className="px-6 py-2 bg-mindtrack-sage text-white rounded-full hover:bg-mindtrack-sage/90 transition-colors"
              >
                Create Your First Goal
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const formatTimeRemaining = (time: TimeRemaining | undefined): string => {
  if (!time) return "";
  if (time.isExpired) return "Expired";
  
  const parts = [];
  if (time.years > 0) parts.push(`${time.years}y`);
  if (time.months > 0) parts.push(`${time.months}m`);
  if (time.weeks > 0) parts.push(`${time.weeks}w`);
  if (time.days > 0) parts.push(`${time.days}d`);
  if (time.hours > 0) parts.push(`${time.hours}h`);
  if (time.minutes > 0) parts.push(`${time.minutes}m`);
  
  return parts.slice(0, 2).join(" ");
};

interface GoalFormProps {
  onSubmit: (goal: Goal) => void;
  onCancel: () => void;
  initialData?: Goal;
}

const GoalForm = ({ onSubmit, onCancel, initialData }: GoalFormProps) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "mental" as Goal["category"],
    deadline: initialData?.deadline || "",
  });
  
  const [steps, setSteps] = useState(initialData?.steps || [{ id: Date.now(), text: "", completed: false }]);
  const [newStep, setNewStep] = useState("");

  const addStep = () => {
    if (newStep.trim()) {
      setSteps([...steps, { id: Date.now(), text: newStep, completed: false }]);
      setNewStep("");
    }
  };

  const removeStep = (id: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter(s => s.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filteredSteps = steps.filter(s => s.text.trim() !== "");
    
    const goal: Goal = {
      id: initialData?.id || Date.now(),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      deadline: formData.deadline,
      progress: initialData?.progress || 0,
      steps: filteredSteps,
      createdAt: initialData?.createdAt || new Date().toLocaleDateString(),
      isFavorite: initialData?.isFavorite || false,
    };
    
    onSubmit(goal);
  };

  return (
    <motion.form
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      onSubmit={handleSubmit}
      className="mindtrack-card space-y-4 border-2 border-mindtrack-sage/30"
    >
      <h3 className="font-medium text-mindtrack-stone mb-2">
        {initialData ? 'Edit Goal' : 'New Goal'}
      </h3>
      
      <div>
        <label htmlFor="goal-title" className="block text-sm font-medium text-mindtrack-stone mb-1">
          Goal Title
        </label>
        <input
          id="goal-title"
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="What do you want to achieve?"
          className="w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20"
        />
      </div>
      
      <div>
        <label htmlFor="goal-description" className="block text-sm font-medium text-mindtrack-stone mb-1">
          Description (optional)
        </label>
        <textarea
          id="goal-description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Add some details about this goal..."
          className="w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20 min-h-[80px]"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="goal-category" className="block text-sm font-medium text-mindtrack-stone mb-1">
            Category
          </label>
          <select
            id="goal-category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as Goal["category"] })}
            className="w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20 bg-white"
          >
            <option value="mental">Mental Wellbeing</option>
            <option value="physical">Physical Health</option>
            <option value="social">Social Connection</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="goal-deadline" className="block text-sm font-medium text-mindtrack-stone mb-1">
            Target Date (optional)
          </label>
          <input
            id="goal-deadline"
            type="date"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            className="w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-mindtrack-stone mb-2">
          Steps to Achieve This Goal
        </label>
        
        <ul className="space-y-2 mb-3">
          {steps.map((step, index) => (
            <li key={step.id} className="flex items-center gap-2">
              <input
                id={`step-input-${step.id}`}
                type="text"
                value={step.text}
                onChange={(e) => {
                  setSteps(steps.map(s => 
                    s.id === step.id ? { ...s, text: e.target.value } : s
                  ));
                }}
                placeholder="Add a step"
                className="flex-1 p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20"
                aria-label={`Step ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => removeStep(step.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                title="Remove step"
                aria-label={`Remove step ${index + 1}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
        
        <div className="flex gap-2">
          <input
            id="new-step-input"
            type="text"
            value={newStep}
            onChange={(e) => setNewStep(e.target.value)}
            placeholder="Add another step"
            className="flex-1 p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newStep.trim()) {
                e.preventDefault();
                addStep();
              }
            }}
            aria-label="Add another step"
          />
          <button
            type="button"
            onClick={addStep}
            disabled={!newStep.trim()}
            className="px-3 py-2 bg-mindtrack-sage/10 text-mindtrack-sage rounded-md hover:bg-mindtrack-sage/20 transition-colors disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-mindtrack-stone hover:bg-mindtrack-sage/5 rounded-md transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors disabled:opacity-50"
          disabled={!formData.title.trim() || steps.filter(s => s.text.trim()).length === 0}
        >
          {initialData ? 'Update' : 'Create'} Goal
        </button>
      </div>
    </motion.form>
  );
};

const getCategory = (category: Goal["category"]): string => {
  switch (category) {
    case "mental": return "Mental Wellbeing";
    case "physical": return "Physical Health";
    case "social": return "Social Connection";
    case "other": return "Other";
  }
};

export default GoalTracker;
