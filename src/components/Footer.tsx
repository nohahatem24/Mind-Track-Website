
import React from "react";
import { BookHeart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-mindtrack-sage/10">
      <div className="mindtrack-container">
        <div className="flex items-center justify-center gap-2 text-mindtrack-stone/60">
          <BookHeart className="w-5 h-5" />
          <p>MindTrack © {currentYear}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
