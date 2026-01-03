
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Heart, Pencil, Target, Trash2, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { Goal } from './GoalData';
import GoalForm from './GoalForm';

interface GoalItemProps {
  goal: Goal;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  onUpdateProgress: (id: number, progress: number) => void;
  onToggleStep: (goalId: number, stepId: number) => void;
  editingId: number | null;
  onUpdate: (goal: Goal) => void;
  onCancelEdit: () => void;
  index: number;
}

const GoalItem = ({
  goal,
  onEdit,
  onDelete,
  onToggleFavorite,
  onUpdateProgress,
  onToggleStep,
  editingId,
  onUpdate,
  onCancelEdit,
  index
}: GoalItemProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const isPastDue = () => {
    if (!goal.targetDate || goal.completed) return false;
    const targetDate = new Date(goal.targetDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);
    return targetDate < now;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      personal: 'bg-purple-100 text-purple-800',
      work: 'bg-blue-100 text-blue-800',
      health: 'bg-green-100 text-green-800',
      learning: 'bg-yellow-100 text-yellow-800',
      relationship: 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.other;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[priority] || colors.medium;
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-green-400';
    if (progress >= 50) return 'bg-yellow-400';
    if (progress >= 25) return 'bg-orange-400';
    return 'bg-red-400';
  };

  if (editingId === goal.id) {
    return (
      <GoalForm
        onSubmit={onUpdate}
        onCancel={onCancelEdit}
        initialData={goal}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      id={`goal-${goal.id}`}
      className="mindtrack-card cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => setShowDetails(!showDetails)}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          {goal.completed ? (
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          ) : (
            <Target className="w-5 h-5 text-mindtrack-sage flex-shrink-0" />
          )}
          <div>
            <h3 className="text-lg font-semibold text-mindtrack-stone">{goal.title}</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded-full text-xs ${getCategoryColor(goal.category)}`}>
                {goal.category}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${getPriorityColor(goal.priority)}`}>
                {goal.priority} priority
              </span>
              {goal.targetDate && (
                <span className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 ${
                  isPastDue() 
                    ? 'bg-amber-100 text-amber-800 font-medium' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  <Clock className="w-3 h-3" />
                  {new Date(goal.targetDate).toLocaleDateString()}
                  {isPastDue() && <span className="ml-1">⚠ Deadline Passed</span>}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(goal.id);
            }}
            className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
            aria-label={goal.isFavorite ? "Remove from favorites" : "Add to favorites"}
            title={goal.isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              className={`w-4 h-4 ${goal.isFavorite ? 'fill-mindtrack-sage text-mindtrack-sage' : 'text-mindtrack-sage'}`} 
            />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(goal.id);
            }}
            className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
            aria-label="Edit goal"
            title="Edit goal"
          >
            <Pencil className="w-4 h-4 text-mindtrack-sage" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(goal.id);
            }}
            className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
            aria-label="Delete goal"
            title="Delete goal"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(!showDetails);
            }}
            className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors ml-auto"
            aria-label={showDetails ? "Collapse goal details" : "Expand goal details"}
            title={showDetails ? "Collapse goal details" : "Expand goal details"}
          >
            {showDetails ? (
              <ChevronUp className="w-4 h-4 text-mindtrack-sage" />
            ) : (
              <ChevronDown className="w-4 h-4 text-mindtrack-sage" />
            )}
          </button>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="text-sm font-medium text-mindtrack-stone">Progress: {goal.progress}%</div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={goal.progress}
            onChange={(e) => {
              e.stopPropagation();
              onUpdateProgress(goal.id, parseInt(e.target.value));
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-24 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            aria-label="Update goal progress"
            title="Drag to update progress"
          />
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full ${getProgressColor(goal.progress)}`}
            style={{ width: `${goal.progress}%` }}
          ></div>
        </div>
      </div>

      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="mt-4 pt-4 border-t border-gray-100"
        >
          {goal.description && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-mindtrack-stone mb-1">Description</h4>
              <p className="text-sm text-mindtrack-stone/70">{goal.description}</p>
            </div>
          )}
          
          {goal.steps && goal.steps.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-mindtrack-stone mb-2">Steps</h4>
              <div className="space-y-2">
                {goal.steps.map(step => (
                  <div 
                    key={step.id}
                    className="flex items-center gap-2 p-2 bg-mindtrack-sage/5 rounded-md cursor-pointer hover:bg-mindtrack-sage/10 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleStep(goal.id, step.id);
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={step.completed ? `Unmark step as complete: ${step.description}` : `Mark step as complete: ${step.description}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.stopPropagation();
                        e.preventDefault();
                        onToggleStep(goal.id, step.id);
                      }
                    }}
                  >
                    <div 
                      className={`p-1 rounded-full flex-shrink-0 ${step.completed ? 'bg-green-100' : 'hover:bg-mindtrack-sage/10'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Check className={`w-4 h-4 ${step.completed ? 'text-green-600' : 'text-mindtrack-sage/50'}`} />
                    </div>
                    <span className={`text-sm flex-1 ${step.completed ? 'line-through text-mindtrack-stone/50' : 'text-mindtrack-stone'}`}>
                      {step.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-3 text-xs text-mindtrack-stone/50">
            Created: {new Date(goal.createdAt).toLocaleDateString()}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GoalItem;
