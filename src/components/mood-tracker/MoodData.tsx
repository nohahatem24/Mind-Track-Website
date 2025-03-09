
import React from 'react';
import { MoodEntry } from './types';

interface MoodDataHookResult {
  visibleEntries: MoodEntry[];
  chartData: Array<{
    date: string;
    time: string;
    mood: number;
    category: string;
    color: string;
    note: string;
    fullTimestamp: string;
    timestamp: number;
  }>;
}

interface MoodDataProps {
  entries: MoodEntry[];
  showOnlyFavorites: boolean;
  selectedDate: string | null;
  children: (data: MoodDataHookResult) => React.ReactNode;
}

const MoodData = ({ entries, showOnlyFavorites, selectedDate, children }: MoodDataProps) => {
  // Filter entries based on favorites toggle and selected date
  const visibleEntries = showOnlyFavorites
    ? entries.filter(entry => entry.isFavorite)
    : selectedDate 
      ? entries.filter(entry => entry.date === selectedDate)
      : entries;

  // Process entries for the chart, ensuring they're chronologically ordered
  const chartData = entries
    .map(entry => ({
      date: entry.date,
      time: entry.time || "",
      mood: entry.mood,
      category: getMoodCategory(entry.mood).label,
      color: getMoodCategory(entry.mood).color,
      note: entry.note || "",
      fullTimestamp: entry.timestamp,
      timestamp: new Date(entry.timestamp).getTime() // Numeric timestamp for sorting
    }))
    .sort((a, b) => a.timestamp - b.timestamp); // Ensure chronological order

  return <>{children({ visibleEntries, chartData })}</>;

  function getMoodCategory(mood: number) {
    const categories = [
      { range: [-10, -6], label: "Severely Low", color: "#ef4444", description: "Severe depression, emotional shutdown" },
      { range: [-5, -1], label: "Mildly Low", color: "#f97316", description: "Sadness, low energy, anxiety" },
      { range: [0, 0], label: "Neutral", color: "#facc15", description: "Balanced, even emotional state" },
      { range: [1, 5], label: "Mildly Elevated", color: "#84cc16", description: "Happiness, calmness, satisfaction" },
      { range: [6, 10], label: "Highly Elevated", color: "#22c55e", description: "Energetic, intense excitement, joy" },
    ];
    
    return categories.find(category => 
      mood >= category.range[0] && mood <= category.range[1]
    ) || categories[2]; // Default to neutral
  }
};

export default MoodData;
