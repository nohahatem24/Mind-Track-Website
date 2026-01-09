
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import GratitudeForm from "./gratitude/GratitudeForm";
import GratitudeEntryList from "./gratitude/GratitudeEntryList";
import GratitudeHeader from "./gratitude/GratitudeHeader";
import { useGratitudeJournal } from "@/hooks/useGratitudeJournal";
import { useI18n } from "@/i18n/I18nProvider";
import FavoritesToggle from "./gratitude/FavoritesToggle";

interface GratitudeJournalProps {
  showOnlyFavorites?: boolean;
}

const GratitudeJournal = ({ showOnlyFavorites = false }: GratitudeJournalProps) => {
  const { t, isRTL } = useI18n();
  const {
    entries,
    addEntry,
    editEntry,
    deleteEntry,
    toggleFavorite,
    showOnlyFavorites: showFavoritesState,
    toggleShowOnlyFavorites
  } = useGratitudeJournal(showOnlyFavorites);

  const [dateStart, setDateStart] = useState<string>("");
  const [dateEnd, setDateEnd] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");

  // Filter entries by date range and search text
  const filteredEntries = useMemo(() => {
    let result = entries;

    // Apply search filter
    if (searchText.trim()) {
      result = result.filter((entry) =>
        entry.content.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply date range filter
    if (dateStart || dateEnd) {
      result = result.filter((entry) => {
        const entryDate = new Date(entry.date);
        
        if (dateStart) {
          const startDate = new Date(dateStart);
          if (entryDate < startDate) return false;
        }
        
        if (dateEnd) {
          const endDate = new Date(dateEnd);
          endDate.setHours(23, 59, 59, 999);
          if (entryDate > endDate) return false;
        }
        
        return true;
      });
    }

    return result;
  }, [entries, dateStart, dateEnd, searchText]);

  return (
    <section id="gratitude" className={`py-16 bg-mindtrack-cream/30 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mindtrack-container">
        <GratitudeHeader />

        <div className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-4">
            {/* Filters */}
            <div className="mindtrack-card space-y-4">
              <h3 className={`text-sm font-medium text-mindtrack-stone/70 ${isRTL ? 'text-right' : ''}`}>
                {t('journal.filters')}
              </h3>
              
              {/* Search */}
              <div>
                <label htmlFor="gratitude-search" className={`block text-sm font-medium text-mindtrack-stone mb-2 ${isRTL ? 'text-right' : ''}`}>
                  {t('journal.search_entries')}
                </label>
                <input
                  id="gratitude-search"
                  type="text"
                  placeholder={t('journal.find_entries')}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className={`w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/30 ${isRTL ? 'text-right' : ''}`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>

              {/* Date Range */}
              <div className={`grid grid-cols-2 gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div>
                  <label htmlFor="gratitude-date-start" className={`block text-sm font-medium text-mindtrack-stone mb-2 ${isRTL ? 'text-right' : ''}`}>
                    {t('journal.from_date')}
                  </label>
                  <input
                    id="gratitude-date-start"
                    type="date"
                    value={dateStart}
                    onChange={(e) => setDateStart(e.target.value)}
                    className="w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/30"
                  />
                </div>
                <div>
                  <label htmlFor="gratitude-date-end" className={`block text-sm font-medium text-mindtrack-stone mb-2 ${isRTL ? 'text-right' : ''}`}>
                    {t('journal.to_date')}
                  </label>
                  <input
                    id="gratitude-date-end"
                    type="date"
                    value={dateEnd}
                    onChange={(e) => setDateEnd(e.target.value)}
                    className="w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/30"
                  />
                </div>
              </div>

              {/* Clear Filters */}
              {(dateStart || dateEnd || searchText) && (
                <button
                  onClick={() => {
                    setDateStart("");
                    setDateEnd("");
                    setSearchText("");
                  }}
                  className={`text-xs text-mindtrack-sage hover:text-mindtrack-sage/80 transition-colors ${isRTL ? 'block mx-auto' : ''}`}
                >
                  {t('journal.clear_filters')}
                </button>
              )}
            </div>

            <FavoritesToggle 
              showOnlyFavorites={showFavoritesState}
              setShowOnlyFavorites={toggleShowOnlyFavorites}
            />
          </div>
          
          <GratitudeForm onAddEntry={addEntry} />
          
          <GratitudeEntryList 
            entries={filteredEntries}
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
