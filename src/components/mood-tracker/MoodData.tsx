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
  dateRange: { startDate: string | null; endDate: string | null };
  children: (data: MoodDataHookResult) => React.ReactNode;
}

const MoodData = ({ entries, showOnlyFavorites, selectedDate, dateRange, children }: MoodDataProps) => {
  // Filter entries based on favorites toggle, selected date, and date range
  const visibleEntries = useMemo(() => {
    let filtered = entries;

    // Apply favorites filter
    if (showOnlyFavorites) {
      filtered = filtered.filter(entry => entry.isFavorite);
    }

    // Apply selected date filter (takes priority over default today filter)
    if (selectedDate) {
      filtered = filtered.filter(entry => entry.date === selectedDate);
    } 
    // Apply date range filter
    else if (dateRange.startDate || dateRange.endDate) {
      filtered = filtered.filter(entry => {
        const entryDate = new Date(entry.date);
        const start = dateRange.startDate ? new Date(dateRange.startDate) : null;
        const end = dateRange.endDate ? new Date(dateRange.endDate) : null;

        if (start && end) {
          return entryDate >= start && entryDate <= end;
        } else if (start) {
          return entryDate >= start;
        } else if (end) {
          return entryDate <= end;
        }
        return true;
      });
    }
    // Default: Show only today's entries if no filters are applied
    else {
      const today = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
      filtered = filtered.filter(entry => entry.date === today);
    }

    return filtered;
  }, [entries, showOnlyFavorites, selectedDate, dateRange]);

  // Process entries for the chart, ensuring they're chronologically ordered
  // Sorting from oldest to newest (left to right on graph)
  const chartData = useMemo(() => {
    let dataToChart = entries;

    // Apply date range filter to chart data
    if (dateRange.startDate || dateRange.endDate) {
      dataToChart = dataToChart.filter(entry => {
        const entryDate = new Date(entry.date);
        const start = dateRange.startDate ? new Date(dateRange.startDate) : null;
        const end = dateRange.endDate ? new Date(dateRange.endDate) : null;

        if (start && end) {
          return entryDate >= start && entryDate <= end;
        } else if (start) {
          return entryDate >= start;
        } else if (end) {
          return entryDate <= end;
        }
        return true;
      });
    }

    return dataToChart
      .map(entry => ({
        date: entry.date,
        time: entry.time || "",
        mood: entry.mood,
        category: getMoodCategory(entry.mood).label,
        color: getMoodCategory(entry.mood).color,
        note: entry.note || "",
        fullTimestamp: entry.timestamp,
        timestamp: new Date(entry.timestamp).getTime()
      }))
      .sort((a, b) => a.timestamp - b.timestamp); // Oldest first for left-to-right flow
  }, [entries, dateRange]);

  // AI-powered mood analysis and insights
  const moodInsights = useMemo(() => {
    // Use visible entries for insights to match what user sees
    const dataForInsights = visibleEntries.length > 0 ? visibleEntries : entries;

    // Default values in case there are no entries
    if (dataForInsights.length === 0) {
      return {
        averageMood: 0,
        dominantMood: "Neutral",
        trendDirection: 'stable' as const,
        consistency: 'consistent' as const,
        suggestion: "Start tracking your mood to get personalized insights."
      };
    }

    // Calculate average mood
    const moodSum = dataForInsights.reduce((sum, item) => sum + item.mood, 0);
    const averageMood = moodSum / dataForInsights.length;

    // Find dominant mood category
    const moodCounts = dataForInsights.reduce((acc, item) => {
      const category = getMoodCategory(item.mood).label;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Neutral";

    // Analyze mood trend direction
    let trendDirection: 'improving' | 'declining' | 'stable' = 'stable';
    if (dataForInsights.length >= 3) {
      // Sort by timestamp to ensure chronological order
      const sortedEntries = [...dataForInsights].sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      
      const recentMoods = sortedEntries.slice(-3).map(item => item.mood);
      const avgRecent = recentMoods.reduce((sum, mood) => sum + mood, 0) / recentMoods.length;
      const olderMoods = sortedEntries.slice(0, Math.max(sortedEntries.length - 3, 1)).map(item => item.mood);
      const avgOlder = olderMoods.reduce((sum, mood) => sum + mood, 0) / olderMoods.length;
      
      if (avgRecent > avgOlder + 1) trendDirection = 'improving';
      else if (avgRecent < avgOlder - 1) trendDirection = 'declining';
    }

    // Analyze mood consistency
    const moodVariance = dataForInsights.reduce((variance, item) => {
      return variance + Math.pow(item.mood - averageMood, 2);
    }, 0) / dataForInsights.length;
    
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
  }, [visibleEntries, entries]);

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