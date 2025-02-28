
import { motion } from "framer-motion";
import { AlertCircle, Calendar, CheckSquare, Clock, Heart, Pencil, PlusCircle, Target, Trash2 } from "lucide-react";
import { useState } from "react";

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

interface GoalTrackerProps {
  showOnlyFavorites?: boolean;
}

const GoalTracker = ({ showOnlyFavorites = false }: GoalTrackerProps) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

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
                      >
                        <Heart 
                          className={`w-4 h-4 ${goal.isFavorite ? 'fill-mindtrack-sage text-mindtrack-sage' : 'text-mindtrack-sage'}`} 
                        />
                      </button>
                      <button
                        onClick={() => setEditingId(goal.id)}
                        className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
                      >
                        <Pencil className="w-4 h-4 text-mindtrack-sage" />
                      </button>
                    </div>
                  </div>

                  {goal.description && (
                    <p className="text-mindtrack-stone/80 mb-4">{goal.description}</p>
                  )}

                  {goal.deadline && (
                    <div className="flex items-center gap-2 text-sm text-mindtrack-stone/80 mb-4">
                      <Calendar className="w-4 h-4" />
                      Target date: {goal.deadline}
                    </div>
                  )}

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-mindtrack-stone">Progress</span>
                      <span className="text-sm font-medium text-mindtrack-stone">{goal.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-mindtrack-sage/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-mindtrack-sage transition-all duration-500 ease-in-out"
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mb-2">
                    <h4 className="font-medium text-mindtrack-stone mb-2">Steps:</h4>
                    <ul className="space-y-2">
                      {goal.steps.map(step => (
                        <li key={step.id} className="flex items-start gap-2">
                          <button
                            onClick={() => toggleStep(goal.id, step.id)}
                            className={`p-0.5 rounded border ${step.completed 
                              ? 'bg-mindtrack-sage border-mindtrack-sage text-white' 
                              : 'border-mindtrack-sage/40 text-transparent'}`}
                          >
                            <CheckSquare className="w-4 h-4" />
                          </button>
                          <span className={`text-mindtrack-stone/80 ${step.completed ? 'line-through text-mindtrack-stone/50' : ''}`}>
                            {step.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="flex items-center gap-1 px-2 py-1 text-sm text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Goal
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ))}

          {goals.length === 0 && !isAdding && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mindtrack-card flex items-center gap-3 text-mindtrack-stone/70"
            >
              <AlertCircle className="w-5 h-5" />
              <p>No goals set yet. Create your first goal to start tracking your progress.</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

const GoalForm = ({ 
  onSubmit, 
  onCancel,
  initialData
}: { 
  onSubmit: (goal: Goal) => void;
  onCancel: () => void;
  initialData?: Goal;
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    deadline: initialData?.deadline || "",
    category: initialData?.category || "mental" as Goal["category"],
  });

  const [steps, setSteps] = useState<Goal["steps"]>(
    initialData?.steps || [{ id: Date.now(), text: "", completed: false }]
  );

  const [newStep, setNewStep] = useState("");

  const addStep = () => {
    if (newStep.trim()) {
      setSteps([...steps, { id: Date.now(), text: newStep, completed: false }]);
      setNewStep("");
    }
  };

  const removeStep = (id: number) => {
    setSteps(steps.filter(step => step.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || steps.length === 0) return;

    const validSteps = steps.filter(step => step.text.trim());
    if (validSteps.length === 0) return;

    const now = new Date();
    const completedSteps = validSteps.filter(step => step.completed).length;
    const progress = Math.round((completedSteps / validSteps.length) * 100);

    onSubmit({
      id: initialData?.id || Date.now(),
      title: formData.title,
      description: formData.description || undefined,
      deadline: formData.deadline || undefined,
      steps: validSteps,
      progress,
      createdAt: initialData?.createdAt || now.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      }),
      category: formData.category,
      isFavorite: initialData?.isFavorite || false,
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mindtrack-card space-y-4"
      onSubmit={handleSubmit}
    >
      <div>
        <label className="block text-sm font-medium text-mindtrack-stone mb-1">
          Goal Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="What do you want to achieve?"
          className="w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-mindtrack-stone mb-1">
          Description (optional)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Add more details about your goal"
          className="w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20 resize-none min-h-[80px]"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-mindtrack-stone mb-1">
            Category
          </label>
          <select
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
          <label className="block text-sm font-medium text-mindtrack-stone mb-1">
            Target Date (optional)
          </label>
          <input
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
          {steps.map(step => (
            <li key={step.id} className="flex items-center gap-2">
              <input
                type="text"
                value={step.text}
                onChange={(e) => {
                  setSteps(steps.map(s => 
                    s.id === step.id ? { ...s, text: e.target.value } : s
                  ));
                }}
                placeholder="Add a step"
                className="flex-1 p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20"
              />
              <button
                type="button"
                onClick={() => removeStep(step.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
        
        <div className="flex gap-2">
          <input
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
