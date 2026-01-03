
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, X } from 'lucide-react';
import { Goal } from './GoalData';

interface GoalFormProps {
  onSubmit: (goal: Goal) => void;
  onCancel: () => void;
  initialData?: Goal;
}

const GoalForm = ({ onSubmit, onCancel, initialData }: GoalFormProps) => {
  const [formData, setFormData] = useState<Omit<Goal, 'id' | 'createdAt'>>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    targetDate: initialData?.targetDate || '',
    completed: initialData?.completed || false,
    progress: initialData?.progress || 0,
    steps: initialData?.steps || [],
    category: initialData?.category || 'personal',
    priority: initialData?.priority || 'medium',
    isFavorite: initialData?.isFavorite || false,
  });

  const [newStep, setNewStep] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const now = new Date();
    
    const goal: Goal = {
      id: initialData?.id || Date.now(),
      ...formData,
      createdAt: initialData?.createdAt || now.toISOString(),
    };

    onSubmit(goal);
  };

  const addStep = () => {
    if (!newStep.trim()) return;
    
    setFormData({
      ...formData,
      steps: [
        ...(formData.steps || []),
        { id: Date.now(), description: newStep, completed: false }
      ]
    });
    
    setNewStep('');
  };

  const removeStep = (stepId: number) => {
    setFormData({
      ...formData,
      steps: formData.steps?.filter(step => step.id !== stepId)
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mindtrack-card space-y-6"
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-mindtrack-stone mb-1" htmlFor="title">
            Goal Title
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20"
            placeholder="What do you want to achieve?"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-mindtrack-stone mb-1" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 min-h-[100px] rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20 resize-none"
            placeholder="Add details about your goal..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-mindtrack-stone mb-1" htmlFor="targetDate">
              Target Date
            </label>
            <div className="relative">
              <input
                id="targetDate"
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                className="w-full p-2 pl-10 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20"
              />
              <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-mindtrack-stone/50" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-mindtrack-stone mb-1" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as Goal['category'] })}
              className="w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20"
            >
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="health">Health</option>
              <option value="learning">Learning</option>
              <option value="relationship">Relationship</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-mindtrack-stone mb-1" htmlFor="priority">
              Priority
            </label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as Goal['priority'] })}
              className="w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-mindtrack-stone mb-1" htmlFor="progress">
              Progress ({formData.progress}%)
            </label>
            <input
              id="progress"
              type="range"
              min="0"
              max="100"
              step="5"
              value={formData.progress}
              onChange={(e) => setFormData({ 
                ...formData, 
                progress: parseInt(e.target.value),
                completed: parseInt(e.target.value) === 100
              })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-mindtrack-stone mb-1">
            Steps
          </label>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={newStep}
              onChange={(e) => setNewStep(e.target.value)}
              className="flex-1 p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20"
              placeholder="Add a step..."
            />
            <button
              type="button"
              onClick={addStep}
              className="p-2 rounded-md bg-mindtrack-sage text-white hover:bg-mindtrack-sage/90 transition-colors"
              aria-label="Add step to goal"
              title="Add step to goal"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-2 max-h-[200px] overflow-y-auto p-1">
            {formData.steps?.map(step => (
              <div key={step.id} className="flex justify-between items-center p-2 bg-mindtrack-sage/5 rounded-md">
                <span className="text-sm text-mindtrack-stone">{step.description}</span>
                <button
                  type="button"
                  onClick={() => removeStep(step.id)}
                  className="p-1 hover:bg-red-50 rounded-full transition-colors"
                  aria-label="Remove step"
                  title="Remove step"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-mindtrack-stone hover:bg-mindtrack-sage/5 rounded-md transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors"
          disabled={!formData.title.trim()}
        >
          Save
        </button>
      </div>
    </motion.form>
  );
};

export default GoalForm;
