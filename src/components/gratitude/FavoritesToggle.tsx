
import { Heart } from "lucide-react";

interface FavoritesToggleProps {
  showOnlyFavorites: boolean;
  setShowOnlyFavorites: (value: boolean) => void;
}

const FavoritesToggle = ({ 
  showOnlyFavorites, 
  setShowOnlyFavorites 
}: FavoritesToggleProps) => {
  return (
    <button
      onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
      className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-md transition-colors ${
        showOnlyFavorites 
          ? "bg-mindtrack-sage text-white" 
          : "bg-mindtrack-sage/10 text-mindtrack-sage hover:bg-mindtrack-sage/20"
      }`}
    >
      <Heart size={16} className={showOnlyFavorites ? "fill-white text-white" : ""} />
      {showOnlyFavorites ? "Showing Favorites" : "Show Favorites"}
    </button>
  );
};

export default FavoritesToggle;
