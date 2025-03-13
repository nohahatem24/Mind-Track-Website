
import React from 'react';

export interface Goal {
  id: number;
  title: string;
  description?: string;
  targetDate?: string;
  completed: boolean;
  progress: number; // 0-100
  steps?: {
    id: number;
    description: string;
    completed: boolean;
  }[];
  category: 'personal' | 'work' | 'health' | 'learning' | 'relationship' | 'other';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  isFavorite?: boolean;
}

export interface GoalDataHookResult {
  visibleGoals: Goal[];
  completedCount: number;
  inProgressCount: number;
  upcomingDeadlines: Goal[];
  averageProgress: number;
}

interface GoalDataProps {
  goals: Goal[];
  showOnlyFavorites: boolean;
  children: (data: GoalDataHookResult) => React.ReactNode;
}

const GoalData = ({ goals, showOnlyFavorites, children }: GoalDataProps) => {
  // Filter goals based on favorites toggle
  const visibleGoals = showOnlyFavorites
    ? goals.filter(goal => goal.isFavorite)
    : goals;

  // Count completed and in-progress goals
  const completedCount = visibleGoals.filter(goal => goal.completed).length;
  const inProgressCount = visibleGoals.filter(goal => !goal.completed && goal.progress > 0).length;

  // Calculate average progress
  const averageProgress = visibleGoals.length > 0
    ? visibleGoals.reduce((sum, goal) => sum + goal.progress, 0) / visibleGoals.length
    : 0;

  // Get upcoming deadlines (goals with target dates in the next 7 days)
  const upcomingDeadlines = visibleGoals
    .filter(goal => {
      if (!goal.targetDate || goal.completed) return false;
      
      const targetDate = new Date(goal.targetDate);
      const now = new Date();
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(now.getDate() + 7);
      
      return targetDate >= now && targetDate <= sevenDaysFromNow;
    })
    .sort((a, b) => new Date(a.targetDate!).getTime() - new Date(b.targetDate!).getTime());

  return <>{children({ visibleGoals, completedCount, inProgressCount, upcomingDeadlines, averageProgress })}</>;
};

export default GoalData;
