
import { Check, Trash2 } from "lucide-react";
import { ActivityItemProps } from "./types";

const ActivityItem = ({ 
  activity, 
  index, 
  onUpdate, 
  onRemove, 
  onToggleComplete 
}: ActivityItemProps) => {
  return (
    <div className="p-4 rounded-md border border-mindtrack-sage/20 space-y-4">
      <div className="flex justify-between items-start">
        <h4 className="font-medium text-mindtrack-stone">Activity {index + 1}</h4>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onToggleComplete(activity.id)}
            className={`p-1 rounded-full transition-colors ${
              activity.completed ? "bg-mindtrack-sage text-white" : "bg-mindtrack-sage/10 text-mindtrack-sage"
            }`}
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onRemove(activity.id)}
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
            onChange={(e) => onUpdate(activity.id, "name", e.target.value)}
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
              onChange={(e) => onUpdate(activity.id, "enjoyment", parseInt(e.target.value))}
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
            onChange={(e) => onUpdate(activity.id, "scheduled", e.target.value)}
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
                onChange={(e) => onUpdate(activity.id, "moodBefore", parseInt(e.target.value))}
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
                onChange={(e) => onUpdate(activity.id, "moodAfter", parseInt(e.target.value))}
                className="w-full h-2 bg-mindtrack-sage/20 rounded-lg appearance-none cursor-pointer"
              />
              <span className="w-8 text-center font-medium">{activity.moodAfter || 5}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityItem;
