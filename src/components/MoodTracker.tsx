
import { motion } from "framer-motion";
import { AlertCircle, Heart, LineChart, Pencil, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';

interface MoodEntry {
  id: number;
  mood: number;
  note?: string;
  timestamp: string;
  date: string; // For chart grouping
  isFavorite?: boolean;
}

interface MoodCategory {
  range: [number, number];
  label: string;
  color: string;
  description: string;
}

interface MoodTrackerProps {
  showOnlyFavorites?: boolean;
}

const MoodTracker = ({ showOnlyFavorites = false }: MoodTrackerProps) => {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const moodCategories: MoodCategory[] = [
    { range: [-10, -6], label: "Severely Low", color: "#d97706", description: "Severe depression, emotional shutdown" },
    { range: [-5, -1], label: "Mildly Low", color: "#a8a29e", description: "Sadness, low energy, anxiety" },
    { range: [0, 0], label: "Neutral", color: "#78716c", description: "Balanced, even emotional state" },
    { range: [1, 5], label: "Mildly Elevated", color: "#84cc16", description: "Happiness, calmness, satisfaction" },
    { range: [6, 10], label: "Highly Elevated", color: "#22c55e", description: "Energetic, intense excitement, joy" },
  ];

  const getMoodCategory = (moodValue: number): MoodCategory => {
    return moodCategories.find(category => 
      moodValue >= category.range[0] && moodValue <= category.range[1]
    ) || moodCategories[2]; // Default to neutral
  };

  const visibleEntries = showOnlyFavorites
    ? entries.filter(entry => entry.isFavorite)
    : entries;

  const chartData = [...entries]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map(entry => ({
      date: entry.date,
      mood: entry.mood,
      category: getMoodCategory(entry.mood).label
    }));

  const addEntry = (entry: MoodEntry) => {
    setEntries([entry, ...entries]);
    setIsAdding(false);
  };

  const updateEntry = (updatedEntry: MoodEntry) => {
    setEntries(entries.map(e => e.id === updatedEntry.id ? updatedEntry : e));
    setEditingId(null);
  };

  return (
    <section id="mood" className="py-16">
      <div className="mindtrack-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="section-title">Mood Tracking</h2>
          <p className="text-mindtrack-stone/80 max-w-2xl">
            Track your daily mood on a scale from -10 (extremely low) to +10 (extremely high) to identify patterns and monitor your emotional well-being.
          </p>
        </motion.div>

        {/* Mood Chart */}
        {entries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mindtrack-card mb-8"
          >
            <h3 className="text-xl font-semibold text-mindtrack-stone mb-6 flex items-center gap-2">
              <LineChart className="w-5 h-5 text-mindtrack-sage" />
              Your Mood Over Time
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={chartData} margin={{ top: 5, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[-10, 10]} ticks={[-10, -5, 0, 5, 10]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="#8A9A5B" 
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#8A9A5B" }} 
                    activeDot={{ r: 6, fill: "#8A9A5B" }} 
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              {moodCategories.map((category) => (
                <div key={category.label} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                  <span className="text-sm text-mindtrack-stone">{category.label} ({category.range[0]} to {category.range[1]})</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="space-y-6">
          {!isAdding && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAdding(true)}
              className="w-full mindtrack-card flex items-center justify-center gap-2 text-mindtrack-sage hover:text-mindtrack-sage/80"
            >
              <Plus className="w-5 h-5" />
              Log Your Current Mood
            </motion.button>
          )}

          {isAdding && (
            <MoodForm onSubmit={addEntry} onCancel={() => setIsAdding(false)} />
          )}

          {visibleEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="mindtrack-card"
            >
              {editingId === entry.id ? (
                <MoodForm 
                  onSubmit={updateEntry} 
                  onCancel={() => setEditingId(null)}
                  initialData={entry}
                />
              ) : (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-sm text-mindtrack-stone/60">
                      {entry.timestamp}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const updatedEntries = entries.map(e => 
                            e.id === entry.id ? { ...e, isFavorite: !e.isFavorite } : e
                          );
                          setEntries(updatedEntries);
                        }}
                        className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
                      >
                        <Heart 
                          className={`w-4 h-4 ${entry.isFavorite ? 'fill-mindtrack-sage text-mindtrack-sage' : 'text-mindtrack-sage'}`} 
                        />
                      </button>
                      <button
                        onClick={() => setEditingId(entry.id)}
                        className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
                      >
                        <Pencil className="w-4 h-4 text-mindtrack-sage" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div 
                        className="p-4 rounded-lg" 
                        style={{ 
                          backgroundColor: `${getMoodCategory(entry.mood).color}20`,
                          borderLeft: `4px solid ${getMoodCategory(entry.mood).color}` 
                        }}
                      >
                        <h3 className="font-medium text-mindtrack-stone">
                          Mood: {entry.mood} - {getMoodCategory(entry.mood).label}
                        </h3>
                        <p className="mt-1 text-sm text-mindtrack-stone/80">
                          {getMoodCategory(entry.mood).description}
                        </p>
                      </div>
                      {entry.note && (
                        <div className="mt-4">
                          <h3 className="font-medium text-mindtrack-stone">Notes</h3>
                          <p className="mt-1 text-mindtrack-stone/80">{entry.note}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          ))}

          {entries.length === 0 && !isAdding && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mindtrack-card flex items-center gap-3 text-mindtrack-stone/70"
            >
              <AlertCircle className="w-5 h-5" />
              <p>No mood entries logged yet. Start tracking how you feel to see patterns over time.</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

const MoodForm = ({ 
  onSubmit, 
  onCancel,
  initialData
}: { 
  onSubmit: (entry: MoodEntry) => void;
  onCancel: () => void;
  initialData?: MoodEntry;
}) => {
  const [mood, setMood] = useState<number>(initialData?.mood || 0);
  const [note, setNote] = useState<string>(initialData?.note || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    
    onSubmit({
      id: initialData?.id || Date.now(),
      mood,
      ...(note ? { note } : {}),
      date: formattedDate,
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

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-mindtrack-sage/10 rounded-md shadow-sm">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-mindtrack-stone">
          Mood: <span className="font-medium">{payload[0].value}</span>
        </p>
        <p className="text-sm text-mindtrack-stone/70">{payload[0].payload.category}</p>
      </div>
    );
  }

  return null;
};

export default MoodTracker;
