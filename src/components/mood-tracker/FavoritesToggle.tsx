
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
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm transition-colors ${
        showOnlyFavorites 
          ? 'bg-mindtrack-sage text-white' 
          : 'bg-white border border-mindtrack-sage/10 text-mindtrack-sage hover:bg-mindtrack-sage/5'
      }`}
    >
      <Heart className={`w-4 h-4 ${showOnlyFavorites ? 'fill-white' : 'text-mindtrack-sage'}`} />
      {showOnlyFavorites ? 'Show All Entries' : 'Show Favorites'}
    </motion.button>
  );
};

export default FavoritesToggle;
