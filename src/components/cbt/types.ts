
export interface Technique {
  id: string;
  title: string;
  description: string;
  steps: string[];
  category: "cognitive" | "behavioral" | "mindfulness";
  isFavorite?: boolean;
}

// Enhanced interfaces to store detailed exercise data
export interface ExerciseData {
  id: string;
  techniqueId: string;
  date: string;
  notes?: string;
  data: Record<string, any>; // To store all user inputs
}

// Storage keys for localStorage
export const FAVORITES_STORAGE_KEY = 'mindtrack_cbt_favorites';
export const COMPLETED_STORAGE_KEY = 'mindtrack_cbt_completed';
export const HISTORY_STORAGE_KEY = 'mindtrack_cbt_history';
export const DAILY_COUNTS_STORAGE_KEY = 'mindtrack_cbt_daily_counts';

export interface CBTTechniquesProps {
  showOnlyFavorites?: boolean;
}
