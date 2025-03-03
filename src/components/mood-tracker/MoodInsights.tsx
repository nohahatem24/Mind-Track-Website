
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Brain, Info, TrendingDown, TrendingUp } from "lucide-react";
import { MoodEntry, moodCategories, getMoodCategory } from "./types";

interface MoodInsightsProps {
  entries: MoodEntry[];
}

interface MoodTrend {
  trend: 'improving' | 'declining' | 'stable' | 'fluctuating' | 'insufficient';
  averageMood: number;
  description: string;
  suggestion?: string;
}

const MoodInsights = ({ entries }: MoodInsightsProps) => {
  const [insights, setInsights] = useState<MoodTrend | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  // Calculate mood insights based on entries
  useEffect(() => {
    if (entries.length < 3) {
      setInsights({
        trend: 'insufficient',
        averageMood: 0,
        description: "Not enough mood entries to analyze trends yet. Add more entries to see insights."
      });
      return;
    }

    // Get recent entries (last 7 days or all if less than 7 days of data)
    const sortedEntries = [...entries].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    const recentEntries = sortedEntries.slice(0, Math.min(7, sortedEntries.length));
    const olderEntries = sortedEntries.slice(
      Math.min(7, sortedEntries.length), 
      Math.min(14, sortedEntries.length)
    );
    
    // Calculate average moods
    const recentAvg = recentEntries.reduce((sum, entry) => sum + entry.mood, 0) / recentEntries.length;
    const olderAvg = olderEntries.length > 0 
      ? olderEntries.reduce((sum, entry) => sum + entry.mood, 0) / olderEntries.length 
      : recentAvg;
    
    // Calculate mood variability (standard deviation)
    const recentMoods = recentEntries.map(entry => entry.mood);
    const moodVariability = calculateStandardDeviation(recentMoods);
    
    // Determine trend
    const moodDifference = recentAvg - olderAvg;
    let trend: 'improving' | 'declining' | 'stable' | 'fluctuating' | 'insufficient';
    
    if (moodVariability > 5) {
      trend = 'fluctuating';
    } else if (Math.abs(moodDifference) < 2) {
      trend = 'stable';
    } else if (moodDifference > 0) {
      trend = 'improving';
    } else {
      trend = 'declining';
    }
    
    // Generate descriptions and suggestions
    let description = '';
    let suggestion = '';
    
    switch (trend) {
      case 'improving':
        description = "Your mood appears to be improving recently! Keep up the good work.";
        suggestion = "Continue the activities that have been helping you feel better.";
        break;
      case 'declining':
        description = "Your mood seems to be lower than usual lately.";
        suggestion = "Consider trying activities that have improved your mood in the past or reaching out to someone you trust.";
        break;
      case 'stable':
        description = "Your mood has been relatively stable lately.";
        suggestion = recentAvg > 0 
          ? "You're maintaining a positive outlook. Great job!"
          : "Try incorporating more activities that bring you joy.";
        break;
      case 'fluctuating':
        description = "Your mood has been fluctuating significantly.";
        suggestion = "Regular self-care routines might help stabilize your emotions.";
        break;
      default:
        description = "Add more entries to see detailed insights.";
        break;
    }
    
    setInsights({
      trend,
      averageMood: parseFloat(recentAvg.toFixed(1)),
      description,
      suggestion
    });
  }, [entries]);

  // Helper function to calculate standard deviation
  const calculateStandardDeviation = (values: number[]): number => {
    if (values.length === 0) return 0;
    
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squareDiffs = values.map(value => {
      const diff = value - avg;
      return diff * diff;
    });
    const avgSquareDiff = squareDiffs.reduce((sum, val) => sum + val, 0) / squareDiffs.length;
    return Math.sqrt(avgSquareDiff);
  };

  // Get the appropriate mood category based on average mood
  const getMoodInsightColor = (avgMood: number): string => {
    const category = getMoodCategory(avgMood);
    return category.color;
  };

  if (!insights) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mindtrack-card mb-6"
    >
      <div className="flex justify-between items-start">
        <div className="flex gap-3 items-center">
          <Brain className="w-5 h-5 text-mindtrack-sage" />
          <h3 className="text-lg font-medium text-mindtrack-stone">Mood Insights</h3>
        </div>
        <button 
          onClick={() => setShowInfo(!showInfo)} 
          className="p-1 hover:bg-mindtrack-sage/5 rounded-full"
        >
          <Info className="w-4 h-4 text-mindtrack-sage/70" />
        </button>
      </div>
      
      {showInfo && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-2 p-3 bg-mindtrack-sage/5 rounded-md text-sm text-mindtrack-stone/80"
        >
          Mood Insights analyze your recent mood entries to identify patterns and trends. 
          The analysis is based on your last 7-14 days of mood tracking data and provides 
          personalized suggestions based on your emotional patterns.
        </motion.div>
      )}
      
      <div className="mt-4 space-y-4">
        <div className="flex items-center gap-3">
          {insights.trend === 'improving' && <TrendingUp className="w-5 h-5 text-green-500" />}
          {insights.trend === 'declining' && <TrendingDown className="w-5 h-5 text-red-500" />}
          {insights.trend === 'stable' && <span className="w-5 h-5 flex items-center justify-center text-blue-500">━</span>}
          {insights.trend === 'fluctuating' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          
          <div>
            <div className="font-medium text-mindtrack-stone">
              {insights.trend === 'improving' && "Mood Improving"}
              {insights.trend === 'declining' && "Mood Declining"}
              {insights.trend === 'stable' && "Mood Stable"}
              {insights.trend === 'fluctuating' && "Mood Fluctuating"}
              {insights.trend === 'insufficient' && "Insufficient Data"}
            </div>
            <div className="text-sm text-mindtrack-stone/70">
              Average mood: <span style={{ color: getMoodInsightColor(insights.averageMood) }}>
                {insights.averageMood}
              </span> / 10
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-mindtrack-sage/5 rounded-md">
          <p className="text-mindtrack-stone/80 mb-2">{insights.description}</p>
          {insights.suggestion && (
            <p className="text-mindtrack-sage font-medium text-sm">{insights.suggestion}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MoodInsights;
