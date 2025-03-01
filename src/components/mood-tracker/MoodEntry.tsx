
import { motion } from "framer-motion";
import { Heart, Pencil, Trash2 } from "lucide-react";
import { MoodEntry as MoodEntryType } from "./types";
import { getMoodCategory } from "./types";
import MoodForm from "./MoodForm";

interface MoodEntryProps {
  entry: MoodEntryType;
  editingId: number | null;
  onDelete: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  onEdit: (id: number) => void;
  onUpdate: (entry: MoodEntryType) => void;
  onCancelEdit: () => void;
  index: number;
}

const MoodEntryComponent = ({ 
  entry, 
  editingId, 
  onDelete, 
  onToggleFavorite, 
  onEdit, 
  onUpdate,
  onCancelEdit,
  index 
}: MoodEntryProps) => {
  return (
    <motion.div
      key={entry.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="mindtrack-card"
    >
      {editingId === entry.id ? (
        <MoodForm 
          onSubmit={onUpdate} 
          onCancel={onCancelEdit}
          initialData={entry}
        />
      ) : (
        <>
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm text-mindtrack-stone/60">
              {entry.timestamp}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onToggleFavorite(entry.id)}
                className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
              >
                <Heart 
                  className={`w-4 h-4 ${entry.isFavorite ? 'fill-mindtrack-sage text-mindtrack-sage' : 'text-mindtrack-sage'}`} 
                />
              </button>
              <button
                onClick={() => onEdit(entry.id)}
                className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
              >
                <Pencil className="w-4 h-4 text-mindtrack-sage" />
              </button>
              <button
                onClick={() => onDelete(entry.id)}
                className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div 
                className="p-4 rounded-lg" 
                style={{ 
                  backgroundColor: `${getMoodCategory(entry.mood).color}20`,
                  borderLeft: `4px solid ${getMoodCategory(entry.mood).color}` 
                }}
              >
                <h3 className="font-medium text-mindtrack-stone">
                  Mood: {entry.mood} - {getMoodCategory(entry.mood).label}
                </h3>
                <p className="mt-1 text-sm text-mindtrack-stone/80">
                  {getMoodCategory(entry.mood).description}
                </p>
              </div>
              {entry.note && (
                <div className="mt-4">
                  <h3 className="font-medium text-mindtrack-stone">Notes</h3>
                  <p className="mt-1 text-mindtrack-stone/80">{entry.note}</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default MoodEntryComponent;
