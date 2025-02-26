
import { motion } from "framer-motion";
import { BookHeart, Menu } from "lucide-react";
import { useState } from "react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-lg z-50 border-b border-mindtrack-sage/10">
      <div className="mindtrack-container">
        <div className="flex items-center justify-between h-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <BookHeart className="w-6 h-6 text-mindtrack-sage" />
            <span className="text-xl font-semibold text-mindtrack-stone">MindTrack</span>
          </motion.div>

          <div className="hidden md:flex items-center gap-6">
            <NavLink href="#triggers">Triggers</NavLink>
            <NavLink href="#gratitude">Gratitude</NavLink>
          </div>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-mindtrack-sage/5 rounded-lg"
          >
            <Menu className="w-6 h-6 text-mindtrack-stone" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-mindtrack-sage/10"
        >
          <div className="mindtrack-container py-4 space-y-2">
            <MobileNavLink href="#triggers" onClick={() => setIsOpen(false)}>
              Triggers
            </MobileNavLink>
            <MobileNavLink href="#gratitude" onClick={() => setIsOpen(false)}>
              Gratitude
            </MobileNavLink>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a 
    href={href}
    className="text-mindtrack-stone hover:text-mindtrack-sage transition-colors font-medium"
  >
    {children}
  </a>
);

const MobileNavLink = ({ 
  href, 
  children, 
  onClick 
}: { 
  href: string; 
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <a
    href={href}
    onClick={onClick}
    className="block py-2 px-4 text-mindtrack-stone hover:bg-mindtrack-sage/5 rounded-lg transition-colors"
  >
    {children}
  </a>
);

export default Navigation;
