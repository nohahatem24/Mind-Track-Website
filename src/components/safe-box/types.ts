
export interface SafeEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  dateCreated: string;
  dateModified: string;
  isFavorite?: boolean;
}

export interface SafeCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

export interface NewEntryFormData {
  title: string;
  content: string;
  category: string;
}

export interface NewCategoryFormData {
  name: string;
  description: string;
  color: string;
}

// Storage keys for localStorage
export const STORAGE_KEY = 'mindtrack_safebox';
export const CATEGORIES_KEY = 'mindtrack_safebox_categories';
export const PASSWORD_KEY = 'mindtrack_safebox_password';
