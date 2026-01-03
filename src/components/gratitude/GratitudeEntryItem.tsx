
import { Heart, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { GratitudeEntry } from "./types";

interface GratitudeEntryItemProps {
  entry: GratitudeEntry;
  onEdit: (entry: GratitudeEntry, newContent: string) => void;
  onDelete: (entryId: number) => void;
  onToggleFavorite: (entry: GratitudeEntry) => void;
}

const GratitudeEntryItem = ({ 
  entry, 
  onEdit, 
  onDelete, 
  onToggleFavorite 
}: GratitudeEntryItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(entry.content);

  const handleSaveEdit = () => {
    if (!editContent.trim()) return;
    onEdit(entry, editContent);
    setIsEditing(false);
  };

  const startEditing = () => {
    setEditContent(entry.content);
    setIsEditing(true);
  };

  return (
    <div className="flex items-start gap-3">
      <Heart className="w-5 h-5 text-mindtrack-sage flex-shrink-0 mt-1" />
      <div className="flex-1">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Edit your gratitude entry..."
              aria-label="Edit gratitude entry"
              className="w-full p-3 min-h-[100px] rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20 resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-mindtrack-stone hover:bg-mindtrack-sage/5 rounded-md transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1.5 bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors text-sm"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start">
              <p className="text-mindtrack-stone">{entry.content}</p>
              <div className="flex gap-2 ml-2">
                <button
                  onClick={() => onToggleFavorite(entry)}
                  className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
                  aria-label={entry.isFavorite ? "Remove from favorites" : "Add to favorites"}
                  title={entry.isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart 
                    className={`w-4 h-4 ${entry.isFavorite ? 'fill-mindtrack-sage text-mindtrack-sage' : 'text-mindtrack-sage'}`} 
                  />
                </button>
                <button
                  onClick={startEditing}
                  className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
                  aria-label="Edit this entry"
                  title="Edit this entry"
                >
                  <Pencil className="w-4 h-4 text-mindtrack-sage" />
                </button>
                <button
                  onClick={() => onDelete(entry.id)}
                  className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
                  aria-label="Delete this entry"
                  title="Delete this entry"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
            <p className="mt-2 text-sm text-mindtrack-stone/60">
              {entry.date} at {entry.time}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default GratitudeEntryItem;
