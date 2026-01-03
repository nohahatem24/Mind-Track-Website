
import { Plus } from "lucide-react";
import { AddActivityFormProps } from "./types";

const AddActivityForm = ({ 
  newActivity, 
  setNewActivity, 
  onAdd 
}: AddActivityFormProps) => {
  return (
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
              aria-label="Expected enjoyment level"
              title="Expected enjoyment level"
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
            aria-label="Scheduled date and time"
            title="Scheduled date and time"
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onAdd}
          disabled={!newActivity.name.trim() || !newActivity.scheduled}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Add Activity
        </button>
      </div>
    </div>
  );
};

export default AddActivityForm;
