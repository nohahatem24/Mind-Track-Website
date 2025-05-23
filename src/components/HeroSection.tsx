
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
              onClick={() => scrollToSection('mood')}
            />
            <FeatureCard
              icon={<ScrollText className="w-6 h-6" />}
              title="Trigger Tracking"
              description="Document and understand your emotional triggers to develop healthier coping mechanisms."
              onClick={() => scrollToSection('trigger')}
            />
            <FeatureCard
              icon={<Sparkles className="w-6 h-6" />}
              title="Gratitude Journal"
              description="Cultivate positivity by recording daily moments of gratitude and appreciation."
              onClick={() => scrollToSection('gratitude')}
            />
            <FeatureCard
              icon={<Brain className="w-6 h-6" />}
              title="CBT Techniques"
              description="Access proven cognitive behavioral therapy exercises to improve your mental wellbeing."
              onClick={() => scrollToSection('cbt')}
            />
            <FeatureCard
              icon={<Layers className="w-6 h-6" />}
              title="DBT Techniques"
              description="Learn dialectical behavior therapy skills for emotional regulation and mindfulness."
              onClick={() => scrollToSection('dbt')}
            />
            <FeatureCard
              icon={<Target className="w-6 h-6" />}
              title="Goal Setting"
              description="Set and track personal growth goals aligned with your mental health journey."
              onClick={() => scrollToSection('goals')}
            />
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Relationships"
              description="Track and improve your interpersonal connections and communication patterns."
              onClick={() => scrollToSection('relationships')}
            />
            <FeatureCard
              icon={<Heart className="w-6 h-6" />}
              title="Favorites"
              description="Save important entries and insights for quick access and review."
              onClick={toggleFavorites}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
