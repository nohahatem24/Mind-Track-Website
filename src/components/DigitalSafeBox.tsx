import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  AlertCircle, 
  Check, 
  ChevronDown, 
  Edit, 
  FileLock2, 
  FolderLock, 
  Lock, 
  Plus, 
  Save, 
  Trash2, 
  Unlock, 
  X 
} from "lucide-react";
import { toast } from "sonner";

interface SafeEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  dateCreated: string;
  dateModified: string;
  isFavorite?: boolean;
}

interface SafeCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

const STORAGE_KEY = 'mindtrack_safebox';
const CATEGORIES_KEY = 'mindtrack_safebox_categories';
const PASSWORD_KEY = 'mindtrack_safebox_password';

const DigitalSafeBox = () => {
  const [entries, setEntries] = useState<SafeEntry[]>([]);
  const [categories, setCategories] = useState<SafeCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState('');
  const [savedPassword, setSavedPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSettingPassword, setIsSettingPassword] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // New entry form state
  const [newEntry, setNewEntry] = useState<Omit<SafeEntry, 'id' | 'dateCreated' | 'dateModified'>>({
    title: '',
    content: '',
    category: 'general',
  });

  // New category form state
  const [newCategory, setNewCategory] = useState<Omit<SafeCategory, 'id'>>({
    name: '',
    description: '',
    color: '#84cc16', // Default color (mindtrack-sage)
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
    const defaultCategories: SafeCategory[] = [
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

  // Filter entries by category and search query
  const filteredEntries = entries.filter(entry => {
    const matchesCategory = selectedCategory ? entry.category === selectedCategory : true;
    const matchesSearch = searchQuery 
      ? entry.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        entry.content.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  // Handle unlock attempt
  const handleUnlock = () => {
    if (password === savedPassword) {
      setIsLocked(false);
      setPassword('');
      setPasswordError('');
      toast.success('Safebox unlocked successfully');
    } else {
      setPasswordError('Incorrect password. Please try again.');
    }
  };

  // Handle setting new password
  const handleSetPassword = () => {
    if (password.length < 4) {
      setPasswordError('Password must be at least 4 characters long.');
      return;
    }
    
    localStorage.setItem(PASSWORD_KEY, password);
    setSavedPassword(password);
    setIsSettingPassword(false);
    setIsLocked(false);
    setPassword('');
    setPasswordError('');
    toast.success('Password created successfully');
  };

  // Handle password input change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError('');
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
    if (expandedId === id) setExpandedId(null);
    if (editingId === id) setEditingId(null);
  };

  // Handle adding a new category
  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return;
    
    const newId = `category_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const categoryToAdd: SafeCategory = {
      id: newId,
      name: newCategory.name,
      description: newCategory.description,
      color: newCategory.color,
    };
    
    setCategories([...categories, categoryToAdd]);
    setNewCategory({
      name: '',
      description: '',
      color: '#84cc16',
    });
    setIsAddingCategory(false);
  };

  // Start editing an entry
  const startEditing = (entry: SafeEntry) => {
    setNewEntry({
      title: entry.title,
      content: entry.content,
      category: entry.category,
    });
    setEditingId(entry.id);
    setExpandedId(entry.id);
  };

  // Toggle entry expansion
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Lock the safe box
  const lockSafeBox = () => {
    setIsLocked(true);
    toast.success('Safebox locked successfully');
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  // Render lock screen
  if (isLocked) {
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
            <h2 className="section-title">Digital Safe Box</h2>
            <p className="text-mindtrack-stone/80 max-w-2xl mb-6">
              A secure place to store your meaningful thoughts, memories, and notes.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mindtrack-card flex flex-col items-center justify-center py-10"
          >
            <Lock className="w-16 h-16 text-mindtrack-sage mb-6" />
            <h3 className="text-xl font-semibold text-mindtrack-stone mb-4">
              Your Digital Safe Box is Locked
            </h3>
            <p className="text-mindtrack-stone/80 mb-6 text-center max-w-md">
              Enter your password to access your secure notes and memories.
            </p>
            
            <div className="w-full max-w-xs space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter your password"
                  className="w-full p-3 border border-mindtrack-sage/30 rounded-md focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/50"
                  onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                />
                {passwordError && (
                  <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                )}
              </div>
              
              <button
                onClick={handleUnlock}
                className="w-full py-3 bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors"
              >
                Unlock Safe Box
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // Render password setup screen
  if (isSettingPassword) {
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
            <h2 className="section-title">Digital Safe Box</h2>
            <p className="text-mindtrack-stone/80 max-w-2xl mb-6">
              A secure place to store your meaningful thoughts, memories, and notes.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mindtrack-card flex flex-col items-center justify-center py-10"
          >
            <FolderLock className="w-16 h-16 text-mindtrack-sage mb-6" />
            <h3 className="text-xl font-semibold text-mindtrack-stone mb-4">
              Set Up Your Digital Safe Box
            </h3>
            <p className="text-mindtrack-stone/80 mb-6 text-center max-w-md">
              Create a password to protect your private notes and memories. 
              Make sure to remember it as it cannot be recovered.
            </p>
            
            <div className="w-full max-w-xs space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Create a password"
                  className="w-full p-3 border border-mindtrack-sage/30 rounded-md focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/50"
                  onKeyDown={(e) => e.key === 'Enter' && handleSetPassword()}
                />
                {passwordError && (
                  <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                )}
              </div>
              
              <button
                onClick={handleSetPassword}
                className="w-full py-3 bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors"
              >
                Create Safe Box
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

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
            <div className="mindtrack-card">
              <h3 className="text-lg font-medium text-mindtrack-stone mb-3">Categories</h3>
              
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-3 py-2 rounded-md ${!selectedCategory ? 'bg-mindtrack-sage text-white' : 'hover:bg-mindtrack-sage/5'}`}
                >
                  All Notes
                </button>
                
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2 ${
                      selectedCategory === category.id ? 'bg-mindtrack-sage text-white' : 'hover:bg-mindtrack-sage/5'
                    }`}
                  >
                    <span 
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: category.color }}
                    ></span>
                    {category.name}
                  </button>
                ))}
              </div>
              
              {!isAddingCategory ? (
                <button
                  onClick={() => setIsAddingCategory(true)}
                  className="mt-4 w-full flex items-center justify-center gap-2 text-mindtrack-sage hover:text-mindtrack-sage/80 py-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Category
                </button>
              ) : (
                <div className="mt-4 p-3 border border-mindtrack-sage/20 rounded-md">
                  <h4 className="text-sm font-medium text-mindtrack-stone mb-2">New Category</h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                      placeholder="Category name"
                      className="w-full p-2 text-sm border border-mindtrack-sage/30 rounded-md"
                    />
                    <input
                      type="text"
                      value={newCategory.description || ''}
                      onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                      placeholder="Description (optional)"
                      className="w-full p-2 text-sm border border-mindtrack-sage/30 rounded-md"
                    />
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={newCategory.color}
                        onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                        className="w-10 h-10 p-1 border border-mindtrack-sage/30 rounded-md"
                      />
                      <div className="flex-1">
                        <label className="text-xs text-mindtrack-stone/70">Color</label>
                        <input
                          type="text"
                          value={newCategory.color}
                          onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                          className="w-full p-2 text-sm border border-mindtrack-sage/30 rounded-md"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddCategory}
                        className="flex-1 py-2 bg-mindtrack-sage text-white text-sm rounded-md hover:bg-mindtrack-sage/90"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsAddingCategory(false)}
                        className="px-3 py-2 border border-mindtrack-sage/30 text-mindtrack-stone/70 text-sm rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Main content */}
          <div className="md:col-span-3 space-y-6">
            {/* Search and add new */}
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
              
              {!isAdding && (
                <button
                  onClick={() => setIsAdding(true)}
                  className="px-4 py-3 bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  New Entry
                </button>
              )}
            </div>
            
            {/* Add new entry form */}
            {isAdding && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mindtrack-card"
              >
                <h3 className="text-lg font-medium text-mindtrack-stone mb-4">Add New Entry</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-mindtrack-stone mb-1">Title</label>
                    <input
                      type="text"
                      value={newEntry.title}
                      onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                      placeholder="Give your entry a title"
                      className="w-full p-2 border border-mindtrack-sage/30 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-mindtrack-stone mb-1">Category</label>
                    <select
                      value={newEntry.category}
                      onChange={(e) => setNewEntry({...newEntry, category: e.target.value})}
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
                      value={newEntry.content}
                      onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                      placeholder="Write your thoughts here..."
                      className="w-full p-2 border border-mindtrack-sage/30 rounded-md min-h-[150px]"
                    ></textarea>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddEntry}
                      className="flex-1 py-2 bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Save className="w-4 h-4" />
                        Save Entry
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setIsAdding(false);
                        setNewEntry({
                          title: '',
                          content: '',
                          category: 'general',
                        });
                      }}
                      className="px-4 py-2 border border-mindtrack-sage/30 text-mindtrack-stone/70 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Edit entry form */}
            {editingId && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mindtrack-card"
              >
                <h3 className="text-lg font-medium text-mindtrack-stone mb-4">Edit Entry</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-mindtrack-stone mb-1">Title</label>
                    <input
                      type="text"
                      value={newEntry.title}
                      onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                      placeholder="Give your entry a title"
                      className="w-full p-2 border border-mindtrack-sage/30 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-mindtrack-stone mb-1">Category</label>
                    <select
                      value={newEntry.category}
                      onChange={(e) => setNewEntry({...newEntry, category: e.target.value})}
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
                      value={newEntry.content}
                      onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                      placeholder="Write your thoughts here..."
                      className="w-full p-2 border border-mindtrack-sage/30 rounded-md min-h-[150px]"
                    ></textarea>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleUpdateEntry(editingId)}
                      className="flex-1 py-2 bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Save className="w-4 h-4" />
                        Update Entry
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setNewEntry({
                          title: '',
                          content: '',
                          category: 'general',
                        });
                      }}
                      className="px-4 py-2 border border-mindtrack-sage/30 text-mindtrack-stone/70 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Entries list */}
            <div className="space-y-4">
              {filteredEntries.length > 0 ? (
                filteredEntries.map(entry => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mindtrack-card border-l-4`}
                    style={{ borderLeftColor: getCategoryColor(entry.category) }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <FileLock2 className="w-5 h-5 text-mindtrack-sage mt-1" />
                        <div>
                          <h3 className="font-medium text-mindtrack-stone">{entry.title}</h3>
                          <div className="text-xs text-mindtrack-stone/70 space-x-2">
                            <span>{formatDate(entry.dateModified)}</span>
                            <span className="px-2 py-0.5 rounded-full bg-mindtrack-sage/10" style={{ color: getCategoryColor(entry.category) }}>
                              {getCategoryName(entry.category)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <button
                          onClick={() => startEditing(entry)}
                          className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
                        >
                          <Edit className="w-4 h-4 text-mindtrack-sage" />
                        </button>
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="p-1 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                        <button
                          onClick={() => toggleExpand(entry.id)}
                          className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
                        >
                          <ChevronDown 
                            className={`w-4 h-4 text-mindtrack-sage transform transition-transform ${
                              expandedId === entry.id ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                    
                    {expandedId === entry.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-3 pt-3 border-t border-mindtrack-sage/10"
                      >
                        <p className="text-mindtrack-stone/80 whitespace-pre-wrap">{entry.content}</p>
                      </motion.div>
                    )}
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mindtrack-card flex items-center gap-3 text-mindtrack-stone/70"
                >
                  <AlertCircle className="w-5 h-5" />
                  {searchQuery ? (
                    <p>No entries match your search criteria.</p>
                  ) : selectedCategory ? (
                    <p>No entries in this category yet. Add your first one!</p>
                  ) : (
                    <p>Your Digital Safe Box is empty. Start by adding your first entry.</p>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DigitalSafeBox;
