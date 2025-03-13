
import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, TrendingDown, Minus, AlertTriangle, Check, BarChart } from 'lucide-react';

interface MoodInsightsProps {
  insights: {
    averageMood: number;
    dominantMood: string;
    trendDirection: 'improving' | 'declining' | 'stable';
    consistency: 'consistent' | 'variable' | 'very variable';
    suggestion: string;
  };
}

const MoodInsights = ({ insights }: MoodInsightsProps) => {
  const getTrendIcon = () => {
    switch (insights.trendDirection) {
      case 'improving':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'declining':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <Minus className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getConsistencyIcon = () => {
    switch (insights.consistency) {
      case 'consistent':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'variable':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'very variable':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getMoodColor = () => {
    if (insights.averageMood >= 6) return 'text-green-600';
    if (insights.averageMood >= 1) return 'text-green-500';
    if (insights.averageMood === 0) return 'text-yellow-500';
    if (insights.averageMood >= -5) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mindtrack-card mb-8"
    >
      <h3 className="text-xl font-semibold text-mindtrack-stone mb-6 flex items-center gap-2">
        <Brain className="w-5 h-5 text-mindtrack-sage" />
        AI Mood Insights
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-mindtrack-sage/5 rounded-lg">
          <div className="text-sm text-mindtrack-stone/70 mb-1">Average Mood</div>
          <div className={`text-2xl font-bold ${getMoodColor()}`}>{insights.averageMood}</div>
        </div>
        
        <div className="p-4 bg-mindtrack-sage/5 rounded-lg">
          <div className="text-sm text-mindtrack-stone/70 mb-1">Most Common Mood</div>
          <div className="text-xl font-medium text-mindtrack-stone">{insights.dominantMood}</div>
        </div>
        
        <div className="p-4 bg-mindtrack-sage/5 rounded-lg">
          <div className="text-sm text-mindtrack-stone/70 mb-1">Trend Direction</div>
          <div className="flex items-center gap-2">
            {getTrendIcon()}
            <span className="text-xl font-medium text-mindtrack-stone capitalize">{insights.trendDirection}</span>
          </div>
        </div>
        
        <div className="p-4 bg-mindtrack-sage/5 rounded-lg">
          <div className="text-sm text-mindtrack-stone/70 mb-1">Mood Consistency</div>
          <div className="flex items-center gap-2">
            {getConsistencyIcon()}
            <span className="text-xl font-medium text-mindtrack-stone capitalize">{insights.consistency}</span>
          </div>
        </div>
      </div>
      
      <div className="p-5 border border-mindtrack-sage/20 rounded-lg bg-mindtrack-sage/5">
        <div className="flex items-start gap-3">
          <BarChart className="w-5 h-5 text-mindtrack-sage flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-medium text-mindtrack-stone mb-1">AI Suggestion</h4>
            <p className="text-mindtrack-stone/80">{insights.suggestion}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MoodInsights;
