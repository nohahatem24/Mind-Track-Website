
import { useState, useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import DashboardTabs from "@/components/DashboardTabs";
import FavoritesButton from "@/components/FavoritesButton";
import MainContent from "@/components/MainContent";
import Footer from "@/components/Footer";

const Index = () => {
  const [showFavorites, setShowFavorites] = useState(false);
  const [activeTab, setActiveTab] = useState("mood");
  
  // Refs for each section
  const moodRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const gratitudeRef = useRef<HTMLDivElement>(null);
  const cbtRef = useRef<HTMLDivElement>(null);
  const goalsRef = useRef<HTMLDivElement>(null);

  // Get ref based on section ID
  const getSectionRef = (sectionId: string) => {
    switch (sectionId) {
      case "mood": return moodRef;
      case "trigger": return triggerRef;
      case "gratitude": return gratitudeRef;
      case "cbt": return cbtRef;
      case "goals": return goalsRef;
      default: return null;
    }
  };
  
  // This function will handle tab changes and scrolling
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    
    // Immediate scrolling to the selected section
    scrollToSection(tabId);
  };

  // Function to scroll to a section
  const scrollToSection = (sectionId: string) => {
    const sectionRef = getSectionRef(sectionId);
    
    if (sectionRef && sectionRef.current) {
      // Calculate offset to account for the fixed header
      const headerOffset = 80; // Adjust based on your header height
      const elementPosition = sectionRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Toggle favorites
  const toggleFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  // Handle initial scrolling if there's a hash in the URL
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const validSections = ['mood', 'trigger', 'gratitude', 'cbt', 'goals'];
      if (validSections.includes(hash)) {
        setActiveTab(hash);
        // Use a small timeout to ensure the page is fully loaded
        setTimeout(() => scrollToSection(hash), 100);
      }
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <HeroSection 
        handleTabChange={handleTabChange} 
        toggleFavorites={toggleFavorites} 
        showFavorites={showFavorites} 
      />
      
      <DashboardTabs activeTab={activeTab} handleTabChange={handleTabChange} />
      
      <FavoritesButton showFavorites={showFavorites} toggleFavorites={toggleFavorites} />
      
      <MainContent 
        activeTab={activeTab} 
        showFavorites={showFavorites} 
        moodRef={moodRef}
        triggerRef={triggerRef}
        gratitudeRef={gratitudeRef}
        cbtRef={cbtRef}
        goalsRef={goalsRef}
      />
      
      <Footer />
    </div>
  );
};

export default Index;
