
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Plus, Target, Calendar, ArrowRight, Star, AlertCircle } from 'lucide-react';
import { Goal } from './GoalData';
import GoalForm from './GoalForm';
import GoalItem from './GoalItem';
import GoalData from './GoalData';
import GoalProgress from './GoalProgress';

interface GoalTrackerProps {
  showOnlyFavorites?: boolean;
}

const STORAGE_KEY = 'mindtrack_goals';

const GoalTracker = ({ showOnlyFavorites = false }: GoalTrackerProps) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showFavoritesState, setShowFavoritesState] = useState(showOnlyFavorites);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  // Load saved goals from localStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem(STORAGE_KEY);
    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals));
      } catch (e) {
        console.error("Error parsing saved goals:", e);
      }
    }
  }, []);

  // Save goals to localStorage when they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  }, [goals]);

  // Update showFavorites state when prop changes
  useEffect(() => {
    setShowFavoritesState(showOnlyFavorites);
  }, [showOnlyFavorites]);

  const addGoal = (goal: Goal) => {
    setGoals([goal, ...goals]);
    setIsAdding(false);
  };

  const updateGoal = (updatedGoal: Goal) => {
    setGoals(goals.map(g => g.id === updatedGoal.id ? updatedGoal : g));
    setEditingId(null);
  };

  const deleteGoal = (goalId: number) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  };

  const toggleFavorite = (goalId: number) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, isFavorite: !goal.isFavorite } 
        : goal
    ));
  };

  const updateProgress = (goalId: number, progress: number) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, progress, completed: progress === 100 } 
        : goal
    ));
  };

  const toggleStepCompleted = (goalId: number, stepId: number) => {
    setGoals(goals.map(goal => {
      if (goal.id !== goalId || !goal.steps) return goal;
      
      const updatedSteps = goal.steps.map(step => 
        step.id === stepId ? { ...step, completed: !step.completed } : step
      );
      
      // Calculate new progress based on completed steps
      const completedSteps = updatedSteps.filter(step => step.completed).length;
      const totalSteps = updatedSteps.length;
      const newProgress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : goal.progress;
      
      return { 
        ...goal, 
        steps: updatedSteps,
        progress: newProgress,
        completed: newProgress === 100
      };
    }));
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
          <h2 className="section-title">Goal Tracking</h2>
          <p className="text-mindtrack-stone/80 max-w-2xl">
            Set, track, and achieve your personal goals. Break down larger objectives into manageable steps and monitor your progress over time.
          </p>
        </motion.div>

        <GoalData 
          goals={goals} 
          showOnlyFavorites={showFavoritesState}
        >
          {({ visibleGoals, completedCount, inProgressCount, upcomingDeadlines, averageProgress }) => (
            <>
              <GoalProgress
                completedCount={completedCount}
                inProgressCount={inProgressCount}
                totalCount={visibleGoals.length}
                averageProgress={averageProgress}
              />

              {upcomingDeadlines.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mindtrack-card mb-8"
                >
                  <h3 className="text-xl font-semibold text-mindtrack-stone mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-mindtrack-sage" />
                    Upcoming Deadlines
                  </h3>
                  <div className="space-y-3">
                    {upcomingDeadlines.map(goal => (
                      <div key={goal.id} className="flex items-center justify-between p-3 bg-mindtrack-sage/5 rounded-md">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-mindtrack-sage" />
                          <span className="font-medium text-mindtrack-stone">{goal.title}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-mindtrack-stone/70">
                            Due: {new Date(goal.targetDate!).toLocaleDateString()}
                          </span>
                          <ArrowRight className="w-4 h-4 text-mindtrack-sage" />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              <div className="flex justify-between items-center mb-6">
                <div className="flex flex-wrap gap-2">
                  <CategoryButton 
                    active={filterCategory === 'all'} 
                    onClick={() => setFilterCategory('all')}
                  >
                    All Goals
                  </CategoryButton>
                  <CategoryButton 
                    active={filterCategory === 'personal'} 
                    onClick={() => setFilterCategory('personal')}
                  >
                    Personal
                  </CategoryButton>
                  <CategoryButton 
                    active={filterCategory === 'work'} 
                    onClick={() => setFilterCategory('work')}
                  >
                    Work
                  </CategoryButton>
                  <CategoryButton 
                    active={filterCategory === 'health'} 
                    onClick={() => setFilterCategory('health')}
                  >
                    Health
                  </CategoryButton>
                </div>
                
                <button
                  onClick={() => setShowFavoritesState(!showFavoritesState)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md ${
                    showFavoritesState 
                      ? 'bg-mindtrack-sage text-white' 
                      : 'text-mindtrack-sage hover:bg-mindtrack-sage/5'
                  } transition-colors`}
                >
                  <Star className="w-4 h-4" />
                  <span className="text-sm">Favorites</span>
                </button>
              </div>

              <div className="space-y-6">
                {!isAdding && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsAdding(true)}
                    className="w-full mindtrack-card flex items-center justify-center gap-2 text-mindtrack-sage hover:text-mindtrack-sage/80"
                  >
                    <Plus className="w-5 h-5" />
                    Add New Goal
                  </motion.button>
                )}

                {isAdding && (
                  <GoalForm onSubmit={addGoal} onCancel={() => setIsAdding(false)} />
                )}

                {visibleGoals
                  .filter(goal => filterCategory === 'all' ? true : goal.category === filterCategory)
                  .map((goal, index) => (
                    <GoalItem
                      key={goal.id}
                      goal={goal}
                      onEdit={setEditingId}
                      onDelete={deleteGoal}
                      onToggleFavorite={toggleFavorite}
                      onUpdateProgress={updateProgress}
                      onToggleStep={toggleStepCompleted}
                      editingId={editingId}
                      onUpdate={updateGoal}
                      onCancelEdit={() => setEditingId(null)}
                      index={index}
                    />
                  ))}

                {goals.length === 0 && !isAdding && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mindtrack-card flex items-center gap-3 text-mindtrack-stone/70"
                  >
                    <AlertCircle className="w-5 h-5" />
                    <p>No goals created yet. Set your first goal to start tracking your progress.</p>
                  </motion.div>
                )}
                
                {goals.length > 0 && visibleGoals.filter(goal => filterCategory === 'all' ? true : goal.category === filterCategory).length === 0 && !isAdding && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mindtrack-card flex items-center gap-3 text-mindtrack-stone/70"
                  >
                    <AlertCircle className="w-5 h-5" />
                    <p>No goals match your current filters.</p>
                  </motion.div>
                )}
              </div>
            </>
          )}
        </GoalData>
      </div>
    </section>
  );
};

// Helper component for category filtering
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

export default GoalTracker;
