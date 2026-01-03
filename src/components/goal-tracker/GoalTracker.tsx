
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check, Plus, Target, Calendar, Heart, AlertCircle, Search } from 'lucide-react';
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
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchText, setSearchText] = useState<string>('');
  const [dateStart, setDateStart] = useState<string>("");
  const [dateEnd, setDateEnd] = useState<string>("");
  
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
    const newGoal = { ...goal, createdAt: new Date().toISOString() };
    setGoals([newGoal, ...goals]);
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
          searchText={searchText}
          filterPriority={filterPriority}
          filterCategory={filterCategory}
          dateStart={dateStart}
          dateEnd={dateEnd}
        >
          {({ visibleGoals, completedCount, inProgressCount, upcomingDeadlines, averageProgress, goalsGroupedByPriority, pastDueCount, pastDueGoals }) => (
            <>
              <GoalProgress
                completedCount={completedCount}
                inProgressCount={inProgressCount}
                totalCount={visibleGoals.length}
                averageProgress={averageProgress}
                pastDueCount={pastDueCount}
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
                      <motion.div 
                        key={goal.id} 
                        className="flex flex-col p-3 bg-mindtrack-sage/5 rounded-md cursor-pointer hover:bg-mindtrack-sage/10 transition-colors"
                        whileHover={{ x: 4 }}
                        onClick={() => {
                          // Scroll goal into view when clicked from upcoming deadlines
                          const goalElement = document.getElementById(`goal-${goal.id}`);
                          goalElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-mindtrack-sage" />
                            <span className="font-medium text-mindtrack-stone">{goal.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              goal.priority === 'high' ? 'bg-red-100 text-red-800' :
                              goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {goal.priority} priority
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-mindtrack-stone/70 mt-1">
                          Due: {new Date(goal.targetDate!).toLocaleDateString()}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* PAST DUE SECTION */}
              {pastDueGoals.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mindtrack-card mb-8"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-xl font-semibold text-amber-700 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                      Deadline Passed
                    </h3>
                  </div>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto border border-amber-200/30 rounded-lg p-4 bg-amber-50/50">
                    {pastDueGoals.map(goal => (
                      <motion.div 
                        key={goal.id} 
                        className="flex flex-col p-3 bg-amber-100/50 rounded-md cursor-pointer hover:bg-amber-100 transition-colors border border-amber-200/50"
                        whileHover={{ x: 4 }}
                        onClick={() => {
                          // Scroll goal into view when clicked from deadlines passed section
                          const goalElement = document.getElementById(`goal-${goal.id}`);
                          goalElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-600" />
                            <span className="font-medium text-mindtrack-stone">{goal.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              goal.priority === 'high' ? 'bg-red-100 text-red-800' :
                              goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {goal.priority} priority
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-mindtrack-stone/70 mt-1">
                          Was due: {new Date(goal.targetDate!).toLocaleDateString()}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* FILTER SECTION */}
              <div className="mindtrack-card mb-8 p-6">
                <h3 className="text-lg font-semibold text-mindtrack-stone mb-4">Filters & Search</h3>
                
                {/* Search Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-mindtrack-stone mb-2">Search Goals</label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-mindtrack-sage/50" />
                    <input
                      type="text"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      placeholder="Search by title, description, or steps..."
                      aria-label="Search goals by title, description, or steps"
                      className="w-full pl-10 pr-3 py-2 border border-mindtrack-sage/20 rounded-md focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20"
                    />
                  </div>
                </div>

                {/* Priority Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-mindtrack-stone mb-2">Priority</label>
                  <div className="flex flex-wrap gap-2">
                    <PriorityButton
                      active={filterPriority === 'all'}
                      onClick={() => setFilterPriority('all')}
                    >
                      All
                    </PriorityButton>
                    <PriorityButton
                      active={filterPriority === 'high'}
                      onClick={() => setFilterPriority('high')}
                      color="red"
                    >
                      High
                    </PriorityButton>
                    <PriorityButton
                      active={filterPriority === 'medium'}
                      onClick={() => setFilterPriority('medium')}
                      color="yellow"
                    >
                      Medium
                    </PriorityButton>
                    <PriorityButton
                      active={filterPriority === 'low'}
                      onClick={() => setFilterPriority('low')}
                      color="green"
                    >
                      Low
                    </PriorityButton>
                  </div>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-mindtrack-stone mb-2">Category</label>
                  <div className="flex flex-wrap gap-2">
                    <CategoryButton 
                      active={filterCategory === 'all'} 
                      onClick={() => setFilterCategory('all')}
                    >
                      All Categories
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
                    <CategoryButton 
                      active={filterCategory === 'learning'} 
                      onClick={() => setFilterCategory('learning')}
                    >
                      Learning
                    </CategoryButton>
                    <CategoryButton 
                      active={filterCategory === 'relationship'} 
                      onClick={() => setFilterCategory('relationship')}
                    >
                      Relationship
                    </CategoryButton>
                    <CategoryButton 
                      active={filterCategory === 'other'} 
                      onClick={() => setFilterCategory('other')}
                    >
                      Other
                    </CategoryButton>
                  </div>
                </div>

                {/* Date Range Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-mindtrack-stone mb-2">Date Range</label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-xs text-mindtrack-stone/70">Start Date</label>
                      <input
                        type="date"
                        value={dateStart}
                        onChange={(e) => setDateStart(e.target.value)}
                        aria-label="Filter goals by start date"
                        className="w-full mt-1 px-3 py-2 border border-mindtrack-sage/20 rounded-md focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-mindtrack-stone/70">End Date</label>
                      <input
                        type="date"
                        value={dateEnd}
                        onChange={(e) => setDateEnd(e.target.value)}
                        aria-label="Filter goals by end date"
                        className="w-full mt-1 px-3 py-2 border border-mindtrack-sage/20 rounded-md focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Favorites Toggle */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFavoritesState(!showFavoritesState)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors ${
                      showFavoritesState 
                        ? 'bg-mindtrack-sage text-white' 
                        : 'text-mindtrack-sage hover:bg-mindtrack-sage/5 border border-mindtrack-sage/20'
                    }`}
                    aria-label={showFavoritesState ? "Show all goals" : "Show only favorites"}
                    title={showFavoritesState ? "Show all goals" : "Show only favorites"}
                  >
                    <Heart className={`w-4 h-4 ${showFavoritesState ? 'fill-white' : ''}`} />
                    <span className="text-sm">Favorites Only</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setSearchText('');
                      setFilterPriority('all');
                      setFilterCategory('all');
                      setDateStart('');
                      setDateEnd('');
                      setShowFavoritesState(false);
                    }}
                    className="ml-auto px-3 py-1.5 rounded-md text-amber-700 hover:bg-amber-100 border border-amber-300 transition-colors text-sm font-medium"
                    aria-label="Reset all filters"
                    title="Reset all filters to default"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>

              {/* ADD NEW GOAL */}
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

                {/* PRIORITY-BASED SECTIONS */}
                <div className="space-y-8">
                  {/* HIGH PRIORITY SECTION */}
                  {goalsGroupedByPriority.high.length > 0 && (
                    <PrioritySection
                      title="High Priority"
                      goals={goalsGroupedByPriority.high}
                      color="red"
                      editingId={editingId}
                      onEdit={setEditingId}
                      onDelete={deleteGoal}
                      onToggleFavorite={toggleFavorite}
                      onUpdateProgress={updateProgress}
                      onToggleStep={toggleStepCompleted}
                      onUpdate={updateGoal}
                      onCancelEdit={() => setEditingId(null)}
                    />
                  )}

                  {/* MEDIUM PRIORITY SECTION */}
                  {goalsGroupedByPriority.medium.length > 0 && (
                    <PrioritySection
                      title="Medium Priority"
                      goals={goalsGroupedByPriority.medium}
                      color="yellow"
                      editingId={editingId}
                      onEdit={setEditingId}
                      onDelete={deleteGoal}
                      onToggleFavorite={toggleFavorite}
                      onUpdateProgress={updateProgress}
                      onToggleStep={toggleStepCompleted}
                      onUpdate={updateGoal}
                      onCancelEdit={() => setEditingId(null)}
                    />
                  )}

                  {/* LOW PRIORITY SECTION */}
                  {goalsGroupedByPriority.low.length > 0 && (
                    <PrioritySection
                      title="Low Priority"
                      goals={goalsGroupedByPriority.low}
                      color="green"
                      editingId={editingId}
                      onEdit={setEditingId}
                      onDelete={deleteGoal}
                      onToggleFavorite={toggleFavorite}
                      onUpdateProgress={updateProgress}
                      onToggleStep={toggleStepCompleted}
                      onUpdate={updateGoal}
                      onCancelEdit={() => setEditingId(null)}
                    />
                  )}
                </div>

                {/* EMPTY STATES */}
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
                
                {goals.length > 0 && visibleGoals.length === 0 && !isAdding && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mindtrack-card flex items-center gap-3 text-mindtrack-stone/70"
                  >
                    <AlertCircle className="w-5 h-5" />
                    <p>No goals match your current filters. Try adjusting your search or filter criteria.</p>
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
        : "bg-white text-mindtrack-stone hover:bg-mindtrack-sage/5 border border-mindtrack-sage/20"
    }`}
  >
    {children}
  </button>
);

// Helper component for priority filtering
// NOTE: Visual semantics — Priority colors (red/yellow/green) represent urgency levels ONLY
// They never conflict with category meanings. Categories use neutral identifiers.
const PriorityButton = ({ 
  children, 
  active, 
  onClick,
  color = 'sage'
}: { 
  children: React.ReactNode; 
  active: boolean; 
  onClick: () => void;
  color?: string;
}) => {
  const bgColor = active 
    ? color === 'red' ? 'bg-red-500' :
      color === 'yellow' ? 'bg-yellow-500' :
      color === 'green' ? 'bg-green-500' :
      'bg-mindtrack-sage'
    : 'bg-white border border-mindtrack-sage/20';
    
  const textColor = active ? 'text-white' : 'text-mindtrack-stone hover:bg-mindtrack-sage/5';

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${bgColor} ${textColor}`}
    >
      {children}
    </button>
  );
};

// Helper component for displaying a priority section
interface PrioritySectionProps {
  title: string;
  goals: Goal[];
  color: 'red' | 'yellow' | 'green' | 'amber';
  editingId: number | null;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  onUpdateProgress: (id: number, progress: number) => void;
  onToggleStep: (goalId: number, stepId: number) => void;
  onUpdate: (goal: Goal) => void;
  onCancelEdit: () => void;
  isPastDue?: boolean;
}

const PrioritySection = ({
  title,
  goals,
  color,
  editingId,
  onEdit,
  onDelete,
  onToggleFavorite,
  onUpdateProgress,
  onToggleStep,
  onUpdate,
  onCancelEdit,
  isPastDue = false
}: PrioritySectionProps) => {
  const borderColor = color === 'red' ? 'border-l-red-500' :
                     color === 'yellow' ? 'border-l-yellow-500' :
                     color === 'amber' ? 'border-l-amber-600' :
                     'border-l-green-500';
  
  const titleColor = color === 'red' ? 'text-red-600' :
                    color === 'yellow' ? 'text-yellow-600' :
                    color === 'amber' ? 'text-amber-700' :
                    'text-green-600';

  return (
    <div className={`border-l-4 ${borderColor} pl-4`}>
      <div className="flex items-center gap-2 mb-4">
        <h3 className={`text-lg font-semibold ${titleColor}`}>{title}</h3>
        {isPastDue && (
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
            ⚠ Deadline Passed
          </span>
        )}
      </div>
      <div className="space-y-4 max-h-[600px] overflow-y-auto border border-mindtrack-sage/10 rounded-lg p-4 bg-mindtrack-sage/5">
        {goals.map((goal, index) => (
          <GoalItem
            key={goal.id}
            goal={goal}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleFavorite={onToggleFavorite}
            onUpdateProgress={onUpdateProgress}
            onToggleStep={onToggleStep}
            editingId={editingId}
            onUpdate={onUpdate}
            onCancelEdit={onCancelEdit}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default GoalTracker;
