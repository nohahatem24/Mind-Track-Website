
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import DashboardTabs from "@/components/DashboardTabs";
import Footer from "@/components/Footer";
import MainContent from "@/components/MainContent";

const Index = () => {
  const [activeTab, setActiveTab] = useState("mood");
  const [showFavorites, setShowFavorites] = useState(false);
  const location = useLocation();
  
  const moodRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const gratitudeRef = useRef<HTMLDivElement>(null);
  const cbtRef = useRef<HTMLDivElement>(null);
  const dbtRef = useRef<HTMLDivElement>(null);
  const goalsRef = useRef<HTMLDivElement>(null);
  const relationshipsRef = useRef<HTMLDivElement>(null);

  // Check for section parameter in URL
  useEffect(() => {
    // Get the section from the URL query parameter
    const queryParams = new URLSearchParams(location.search);
    const sectionParam = queryParams.get('section');
    
    if (sectionParam) {
      // Update the active tab
      setActiveTab(sectionParam);
      
      // Scroll to the section after a short delay to ensure rendering
      setTimeout(() => {
        let ref = null;
        switch (sectionParam) {
          case "mood": ref = moodRef; break;
          case "trigger": ref = triggerRef; break;
          case "gratitude": ref = gratitudeRef; break;
          case "cbt": ref = cbtRef; break;
          case "dbt": ref = dbtRef; break;
          case "goals": ref = goalsRef; break;
          case "relationships": ref = relationshipsRef; break;
          default: break;
        }
        
        if (ref && ref.current) {
          const headerOffset = 80;
          const elementPosition = ref.current.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [location]);

  // Handle tab change and scroll to section
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    
    // Scroll to the corresponding section
    let ref = null;
    switch (tabId) {
      case "mood":
        ref = moodRef;
        break;
      case "trigger":
        ref = triggerRef;
        break;
      case "gratitude":
        ref = gratitudeRef;
        break;
      case "cbt":
        ref = cbtRef;
        break;
      case "dbt":
        ref = dbtRef;
        break;
      case "goals":
        ref = goalsRef;
        break;
      case "relationships":
        ref = relationshipsRef;
        break;
      default:
        break;
    }
    
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-mindtrack-cream"
    >
      <Navigation />
      <HeroSection 
        showFavorites={showFavorites} 
        setShowFavorites={setShowFavorites}
      />
      
      <main>
        <DashboardTabs
          activeTab={activeTab}
          handleTabChange={handleTabChange}
        />
        
        <MainContent 
          activeTab={activeTab}
          showFavorites={showFavorites}
          moodRef={moodRef}
          triggerRef={triggerRef}
          gratitudeRef={gratitudeRef}
          cbtRef={cbtRef}
          dbtRef={dbtRef}
          goalsRef={goalsRef}
          relationshipsRef={relationshipsRef}
        />
      </main>
      
      <Footer />
    </motion.div>
  );
};

export default Index;
