import { useState } from "react";
import { motion } from "framer-motion";
import AddActivityForm from "./AddActivityForm";
import PendingActivityItem from "./PendingActivityItem";
import { Activity, BehavioralActivationProps, BehavioralActivationData, NewActivityState } from "./types";

const BehavioralActivation = ({ 
  onComplete, 
  onCancel,
  initialData,
  isEditing = false
}: BehavioralActivationProps) => {
  // Load activities from initialData or start empty
  const [activities, setActivities] = useState<Activity[]>(
    initialData?.activities || []
  );

  const [newActivity, setNewActivity] = useState<NewActivityState>({
    name: "",
    enjoyment: 5,
    scheduled: ""
  });

  // Add activity and save immediately (no submit required)
  const addActivity = () => {
    if (!newActivity.name.trim() || !newActivity.scheduled) return;
    
    const newActivityItem: Activity = {
      id: Date.now(),
      name: newActivity.name,
      enjoyment: newActivity.enjoyment,
      scheduled: newActivity.scheduled,
      status: 'pending'
    };

    setActivities([...activities, newActivityItem]);
    
    // Clear form for next entry
    setNewActivity({
      name: "",
      enjoyment: 5,
      scheduled: ""
    });
  };

  // Toggle activity between pending/completed
  const toggleActivityStatus = (id: number) => {
    setActivities(activities.map(activity => {
      if (activity.id === id) {
        const newStatus = activity.status === 'pending' ? 'completed' : 'pending';
        return { 
          ...activity, 
          status: newStatus,
          // If unchecking, preserve mood data so user doesn't lose it
          // If checking, mood fields will appear for editing
          moodBefore: activity.moodBefore,
          moodAfter: activity.moodAfter
        };
      }
      return activity;
    }));
  };

  // Update mood ratings for a completed activity
  const updateActivityMood = (id: number, moodBefore: number, moodAfter: number) => {
    setActivities(activities.map(activity => {
      if (activity.id === id) {
        return { 
          ...activity, 
          moodBefore,
          moodAfter
        };
      }
      return activity;
    }));
  };

  // Delete activity
  const deleteActivity = (id: number) => {
    setActivities(activities.filter(activity => activity.id !== id));
  };

  // Calculate exercise status
  const pendingCount = activities.filter(a => a.status === 'pending').length;
  const completedCount = activities.filter(a => a.status === 'completed').length;
  const isExerciseComplete = activities.length > 0 && pendingCount === 0 && completedCount > 0;

  // Handle final save to history
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: BehavioralActivationData = {
      activities: activities,
      date: new Date().toISOString()
    };
    onComplete(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Planned Activities Section - Always Visible, Clear Status */}
      {activities.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border-2 transition-colors ${
            isExerciseComplete
              ? 'bg-mindtrack-cream/50 border-mindtrack-sage'
              : 'bg-amber-50 border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className={`text-lg font-semibold ${
              isExerciseComplete 
                ? 'text-mindtrack-sage' 
                : 'text-amber-900'
            }`}>
              {isExerciseComplete 
                ? '✓ Activities Complete' 
                : `📋 Planned Activities (${pendingCount} pending)`
              }
            </h3>
          </div>

          {!isExerciseComplete && (
            <p className="text-sm text-amber-800 mb-4">
              Check activities as you complete them. Rate your mood after each one.
            </p>
          )}

          <div className="space-y-2">
            {activities.map((activity) => (
              <PendingActivityItem
                key={activity.id}
                activity={activity}
                onMarkDone={toggleActivityStatus}
                onCompleteMoods={updateActivityMood}
                onRemove={deleteActivity}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Planning Form - Add New Activities */}
      <motion.form
        className="mindtrack-card space-y-6"
        onSubmit={handleSubmit}
      >
        <div>
          <h3 className="text-lg font-semibold text-mindtrack-stone mb-2">Plan New Activities</h3>
          <p className="text-sm text-mindtrack-stone/70">
            Add activities you want to do. Each activity appears immediately in the list above.
          </p>
        </div>

        {/* Add Activity Form */}
        <AddActivityForm
          newActivity={newActivity}
          setNewActivity={setNewActivity}
          onAdd={addActivity}
        />

        {/* Submit to History */}
        <div className="flex justify-end gap-3 pt-4 border-t border-mindtrack-sage/10">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-mindtrack-stone hover:bg-mindtrack-sage/5 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={activities.length === 0}
            className="px-4 py-2 bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors disabled:opacity-50"
          >
            {isEditing ? "Save Changes" : "Save Exercise"}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default BehavioralActivation;
