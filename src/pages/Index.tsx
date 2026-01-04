
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import Dashboard from "@/components/Dashboard";
import MoodTracker from "@/components/mood-tracker/MoodTracker";
import TriggerTracker from "@/components/TriggerTracker";
import GratitudeJournal from "@/components/GratitudeJournal";
import CBTTechniques from "@/components/cbt/CBTTechniques";
import DBTTechniques from "@/components/dbt/DBTTechniques";
import GoalTracker from "@/components/goal-tracker/GoalTracker";
import RelationshipTracker from "@/components/RelationshipTracker";
import Footer from "@/components/Footer";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showFavorites, setShowFavorites] = useState(false);
  const location = useLocation();

  // Check for section parameter in URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sectionParam = queryParams.get("section");
    if (sectionParam) {
      setActiveSection(sectionParam);
    }
  }, [location]);

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <Dashboard
            onFeatureClick={(section) => setActiveSection(section)}
          />
        );
      case "mood":
        return <MoodTracker showOnlyFavorites={showFavorites} />;
      case "trigger":
        return <TriggerTracker showOnlyFavorites={showFavorites} />;
      case "gratitude":
        return <GratitudeJournal showOnlyFavorites={showFavorites} />;
      case "cbt":
        return <CBTTechniques showOnlyFavorites={showFavorites} />;
      case "dbt":
        return <DBTTechniques showOnlyFavorites={showFavorites} />;
      case "goals":
        return <GoalTracker showOnlyFavorites={showFavorites} />;
      case "relationships":
        return <RelationshipTracker showOnlyFavorites={showFavorites} />;
      default:
        return (
          <Dashboard
            onFeatureClick={(section) => setActiveSection(section)}
          />
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <DashboardLayout
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      >
        <div className="min-h-screen flex flex-col">
          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
          
          {/* Footer */}
          <Footer />
        </div>
      </DashboardLayout>
    </motion.div>
  );
};

export default Index;
