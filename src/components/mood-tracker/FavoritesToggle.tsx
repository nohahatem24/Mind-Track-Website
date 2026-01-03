
import React from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface FavoritesToggleProps {
  showOnlyFavorites: boolean;
  setShowOnlyFavorites: (value: boolean) => void;
}

const FavoritesToggle = ({ showOnlyFavorites, setShowOnlyFavorites }: FavoritesToggleProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-mindtrack-sage/10 rounded-lg shadow-sm hover:bg-mindtrack-sage/5 transition-colors"
    >
      <Heart className={`w-4 h-4 ${showOnlyFavorites ? 'fill-mindtrack-sage text-mindtrack-sage' : 'text-mindtrack-sage'}`} />
      {showOnlyFavorites ? 'Show All Entries' : 'Show Favorites'}
    </motion.button>
  );
};

export default FavoritesToggle;
