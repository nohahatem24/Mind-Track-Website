import { useState, useEffect, useCallback } from 'react';

export interface UserCategory {
  id: string;
  name: string;
  color: string;
  keywords: string[];
  createdAt: string;
}

const DEFAULT_CATEGORIES: UserCategory[] = [
  {
    id: 'work',
    name: 'Work',
    color: '#3b82f6',
    keywords: ['work', 'job', 'boss', 'deadline'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'relationships',
    name: 'Relationships',
    color: '#ec4899',
    keywords: ['friend', 'partner', 'family'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'health',
    name: 'Health',
    color: '#22c55e',
    keywords: ['health', 'sick', 'exercise'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'finances',
    name: 'Finances',
    color: '#f59e0b',
    keywords: ['money', 'bill', 'debt'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'self-image',
    name: 'Self-image',
    color: '#8b5cf6',
    keywords: ['appearance', 'self-esteem'],
    createdAt: new Date().toISOString(),
  },
];

const STORAGE_KEY = 'mindtrack_trigger_categories';

export const useCategoryManager = () => {
  const [categories, setCategories] = useState<UserCategory[]>(DEFAULT_CATEGORIES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load categories from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setCategories(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading categories:', e);
        setCategories(DEFAULT_CATEGORIES);
      }
    } else {
      setCategories(DEFAULT_CATEGORIES);
    }
    setIsLoaded(true);
  }, []);

  // Save categories to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    }
  }, [categories, isLoaded]);

  const addCategory = useCallback((name: string, color: string, keywords: string[] = []) => {
    const newCategory: UserCategory = {
      id: `custom-${Date.now()}`,
      name,
      color,
      keywords,
      createdAt: new Date().toISOString(),
    };
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  }, []);

  const updateCategory = useCallback((id: string, updates: Partial<UserCategory>) => {
    setCategories(prev =>
      prev.map(cat => (cat.id === id ? { ...cat, ...updates } : cat))
    );
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
  }, []);

  const renameCategory = useCallback((id: string, newName: string) => {
    updateCategory(id, { name: newName });
  }, [updateCategory]);

  const mergeCategories = useCallback((sourceId: string, targetId: string) => {
    setCategories(prev => {
      const source = prev.find(c => c.id === sourceId);
      const target = prev.find(c => c.id === targetId);
      
      if (!source || !target) return prev;

      // Merge keywords and remove source category
      const mergedKeywords = Array.from(new Set([...source.keywords, ...target.keywords]));
      
      return prev
        .filter(c => c.id !== sourceId)
        .map(c => (c.id === targetId ? { ...c, keywords: mergedKeywords } : c));
    });
  }, []);

  const getCategoryColor = useCallback((categoryName: string): string => {
    const category = categories.find(c => c.name === categoryName);
    return category?.color || '#6b7280';
  }, [categories]);

  const getCategoryById = useCallback((id: string): UserCategory | undefined => {
    return categories.find(c => c.id === id);
  }, [categories]);

  const getCategoryByName = useCallback((name: string): UserCategory | undefined => {
    return categories.find(c => c.name === name);
  }, [categories]);

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    renameCategory,
    mergeCategories,
    getCategoryColor,
    getCategoryById,
    getCategoryByName,
    isLoaded,
  };
};
