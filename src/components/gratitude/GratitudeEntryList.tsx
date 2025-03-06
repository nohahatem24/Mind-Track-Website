
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import GratitudeEntryItem from "./GratitudeEntryItem";
import { GratitudeEntry } from "./types";

interface GratitudeEntryListProps {
  entries: GratitudeEntry[];
  onEdit: (entry: GratitudeEntry, newContent: string) => void;
  onDelete: (entryId: number) => void;
  onToggleFavorite: (entry: GratitudeEntry) => void;
}

const GratitudeEntryList = ({ 
  entries, 
  onEdit, 
  onDelete, 
  onToggleFavorite 
}: GratitudeEntryListProps) => {
  if (entries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mindtrack-card flex items-center gap-3 text-mindtrack-stone/70"
      >
        <AlertCircle className="w-5 h-5" />
        <p>No gratitude entries yet. Take a moment to reflect on what you're thankful for.</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry, index) => (
        <motion.div
          key={entry.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="mindtrack-card"
        >
          <GratitudeEntryItem
            entry={entry}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleFavorite={onToggleFavorite}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default GratitudeEntryList;
