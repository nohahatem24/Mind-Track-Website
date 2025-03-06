
import React from "react";
import { Heart } from "lucide-react";

interface FavoritesButtonProps {
  showFavorites: boolean;
  toggleFavorites: () => void;
}

const FavoritesButton = ({ showFavorites, toggleFavorites }: FavoritesButtonProps) => {
  return (
    <div className="mindtrack-container">
      <button
        onClick={toggleFavorites}
        className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-white border border-mindtrack-sage/10 rounded-lg shadow-sm hover:bg-mindtrack-sage/5 transition-colors"
      >
        <Heart className={`w-4 h-4 ${showFavorites ? 'fill-mindtrack-sage text-mindtrack-sage' : 'text-mindtrack-sage'}`} />
        {showFavorites ? 'Show All Entries' : 'Show Favorites'}
      </button>
    </div>
  );
};

export default FavoritesButton;
