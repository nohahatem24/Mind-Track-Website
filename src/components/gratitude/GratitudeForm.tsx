
import { PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";

interface GratitudeFormProps {
  onAddEntry: (content: string) => void;
}

const GratitudeForm = ({ onAddEntry }: GratitudeFormProps) => {
  const { t, isRTL } = useI18n();
  const [newEntry, setNewEntry] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.trim()) return;
    
    onAddEntry(newEntry);
    setNewEntry("");
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mindtrack-card"
      onSubmit={handleSubmit}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <textarea
        value={newEntry}
        onChange={(e) => setNewEntry(e.target.value)}
        placeholder={t('journal.placeholder')}
        className={`w-full p-3 min-h-[100px] rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20 resize-none ${isRTL ? 'text-right' : ''}`}
        dir={isRTL ? 'rtl' : 'ltr'}
      />
      <div className={`mt-4 flex ${isRTL ? 'flex-row-reverse' : ''} justify-end`}>
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-4 py-2 bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors disabled:opacity-50"
          disabled={!newEntry.trim()}
        >
          <PlusCircle className="w-4 h-4" />
          {t('journal.add_gratitude')}
        </button>
      </div>
    </motion.form>
  );
};

export default GratitudeForm;
