
import { motion } from "framer-motion";
import { useState } from "react";
import GratitudeForm from "./gratitude/GratitudeForm";
import GratitudeEntryList from "./gratitude/GratitudeEntryList";
import { GratitudeEntry } from "./gratitude/types";

interface GratitudeJournalProps {
  showOnlyFavorites?: boolean;
}

const GratitudeJournal = ({ showOnlyFavorites = false }: GratitudeJournalProps) => {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);

  const visibleEntries = showOnlyFavorites 
    ? entries.filter(entry => entry.isFavorite)
    : entries;

  const addEntry = (content: string) => {
    const now = new Date();
    const entry: GratitudeEntry = {
      id: Date.now(),
      content: content,
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
  };

  const editEntry = (entry: GratitudeEntry, newContent: string) => {
    const updatedEntries = entries.map(e => {
      if (e.id === entry.id) {
        return { ...e, content: newContent };
      }
      return e;
    });
    
    setEntries(updatedEntries);
  };

  const deleteEntry = (entryId: number) => {
    setEntries(entries.filter(entry => entry.id !== entryId));
  };

  const toggleFavorite = (entry: GratitudeEntry) => {
    const updatedEntries = entries.map(e => 
      e.id === entry.id ? { ...e, isFavorite: !e.isFavorite } : e
    );
    setEntries(updatedEntries);
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
          <GratitudeForm onAddEntry={addEntry} />
          <GratitudeEntryList 
            entries={visibleEntries}
            onEdit={editEntry}
            onDelete={deleteEntry}
            onToggleFavorite={toggleFavorite}
          />
        </div>
      </div>
    </section>
  );
};

export default GratitudeJournal;
