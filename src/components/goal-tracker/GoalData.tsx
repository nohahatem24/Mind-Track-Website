
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
  pastDueCount: number;
  upcomingDeadlines: Goal[];
  pastDueGoals: Goal[];
  averageProgress: number;
  goalsGroupedByPriority: {
    high: Goal[];
    medium: Goal[];
    low: Goal[];
  };
}

interface GoalDataProps {
  goals: Goal[];
  showOnlyFavorites: boolean;
  searchText?: string;
  filterPriority?: string;
  filterCategory?: string;
  dateStart?: string;
  dateEnd?: string;
  children: (data: GoalDataHookResult) => React.ReactNode;
}

const GoalData = ({ 
  goals, 
  showOnlyFavorites, 
  searchText = '',
  filterPriority = 'all',
  filterCategory = 'all',
  dateStart = '',
  dateEnd = '',
  children 
}: GoalDataProps) => {
  // COMPOSABLE FILTERING LOGIC
  // All filters work together without conflicts
  
  const visibleGoals = React.useMemo(() => {
    return goals
      .filter(goal => {
        // Favorites filter
        if (showOnlyFavorites && !goal.isFavorite) return false;
        
        // Search filter (title, description, steps)
        if (searchText.trim()) {
          const searchLower = searchText.toLowerCase();
          const titleMatch = goal.title.toLowerCase().includes(searchLower);
          const descMatch = goal.description?.toLowerCase().includes(searchLower) ?? false;
          const stepsMatch = goal.steps?.some(step => 
            step.description.toLowerCase().includes(searchLower)
          ) ?? false;
          
          if (!titleMatch && !descMatch && !stepsMatch) return false;
        }
        
        // Priority filter
        if (filterPriority !== 'all' && goal.priority !== filterPriority) return false;
        
        // Category filter
        if (filterCategory !== 'all' && goal.category !== filterCategory) return false;
        
        // Date range filter
        if (dateStart || dateEnd) {
          const goalDate = goal.targetDate ? new Date(goal.targetDate) : null;
          if (goalDate) {
            if (dateStart) {
              const startDate = new Date(dateStart);
              if (goalDate < startDate) return false;
            }
            if (dateEnd) {
              const endDate = new Date(dateEnd);
              if (goalDate > endDate) return false;
            }
          }
        }
        
        return true;
      })
      // Sort by newest first (descending by createdAt)
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
  }, [goals, showOnlyFavorites, searchText, filterPriority, filterCategory, dateStart, dateEnd]);

  // Count completed and in-progress goals
  const completedCount = visibleGoals.filter(goal => goal.completed).length;
  const inProgressCount = visibleGoals.filter(goal => !goal.completed && goal.progress > 0).length;

  // Compute past-due goals (deadline passed and not completed)
  const pastDueGoals = visibleGoals.filter(goal => {
    if (!goal.targetDate || goal.completed) return false;
    
    const targetDate = new Date(goal.targetDate);
    const now = new Date();
    // Set time to start of day for fair comparison
    now.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);
    
    return targetDate < now;
  });
  
  const pastDueCount = pastDueGoals.length;

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

  // GROUP goals by priority
  const goalsGroupedByPriority = React.useMemo(() => {
    return {
      high: visibleGoals.filter(goal => goal.priority === 'high'),
      medium: visibleGoals.filter(goal => goal.priority === 'medium'),
      low: visibleGoals.filter(goal => goal.priority === 'low')
    };
  }, [visibleGoals]);

  return <>{children({ visibleGoals, completedCount, inProgressCount, pastDueCount, upcomingDeadlines, pastDueGoals, averageProgress, goalsGroupedByPriority })}</>;
};

export default GoalData;
