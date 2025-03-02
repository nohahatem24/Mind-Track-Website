
import { Plus } from "lucide-react";
import { useState } from "react";
import { SafeCategory, NewCategoryFormData } from "./types";

interface CategoriesSidebarProps {
  categories: SafeCategory[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onAddCategory: (category: NewCategoryFormData) => void;
}

const CategoriesSidebar = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory, 
  onAddCategory 
}: CategoriesSidebarProps) => {
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState<NewCategoryFormData>({
    name: '',
    description: '',
    color: '#84cc16', // Default color (mindtrack-sage)
  });

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return;
    
    onAddCategory(newCategory);
    setNewCategory({
      name: '',
      description: '',
      color: '#84cc16',
    });
    setIsAddingCategory(false);
  };

  return (
    <div className="mindtrack-card">
      <h3 className="text-lg font-medium text-mindtrack-stone mb-3">Categories</h3>
      
      <div className="space-y-2">
        <button
          onClick={() => onSelectCategory(null)}
          className={`w-full text-left px-3 py-2 rounded-md ${!selectedCategory ? 'bg-mindtrack-sage text-white' : 'hover:bg-mindtrack-sage/5'}`}
        >
          All Notes
        </button>
        
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
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
  );
};

export default CategoriesSidebar;
