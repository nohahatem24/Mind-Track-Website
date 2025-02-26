
import { motion } from "framer-motion";
import { Heart, PlusCircle } from "lucide-react";
import { useState } from "react";

interface GratitudeEntry {
  id: number;
  content: string;
  date: string;
}

const GratitudeJournal = () => {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [newEntry, setNewEntry] = useState("");

  const addEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.trim()) return;

    const entry: GratitudeEntry = {
      id: Date.now(),
      content: newEntry,
      date: new Date().toLocaleDateString(),
    };

    setEntries([entry, ...entries]);
    setNewEntry("");
  };

  return (
    <section id="gratitude" className="py-16 bg-mindtrack-cream/30">
      <div className="mindtrack-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="section-title">Gratitude Journal</h2>
          <p className="text-mindtrack-stone/80 max-w-2xl">
            Take a moment to reflect on the positive aspects of your day. What are you grateful for?
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-6">
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mindtrack-card"
            onSubmit={addEntry}
          >
            <textarea
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              placeholder="I am grateful for..."
              className="w-full p-3 min-h-[100px] rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20 resize-none"
            />
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2 bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors disabled:opacity-50"
                disabled={!newEntry.trim()}
              >
                <PlusCircle className="w-4 h-4" />
                Add Entry
              </button>
            </div>
          </motion.form>

          <div className="space-y-4">
            {entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="mindtrack-card"
              >
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-mindtrack-sage flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-mindtrack-stone">{entry.content}</p>
                    <p className="mt-2 text-sm text-mindtrack-stone/60">{entry.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GratitudeJournal;
