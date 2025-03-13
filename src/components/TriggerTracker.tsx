
import { motion } from "framer-motion";
import { AlertCircle, Heart, Pencil, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import TriggerCategoryAnalysis from "./trigger-tracker/TriggerCategoryAnalysis";

interface Trigger {
  id: number;
  trigger?: string;
  thoughts?: string;
  coping?: string;
  alternatives?: string;
  timestamp: string;
  isFavorite?: boolean;
  category?: string;
}

interface TriggerTrackerProps {
  showOnlyFavorites?: boolean;
}

const STORAGE_KEY = 'mindtrack_triggers';

const TriggerTracker = ({ showOnlyFavorites = false }: TriggerTrackerProps) => {
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showFavoritesState, setShowFavoritesState] = useState(showOnlyFavorites);

  // Load saved triggers from localStorage
  useEffect(() => {
    const savedTriggers = localStorage.getItem(STORAGE_KEY);
    if (savedTriggers) {
      try {
        setTriggers(JSON.parse(savedTriggers));
      } catch (e) {
        console.error("Error parsing saved triggers:", e);
      }
    }
  }, []);

  // Save triggers to localStorage when they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(triggers));
  }, [triggers]);

  // Update showFavorites state when prop changes
  useEffect(() => {
    setShowFavoritesState(showOnlyFavorites);
  }, [showOnlyFavorites]);

  const addTrigger = (trigger: Trigger) => {
    setTriggers([trigger, ...triggers]);
    setIsAdding(false);
  };

  const updateTrigger = (updatedTrigger: Trigger) => {
    setTriggers(triggers.map(t => t.id === updatedTrigger.id ? updatedTrigger : t));
    setEditingId(null);
  };

  const deleteTrigger = (triggerId: number) => {
    setTriggers(triggers.filter(trigger => trigger.id !== triggerId));
  };

  const toggleFavorite = (triggerId: number) => {
    setTriggers(triggers.map(trigger => 
      trigger.id === triggerId 
        ? { ...trigger, isFavorite: !trigger.isFavorite } 
        : trigger
    ));
  };

  const visibleTriggers = showFavoritesState 
    ? triggers.filter(trigger => trigger.isFavorite)
    : triggers;

  return (
    <section id="trigger" className="py-16">
      <div className="mindtrack-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="section-title">Emotion Tracking</h2>
          <p className="text-mindtrack-stone/80 max-w-2xl">
            Track your emotional experiences. Fill in any aspect that feels relevant - whether it's a specific trigger, your thoughts, feelings, or coping strategies.
          </p>
        </motion.div>

        {triggers.length > 0 && (
          <TriggerCategoryAnalysis triggers={triggers} />
        )}

        <div className="flex justify-between items-center mb-6">
          <div></div>
          <button
            onClick={() => setShowFavoritesState(!showFavoritesState)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md ${
              showFavoritesState 
                ? 'bg-mindtrack-sage text-white' 
                : 'text-mindtrack-sage hover:bg-mindtrack-sage/5'
            } transition-colors`}
          >
            <Heart className="w-4 h-4" />
            <span className="text-sm">Favorites</span>
          </button>
        </div>

        <div className="space-y-6">
          {visibleTriggers.map((trigger, index) => (
            <motion.div
              key={trigger.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="mindtrack-card"
            >
              {editingId === trigger.id ? (
                <TriggerForm 
                  onSubmit={updateTrigger} 
                  onCancel={() => setEditingId(null)}
                  initialData={trigger}
                />
              ) : (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-sm text-mindtrack-stone/60">
                      {trigger.timestamp}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleFavorite(trigger.id)}
                        className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
                      >
                        <Heart 
                          className={`w-4 h-4 ${trigger.isFavorite ? 'fill-mindtrack-sage text-mindtrack-sage' : 'text-mindtrack-sage'}`} 
                        />
                      </button>
                      <button
                        onClick={() => setEditingId(trigger.id)}
                        className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
                      >
                        <Pencil className="w-4 h-4 text-mindtrack-sage" />
                      </button>
                      <button
                        onClick={() => deleteTrigger(trigger.id)}
                        className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-4 gap-4">
                    {trigger.trigger && (
                      <div>
                        <h3 className="font-medium text-mindtrack-stone">Trigger</h3>
                        <p className="mt-1 text-mindtrack-stone/80">{trigger.trigger}</p>
                      </div>
                    )}
                    {trigger.thoughts && (
                      <div>
                        <h3 className="font-medium text-mindtrack-stone">Thoughts & Feelings</h3>
                        <p className="mt-1 text-mindtrack-stone/80">{trigger.thoughts}</p>
                      </div>
                    )}
                    {trigger.coping && (
                      <div>
                        <h3 className="font-medium text-mindtrack-stone">Current Coping</h3>
                        <p className="mt-1 text-mindtrack-stone/80">{trigger.coping}</p>
                      </div>
                    )}
                    {trigger.alternatives && (
                      <div>
                        <h3 className="font-medium text-mindtrack-stone">Alternatives</h3>
                        <p className="mt-1 text-mindtrack-stone/80">{trigger.alternatives}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          ))}

          {!isAdding && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAdding(true)}
              className="w-full mindtrack-card flex items-center justify-center gap-2 text-mindtrack-sage hover:text-mindtrack-sage/80"
            >
              <Plus className="w-5 h-5" />
              Add New Entry
            </motion.button>
          )}

          {isAdding && (
            <TriggerForm onSubmit={addTrigger} onCancel={() => setIsAdding(false)} />
          )}

          {triggers.length === 0 && !isAdding && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mindtrack-card flex items-center gap-3 text-mindtrack-stone/70"
            >
              <AlertCircle className="w-5 h-5" />
              <p>No entries logged yet. Add your first one to start tracking.</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

const TriggerForm = ({ 
  onSubmit, 
  onCancel,
  initialData
}: { 
  onSubmit: (trigger: Trigger) => void;
  onCancel: () => void;
  initialData?: Trigger;
}) => {
  const [formData, setFormData] = useState({
    trigger: initialData?.trigger || "",
    thoughts: initialData?.thoughts || "",
    coping: initialData?.coping || "",
    alternatives: initialData?.alternatives || ""
  });

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
      ['trigger', 'thoughts', 'coping', 'alternatives'].includes(key) && submissionData[key]
    )) {
      return; // Don't submit if all fields are empty
    }

    onSubmit(submissionData as Trigger);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mindtrack-card space-y-4"
      onSubmit={handleSubmit}
    >
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-mindtrack-stone mb-1">
            Trigger <span className="text-mindtrack-stone/60">(optional)</span>
          </label>
          <input
            type="text"
            value={formData.trigger}
            onChange={(e) => setFormData({ ...formData, trigger: e.target.value })}
            className="w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20"
            placeholder="What triggered you? (if known)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-mindtrack-stone mb-1">
            Thoughts & Feelings <span className="text-mindtrack-stone/60">(optional)</span>
          </label>
          <input
            type="text"
            value={formData.thoughts}
            onChange={(e) => setFormData({ ...formData, thoughts: e.target.value })}
            className="w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20"
            placeholder="How did you feel?"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-mindtrack-stone mb-1">
            Current Coping <span className="text-mindtrack-stone/60">(optional)</span>
          </label>
          <input
            type="text"
            value={formData.coping}
            onChange={(e) => setFormData({ ...formData, coping: e.target.value })}
            className="w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20"
            placeholder="How did you cope?"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-mindtrack-stone mb-1">
            Alternative Coping <span className="text-mindtrack-stone/60">(optional)</span>
          </label>
          <input
            type="text"
            value={formData.alternatives}
            onChange={(e) => setFormData({ ...formData, alternatives: e.target.value })}
            className="w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20"
            placeholder="What could you do instead?"
          />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-mindtrack-stone hover:bg-mindtrack-sage/5 rounded-md transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors disabled:opacity-50"
          disabled={!formData.trigger && !formData.thoughts && !formData.coping && !formData.alternatives}
        >
          Save
        </button>
      </div>
    </motion.form>
  );
};

export default TriggerTracker;
