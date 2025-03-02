
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Edit, FileLock2, Trash2 } from "lucide-react";
import { SafeEntry } from "./types";
import { formatDate } from "./utils";

interface EntryItemProps {
  entry: SafeEntry;
  categoryColor: string;
  categoryName: string;
  onEdit: (entry: SafeEntry) => void;
  onDelete: (id: string) => void;
}

const EntryItem = ({ 
  entry, 
  categoryColor, 
  categoryName, 
  onEdit, 
  onDelete 
}: EntryItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mindtrack-card border-l-4"
      style={{ borderLeftColor: categoryColor }}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <FileLock2 className="w-5 h-5 text-mindtrack-sage mt-1" />
          <div>
            <h3 className="font-medium text-mindtrack-stone">{entry.title}</h3>
            <div className="text-xs text-mindtrack-stone/70 space-x-2">
              <span>{formatDate(entry.dateModified)}</span>
              <span className="px-2 py-0.5 rounded-full bg-mindtrack-sage/10" style={{ color: categoryColor }}>
                {categoryName}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(entry)}
            className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
          >
            <Edit className="w-4 h-4 text-mindtrack-sage" />
          </button>
          <button
            onClick={() => onDelete(entry.id)}
            className="p-1 hover:bg-red-50 rounded-full transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
          >
            <ChevronDown 
              className={`w-4 h-4 text-mindtrack-sage transform transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 pt-3 border-t border-mindtrack-sage/10"
        >
          <p className="text-mindtrack-stone/80 whitespace-pre-wrap">{entry.content}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EntryItem;
