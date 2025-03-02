
import { Save } from "lucide-react";
import { motion } from "framer-motion";
import { SafeCategory, NewEntryFormData } from "./types";

interface EntryFormProps {
  isEditing: boolean;
  entry: NewEntryFormData;
  onEntryChange: (entry: NewEntryFormData) => void;
  onSave: () => void;
  onCancel: () => void;
  categories: SafeCategory[];
}

const EntryForm = ({ 
  isEditing, 
  entry, 
  onEntryChange, 
  onSave, 
  onCancel, 
  categories 
}: EntryFormProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mindtrack-card"
    >
      <h3 className="text-lg font-medium text-mindtrack-stone mb-4">
        {isEditing ? "Edit Entry" : "Add New Entry"}
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-mindtrack-stone mb-1">Title</label>
          <input
            type="text"
            value={entry.title}
            onChange={(e) => onEntryChange({...entry, title: e.target.value})}
            placeholder="Give your entry a title"
            className="w-full p-2 border border-mindtrack-sage/30 rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-mindtrack-stone mb-1">Category</label>
          <select
            value={entry.category}
            onChange={(e) => onEntryChange({...entry, category: e.target.value})}
            className="w-full p-2 border border-mindtrack-sage/30 rounded-md"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-mindtrack-stone mb-1">Content</label>
          <textarea
            value={entry.content}
            onChange={(e) => onEntryChange({...entry, content: e.target.value})}
            placeholder="Write your thoughts here..."
            className="w-full p-2 border border-mindtrack-sage/30 rounded-md min-h-[150px]"
          ></textarea>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onSave}
            className="flex-1 py-2 bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90"
          >
            <div className="flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />
              {isEditing ? "Update Entry" : "Save Entry"}
            </div>
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-mindtrack-sage/30 text-mindtrack-stone/70 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EntryForm;
