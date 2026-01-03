import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useMemo } from "react";
import { Trigger } from "./TriggerForm";
import { useCategoryManager } from "@/hooks/trigger-tracker/useCategoryManager";

interface CategoryChartProps {
  triggers: Trigger[];
  filteredTriggers: Trigger[];
}

const CategoryChart = ({ triggers, filteredTriggers }: CategoryChartProps) => {
  const { categories } = useCategoryManager();

  // Calculate category statistics
  const categoryStats = filteredTriggers.reduce((acc, trigger) => {
    const category = trigger.category || "Uncategorized";
    const existing = acc.find((item) => item.name === category);

    if (existing) {
      existing.value += 1;
      existing.withCoping += trigger.coping ? 1 : 0;
      existing.withAlternatives += trigger.alternatives ? 1 : 0;
    } else {
      acc.push({
        name: category,
        value: 1,
        withCoping: trigger.coping ? 1 : 0,
        withAlternatives: trigger.alternatives ? 1 : 0,
      });
    }

    return acc;
  }, [] as Array<{ name: string; value: number; withCoping: number; withAlternatives: number }>);

  // Sort by count (descending)
  const sortedStats = categoryStats.sort((a, b) => b.value - a.value);

  // Generate reflective insights
  const chartData = sortedStats;
  const copingAnalysis = useMemo(() => {
    const strategies: { [key: string]: number } = {};
    const alternatives: { [key: string]: number } = {};

    filteredTriggers.forEach((trigger) => {
      if (trigger.coping) {
        strategies[trigger.coping] = (strategies[trigger.coping] || 0) + 1;
      }
      if (trigger.alternatives) {
        alternatives[trigger.alternatives] =
          (alternatives[trigger.alternatives] || 0) + 1;
      }
    });

    return {
      mostCommonCoping: Object.entries(strategies).sort(
        (a, b) => b[1] - a[1]
      )[0],
      mostCommonAlternative: Object.entries(alternatives).sort(
        (a, b) => b[1] - a[1]
      )[0],
      totalCopingStrategies: Object.keys(strategies).length,
      totalAlternatives: Object.keys(alternatives).length,
    };
  }, [filteredTriggers]);

  const insights = useMemo(() => {
    const insights_arr: string[] = [];

    if (chartData.length > 0) {
      const mostCommon = chartData[0];
      insights_arr.push(
        `You've documented ${mostCommon.value} experience${
          mostCommon.value !== 1 ? "s" : ""
        } related to ${mostCommon.name}.`
      );
    }

    if (copingAnalysis.mostCommonCoping) {
      insights_arr.push(
        `"${copingAnalysis.mostCommonCoping[0]}" appears frequently in your current coping strategies.`
      );
    }

    if (copingAnalysis.totalAlternatives > 0) {
      insights_arr.push(
        `You've explored ${
          copingAnalysis.totalAlternatives
        } alternative coping approach${
          copingAnalysis.totalAlternatives !== 1 ? "es" : ""
        }.`
      );
    }

    return insights_arr.join(" ");
  }, [chartData, copingAnalysis]);

  // Generate unique colors for each category
  const generateUniqueColors = (count: number): string[] => {
    const baseColors = [
      "#3b82f6", // Blue
      "#ec4899", // Pink
      "#22c55e", // Green
      "#f59e0b", // Amber
      "#8b5cf6", // Purple
      "#06b6d4", // Cyan
      "#ef4444", // Red
      "#14b8a6", // Teal
      "#f97316", // Orange
      "#6366f1", // Indigo
      "#d946ef", // Fuchsia
      "#eab308", // Yellow
    ];

    if (count <= baseColors.length) {
      return baseColors.slice(0, count);
    }

    // Generate additional unique colors if needed
    const colors = [...baseColors];
    for (let i = baseColors.length; i < count; i++) {
      const hue = (i * 360) / count;
      const saturation = 70;
      const lightness = 50;
      colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
    return colors;
  };

  const uniqueColors = generateUniqueColors(sortedStats.length);

  // Map colors to category stats
  const statsWithColors = sortedStats.map((stat, index) => ({
    ...stat,
    color: uniqueColors[index],
  }));

  if (sortedStats.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mindtrack-card mb-8"
    >
      <h3 className="text-lg font-semibold text-mindtrack-stone mb-6">
        Category Breakdown
      </h3>

    {/* Insights */}
    <div className="mt-4 mb-4 p-4 rounded-lg bg-mindtrack-cream/50 border border-mindtrack-sage/10">
      <p className="text-xs font-medium text-mindtrack-stone/70 mb-3">
        Reflections
      </p>
      <ul className="space-y-2 text-xs text-mindtrack-stone/80">
        {statsWithColors.length > 0 && (
        <>
          <li>
            <span className="font-medium">Most frequent:</span>{" "}
            {statsWithColors[0].name} ({statsWithColors[0].value}{" "}
            {statsWithColors[0].value === 1 ? "entry" : "entries"})
          </li>
          {statsWithColors.some((s) => s.withCoping < s.value) && (
            <li>
            <span className="font-medium">Notice:</span> Some entries
            don't have coping strategies yet.
            </li>
          )}
          {statsWithColors.some((s) => s.withAlternatives === 0) && (
            <li>
            <span className="font-medium">Opportunity:</span>{" "}
            Exploring alternative strategies could help.
            </li>
          )}
        </>
        )}
      </ul>
    </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Donut Chart */}
        <div className="h-80 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statsWithColors}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {statsWithColors.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
                formatter={(value) =>
                  `${value} ${value === 1 ? "entry" : "entries"}`
                }
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Statistics */}
        <div className="space-y-4">
          <div className="space-y-3">
            {statsWithColors.map((stat) => {
              const percentage = (
                (stat.value / filteredTriggers.length) *
                100
              ).toFixed(0);
              const copingPercentage =
                stat.value > 0
                  ? ((stat.withCoping / stat.value) * 100).toFixed(0)
                  : "0";
              const alternativesPercentage =
                stat.value > 0
                  ? ((stat.withAlternatives / stat.value) * 100).toFixed(0)
                  : "0";

              return (
                <motion.div
                  key={stat.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 rounded-lg bg-mindtrack-sage/5 border border-mindtrack-sage/10"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: stat.color }}
                    />
                    <span className="font-medium text-mindtrack-stone text-sm">
                      {stat.name}
                    </span>
                    <span className="ml-auto text-xs font-semibold text-mindtrack-sage bg-mindtrack-sage/10 px-2 py-1 rounded">
                      {stat.value} {stat.value === 1 ? "entry" : "entries"} (
                      {percentage}%)
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-mindtrack-stone/70 ml-5">
                    <div>
                      <span className="block">With coping strategy:</span>
                      <span className="font-medium text-mindtrack-stone">
                        {copingPercentage}%
                      </span>
                    </div>
                    <div>
                      <span className="block">With alternative:</span>
                      <span className="font-medium text-mindtrack-stone">
                        {alternativesPercentage}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryChart;
