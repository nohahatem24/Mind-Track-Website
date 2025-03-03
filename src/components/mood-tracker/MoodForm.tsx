
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
    const formattedDate = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    
    const formattedTime = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    
    onSubmit({
      id: initialData?.id || Date.now(),
      mood,
      ...(note ? { note } : {}),
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
  };

  const getMoodDescription = (value: number): string => {
    if (value <= -6) return "Severely low mood (depression, despair)";
    if (value <= -1) return "Mild to moderate low mood (sadness, worry)";
    if (value === 0) return "Neutral, balanced state";
    if (value <= 5) return "Mild to moderate positive mood (content, happy)";
    return "Highly elevated mood (joy, excitement)";
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
          How are you feeling right now? ({mood})
        </label>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-mindtrack-stone/70">-10</span>
          <input
            type="range"
            min="-10"
            max="10"
            step="1"
            value={mood}
            onChange={(e) => setMood(parseInt(e.target.value))}
            className="w-full h-2 bg-mindtrack-sage/20 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm font-medium text-mindtrack-stone/70">+10</span>
        </div>
        <p className="mt-2 text-sm text-mindtrack-stone/80">
          {getMoodDescription(mood)}
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-mindtrack-stone mb-1">
          Add notes (optional)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What might be influencing your mood right now?"
          className="w-full p-3 min-h-[100px] rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20 resize-none"
        />
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
          className="px-4 py-2 bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors"
        >
          {initialData ? 'Update' : 'Save'} Mood
        </button>
      </div>
    </motion.form>
  );
};

export default MoodForm;
