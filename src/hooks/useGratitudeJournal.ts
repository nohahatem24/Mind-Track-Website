
import { useState } from "react";
import { GratitudeEntry } from "@/components/gratitude/types";

export const useGratitudeJournal = (initialShowOnlyFavorites = false) => {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(initialShowOnlyFavorites);

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

  const toggleShowOnlyFavorites = () => {
    setShowOnlyFavorites(!showOnlyFavorites);
  };

  return {
    entries: visibleEntries,
    showOnlyFavorites,
    addEntry,
    editEntry,
    deleteEntry,
    toggleFavorite,
    toggleShowOnlyFavorites
  };
};
