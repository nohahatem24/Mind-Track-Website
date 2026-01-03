import { useState } from "react";
import { motion } from "framer-motion";
import { MoodEntry } from "./types";

interface MoodFormProps { 
  onSubmit: (entry: MoodEntry) => void;
  onCancel: () => void;
  initialData?: MoodEntry;
}

const MoodForm = ({ 
  onSubmit, 
  onCancel,
  initialData
}: MoodFormProps) => {
  const [mood, setMood] = useState<number>(initialData?.mood || 0);
  const [note, setNote] = useState<string>(initialData?.note || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    
    // Format date with year: "Jan 2, 2026"
    const formattedDate = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
    
    const formattedTime = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    
    onSubmit({
      id: initialData?.id || Date.now(),
      mood,
      note: note.trim() || undefined,
      date: initialData?.date || formattedDate,
      time: initialData?.time || formattedTime,
      timestamp: initialData?.timestamp || now.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      isFavorite: initialData?.isFavorite || false
    });

    // Reset form if it's a new entry
    if (!initialData) {
      setMood(0);
      setNote("");
    }
  };

  const getMoodDescription = (value: number): string => {
    if (value <= -6) return "Severely low mood (depression, despair)";
    if (value <= -1) return "Mild to moderate low mood (sadness, worry)";
    if (value === 0) return "Neutral, balanced state";
    if (value <= 5) return "Mild to moderate positive mood (content, happy)";
    return "Highly elevated mood (joy, excitement)";
  };

  const getMoodColor = (value: number): string => {
    if (value <= -6) return "#ef4444";
    if (value <= -1) return "#f97316";
    if (value === 0) return "#facc15";
    if (value <= 5) return "#84cc16";
    return "#22c55e";
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mindtrack-card space-y-6"
      onSubmit={handleSubmit}
    >
      <div>
        <label className="block text-lg font-medium text-mindtrack-stone mb-3">
          How are you feeling right now?
        </label>
        
        <div className="flex items-center justify-center mb-4">
          <div 
            className="text-4xl font-bold transition-colors duration-300"
            style={{ color: getMoodColor(mood) }}
          >
            {mood}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-mindtrack-stone/70 min-w-[30px]">-10</span>
          <input
            type="range"
            min="-10"
            max="10"
            step="1"
            value={mood}
            onChange={(e) => setMood(parseInt(e.target.value))}
            title="Adjust your mood level"
            aria-label="Mood level slider"
            className="flex-1 h-2 bg-mindtrack-sage/20 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, 
                #ef4444 0%, 
                #f97316 25%, 
                #facc15 50%, 
                #84cc16 75%, 
                #22c55e 100%)`
            }}
          />
          <span className="text-sm font-medium text-mindtrack-stone/70 min-w-[30px] text-right">+10</span>
        </div>
        
        <p className="mt-3 text-sm text-mindtrack-stone/80 text-center">
          {getMoodDescription(mood)}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-mindtrack-stone mb-2">
          Add notes (optional)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What might be influencing your mood right now?"
          className="w-full p-3 min-h-[100px] rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/30 focus:border-mindtrack-sage/30 resize-none transition-all"
          maxLength={500}
        />
        <div className="text-xs text-mindtrack-stone/50 mt-1 text-right">
          {note.length}/500 characters
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 text-mindtrack-stone hover:bg-mindtrack-sage/5 rounded-md transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors shadow-sm"
        >
          {initialData ? 'Update' : 'Save'} Mood
        </button>
      </div>
    </motion.form>
  );
};

export default MoodForm;