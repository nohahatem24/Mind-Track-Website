
import React, { useMemo } from 'react';
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
  moodInsights: {
    averageMood: number;
    dominantMood: string;
    trendDirection: 'improving' | 'declining' | 'stable';
    consistency: 'consistent' | 'variable' | 'very variable';
    suggestion: string;
  };
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
  // Now sorting from oldest to newest for the chart display
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
    .sort((a, b) => a.timestamp - b.timestamp); // Ensure chronological order (oldest first)

  // AI-powered mood analysis and insights
  const moodInsights = useMemo(() => {
    // Default values in case there are no entries
    if (chartData.length === 0) {
      return {
        averageMood: 0,
        dominantMood: "Neutral",
        trendDirection: 'stable' as const,
        consistency: 'consistent' as const,
        suggestion: "Start tracking your mood to get personalized insights."
      };
    }

    // Calculate average mood
    const moodSum = chartData.reduce((sum, item) => sum + item.mood, 0);
    const averageMood = moodSum / chartData.length;

    // Find dominant mood category
    const moodCounts = chartData.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0][0];

    // Analyze mood trend direction
    let trendDirection: 'improving' | 'declining' | 'stable' = 'stable';
    if (chartData.length >= 3) {
      const recentMoods = chartData.slice(-3).map(item => item.mood);
      const avgRecent = recentMoods.reduce((sum, mood) => sum + mood, 0) / recentMoods.length;
      const olderMoods = chartData.slice(0, Math.max(chartData.length - 3, 1)).map(item => item.mood);
      const avgOlder = olderMoods.reduce((sum, mood) => sum + mood, 0) / olderMoods.length;
      
      if (avgRecent > avgOlder + 1) trendDirection = 'improving';
      else if (avgRecent < avgOlder - 1) trendDirection = 'declining';
    }

    // Analyze mood consistency
    const moodVariance = chartData.reduce((variance, item) => {
      return variance + Math.pow(item.mood - averageMood, 2);
    }, 0) / chartData.length;
    
    let consistency: 'consistent' | 'variable' | 'very variable' = 'consistent';
    if (moodVariance > 16) consistency = 'very variable';
    else if (moodVariance > 4) consistency = 'variable';

    // Generate personalized suggestion based on analysis
    let suggestion = "";
    if (trendDirection === 'declining') {
      suggestion = "Your mood seems to be declining. Consider using CBT techniques or practicing gratitude to help improve your mood.";
    } else if (consistency === 'very variable') {
      suggestion = "Your mood seems quite variable. Tracking your triggers might help identify patterns causing these fluctuations.";
    } else if (averageMood < -2) {
      suggestion = "Your average mood is on the lower side. Consider reaching out to a friend or professional for support.";
    } else if (averageMood > 2) {
      suggestion = "Your mood is generally positive. Great job! Keep using strategies that are working for you.";
    } else {
      suggestion = "Your mood is relatively stable. Regular mood tracking can help maintain awareness of your emotional patterns.";
    }

    return {
      averageMood: parseFloat(averageMood.toFixed(1)),
      dominantMood,
      trendDirection,
      consistency,
      suggestion
    };
  }, [chartData]);

  return <>{children({ visibleEntries, chartData, moodInsights })}</>;

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
