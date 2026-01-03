
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Activity, AlertCircle, TrendingUp } from 'lucide-react';
import { useCategoryManager } from '@/hooks/trigger-tracker/useCategoryManager';

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
  filteredTriggers?: Trigger[];
  reflectionsOnly?: boolean;
}

const TriggerCategoryAnalysis = ({ triggers, filteredTriggers = [], reflectionsOnly = false }: TriggerCategoryAnalysisProps) => {
  const { categories } = useCategoryManager();
  const dataToAnalyze = filteredTriggers.length > 0 ? filteredTriggers : triggers;

  // Category distribution
  const chartData = useMemo(() => {
    const counts: { [key: string]: number } = {};
    dataToAnalyze.forEach(trigger => {
      const cat = trigger.category || 'Uncategorized';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [dataToAnalyze]);

  // Coping strategy analysis
  const copingAnalysis = useMemo(() => {
    const strategies: { [key: string]: number } = {};
    const alternatives: { [key: string]: number } = {};

    dataToAnalyze.forEach(trigger => {
      if (trigger.coping) {
        strategies[trigger.coping] = (strategies[trigger.coping] || 0) + 1;
      }
      if (trigger.alternatives) {
        alternatives[trigger.alternatives] = (alternatives[trigger.alternatives] || 0) + 1;
      }
    });

    return {
      mostCommonCoping: Object.entries(strategies).sort((a, b) => b[1] - a[1])[0],
      mostCommonAlternative: Object.entries(alternatives).sort((a, b) => b[1] - a[1])[0],
      totalCopingStrategies: Object.keys(strategies).length,
      totalAlternatives: Object.keys(alternatives).length,
    };
  }, [dataToAnalyze]);

  // Generate gentle, reflective insights
  const insights = useMemo(() => {
    if (dataToAnalyze.length === 0) {
      return "Start logging entries to understand your emotional patterns over time.";
    }

    const insights_arr: string[] = [];

    if (chartData.length > 0) {
      const mostCommon = chartData.sort((a, b) => b.value - a.value)[0];
      insights_arr.push(`You've documented ${mostCommon.value} experience${mostCommon.value !== 1 ? 's' : ''} related to ${mostCommon.name}.`);
    }

    if (copingAnalysis.mostCommonCoping) {
      insights_arr.push(`"${copingAnalysis.mostCommonCoping[0]}" appears frequently in your current coping strategies.`);
    }

    if (copingAnalysis.totalAlternatives > 0) {
      insights_arr.push(`You've explored ${copingAnalysis.totalAlternatives} alternative coping approach${copingAnalysis.totalAlternatives !== 1 ? 'es' : ''}.`);
    }

    if (insights_arr.length === 0) {
      insights_arr.push("Patterns will become clearer as you log more entries.");
    }

    return insights_arr.join(" ");
  }, [chartData, copingAnalysis, dataToAnalyze.length]);

  const getCategoryColor = (categoryName: string): string => {
    const found = categories.find(c => c.name === categoryName);
    return found ? found.color : '#6b7280';
  };

  if (dataToAnalyze.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mindtrack-card flex items-center gap-3 text-mindtrack-stone/70 mb-8"
      >
        <AlertCircle className="w-5 h-5" />
        <p>No entries to analyze yet. Your patterns will appear as you track more experiences.</p>
      </motion.div>
    );
  }

  // If reflectionsOnly is true, just show the insights text
  if (reflectionsOnly) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-mindtrack-sage/5 rounded-lg border border-mindtrack-sage/10"
      >
        <p className="text-mindtrack-stone/80 text-sm leading-relaxed">{insights}</p>
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
        <TrendingUp className="w-5 h-5 text-mindtrack-sage" />
        Your Patterns
      </h3>

      {/* Gentle Insights */}
      <div className="mb-8 p-4 bg-mindtrack-sage/5 rounded-lg border border-mindtrack-sage/10">
        <p className="text-mindtrack-stone/80 text-sm leading-relaxed">{insights}</p>
      </div>

      {/* Analysis Grid */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Category Distribution */}
          <div>
            <h4 className="font-medium text-mindtrack-stone mb-4 text-sm">Categories</h4>
            {chartData.length <= 3 ? (
              <div className="space-y-3">
                {chartData.map(entry => (
                  <div key={entry.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getCategoryColor(entry.name) }}
                      />
                      <span className="text-sm text-mindtrack-stone">{entry.name}</span>
                    </div>
                    <span className="text-sm font-medium text-mindtrack-sage">{entry.value} entries</span>
                  </div>
                ))}
              </div>
            ) : (
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
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name)} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} entries`, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Coping Strategies Summary */}
          <div>
            <h4 className="font-medium text-mindtrack-stone mb-4 text-sm">Coping Strategies</h4>
            <div className="space-y-4">
              {copingAnalysis.mostCommonCoping && (
                <div>
                  <p className="text-xs text-mindtrack-stone/60 mb-1">Most frequently used</p>
                  <p className="text-sm text-mindtrack-stone font-medium">{copingAnalysis.mostCommonCoping[0]}</p>
                  <p className="text-xs text-mindtrack-stone/60 mt-1">{copingAnalysis.mostCommonCoping[1]} times</p>
                </div>
              )}
              {copingAnalysis.mostCommonAlternative && (
                <div className="pt-4 border-t border-mindtrack-sage/10">
                  <p className="text-xs text-mindtrack-stone/60 mb-1">Alternative most often explored</p>
                  <p className="text-sm text-mindtrack-stone font-medium">{copingAnalysis.mostCommonAlternative[0]}</p>
                  <p className="text-xs text-mindtrack-stone/60 mt-1">{copingAnalysis.mostCommonAlternative[1]} times</p>
                </div>
              )}
              {!copingAnalysis.mostCommonCoping && !copingAnalysis.mostCommonAlternative && (
                <p className="text-sm text-mindtrack-stone/60">Add entries with coping strategies to see patterns.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-mindtrack-sage/10">
        <div className="text-center">
          <p className="text-2xl font-semibold text-mindtrack-sage">{dataToAnalyze.length}</p>
          <p className="text-xs text-mindtrack-stone/60 mt-1">Total entries</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-mindtrack-sage">{chartData.length}</p>
          <p className="text-xs text-mindtrack-stone/60 mt-1">Categories</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-mindtrack-sage">{copingAnalysis.totalCopingStrategies}</p>
          <p className="text-xs text-mindtrack-stone/60 mt-1">Coping methods</p>
        </div>
      </div>
    </motion.div>
  );
};

export default TriggerCategoryAnalysis;
