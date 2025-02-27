import { motion } from "framer-motion";
import { Heart, Pencil, PlusCircle, X } from "lucide-react";
import { useState } from "react";

interface GratitudeEntry {
  id: number;
  content: string;
  date: string;
  time: string;
  isFavorite: boolean;
}

interface GratitudeJournalProps {
  showOnlyFavorites?: boolean;
}

const GratitudeJournal = ({ showOnlyFavorites = false }: GratitudeJournalProps) => {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [newEntry, setNewEntry] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const visibleEntries = showOnlyFavorites 
    ? entries.filter(entry => entry.isFavorite)
    : entries;

  const addEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.trim()) return;

    const now = new Date();
    const entry: GratitudeEntry = {
      id: Date.now(),
      content: newEntry,
      date: now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isFavorite: false,
    };

    setEntries([entry, ...entries]);
    setNewEntry("");
  };

  const startEditing = (entry: GratitudeEntry) => {
    setEditingId(entry.id);
    setEditingContent(entry.content);
  };

  const saveEdit = (entry: GratitudeEntry) => {
    if (!editingContent.trim()) return;
    
    const updatedEntries = entries.map(e => {
      if (e.id === entry.id) {
        return { ...e, content: editingContent };
      }
      return e;
    });
    
    setEntries(updatedEntries);
    setEditingId(null);
    setEditingContent("");
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
            {visibleEntries.map((entry, index) => (
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
                    {editingId === entry.id ? (
                      <div className="space-y-3">
                        <textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="w-full p-3 min-h-[100px] rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20 resize-none"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1.5 text-mindtrack-stone hover:bg-mindtrack-sage/5 rounded-md transition-colors text-sm"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => saveEdit(entry)}
                            className="px-3 py-1.5 bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors text-sm"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start">
                          <p className="text-mindtrack-stone">{entry.content}</p>
                          <button
                            onClick={() => startEditing(entry)}
                            className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors ml-2"
                          >
                            <Pencil className="w-4 h-4 text-mindtrack-sage" />
                          </button>
                        </div>
                        <p className="mt-2 text-sm text-mindtrack-stone/60">
                          {entry.date} at {entry.time}
                        </p>
                      </>
                    )}
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
