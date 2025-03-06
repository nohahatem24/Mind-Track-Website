
import { PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface GratitudeFormProps {
  onAddEntry: (content: string) => void;
}

const GratitudeForm = ({ onAddEntry }: GratitudeFormProps) => {
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
  );
};

export default GratitudeForm;
