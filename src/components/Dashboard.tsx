import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, Zap, Heart, Brain, Target, Users, BookOpen, User, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AuthComponent from "./auth/AuthComponent";
import ProfileMenu from "./auth/ProfileMenu";

interface AuthUser {
  id: string;
  email: string | undefined;
  user_metadata?: {
    full_name?: string;
  };
}

interface DashboardFeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}

const DashboardFeatureCard: React.FC<DashboardFeatureCardProps> = ({
  icon,
  title,
  description,
  color,
  onClick,
}) => {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`text-left p-6 rounded-lg border-2 transition-all hover:shadow-md ${color}`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0 mt-1">{icon}</div>
        <h3 className="font-semibold text-mindtrack-stone text-lg">{title}</h3>
      </div>
      <p className="text-mindtrack-stone/70 text-sm">{description}</p>
    </motion.button>
  );
};

interface DashboardProps {
  onFeatureClick: (section: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onFeatureClick }) => {
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [fullName, setFullName] = useState<string | undefined>();

  // Check if user is logged in and fetch their name
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          setIsLoggedIn(true);
          const authUser = data.session.user;
          setUser({
            id: authUser.id,
            email: authUser.email,
            user_metadata: authUser.user_metadata,
          });

          // Try to get full name from user metadata first
          if (authUser.user_metadata?.full_name) {
            const firstName = authUser.user_metadata.full_name.split(" ")[0];
            setUserName(firstName);
            setFullName(authUser.user_metadata.full_name);
          }

          // Try to get from profiles table as backup
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: profileData } = await (supabase as any)
              .from("profiles")
              .select("full_name")
              .eq("id", authUser.id)
              .single();

            if (profileData?.full_name) {
              const firstName = profileData.full_name.split(" ")[0];
              setUserName(firstName);
              setFullName(profileData.full_name);
            }
          } catch (profileError) {
            console.error("Profile fetch error (non-blocking):", profileError);
          }
        } else {
          setIsLoggedIn(false);
          setUserName(null);
          setUser(null);
          setFullName(undefined);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    checkUser();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setIsLoggedIn(true);
          setUser({
            id: session.user.id,
            email: session.user.email,
            user_metadata: session.user.user_metadata,
          });

          if (session.user.user_metadata?.full_name) {
            const firstName = session.user.user_metadata.full_name.split(" ")[0];
            setUserName(firstName);
            setFullName(session.user.user_metadata.full_name);
          }

          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: profileData } = await (supabase as any)
              .from("profiles")
              .select("full_name")
              .eq("id", session.user.id)
              .single();

            if (profileData?.full_name) {
              const firstName = profileData.full_name.split(" ")[0];
              setUserName(firstName);
              setFullName(profileData.full_name);
            }
          } catch (profileError) {
            console.error("Profile fetch error:", profileError);
          }
        } else if (event === "SIGNED_OUT") {
          setIsLoggedIn(false);
          setUserName(null);
          setUser(null);
          setFullName(undefined);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);
  const features = [
    {
      id: "mood",
      icon: <BarChart3 className="w-6 h-6 text-mindtrack-sage" />,
      title: "Mood Tracking",
      description: "Monitor your emotional patterns and discover what influences your mood throughout the day.",
      color: "border-mindtrack-sage/20 bg-mindtrack-sage/10 hover:border-mindtrack-sage/40",
    },
    {
      id: "trigger",
      icon: <Zap className="w-6 h-6 text-amber-600" />,
      title: "Trigger Tracking",
      description: "Identify and understand what triggers your emotional responses.",
      color: "border-amber-200 bg-amber-50 hover:border-amber-300",
    },
    {
      id: "gratitude",
      icon: <Heart className="w-6 h-6 text-rose-600" />,
      title: "Gratitude Journal",
      description: "Cultivate positivity by reflecting on what you're grateful for each day.",
      color: "border-rose-200 bg-rose-50 hover:border-rose-300",
    },
    {
      id: "cbt",
      icon: <Brain className="w-6 h-6 text-purple-600" />,
      title: "CBT Techniques",
      description: "Learn cognitive behavioral therapy skills to reshape unhelpful thought patterns.",
      color: "border-purple-200 bg-purple-50 hover:border-purple-300",
    },
    {
      id: "dbt",
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      title: "DBT Techniques",
      description: "Practice dialectical behavior therapy skills for emotional regulation and distress tolerance.",
      color: "border-blue-200 bg-blue-50 hover:border-blue-300",
    },
    {
      id: "goals",
      icon: <Target className="w-6 h-6 text-green-600" />,
      title: "Goal Tracker",
      description: "Set, monitor, and achieve meaningful goals aligned with your values.",
      color: "border-green-200 bg-green-50 hover:border-green-300",
    },
    {
      id: "relationships",
      icon: <Users className="w-6 h-6 text-cyan-600" />,
      title: "Relationships",
      description: "Explore and strengthen your connections with others.",
      color: "border-cyan-200 bg-cyan-50 hover:border-cyan-300",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold text-mindtrack-stone mb-3">
          {isLoggedIn && userName ? `Welcome back, ${userName}!` : "Welcome to MindTrack"}
        </h1>
        <p className="text-lg text-mindtrack-stone/70 mb-4">
          {isLoggedIn ? "Here's your personal wellness dashboard." : "Track Your Journey to Better Mental Health."}
        </p>
        <p className="text-mindtrack-stone/60 max-w-2xl">
          MindTrack is a compassionate companion for understanding your emotions, tracking your patterns, and discovering tools that help you thrive. 
        </p>
      </motion.div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <DashboardFeatureCard
            key={feature.id}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            color={feature.color}
            onClick={() => onFeatureClick(feature.id)}
          />
        ))}
      </div>

      {/* Recent Activity Section (Optional) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-16 p-8 rounded-lg border border-mindtrack-sage/10 bg-mindtrack-sage/2"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold text-mindtrack-stone mb-4">
              {isLoggedIn ? "Continue Your Journey" : "Ready to Get Started?"}
            </h2>
            <ul className="space-y-2 text-mindtrack-stone/70 text-sm">
              <li>✓ Track your mood and identify patterns</li>
              <li>✓ Discover what triggers your emotions</li>
              <li>✓ Practice evidence-based therapeutic techniques</li>
              <li>✓ Build meaningful goals and relationships</li>
            </ul>
          </div>

          {/* Register Button or Profile */}
          {isLoggedIn ? (
            <div className="flex justify-center md:justify-end">
              <ProfileMenu user={user!} fullName={fullName} />
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-mindtrack-sage text-white rounded-lg hover:bg-mindtrack-sage/90 transition-colors font-medium shadow-md hover:shadow-lg whitespace-nowrap"
            >
              <span>Register</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Auth Modal */}
      {showAuthModal && <AuthComponent onClose={() => setShowAuthModal(false)} />}
    </div>
  );
};

export default Dashboard;
