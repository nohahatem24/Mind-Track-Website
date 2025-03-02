import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Plus, Star } from "lucide-react";
import { toast } from "sonner";

import { 
  SafeEntry, 
  SafeCategory, 
  NewEntryFormData, 
  NewCategoryFormData,
  DateRangeFilter,
  STORAGE_KEY,
  CATEGORIES_KEY,
  PASSWORD_KEY
} from "./safe-box/types";
import { getDefaultCategories } from "./safe-box/utils";
import LockScreen from "./safe-box/LockScreen";
import PasswordSetupScreen from "./safe-box/PasswordSetupScreen";
import CategoriesSidebar from "./safe-box/CategoriesSidebar";
import EntryForm from "./safe-box/EntryForm";
import EntriesList from "./safe-box/EntriesList";
import DateRangeFilterComponent from "./safe-box/DateRangeFilter";

const DigitalSafeBox = () => {
  const [entries, setEntries] = useState<SafeEntry[]>([]);
  const [categories, setCategories] = useState<SafeCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(true);
  const [passwordError, setPasswordError] = useState('');
  const [isSettingPassword, setIsSettingPassword] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedPassword, setSavedPassword] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [dateRange, setDateRange] = useState<DateRangeFilter>({
    startDate: null,
    endDate: null
  });
  
  // New entry form state
  const [newEntry, setNewEntry] = useState<NewEntryFormData>({
    title: '',
    content: '',
    category: 'general',
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    // Check if password is set
    const storedPassword = localStorage.getItem(PASSWORD_KEY);
    if (storedPassword) {
      setSavedPassword(storedPassword);
      setIsLocked(true);
    } else {
      setIsLocked(false);
      setIsSettingPassword(true);
    }

    // Load categories
    const savedCategories = localStorage.getItem(CATEGORIES_KEY);
    if (savedCategories) {
      try {
        const parsedCategories = JSON.parse(savedCategories);
        setCategories(parsedCategories);
      } catch (e) {
        console.error("Error parsing saved categories:", e);
        // Create default category if parsing fails
        initializeDefaultCategory();
      }
    } else {
      // Create default category if none exist
      initializeDefaultCategory();
    }
  }, []);

  // Load entries when unlocked
  useEffect(() => {
    if (!isLocked) {
      loadEntries();
    }
  }, [isLocked]);

  // Initialize with a default category
  const initializeDefaultCategory = () => {
    const defaultCategories = getDefaultCategories();
    setCategories(defaultCategories);
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaultCategories));
  };

  // Load entries from localStorage
  const loadEntries = () => {
    const savedEntries = localStorage.getItem(STORAGE_KEY);
    if (savedEntries) {
      try {
        setEntries(JSON.parse(savedEntries));
      } catch (e) {
        console.error("Error parsing saved safe box entries:", e);
        setEntries([]);
      }
    }
  };

  // Save entries to localStorage
  useEffect(() => {
    if (!isLocked) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
  }, [entries, isLocked]);

  // Save categories to localStorage
  useEffect(() => {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  }, [categories]);

  // Handle unlock attempt
  const handleUnlock = (password: string) => {
    if (password === savedPassword) {
      setIsLocked(false);
      setPasswordError('');
      toast.success('Safebox unlocked successfully');
    } else {
      setPasswordError('Incorrect password. Please try again.');
    }
  };

  // Handle setting new password
  const handleSetPassword = (password: string) => {
    if (password.length < 4) {
      setPasswordError('Password must be at least 4 characters long.');
      return;
    }
    
    localStorage.setItem(PASSWORD_KEY, password);
    setSavedPassword(password);
    setIsSettingPassword(false);
    setIsLocked(false);
    setPasswordError('');
    toast.success('Password created successfully');
  };

  // Handle adding a new entry
  const handleAddEntry = () => {
    if (!newEntry.title.trim()) {
      return; // Don't add empty entries
    }
    
    const now = new Date().toISOString();
    const newId = `entry_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    const entryToAdd: SafeEntry = {
      id: newId,
      title: newEntry.title,
      content: newEntry.content,
      category: newEntry.category,
      dateCreated: now,
      dateModified: now,
    };
    
    setEntries([entryToAdd, ...entries]);
    setNewEntry({
      title: '',
      content: '',
      category: 'general',
    });
    setIsAdding(false);
  };

  // Handle updating an entry
  const handleUpdateEntry = (id: string) => {
    const entryToUpdate = entries.find(entry => entry.id === id);
    if (!entryToUpdate || !newEntry.title.trim()) return;
    
    const updatedEntries = entries.map(entry => 
      entry.id === id 
        ? {
            ...entry,
            title: newEntry.title,
            content: newEntry.content,
            category: newEntry.category,
            dateModified: new Date().toISOString()
          }
        : entry
    );
    
    setEntries(updatedEntries);
    setNewEntry({
      title: '',
      content: '',
      category: 'general',
    });
    setEditingId(null);
  };

  // Handle deleting an entry
  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
    if (editingId === id) setEditingId(null);
  };

  // Handle adding a new category
  const handleAddCategory = (categoryData: NewCategoryFormData) => {
    if (!categoryData.name.trim()) return;
    
    const newId = `category_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const categoryToAdd: SafeCategory = {
      id: newId,
      name: categoryData.name,
      description: categoryData.description,
      color: categoryData.color,
    };
    
    setCategories([...categories, categoryToAdd]);
  };

  // Start editing an entry
  const startEditing = (entry: SafeEntry) => {
    setNewEntry({
      title: entry.title,
      content: entry.content,
      category: entry.category,
    });
    setEditingId(entry.id);
  };

  // Lock the safe box
  const lockSafeBox = () => {
    setIsLocked(true);
    toast.success('Safebox locked successfully');
  };

  // Handle changing date range filter
  const handleDateRangeChange = (newDateRange: DateRangeFilter) => {
    setDateRange(newDateRange);
  };

  // Handle favorite toggling
  const handleToggleFavorite = (id: string) => {
    const updatedEntries = entries.map(entry => 
      entry.id === id 
        ? { ...entry, isFavorite: !entry.isFavorite }
        : entry
    );
    
    setEntries(updatedEntries);
    
    const entry = entries.find(e => e.id === id);
    if (entry) {
      toast.success(
        entry.isFavorite 
          ? `"${entry.title}" removed from favorites` 
          : `"${entry.title}" added to favorites`
      );
    }
  };

  // Render lock screen
  if (isLocked) {
    return <LockScreen onUnlock={handleUnlock} passwordError={passwordError} />;
  }

  // Render password setup screen
  if (isSettingPassword) {
    return <PasswordSetupScreen onSetPassword={handleSetPassword} passwordError={passwordError} />;
  }

  // Check if any filters are active
  const hasActiveFilters = !!searchQuery || !!selectedCategory || !!dateRange.startDate || !!dateRange.endDate;

  // Render main safe box UI
  return (
    <section id="safe-box" className="py-16">
      <div className="mindtrack-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <h2 className="section-title">Digital Safe Box</h2>
            <button
              onClick={lockSafeBox}
              className="flex items-center gap-2 px-4 py-2 border border-mindtrack-sage text-mindtrack-sage rounded-md hover:bg-mindtrack-sage/5"
            >
              <Lock className="w-4 h-4" />
              Lock Safe
            </button>
          </div>
          <p className="text-mindtrack-stone/80 max-w-2xl mb-6">
            A secure place to store your meaningful thoughts, memories, and notes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-4">
            <CategoriesSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onAddCategory={handleAddCategory}
            />
          </div>
          
          {/* Main content */}
          <div className="md:col-span-3 space-y-6">
            {/* Search and filters */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search notes..."
                    className="w-full p-3 pl-10 border border-mindtrack-sage/30 rounded-md focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/50"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3.5 text-mindtrack-stone/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                {!isAdding && !editingId && (
                  <button
                    onClick={() => setIsAdding(true)}
                    className="px-4 py-3 bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    New Entry
                  </button>
                )}
              </div>
              
              {/* Filters */}
              <div className="flex flex-wrap gap-2 items-center">
                <DateRangeFilterComponent 
                  dateRange={dateRange}
                  onDateRangeChange={handleDateRangeChange}
                />
                
                {/* Favorites filter */}
                <button
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors ${
                    showFavoritesOnly 
                      ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                      : 'bg-white border border-mindtrack-sage/30 text-mindtrack-stone/70 hover:bg-mindtrack-sage/5'
                  }`}
                >
                  <Star className={`w-4 h-4 ${showFavoritesOnly ? 'fill-amber-500 text-amber-500' : ''}`} />
                  Favorites
                </button>
                
                {/* Clear filters button */}
                {(hasActiveFilters || showFavoritesOnly) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory(null);
                      setDateRange({ startDate: null, endDate: null });
                      setShowFavoritesOnly(false);
                    }}
                    className="text-xs text-mindtrack-stone/60 hover:text-mindtrack-stone underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
            
            {/* Add/Edit Entry form */}
            {(isAdding || editingId) && (
              <EntryForm
                isEditing={!!editingId}
                entry={newEntry}
                onEntryChange={setNewEntry}
                onSave={() => editingId ? handleUpdateEntry(editingId) : handleAddEntry()}
                onCancel={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  setNewEntry({
                    title: '',
                    content: '',
                    category: 'general',
                  });
                }}
                categories={categories}
              />
            )}
            
            {/* Entries list */}
            <EntriesList
              entries={entries}
              categories={categories}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              dateRange={dateRange}
              showFavoritesOnly={showFavoritesOnly}
              onEdit={startEditing}
              onDelete={handleDeleteEntry}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DigitalSafeBox;
