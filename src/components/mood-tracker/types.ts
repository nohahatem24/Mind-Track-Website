export interface MoodEntry {
  id: number;
  mood: number;
  note?: string;
  timestamp: string;
  date: string; // Format: "Jan 2, 2026"
  time?: string;
  isFavorite?: boolean;
}

export interface MoodCategory {
  range: [number, number];
  label: string;
  color: string;
  description: string;
}

export interface MoodTrackerProps {
  showOnlyFavorites?: boolean;
}

export interface DateRange {
  startDate: string | null;
  endDate: string | null;
}

export const STORAGE_KEY = 'mindtrack_mood_entries';

export const moodCategories: MoodCategory[] = [
  { range: [-10, -6], label: "Severely Low", color: "#ef4444", description: "Severe depression, emotional shutdown" },
  { range: [-5, -1], label: "Mildly Low", color: "#f97316", description: "Sadness, low energy, anxiety" },
  { range: [0, 0], label: "Neutral", color: "#facc15", description: "Balanced, even emotional state" },
  { range: [1, 5], label: "Mildly Elevated", color: "#84cc16", description: "Happiness, calmness, satisfaction" },
  { range: [6, 10], label: "Highly Elevated", color: "#22c55e", description: "Energetic, intense excitement, joy" },
];

export const getMoodCategory = (moodValue: number): MoodCategory => {
  return moodCategories.find(category => 
    moodValue >= category.range[0] && moodValue <= category.range[1]
  ) || moodCategories[2]; // Default to neutral
};