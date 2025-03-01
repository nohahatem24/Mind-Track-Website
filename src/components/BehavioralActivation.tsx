
import { useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface Activity {
  id: number;
  name: string;
  enjoyment: number;
  scheduled: string;
  moodBefore?: number;
  moodAfter?: number;
  completed: boolean;
}

interface BehavioralActivationProps {
  onComplete: (data: Record<string, any>) => void;
  onCancel: () => void;
  initialData?: Record<string, any>;
  isEditing?: boolean;
}

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

  const [newActivity, setNewActivity] = useState({
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
          <div 
            key={activity.id}
            className="p-4 rounded-md border border-mindtrack-sage/20 space-y-4"
          >
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-mindtrack-stone">Activity {index + 1}</h4>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => toggleCompleted(activity.id)}
                  className={`p-1 rounded-full transition-colors ${
                    activity.completed ? "bg-mindtrack-sage text-white" : "bg-mindtrack-sage/10 text-mindtrack-sage"
                  }`}
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeActivity(activity.id)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-mindtrack-stone mb-1">
                  Activity Name
                </label>
                <input
                  type="text"
                  value={activity.name}
                  onChange={(e) => updateActivity(activity.id, "name", e.target.value)}
                  placeholder="e.g., 30 min walk, coffee with friend"
                  className="w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-mindtrack-stone mb-1">
                  Expected Enjoyment (1-10)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={activity.enjoyment}
                    onChange={(e) => updateActivity(activity.id, "enjoyment", parseInt(e.target.value))}
                    className="w-full h-2 bg-mindtrack-sage/20 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="w-8 text-center font-medium">{activity.enjoyment}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-mindtrack-stone mb-1">
                  When
                </label>
                <input
                  type="datetime-local"
                  value={activity.scheduled}
                  onChange={(e) => updateActivity(activity.id, "scheduled", e.target.value)}
                  className="w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20"
                  required
                />
              </div>
            </div>
            
            {activity.completed && (
              <div className="grid md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-mindtrack-sage/10">
                <div>
                  <label className="block text-sm font-medium text-mindtrack-stone mb-1">
                    Mood Before (1-10)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={activity.moodBefore || 5}
                      onChange={(e) => updateActivity(activity.id, "moodBefore", parseInt(e.target.value))}
                      className="w-full h-2 bg-mindtrack-sage/20 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="w-8 text-center font-medium">{activity.moodBefore || 5}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-mindtrack-stone mb-1">
                    Mood After (1-10)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={activity.moodAfter || 5}
                      onChange={(e) => updateActivity(activity.id, "moodAfter", parseInt(e.target.value))}
                      className="w-full h-2 bg-mindtrack-sage/20 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="w-8 text-center font-medium">{activity.moodAfter || 5}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 rounded-md border border-dashed border-mindtrack-sage/40 space-y-4">
        <h4 className="font-medium text-mindtrack-stone">Add New Activity</h4>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-mindtrack-stone mb-1">
              Activity Name
            </label>
            <input
              type="text"
              value={newActivity.name}
              onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
              placeholder="e.g., 30 min walk, coffee with friend"
              className="w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-mindtrack-stone mb-1">
              Expected Enjoyment (1-10)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="10"
                value={newActivity.enjoyment}
                onChange={(e) => setNewActivity({ ...newActivity, enjoyment: parseInt(e.target.value) })}
                className="w-full h-2 bg-mindtrack-sage/20 rounded-lg appearance-none cursor-pointer"
              />
              <span className="w-8 text-center font-medium">{newActivity.enjoyment}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-mindtrack-stone mb-1">
              When
            </label>
            <input
              type="datetime-local"
              value={newActivity.scheduled}
              onChange={(e) => setNewActivity({ ...newActivity, scheduled: e.target.value })}
              className="w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={addActivity}
            disabled={!newActivity.name.trim() || !newActivity.scheduled}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Add Activity
          </button>
        </div>
      </div>

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
