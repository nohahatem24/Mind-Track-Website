
import { useState } from "react";
import { motion } from "framer-motion";
import AddActivityForm from "./AddActivityForm";
import PendingActivityItem from "./PendingActivityItem";
import CompletedActivityItem from "./CompletedActivityItem";
import { Activity, BehavioralActivationProps, BehavioralActivationData, NewActivityState } from "./types";

const BehavioralActivation = ({ 
  onComplete, 
  onCancel,
  initialData,
  isEditing = false
}: BehavioralActivationProps) => {
  const [activities, setActivities] = useState<Activity[]>(
    initialData?.activities || []
  );

  const [newActivity, setNewActivity] = useState<NewActivityState>({
    name: "",
    enjoyment: 5,
    scheduled: ""
  });

  const addActivity = () => {
    if (!newActivity.name.trim() || !newActivity.scheduled) return;
    
    setActivities([
      ...activities,
      {
        id: Date.now(),
        name: newActivity.name,
        enjoyment: newActivity.enjoyment,
        scheduled: newActivity.scheduled,
        status: 'pending'
      }
    ]);
    
    setNewActivity({
      name: "",
      enjoyment: 5,
      scheduled: ""
    });
  };

  const removeActivity = (id: number) => {
    setActivities(activities.filter(activity => activity.id !== id));
  };

  const markActivityDone = (id: number) => {
    setActivities(activities.map(activity => {
      if (activity.id === id) {
        return { ...activity, status: 'completing' };
      }
      return activity;
    }));
  };

  const completeActivityWithMoods = (id: number, moodBefore: number, moodAfter: number) => {
    setActivities(activities.map(activity => {
      if (activity.id === id) {
        return { 
          ...activity, 
          status: 'completed',
          moodBefore,
          moodAfter
        };
      }
      return activity;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: BehavioralActivationData = {
      activities,
      date: new Date().toISOString()
    };
    onComplete(data);
  };

  const pendingActivities = activities.filter(a => a.status === 'pending' || a.status === 'completing');
  const completedActivities = activities.filter(a => a.status === 'completed');

  const isFormValid = () => {
    return activities.length > 0 && completedActivities.length > 0;
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
      onSubmit={handleSubmit}
    >
      {/* Add New Activity Form */}
      <AddActivityForm
        newActivity={newActivity}
        setNewActivity={setNewActivity}
        onAdd={addActivity}
      />

      {/* Pending/To-Do Activities Section */}
      {pendingActivities.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 p-4 rounded-lg bg-amber-50 border-2 border-amber-200"
        >
          <h3 className="text-lg font-semibold text-amber-900">To-Do Activities</h3>
          <p className="text-sm text-amber-800">Complete these planned activities and rate your mood before and after.</p>
          
          <div className="space-y-3">
            {pendingActivities.map((activity) => (
              <PendingActivityItem
                key={activity.id}
                activity={activity}
                onMarkDone={markActivityDone}
                onRemove={removeActivity}
                onCompleteMoods={completeActivityWithMoods}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Completed Activities Section */}
      {completedActivities.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 p-4 rounded-lg bg-green-50 border-2 border-green-200"
        >
          <h3 className="text-lg font-semibold text-green-900">✓ Completed Activities</h3>
          <p className="text-sm text-green-800">Activities you have finished with mood ratings.</p>
          
          <div className="space-y-3">
            {completedActivities.map((activity, index) => (
              <CompletedActivityItem
                key={activity.id}
                activity={activity}
                index={index}
                onRemove={removeActivity}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Submit Section */}
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
          className="px-4 py-2 bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors disabled:opacity-50"
          disabled={!isFormValid()}
        >
          {isEditing ? "Save Changes" : "Complete Exercise"}
        </button>
      </div>
    </motion.form>
  );
};

export default BehavioralActivation;
