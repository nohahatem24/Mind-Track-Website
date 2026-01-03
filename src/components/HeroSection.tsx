
import { motion } from "framer-motion";
import { BookHeart, Heart, ScrollText, Sparkles, BarChart3, Target, Brain, Users, Layers } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";
import FeatureCard from "./FeatureCard";

interface HeroSectionProps {
  showFavorites: boolean;
  setShowFavorites: Dispatch<SetStateAction<boolean>>;
}

const HeroSection = ({ showFavorites, setShowFavorites }: HeroSectionProps) => {
  // Toggle favorites function to use with the Favorites feature card
  const toggleFavorites = () => {
    setShowFavorites(prev => !prev);
  };

  // Function to scroll to a section
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      // Calculate offset to account for the fixed header
      const headerOffset = 80;
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="pt-32 pb-20 bg-gradient-to-b from-white via-mindtrack-sage/5 to-mindtrack-cream">
      <div className="mindtrack-container">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="mb-8 flex justify-center">
              <div className="p-4 bg-mindtrack-sage/10 rounded-full">
                <BookHeart className="w-16 h-16 text-mindtrack-sage" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-mindtrack-stone mb-6 leading-tight">
              Your Safe Space for Emotional Growth
            </h1>
            <p className="text-xl text-mindtrack-stone/70 max-w-2xl mx-auto leading-relaxed">
              MindTrack is a compassionate companion for understanding your emotions, tracking your mood patterns, and discovering tools that help you thrive. Built with care for your mental wellbeing.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          >
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Mood Tracking"
              description="Understand your emotional patterns with daily mood logging and visual trends."
              onClick={() => scrollToSection('mood')}
            />
            <FeatureCard
              icon={<ScrollText className="w-6 h-6" />}
              title="Trigger Tracking"
              description="Identify what impacts your emotions and build awareness of your patterns."
              onClick={() => scrollToSection('trigger')}
            />
            <FeatureCard
              icon={<Sparkles className="w-6 h-6" />}
              title="Gratitude Journal"
              description="Cultivate positivity by honoring moments of joy and appreciation daily."
              onClick={() => scrollToSection('gratitude')}
            />
            <FeatureCard
              icon={<Brain className="w-6 h-6" />}
              title="CBT Techniques"
              description="Explore evidence-based exercises to shift thought patterns and emotions."
              onClick={() => scrollToSection('cbt')}
            />
            <FeatureCard
              icon={<Layers className="w-6 h-6" />}
              title="DBT Skills"
              description="Learn mindfulness and emotion regulation techniques when you need them."
              onClick={() => scrollToSection('dbt')}
            />
            <FeatureCard
              icon={<Target className="w-6 h-6" />}
              title="Goal Setting"
              description="Create meaningful personal growth goals aligned with your values."
              onClick={() => scrollToSection('goals')}
            />
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Relationships"
              description="Strengthen connections by reflecting on your interactions and communication."
              onClick={() => scrollToSection('relationships')}
            />
            <FeatureCard
              icon={<Heart className="w-6 h-6" />}
              title="Favorites"
              description="Bookmark insights and moments that matter most to you."
              onClick={toggleFavorites}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
