import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Plus } from "lucide-react";
import { useState, useMemo } from "react";
import { useKeywordExtraction } from "@/hooks/trigger-tracker/useKeywordExtraction";
import { useCategoryManager } from "@/hooks/trigger-tracker/useCategoryManager";

interface TriggerFormProps {
  onSubmit: (trigger: Trigger) => void;
  onCancel: () => void;
  initialData?: Trigger;
}

export interface Trigger {
  id: number;
  trigger?: string;
  thoughts?: string;
  coping?: string;
  alternatives?: string;
  category?: string;
  timestamp: string;
  isFavorite?: boolean;
}

const TriggerForm = ({ 
  onSubmit, 
  onCancel,
  initialData
}: TriggerFormProps) => {
  const [formData, setFormData] = useState({
    trigger: initialData?.trigger || "",
    thoughts: initialData?.thoughts || "",
    coping: initialData?.coping || "",
    alternatives: initialData?.alternatives || "",
    category: initialData?.category || ""
  });

  const [showCategorySuggestions, setShowCategorySuggestions] = useState(true);
  const [customCategoryInput, setCustomCategoryInput] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const { categories, getCategoryColor, addCategory } = useCategoryManager();

  // Get keyword-based category suggestions
  const categorySuggestions = useMemo(() => {
    const combinedText = [formData.trigger, formData.thoughts, formData.coping, formData.alternatives]
      .filter(Boolean)
      .join(' ');

    if (!combinedText.trim()) return [];

    const suggestions = new Map<string, number>();
    const categoryNames = categories.map(c => c.name);

    categories.forEach(cat => {
      let matchCount = 0;
      cat.keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = combinedText.match(regex);
        if (matches) matchCount += matches.length;
      });

      if (matchCount > 0) {
        suggestions.set(cat.name, matchCount);
      }
    });

    // Sort by match count and return top 3
    return Array.from(suggestions.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category]) => category);
  }, [formData, categories]);

  const handleCategorySelect = (category: string) => {
    setFormData({ ...formData, category });
    setShowCategorySuggestions(false);
  };

  const handleAddCustomCategory = () => {
    if (customCategoryInput.trim()) {
      const newCategory = addCategory(
        customCategoryInput.trim(),
        "#" + Math.floor(Math.random() * 16777215).toString(16),
        [customCategoryInput.trim().toLowerCase()]
      );
      setFormData({ ...formData, category: newCategory.name });
      setCustomCategoryInput("");
      setShowCustomInput(false);
      setShowCategorySuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();

    // Only include fields that have content
    const submissionData = {
      id: initialData?.id || Date.now(),
      ...(formData.trigger ? { trigger: formData.trigger } : {}),
      ...(formData.thoughts ? { thoughts: formData.thoughts } : {}),
      ...(formData.coping ? { coping: formData.coping } : {}),
      ...(formData.alternatives ? { alternatives: formData.alternatives } : {}),
      ...(formData.category ? { category: formData.category } : {}),
      timestamp: initialData?.timestamp || now.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      isFavorite: initialData?.isFavorite || false
    };

    // Check if at least one field has content
    if (!Object.keys(submissionData).some(key => 
      ['trigger', 'thoughts', 'coping', 'alternatives', 'category'].includes(key) && submissionData[key]
    )) {
      return;
    }

    onSubmit(submissionData as Trigger);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mindtrack-card space-y-6"
      onSubmit={handleSubmit}
    >
      {/* Field Section */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-mindtrack-stone/70">Reflection Fields</h4>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-mindtrack-stone mb-2">
              What triggered you?
              <span className="text-mindtrack-stone/50 font-normal ml-1">(optional)</span>
            </label>
            <input
              type="text"
              value={formData.trigger}
              onChange={(e) => setFormData({ ...formData, trigger: e.target.value })}
              className="w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/30"
              placeholder="Describe the trigger..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mindtrack-stone mb-2">
              Thoughts & Feelings
              <span className="text-mindtrack-stone/50 font-normal ml-1">(optional)</span>
            </label>
            <input
              type="text"
              value={formData.thoughts}
              onChange={(e) => setFormData({ ...formData, thoughts: e.target.value })}
              className="w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/30"
              placeholder="How did you feel?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mindtrack-stone mb-2">
              How did you cope?
              <span className="text-mindtrack-stone/50 font-normal ml-1">(optional)</span>
            </label>
            <input
              type="text"
              value={formData.coping}
              onChange={(e) => setFormData({ ...formData, coping: e.target.value })}
              className="w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/30"
              placeholder="Your current coping strategy..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mindtrack-stone mb-2">
              Alternative you could try
              <span className="text-mindtrack-stone/50 font-normal ml-1">(optional)</span>
            </label>
            <input
              type="text"
              value={formData.alternatives}
              onChange={(e) => setFormData({ ...formData, alternatives: e.target.value })}
              className="w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/30"
              placeholder="Something else you could try..."
            />
          </div>
        </div>
      </div>

      {/* Category Section */}
      <div className="space-y-3 border-t border-mindtrack-sage/10 pt-6">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-mindtrack-stone/70">Category (Optional)</h4>
          <button
            type="button"
            onClick={() => setShowCategorySuggestions(!showCategorySuggestions)}
            className="text-xs text-mindtrack-sage hover:text-mindtrack-sage/80 transition-colors"
          >
            {showCategorySuggestions ? 'Hide' : 'Show'} suggestions
          </button>
        </div>

        {/* Suggested Categories */}
        <AnimatePresence>
          {showCategorySuggestions && categorySuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-mindtrack-sage/5 rounded-lg p-3 space-y-2"
            >
              <p className="text-xs text-mindtrack-stone/60">Based on your entry:</p>
              <div className="flex flex-wrap gap-2">
                {categorySuggestions.map(category => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategorySelect(category)}
                    className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                      formData.category === category
                        ? 'bg-mindtrack-sage text-white'
                        : 'bg-white border border-mindtrack-sage/20 text-mindtrack-stone hover:border-mindtrack-sage/50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected Category */}
        {formData.category && (
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: categories.find(c => c.name === formData.category)?.color || '#6b7280' }}
            />
            <span className="text-sm text-mindtrack-stone font-medium">{formData.category}</span>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, category: "" })}
              className="ml-auto text-xs text-mindtrack-stone/60 hover:text-mindtrack-stone transition-colors"
            >
              Clear
            </button>
          </div>
        )}

        {/* Custom Category Input */}
        {showCustomInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={customCategoryInput}
              onChange={(e) => setCustomCategoryInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustomCategory()}
              placeholder="New category name..."
              className="flex-1 p-2 text-sm rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/30"
              autoFocus
            />
            <button
              type="button"
              onClick={handleAddCustomCategory}
              className="px-3 py-2 text-sm bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCustomInput(false);
                setCustomCategoryInput("");
              }}
              className="px-2 py-2 text-mindtrack-stone/60 hover:text-mindtrack-stone transition-colors"
              aria-label="Cancel adding custom category"
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Add Custom Category Button */}
        {!showCustomInput && (
          <button
            type="button"
            onClick={() => setShowCustomInput(true)}
            className="text-xs text-mindtrack-sage hover:text-mindtrack-sage/80 transition-colors flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Create new category
          </button>
        )}

        {/* Category List */}
        {!formData.category && (
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.name)}
                className="px-3 py-1.5 text-sm rounded-md border transition-all"
                style={{
                  borderColor: cat.color,
                  color: cat.color,
                  backgroundColor: `${cat.color}10`,
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 border-t border-mindtrack-sage/10 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-mindtrack-stone hover:bg-mindtrack-sage/5 rounded-md transition-colors"
          aria-label="Cancel and close form"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors disabled:opacity-50"
          disabled={!formData.trigger && !formData.thoughts && !formData.coping && !formData.alternatives}
          aria-label="Save trigger entry"
        >
          Save Entry
        </button>
      </div>
    </motion.form>
  );
};

export default TriggerForm;
