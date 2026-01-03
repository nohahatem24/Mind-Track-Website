
import { motion } from "framer-motion";
import { BookHeart, Menu } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthButton from "./auth/AuthButton";

interface MobileNavLinkProps {
  sectionId: string;
  children: React.ReactNode;
  onClick: (sectionId: string) => void;
}

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleMobileNavClick = (sectionId: string) => {
    // Close the mobile menu
    setIsOpen(false);
    
    // Navigate to the section
    navigateToSection(sectionId);
  };

  // Function to navigate to a section
  const navigateToSection = (sectionId: string) => {
    // Close mobile menu if open
    setIsOpen(false);
    
    // Check if we're already on the homepage
    if (window.location.pathname === "/") {
      // Select the tab first to ensure content is loaded
      const tabButtons = document.querySelectorAll('[data-tab-id]');
      const targetTab = Array.from(tabButtons).find(
        button => (button as HTMLElement).dataset.tabId === sectionId
      ) as HTMLElement | undefined;
      
      if (targetTab) {
        // Simulate click on the tab to activate it
        targetTab.click();
        
        // Then scroll to the section with a short delay to ensure content is rendered
        setTimeout(() => {
          const section = document.getElementById(sectionId);
          if (section) {
            const headerOffset = 80;
            const elementPosition = section.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 50);
      }
    } else {
      // If not on homepage, navigate there with anchor
      navigate(`/?section=${sectionId}`);
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
            <Link to="/" className="flex items-center gap-2">
              <BookHeart className="w-6 h-6 text-mindtrack-sage" />
              <span className="text-xl font-semibold text-mindtrack-stone">MindTrack</span>
            </Link>
          </motion.div>

          <div className="hidden md:flex items-center space-x-6">
            <div className="flex space-x-4">
              <NavLink sectionId="mood" onClick={navigateToSection}>Mood</NavLink>
              <NavLink sectionId="trigger" onClick={navigateToSection}>Triggers</NavLink>
              <NavLink sectionId="gratitude" onClick={navigateToSection}>Gratitude</NavLink>
              <NavLink sectionId="cbt" onClick={navigateToSection}>CBT</NavLink>
              <NavLink sectionId="dbt" onClick={navigateToSection}>DBT</NavLink>
              <NavLink sectionId="goals" onClick={navigateToSection}>Goals</NavLink>
              <NavLink sectionId="relationships" onClick={navigateToSection}>Relationships</NavLink>
            </div>
            
            <AuthButton />
          </div>

          <div className="md:hidden flex items-center gap-2">
            <AuthButton />
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-mindtrack-sage/5 rounded-lg"
              aria-label="Toggle navigation menu"
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
