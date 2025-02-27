import { motion } from "framer-motion";
import { BookHeart, Heart, ScrollText, Sparkles } from "lucide-react";
import GratitudeJournal from "@/components/GratitudeJournal";
import Navigation from "@/components/Navigation";
import TriggerTracker from "@/components/TriggerTracker";
import { useState, useEffect } from "react";

const Index = () => {
  const [showFavorites, setShowFavorites] = useState(false);
  
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
              className="grid md:grid-cols-2 gap-6 mt-12"
            >
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
            </motion.div>
          </div>
        </div>
      </section>

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
      <TriggerTracker showOnlyFavorites={showFavorites} />
      <GratitudeJournal showOnlyFavorites={showFavorites} />

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
