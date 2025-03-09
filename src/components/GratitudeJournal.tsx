
import { motion } from "framer-motion";
import GratitudeForm from "./gratitude/GratitudeForm";
import GratitudeEntryList from "./gratitude/GratitudeEntryList";
import GratitudeHeader from "./gratitude/GratitudeHeader";
import { useGratitudeJournal } from "@/hooks/useGratitudeJournal";
import FavoritesToggle from "./gratitude/FavoritesToggle";

interface GratitudeJournalProps {
  showOnlyFavorites?: boolean;
}

const GratitudeJournal = ({ showOnlyFavorites = false }: GratitudeJournalProps) => {
  const {
    entries,
    addEntry,
    editEntry,
    deleteEntry,
    toggleFavorite,
    showOnlyFavorites: showFavoritesState,
    toggleShowOnlyFavorites
  } = useGratitudeJournal(showOnlyFavorites);

  return (
    <section id="gratitude" className="py-16 bg-mindtrack-cream/30">
      <div className="mindtrack-container">
        <GratitudeHeader />

        <div className="max-w-2xl mx-auto space-y-6">
          <FavoritesToggle 
            showOnlyFavorites={showFavoritesState}
            setShowOnlyFavorites={toggleShowOnlyFavorites}
          />
          
          <GratitudeForm onAddEntry={addEntry} />
          
          <GratitudeEntryList 
            entries={entries}
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
