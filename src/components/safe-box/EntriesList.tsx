
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { SafeEntry, SafeCategory, DateRangeFilter } from "./types";
import EntryItem from "./EntryItem";
import { isDateInRange } from "./utils";

interface EntriesListProps {
  entries: SafeEntry[];
  categories: SafeCategory[];
  searchQuery: string;
  selectedCategory: string | null;
  dateRange: DateRangeFilter;
  onEdit: (entry: SafeEntry) => void;
  onDelete: (id: string) => void;
}

const EntriesList = ({ 
  entries, 
  categories, 
  searchQuery, 
  selectedCategory,
  dateRange,
  onEdit, 
  onDelete 
}: EntriesListProps) => {
  // Filter entries by category, search query, and date range
  const filteredEntries = entries.filter(entry => {
    const matchesCategory = selectedCategory ? entry.category === selectedCategory : true;
    const matchesSearch = searchQuery 
      ? entry.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        entry.content.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesDateRange = isDateInRange(entry.dateModified, dateRange.startDate, dateRange.endDate);
    
    return matchesCategory && matchesSearch && matchesDateRange;
  });

  // Get category color
  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.color || '#84cc16';
  };

  // Get category name
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Unknown';
  };

  if (filteredEntries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mindtrack-card flex items-center gap-3 text-mindtrack-stone/70"
      >
        <AlertCircle className="w-5 h-5" />
        {searchQuery || dateRange.startDate || dateRange.endDate ? (
          <p>No entries match your search criteria.</p>
        ) : selectedCategory ? (
          <p>No entries in this category yet. Add your first one!</p>
        ) : (
          <p>Your Digital Safe Box is empty. Start by adding your first entry.</p>
        )}
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredEntries.map(entry => (
        <EntryItem
          key={entry.id}
          entry={entry}
          categoryColor={getCategoryColor(entry.category)}
          categoryName={getCategoryName(entry.category)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default EntriesList;
