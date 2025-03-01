
import { motion } from "framer-motion";
import { BookHeart, Heart, ScrollText, Sparkles, BarChart3, Target, Brain } from "lucide-react";
import GratitudeJournal from "@/components/GratitudeJournal";
import Navigation from "@/components/Navigation";
import TriggerTracker from "@/components/TriggerTracker";
import MoodTracker from "@/components/mood-tracker/MoodTracker";
import CBTTechniques from "@/components/CBTTechniques";
import GoalTracker from "@/components/GoalTracker";
import { useState, useEffect, useRef } from "react";

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
      
      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="mindtrack-container">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <BookHeart className="w-16 h-16 text-mindtrack-sage mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold text-mindtrack-stone mb-4">
                Track Your Journey to Better Mental Health
              </h1>
              <p className="text-xl text-mindtrack-stone/80 mb-8">
                A safe space to document your triggers, explore your emotions, and practice gratitude.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid md:grid-cols-3 gap-6 mt-12"
            >
              <FeatureCard
                icon={<BarChart3 className="w-6 h-6" />}
                title="Mood Tracking"
                description="Track your daily moods from -10 to +10 and visualize changes over time."
                onClick={() => handleTabChange("mood")}
              />
              <FeatureCard
                icon={<ScrollText className="w-6 h-6" />}
                title="Trigger Tracking"
                description="Document and understand your emotional triggers to develop healthier coping mechanisms."
                onClick={() => handleTabChange("trigger")}
              />
              <FeatureCard
                icon={<Sparkles className="w-6 h-6" />}
                title="Gratitude Journal"
                description="Cultivate positivity by recording daily moments of gratitude and appreciation."
                onClick={() => handleTabChange("gratitude")}
              />
              <FeatureCard
                icon={<Brain className="w-6 h-6" />}
                title="CBT Techniques"
                description="Access proven cognitive behavioral therapy exercises to improve your mental wellbeing."
                onClick={() => handleTabChange("cbt")}
              />
              <FeatureCard
                icon={<Target className="w-6 h-6" />}
                title="Goal Setting"
                description="Set and track personal growth goals aligned with your mental health journey."
                onClick={() => handleTabChange("goals")}
              />
              <FeatureCard
                icon={<Heart className="w-6 h-6" />}
                title="Favorites"
                description="Save important entries and insights for quick access and review."
                onClick={() => setShowFavorites(!showFavorites)}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dashboard Tabs */}
      <div className="mindtrack-container mb-8">
        <div className="border-b border-mindtrack-sage/10">
          <div className="flex overflow-x-auto no-scrollbar">
            <button
              onClick={() => handleTabChange("mood")}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 ${
                activeTab === "mood"
                  ? "border-mindtrack-sage text-mindtrack-sage"
                  : "border-transparent text-mindtrack-stone/70 hover:text-mindtrack-stone"
              }`}
            >
              Mood Tracking
            </button>
            <button
              onClick={() => handleTabChange("trigger")}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 ${
                activeTab === "trigger"
                  ? "border-mindtrack-sage text-mindtrack-sage"
                  : "border-transparent text-mindtrack-stone/70 hover:text-mindtrack-stone"
              }`}
            >
              Trigger Tracking
            </button>
            <button
              onClick={() => handleTabChange("gratitude")}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 ${
                activeTab === "gratitude"
                  ? "border-mindtrack-sage text-mindtrack-sage"
                  : "border-transparent text-mindtrack-stone/70 hover:text-mindtrack-stone"
              }`}
            >
              Gratitude Journal
            </button>
            <button
              onClick={() => handleTabChange("cbt")}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 ${
                activeTab === "cbt"
                  ? "border-mindtrack-sage text-mindtrack-sage"
                  : "border-transparent text-mindtrack-stone/70 hover:text-mindtrack-stone"
              }`}
            >
              CBT Techniques
            </button>
            <button
              onClick={() => handleTabChange("goals")}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 ${
                activeTab === "goals"
                  ? "border-mindtrack-sage text-mindtrack-sage"
                  : "border-transparent text-mindtrack-stone/70 hover:text-mindtrack-stone"
              }`}
            >
              Goal Tracker
            </button>
          </div>
        </div>
      </div>

      {/* Favorites Toggle */}
      <div className="mindtrack-container">
        <button
          onClick={() => setShowFavorites(!showFavorites)}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-white border border-mindtrack-sage/10 rounded-lg shadow-sm hover:bg-mindtrack-sage/5 transition-colors"
        >
          <Heart className={`w-4 h-4 ${showFavorites ? 'fill-mindtrack-sage text-mindtrack-sage' : 'text-mindtrack-sage'}`} />
          {showFavorites ? 'Show All Entries' : 'Show Favorites'}
        </button>
      </div>

      {/* Content with refs for each section */}
      <div id="mood" ref={moodRef}>
        {activeTab === "mood" && <MoodTracker showOnlyFavorites={showFavorites} />}
      </div>
      <div id="trigger" ref={triggerRef}>
        {activeTab === "trigger" && <TriggerTracker showOnlyFavorites={showFavorites} />}
      </div>
      <div id="gratitude" ref={gratitudeRef}>
        {activeTab === "gratitude" && <GratitudeJournal showOnlyFavorites={showFavorites} />}
      </div>
      <div id="cbt" ref={cbtRef}>
        {activeTab === "cbt" && <CBTTechniques showOnlyFavorites={showFavorites} />}
      </div>
      <div id="goals" ref={goalsRef}>
        {activeTab === "goals" && <GoalTracker showOnlyFavorites={showFavorites} />}
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-mindtrack-sage/10">
        <div className="mindtrack-container">
          <div className="flex items-center justify-center gap-2 text-mindtrack-stone/60">
            <BookHeart className="w-5 h-5" />
            <p>MindTrack © 2024</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  onClick
}: { 
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
}) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="mindtrack-card cursor-pointer"
    onClick={onClick}
  >
    <div className="text-mindtrack-sage mb-3">{icon}</div>
    <h3 className="text-lg font-semibold text-mindtrack-stone mb-2">{title}</h3>
    <p className="text-mindtrack-stone/80">{description}</p>
  </motion.div>
);

export default Index;
