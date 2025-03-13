
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Activity, AlertCircle } from 'lucide-react';

interface Trigger {
  id: number;
  trigger?: string;
  thoughts?: string;
  coping?: string;
  alternatives?: string;
  timestamp: string;
  isFavorite?: boolean;
  category?: string;
}

interface TriggerCategoryAnalysisProps {
  triggers: Trigger[];
}

const TRIGGER_CATEGORIES = [
  { name: 'Work', color: '#3b82f6' },
  { name: 'Relationships', color: '#ec4899' },
  { name: 'Health', color: '#22c55e' },
  { name: 'Finances', color: '#f59e0b' },
  { name: 'Self-image', color: '#8b5cf6' },
  { name: 'Other', color: '#6b7280' },
];

const TriggerCategoryAnalysis = ({ triggers }: TriggerCategoryAnalysisProps) => {
  // Auto-categorize triggers based on keywords
  const categorizedTriggers = useMemo(() => {
    return triggers.map(trigger => {
      const triggerText = [trigger.trigger, trigger.thoughts].filter(Boolean).join(' ').toLowerCase();
      
      if (!triggerText) return { ...trigger, category: 'Other' };
      
      // Simple keyword matching for categories
      if (/\b(work|job|boss|colleague|meeting|deadline|project)\b/.test(triggerText)) {
        return { ...trigger, category: 'Work' };
      } else if (/\b(friend|partner|spouse|boyfriend|girlfriend|husband|wife|family|relationship|date)\b/.test(triggerText)) {
        return { ...trigger, category: 'Relationships' };
      } else if (/\b(health|sick|illness|pain|doctor|workout|exercise|diet|sleep)\b/.test(triggerText)) {
        return { ...trigger, category: 'Health' };
      } else if (/\b(money|finance|bill|debt|afford|expensive|budget|cost|pay)\b/.test(triggerText)) {
        return { ...trigger, category: 'Finances' };
      } else if (/\b(look|appearance|weight|fat|thin|ugly|attractive|body|self-esteem)\b/.test(triggerText)) {
        return { ...trigger, category: 'Self-image' };
      } else {
        return { ...trigger, category: 'Other' };
      }
    });
  }, [triggers]);

  // Prepare data for the pie chart
  const chartData = useMemo(() => {
    const categoryCounts: Record<string, number> = {};
    
    categorizedTriggers.forEach(trigger => {
      const category = trigger.category || 'Other';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    return Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));
  }, [categorizedTriggers]);

  // Get color for a category
  const getCategoryColor = (category: string) => {
    const found = TRIGGER_CATEGORIES.find(c => c.name === category);
    return found ? found.color : '#6b7280';
  };

  // Generate insights based on categories
  const categoryInsights = useMemo(() => {
    if (chartData.length === 0) return 'Start logging your triggers to get personalized insights.';
    
    const mostCommonCategory = chartData.sort((a, b) => b.value - a.value)[0];
    
    let insight = '';
    switch (mostCommonCategory.name) {
      case 'Work':
        insight = 'Work-related situations seem to be your most common trigger. Consider implementing stress management techniques during your workday.';
        break;
      case 'Relationships':
        insight = 'Relationship interactions frequently trigger emotional responses for you. Practicing communication skills and setting boundaries might help.';
        break;
      case 'Health':
        insight = 'Health concerns appear to be a significant trigger. Focusing on self-care routines and getting adequate rest could be beneficial.';
        break;
      case 'Finances':
        insight = 'Financial matters are often triggering for you. Creating a budget and financial plan might help reduce this source of stress.';
        break;
      case 'Self-image':
        insight = 'Self-image concerns seem to be a common trigger. Practicing self-compassion and challenging negative self-talk could be helpful.';
        break;
      default:
        insight = `Your triggers often fall into the "${mostCommonCategory.name}" category. Reviewing these entries might help you identify patterns.`;
    }
    
    return insight;
  }, [chartData]);

  if (triggers.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mindtrack-card flex items-center gap-3 text-mindtrack-stone/70"
      >
        <AlertCircle className="w-5 h-5" />
        <p>No trigger entries logged yet. Start tracking to see category analysis.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mindtrack-card mb-8"
    >
      <h3 className="text-xl font-semibold text-mindtrack-stone mb-6 flex items-center gap-2">
        <Activity className="w-5 h-5 text-mindtrack-sage" />
        Trigger Category Analysis
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name)} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} entries`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col justify-center">
          <h4 className="font-medium text-mindtrack-stone mb-2">AI Insight</h4>
          <p className="text-mindtrack-stone/80">{categoryInsights}</p>
          
          <div className="mt-4">
            <h5 className="font-medium text-sm text-mindtrack-stone mb-2">Common Coping Strategies</h5>
            <ul className="list-disc pl-5 text-sm text-mindtrack-stone/80">
              {categorizedTriggers
                .filter(t => t.coping)
                .slice(0, 3)
                .map((trigger, index) => (
                  <li key={index}>{trigger.coping}</li>
                ))}
              {categorizedTriggers.filter(t => t.coping).length === 0 && (
                <li className="text-mindtrack-stone/60">No coping strategies recorded yet</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TriggerCategoryAnalysis;
