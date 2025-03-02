
import { SafeCategory } from "./types";

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Initialize with default categories
export const getDefaultCategories = (): SafeCategory[] => {
  return [
    {
      id: 'general',
      name: 'General',
      description: 'Default category for all entries',
      color: '#84cc16', // mindtrack-sage
    },
    {
      id: 'memories',
      name: 'Memories',
      description: 'Special moments to remember',
      color: '#f97316', // Orange
    },
    {
      id: 'future',
      name: 'Future Self',
      description: 'Notes for your future self',
      color: '#3b82f6', // Blue
    }
  ];
};
