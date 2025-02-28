
import { motion } from "framer-motion";
import { BookHeart, Heart, ScrollText, Sparkles, BarChart3, Target, Brain } from "lucide-react";
import GratitudeJournal from "@/components/GratitudeJournal";
import Navigation from "@/components/Navigation";
import TriggerTracker from "@/components/TriggerTracker";
import MoodTracker from "@/components/MoodTracker";
import CBTTechniques from "@/components/CBTTechniques";
import GoalTracker from "@/components/GoalTracker";
import { useState, useEffect } from "react";

const Index = () => {
  const [showFavorites, setShowFavorites] = useState(false);
  const [activeTab, setActiveTab] = useState("mood");
  
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
              />
              <FeatureCard
                icon={<ScrollText className="w-6 h-6" />}
                title="Trigger Tracking"
                description="Document and understand your emotional triggers to develop healthier coping mechanisms."
              />
              <FeatureCard
                icon={<Sparkles className="w-6 h-6" />}
                title="Gratitude Journal"
                description="Cultivate positivity by recording daily moments of gratitude and appreciation."
              />
              <FeatureCard
                icon={<Brain className="w-6 h-6" />}
                title="CBT Techniques"
                description="Access proven cognitive behavioral therapy exercises to improve your mental wellbeing."
              />
              <FeatureCard
                icon={<Target className="w-6 h-6" />}
                title="Goal Setting"
                description="Set and track personal growth goals aligned with your mental health journey."
              />
              <FeatureCard
                icon={<Heart className="w-6 h-6" />}
                title="Favorites"
                description="Save important entries and insights for quick access and review."
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
              onClick={() => setActiveTab("mood")}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 ${
                activeTab === "mood"
                  ? "border-mindtrack-sage text-mindtrack-sage"
                  : "border-transparent text-mindtrack-stone/70 hover:text-mindtrack-stone"
              }`}
            >
              Mood Tracking
            </button>
            <button
              onClick={() => setActiveTab("trigger")}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 ${
                activeTab === "trigger"
                  ? "border-mindtrack-sage text-mindtrack-sage"
                  : "border-transparent text-mindtrack-stone/70 hover:text-mindtrack-stone"
              }`}
            >
              Trigger Tracking
            </button>
            <button
              onClick={() => setActiveTab("gratitude")}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 ${
                activeTab === "gratitude"
                  ? "border-mindtrack-sage text-mindtrack-sage"
                  : "border-transparent text-mindtrack-stone/70 hover:text-mindtrack-stone"
              }`}
            >
              Gratitude Journal
            </button>
            <button
              onClick={() => setActiveTab("cbt")}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 ${
                activeTab === "cbt"
                  ? "border-mindtrack-sage text-mindtrack-sage"
                  : "border-transparent text-mindtrack-stone/70 hover:text-mindtrack-stone"
              }`}
            >
              CBT Techniques
            </button>
            <button
              onClick={() => setActiveTab("goals")}
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

      {/* Content */}
      {activeTab === "mood" && <MoodTracker showOnlyFavorites={showFavorites} />}
      {activeTab === "trigger" && <TriggerTracker showOnlyFavorites={showFavorites} />}
      {activeTab === "gratitude" && <GratitudeJournal showOnlyFavorites={showFavorites} />}
      {activeTab === "cbt" && <CBTTechniques showOnlyFavorites={showFavorites} />}
      {activeTab === "goals" && <GoalTracker showOnlyFavorites={showFavorites} />}

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
  description 
}: { 
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="mindtrack-card"
  >
    <div className="text-mindtrack-sage mb-3">{icon}</div>
    <h3 className="text-lg font-semibold text-mindtrack-stone mb-2">{title}</h3>
    <p className="text-mindtrack-stone/80">{description}</p>
  </motion.div>
);

export default Index;
