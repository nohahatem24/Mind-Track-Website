
import { motion } from "framer-motion";
import { BookHeart, Heart, ScrollText, Sparkles, BarChart3, Target, Brain, Users, Layers } from "lucide-react";
import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import FeatureCard from "./FeatureCard";
import AuthComponent from "./auth/AuthComponent";
import ProfileMenu from "./auth/ProfileMenu";

interface AuthUser {
  id: string;
  email: string | undefined;
  user_metadata?: {
    full_name?: string;
  };
}

interface HeroSectionProps {
  showFavorites: boolean;
  setShowFavorites: Dispatch<SetStateAction<boolean>>;
}

const HeroSection = ({ showFavorites, setShowFavorites }: HeroSectionProps) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [fullName, setFullName] = useState<string | undefined>();

  // Toggle favorites function to use with the Favorites feature card
  const toggleFavorites = () => {
    setShowFavorites(prev => !prev);
  };

  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          const authUser = data.session.user;
          setUser({
            id: authUser.id,
            email: authUser.email,
            user_metadata: authUser.user_metadata,
          });

          if (authUser.user_metadata?.full_name) {
            setFullName(authUser.user_metadata.full_name);
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }

      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (event === "SIGNED_IN" && session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email,
              user_metadata: session.user.user_metadata,
            });
            if (session.user.user_metadata?.full_name) {
              setFullName(session.user.user_metadata.full_name);
            }
          } else if (event === "SIGNED_OUT") {
            setUser(null);
            setFullName(undefined);
          }
        }
      );

      return () => {
        authListener?.subscription.unsubscribe();
      };
    };

    checkUser();
  }, []);

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

            {/* Sign Up / Login or Profile Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-8 flex justify-center"
            >
              {user ? (
                <div className="w-full md:w-auto flex justify-center">
                  <ProfileMenu user={user} fullName={fullName} />
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-mindtrack-sage text-white rounded-lg hover:bg-mindtrack-sage/90 transition-colors font-medium shadow-md hover:shadow-lg"
                >
                  <User className="w-5 h-5" />
                  <span>Start Your Journey</span>
                </button>
              )}
            </motion.div>
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

      {/* Auth Modal */}
      {showAuthModal && <AuthComponent onClose={() => setShowAuthModal(false)} />}
    </section>
  );
};

export default HeroSection;
