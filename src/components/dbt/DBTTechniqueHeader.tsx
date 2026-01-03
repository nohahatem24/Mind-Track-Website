
import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface DBTTechniqueHeaderProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  showFavoritesOnly?: boolean;
  setShowFavoritesOnly?: (show: boolean) => void;
}

const DBTTechniqueHeader: React.FC<DBTTechniqueHeaderProps> = ({
  selectedCategory,
  setSelectedCategory,
  showHistory,
  setShowHistory,
  showFavoritesOnly = false,
  setShowFavoritesOnly = () => {}
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="mb-8"
    >
      <h2 className="section-title">DBT Techniques & Exercises</h2>
      <p className="text-mindtrack-stone/80 max-w-2xl mb-6">
        Evidence-based dialectical behavior therapy exercises to help regulate emotions, improve interpersonal effectiveness, increase distress tolerance, and enhance mindfulness.
      </p>
      
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <CategoryFilter 
          selectedCategory={selectedCategory} 
          setSelectedCategory={setSelectedCategory} 
        />
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              showFavoritesOnly
                ? "bg-mindtrack-sage text-white"
                : "border border-mindtrack-sage text-mindtrack-sage hover:bg-mindtrack-sage/5"
            }`}
            title={showFavoritesOnly ? "Show all techniques" : "Show only favorites"}
          >
            <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-white' : ''}`} />
            Favorites
          </button>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-4 py-2 border border-mindtrack-sage text-mindtrack-sage rounded-md hover:bg-mindtrack-sage/5 transition-colors"
          >
            {showHistory ? "Hide History" : "View History"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Using a local import to avoid circular dependencies
const CategoryFilter = ({ 
  selectedCategory, 
  setSelectedCategory 
}: { 
  selectedCategory: string, 
  setSelectedCategory: (category: string) => void 
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setSelectedCategory("all")}
        className={`px-4 py-2 rounded-md transition-colors ${
          selectedCategory === "all"
            ? "bg-mindtrack-sage text-white"
            : "border border-mindtrack-sage text-mindtrack-sage hover:bg-mindtrack-sage/5"
        }`}
      >
        All
      </button>
      <button
        onClick={() => setSelectedCategory("mindfulness")}
        className={`px-4 py-2 rounded-md transition-colors ${
          selectedCategory === "mindfulness"
            ? "bg-mindtrack-sage text-white"
            : "border border-mindtrack-sage text-mindtrack-sage hover:bg-mindtrack-sage/5"
        }`}
      >
        Mindfulness
      </button>
      <button
        onClick={() => setSelectedCategory("distress-tolerance")}
        className={`px-4 py-2 rounded-md transition-colors ${
          selectedCategory === "distress-tolerance"
            ? "bg-mindtrack-sage text-white"
            : "border border-mindtrack-sage text-mindtrack-sage hover:bg-mindtrack-sage/5"
        }`}
      >
        Distress Tolerance
      </button>
      <button
        onClick={() => setSelectedCategory("emotion-regulation")}
        className={`px-4 py-2 rounded-md transition-colors ${
          selectedCategory === "emotion-regulation"
            ? "bg-mindtrack-sage text-white"
            : "border border-mindtrack-sage text-mindtrack-sage hover:bg-mindtrack-sage/5"
        }`}
      >
        Emotion Regulation
      </button>
      <button
        onClick={() => setSelectedCategory("interpersonal")}
        className={`px-4 py-2 rounded-md transition-colors ${
          selectedCategory === "interpersonal"
            ? "bg-mindtrack-sage text-white"
            : "border border-mindtrack-sage text-mindtrack-sage hover:bg-mindtrack-sage/5"
        }`}
      >
        Interpersonal
      </button>
    </div>
  );
};

export default DBTTechniqueHeader;
