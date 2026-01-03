import { useState } from "react";
import { Check, Trash2, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { PendingActivityItemProps } from "./types";

const PendingActivityItem = ({ 
  activity, 
  onMarkDone, 
  onRemove,
  onCompleteMoods
}: PendingActivityItemProps) => {
  const [moodBefore, setMoodBefore] = useState(5);
  const [moodAfter, setMoodAfter] = useState(5);

  const handleCompleteMoods = () => {
    onCompleteMoods(activity.id, moodBefore, moodAfter);
  };

  const isCompletingState = activity.status === 'completing';
  const scheduledDate = new Date(activity.scheduled);
  const formattedTime = scheduledDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
  const formattedDate = scheduledDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-4 rounded-lg border-2 transition-all ${
        isCompletingState
          ? 'border-amber-300 bg-white'
          : 'border-amber-100 bg-amber-50/50 hover:bg-amber-50'
      }`}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h4 className="font-semibold text-amber-900 text-lg">{activity.name}</h4>
          <div className="flex flex-wrap gap-4 mt-2 text-sm">
            <div className="flex items-center gap-1 text-amber-800">
              <span className="font-medium">📅</span>
              <span>{formattedDate} at {formattedTime}</span>
            </div>
            <div className="flex items-center gap-1 text-amber-800">
              <span className="font-medium">✨ Expected enjoyment:</span>
              <span className="font-semibold">{activity.enjoyment}/10</span>
            </div>
          </div>
        </div>

        {!isCompletingState && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onMarkDone(activity.id)}
              className="p-2 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
              title="Mark as done"
            >
              <Check className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => onRemove(activity.id)}
              className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
              title="Delete activity"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Mood Rating Section - Appears when "Done" is clicked */}
      {isCompletingState && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 pt-4 border-t-2 border-amber-200 space-y-4"
        >
          <p className="text-sm font-medium text-amber-900">
            How was your mood before and after this activity?
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Mood Before (1-10)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={moodBefore}
                  onChange={(e) => setMoodBefore(parseInt(e.target.value))}
                  className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  aria-label="Mood before activity"
                  title="Mood before activity"
                />
                <div className="w-12 flex items-center justify-center">
                  <span className="text-2xl">
                    {moodBefore <= 3 ? '😔' : moodBefore <= 6 ? '😐' : moodBefore <= 8 ? '🙂' : '😊'}
                  </span>
                </div>
                <span className="w-8 text-center font-bold text-amber-900">{moodBefore}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Mood After (1-10)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={moodAfter}
                  onChange={(e) => setMoodAfter(parseInt(e.target.value))}
                  className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  aria-label="Mood after activity"
                  title="Mood after activity"
                />
                <div className="w-12 flex items-center justify-center">
                  <span className="text-2xl">
                    {moodAfter <= 3 ? '😔' : moodAfter <= 6 ? '😐' : moodAfter <= 8 ? '🙂' : '😊'}
                  </span>
                </div>
                <span className="w-8 text-center font-bold text-amber-900">{moodAfter}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleCompleteMoods}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Complete Activity
            </button>
          </div>

          {moodAfter > moodBefore && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 rounded-md bg-green-100 border border-green-300 text-sm text-green-800"
            >
              ✨ Great! Your mood improved by {moodAfter - moodBefore} points!
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default PendingActivityItem;
