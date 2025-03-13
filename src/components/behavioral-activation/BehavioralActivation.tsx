
import { useState } from "react";
import { motion } from "framer-motion";
import ActivityItem from "./ActivityItem";
import AddActivityForm from "./AddActivityForm";
import { Activity, BehavioralActivationProps, NewActivityState } from "./types";

const BehavioralActivation = ({ 
  onComplete, 
  onCancel,
  initialData,
  isEditing = false
}: BehavioralActivationProps) => {
  const [activities, setActivities] = useState<Activity[]>(
    initialData?.activities || [
      {
        id: 1,
        name: "",
        enjoyment: 5,
        scheduled: "",
        moodBefore: undefined,
        moodAfter: undefined,
        completed: false
      }
    ]
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
        completed: false
      }
    ]);
    
    setNewActivity({
      name: "",
      enjoyment: 5,
      scheduled: ""
    });
  };

  const updateActivity = (id: number, field: string, value: any) => {
    setActivities(activities.map(activity => {
      if (activity.id === id) {
        return { ...activity, [field]: value };
      }
      return activity;
    }));
  };

  const removeActivity = (id: number) => {
    setActivities(activities.filter(activity => activity.id !== id));
  };

  const toggleCompleted = (id: number) => {
    setActivities(activities.map(activity => {
      if (activity.id === id) {
        return { ...activity, completed: !activity.completed };
      }
      return activity;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      activities,
      date: new Date().toISOString()
    });
  };

  const isFormValid = () => {
    return activities.length > 0 && activities.every(activity => 
      activity.name.trim() !== "" && activity.scheduled !== ""
    );
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-mindtrack-stone">Planned Activities</h3>
        
        {activities.map((activity, index) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            index={index}
            onUpdate={updateActivity}
            onRemove={removeActivity}
            onToggleComplete={toggleCompleted}
          />
        ))}
      </div>

      <AddActivityForm
        newActivity={newActivity}
        setNewActivity={setNewActivity}
        onAdd={addActivity}
      />

      <div className="flex justify-end gap-3">
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
