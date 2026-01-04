import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { Activity } from "./types";

interface PendingActivitiesCardProps {
  activities: Activity[];
  onToggleDone: (id: number) => void;
  onCompleteMoods: (id: number, moodBefore: number, moodAfter: number) => void;
}

const PendingActivitiesCard = ({
  activities,
  onToggleDone,
  onCompleteMoods
}: PendingActivitiesCardProps) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [moodStates, setMoodStates] = useState<Record<number, { before: number; after: number }>>({});

  if (activities.length === 0) {
    return null;
  }

  const pendingActivities = activities.filter(a => a.status === 'pending');
  const completedActivities = activities.filter(a => a.status === 'completed');

  const handleMoodChange = (id: number, field: 'before' | 'after', value: number) => {
    setMoodStates(prev => ({
      ...prev,
      [id]: {
        before: prev[id]?.before || 5,
        after: prev[id]?.after || 5,
        [field]: value
      }
    }));
  };

  const handleCompleteMood = (id: number) => {
    const moods = moodStates[id];
    if (moods) {
      onCompleteMoods(id, moods.before, moods.after);
      setMoodStates(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Pending Activities Section */}
      {pendingActivities.length > 0 && (
        <div className="p-4 rounded-lg bg-amber-50 border-2 border-amber-200">
          <h3 className="text-lg font-semibold text-amber-900 mb-3">📋 Pending Activities ({pendingActivities.length})</h3>
          <p className="text-sm text-amber-800 mb-4">Click the checkmark to mark as done and rate your mood.</p>

          <div className="space-y-2">
            {pendingActivities.map((activity) => {
              const isExpanded = expandedId === activity.id;
              const moods = moodStates[activity.id] || { before: 5, after: 5 };
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
                  key={activity.id}
                  layout
                  className="bg-white rounded-md border-2 border-amber-100 p-3 hover:border-amber-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-amber-900">{activity.name}</h4>
                      <div className="flex flex-wrap gap-3 mt-1 text-xs text-amber-800">
                        <span>📅 {formattedDate} at {formattedTime}</span>
                        <span>✨ Expected: {activity.enjoyment}/10</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleDone(activity.id)}
                      className="p-2 rounded-full bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors flex-shrink-0"
                      title="Mark as done"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Mood Rating Section - Toggle with chevron */}
                  <motion.button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : activity.id)}
                    className="mt-3 w-full flex items-center justify-center gap-2 text-xs text-amber-700 hover:text-amber-900 transition-colors"
                  >
                    <span className="font-medium">Rate mood before and after</span>
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </motion.button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pt-3 border-t border-amber-200 space-y-4"
                      >
                        <div>
                          <label className="block text-sm font-medium text-amber-900 mb-2">
                            Mood Before (1-10)
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="range"
                              min="1"
                              max="10"
                              value={moods.before}
                              onChange={(e) => handleMoodChange(activity.id, 'before', parseInt(e.target.value))}
                              className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                              aria-label="Mood before activity"
                              title="Mood before activity"
                            />
                            <div className="w-12 flex items-center justify-center">
                              <span className="text-2xl">
                                {moods.before <= 3 ? '😔' : moods.before <= 6 ? '😐' : moods.before <= 8 ? '🙂' : '😊'}
                              </span>
                            </div>
                            <span className="w-8 text-center font-bold text-amber-900">{moods.before}</span>
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
                              value={moods.after}
                              onChange={(e) => handleMoodChange(activity.id, 'after', parseInt(e.target.value))}
                              className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                              aria-label="Mood after activity"
                              title="Mood after activity"
                            />
                            <div className="w-12 flex items-center justify-center">
                              <span className="text-2xl">
                                {moods.after <= 3 ? '😔' : moods.after <= 6 ? '😐' : moods.after <= 8 ? '🙂' : '😊'}
                              </span>
                            </div>
                            <span className="w-8 text-center font-bold text-amber-900">{moods.after}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCompleteMood(activity.id)}
                          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium mt-2"
                        >
                          Complete Activity ✓
                        </button>

                        {moods.after > moods.before && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-3 rounded-md bg-green-100 border border-green-300 text-sm text-green-800"
                          >
                            ✨ Great! Your mood improved by {moods.after - moods.before} point{moods.after - moods.before !== 1 ? 's' : ''}!
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Activities Section */}
      {completedActivities.length > 0 && (
        <div className="p-4 rounded-lg bg-green-50 border-2 border-green-200">
          <h3 className="text-lg font-semibold text-green-900 mb-3">✓ Completed Activities ({completedActivities.length})</h3>

          <div className="space-y-2">
            {completedActivities.map((activity) => {
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

              const moodEmoji = (mood: number | undefined) => {
                if (!mood) return '😐';
                return mood <= 3 ? '😔' : mood <= 6 ? '😐' : mood <= 8 ? '🙂' : '😊';
              };

              const moodImprovement = (activity.moodAfter || 0) - (activity.moodBefore || 0);

              return (
                <div key={activity.id} className="bg-white rounded-md border-2 border-green-300 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-900">{activity.name}</h4>
                      <div className="flex flex-wrap gap-3 mt-1 text-xs text-green-800">
                        <span>📅 {formattedDate} at {formattedTime}</span>
                        <span>✨ Expected: {activity.enjoyment}/10</span>
                      </div>

                      {/* Mood display */}
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <div className="bg-amber-50 p-2 rounded text-center">
                          <p className="text-xs font-medium text-green-700 mb-1">Before</p>
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-xl">{moodEmoji(activity.moodBefore)}</span>
                            <span className="font-bold text-green-900">{activity.moodBefore}/10</span>
                          </div>
                        </div>
                        <div className="bg-green-50 p-2 rounded text-center">
                          <p className="text-xs font-medium text-green-700 mb-1">After</p>
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-xl">{moodEmoji(activity.moodAfter)}</span>
                            <span className="font-bold text-green-900">{activity.moodAfter}/10</span>
                          </div>
                        </div>
                      </div>

                      {moodImprovement > 0 && (
                        <div className="mt-2 text-xs text-green-700 font-medium">
                          ✨ Mood improved by {moodImprovement} point{moodImprovement !== 1 ? 's' : ''}!
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleDone(activity.id)}
                      className="p-2 rounded-full bg-green-200 text-green-700 hover:bg-green-300 transition-colors flex-shrink-0"
                      title="Mark as pending again"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PendingActivitiesCard;
