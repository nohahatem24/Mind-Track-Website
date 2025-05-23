
import { motion } from "framer-motion";
import { BookHeart, Menu } from "lucide-react";
import { useState } from "react";
import AuthButton from "./auth/AuthButton";

interface MobileNavLinkProps {
  sectionId: string;
  children: React.ReactNode;
  onClick: (sectionId: string) => void;
}

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMobileNavClick = (sectionId: string) => {
    // Close the mobile menu
    setIsOpen(false);
    
    // Scroll to the section
    scrollToSection(sectionId);
  };

  // Function to scroll to a section
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      // Calculate offset to account for the fixed header
      const headerOffset = 80; // Adjust based on your header height
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

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

          <div className="hidden md:flex items-center space-x-6">
            <div className="flex space-x-4">
              <NavLink sectionId="mood" onClick={scrollToSection}>Mood</NavLink>
              <NavLink sectionId="trigger" onClick={scrollToSection}>Triggers</NavLink>
              <NavLink sectionId="gratitude" onClick={scrollToSection}>Gratitude</NavLink>
              <NavLink sectionId="cbt" onClick={scrollToSection}>CBT</NavLink>
              <NavLink sectionId="dbt" onClick={scrollToSection}>DBT</NavLink>
              <NavLink sectionId="goals" onClick={scrollToSection}>Goals</NavLink>
              <NavLink sectionId="relationships" onClick={scrollToSection}>Relationships</NavLink>
            </div>
            
            <AuthButton />
          </div>

          <div className="md:hidden flex items-center gap-2">
            <AuthButton />
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-mindtrack-sage/5 rounded-lg"
            >
              <Menu className="w-6 h-6 text-mindtrack-stone" />
            </button>
          </div>
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
            <MobileNavLink sectionId="mood" onClick={handleMobileNavClick}>
              Mood Tracking
            </MobileNavLink>
            <MobileNavLink sectionId="trigger" onClick={handleMobileNavClick}>
              Trigger Tracking
            </MobileNavLink>
            <MobileNavLink sectionId="gratitude" onClick={handleMobileNavClick}>
              Gratitude Journal
            </MobileNavLink>
            <MobileNavLink sectionId="cbt" onClick={handleMobileNavClick}>
              CBT Techniques
            </MobileNavLink>
            <MobileNavLink sectionId="dbt" onClick={handleMobileNavClick}>
              DBT Techniques
            </MobileNavLink>
            <MobileNavLink sectionId="goals" onClick={handleMobileNavClick}>
              Goal Tracker
            </MobileNavLink>
            <MobileNavLink sectionId="relationships" onClick={handleMobileNavClick}>
              Relationships
            </MobileNavLink>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

const NavLink = ({ 
  sectionId, 
  children, 
  onClick 
}: { 
  sectionId: string;
  children: React.ReactNode;
  onClick: (sectionId: string) => void;
}) => (
  <button
    onClick={() => onClick(sectionId)}
    className="text-mindtrack-stone hover:text-mindtrack-sage transition-colors py-2"
  >
    {children}
  </button>
);

const MobileNavLink = ({ 
  sectionId, 
  children, 
  onClick 
}: MobileNavLinkProps) => (
  <button
    onClick={() => onClick(sectionId)}
    className="block w-full text-left py-2 px-4 text-mindtrack-stone hover:bg-mindtrack-sage/5 rounded-lg transition-colors"
  >
    {children}
  </button>
);

export default Navigation;
