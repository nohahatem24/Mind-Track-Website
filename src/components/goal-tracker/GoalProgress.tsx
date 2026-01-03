import React from "react";
import { motion } from "framer-motion";
import { Check, Target, Clock, Percent, AlertCircle } from "lucide-react";

interface GoalProgressProps {
  completedCount: number;
  inProgressCount: number;
  totalCount: number;
  averageProgress: number;
  pastDueCount?: number;
}

const GoalProgress = ({
  completedCount,
  inProgressCount,
  totalCount,
  averageProgress,
  pastDueCount = 0,
}: GoalProgressProps) => {
  const safeAverageProgress = isNaN(averageProgress)
    ? 0
    : Math.round(averageProgress);
  const notStartedCount = totalCount - completedCount - inProgressCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mindtrack-card mb-8"
    >
      <h3 className="text-xl font-semibold text-mindtrack-stone mb-6 flex items-center gap-2">
        <Target className="w-5 h-5 text-mindtrack-sage" />
        Goal Progress Overview
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="p-4 bg-mindtrack-sage/5 rounded-lg">
          <div className="text-sm text-mindtrack-stone/70 mb-1">
            Total Goals
          </div>
          <div className="text-2xl font-bold text-mindtrack-stone flex items-center gap-2">
            {totalCount}
            <Target className="w-5 h-5 text-mindtrack-sage" />
          </div>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <div className="text-sm text-mindtrack-stone/70 mb-1">Completed</div>
          <div className="text-2xl font-bold text-green-600 flex items-center gap-2">
            {completedCount}
            <Check className="w-5 h-5 text-green-600" />
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="text-sm text-mindtrack-stone/70 mb-1">
            In Progress
          </div>
          <div className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            {inProgressCount}
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
        </div>

        <div
          className={`p-4 rounded-lg ${
            pastDueCount > 0
              ? "bg-amber-50 border border-amber-200"
              : "bg-gray-50 border border-gray-200"
          }`}
        >
          <div className="text-sm text-mindtrack-stone/70 mb-1">
            Deadline Passed
          </div>
          <div
            className={`text-2xl font-bold flex items-center gap-2 ${
              pastDueCount > 0 ? "text-amber-700" : "text-gray-500"
            }`}
          >
            {pastDueCount}
            <AlertCircle
              className={`w-5 h-5 ${
                pastDueCount > 0 ? "text-amber-600" : "text-gray-400"
              }`}
            />
          </div>
        </div>

        <div className="p-4 bg-mindtrack-sage/5 rounded-lg">
          <div className="text-sm text-mindtrack-stone/70 mb-1">
            Average Progress
          </div>
          <div className="text-2xl font-bold text-mindtrack-stone flex items-center gap-2">
            {safeAverageProgress}%
            <Percent className="w-5 h-5 text-mindtrack-sage" />
          </div>
        </div>
      </div>

      {totalCount > 0 && (
        <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${safeAverageProgress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute top-0 left-0 h-full bg-mindtrack-sage"
          />
        </div>
      )}
    </motion.div>
  );
};

export default GoalProgress;
