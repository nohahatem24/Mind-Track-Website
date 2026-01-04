import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Zap,
  Heart,
  Brain,
  Target,
  Users,
  BookOpen,
  BookHeart,
  Menu,
  X,
  Home,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import AuthButton from "./auth/AuthButton";
import ProfileMenu from "./auth/ProfileMenu";

interface AuthUser {
  id: string;
  email: string | undefined;
  user_metadata?: {
    full_name?: string;
  };
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  section: string;
}

interface DashboardLayoutProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  children: React.ReactNode;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <Home className="w-5 h-5" />,
    section: "dashboard",
  },
  {
    id: "mood",
    label: "Mood Tracking",
    icon: <BarChart3 className="w-5 h-5" />,
    section: "mood",
  },
  {
    id: "trigger",
    label: "Trigger Tracking",
    icon: <Zap className="w-5 h-5" />,
    section: "trigger",
  },
  {
    id: "gratitude",
    label: "Gratitude Journal",
    icon: <Heart className="w-5 h-5" />,
    section: "gratitude",
  },
  {
    id: "cbt",
    label: "CBT Techniques",
    icon: <Brain className="w-5 h-5" />,
    section: "cbt",
  },
  {
    id: "dbt",
    label: "DBT Techniques",
    icon: <BookOpen className="w-5 h-5" />,
    section: "dbt",
  },
  {
    id: "goals",
    label: "Goal Tracker",
    icon: <Target className="w-5 h-5" />,
    section: "goals",
  },
  {
    id: "relationships",
    label: "Relationships",
    icon: <Users className="w-5 h-5" />,
    section: "relationships",
  },
];

const Sidebar: React.FC<{
  activeSection: string;
  onSectionChange: (section: string) => void;
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
}> = ({ activeSection, onSectionChange, isMobile, isOpen, onClose }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [fullName, setFullName] = useState<string | undefined>();

  // Check user login status
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
  return (
    <>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <motion.div
          className="fixed left-0 top-0 h-screen w-64 bg-mindtrack-cream border-r border-mindtrack-sage/10 flex flex-col"
          initial={{ x: -256 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Logo / Header */}
          <div className="p-6 border-b border-mindtrack-sage/10">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-mindtrack-sage flex items-center justify-center">
                <BookHeart className="w-7 h-7 text-white" />
              </div>
              <span className="font-semibold text-mindtrack-stone">
                MindTrack
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {SIDEBAR_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.section)}
                disabled={activeSection === item.section}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeSection === item.section
                    ? "bg-mindtrack-sage/10 text-mindtrack-sage font-semibold cursor-default"
                    : "text-mindtrack-stone hover:bg-mindtrack-sage/5 active:bg-mindtrack-sage/10"
                }`}
              >
                <div className="flex-shrink-0">{item.icon}</div>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Footer Info */}
          <div className="p-4 border-t border-mindtrack-sage/10">
            <p className="text-xs text-mindtrack-stone/60 text-center mb-4">
              Your safe space for emotional growth
            </p>
            
            {/* Auth Button / Profile Menu */}
            <div className="mt-2">
              {user ? (
                <ProfileMenu user={user} fullName={fullName} isCompact={true} />
              ) : (
                <AuthButton />
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Mobile Sidebar (Sheet) */}
      {isMobile && (
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/20 z-40"
              />

              {/* Sheet */}
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ duration: 0.3 }}
                className="fixed left-0 top-0 h-screen w-72 bg-mindtrack-cream flex flex-col z-50"
              >
                {/* Header with Close */}
                <div className="p-6 border-b border-mindtrack-sage/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-mindtrack-sage flex items-center justify-center">
                      <BookHeart className="w-7 h-7 text-white" />
                    </div>
                    <span className="font-semibold text-mindtrack-stone">
                      MindTrack
                    </span>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1 hover:bg-mindtrack-sage/5 rounded-lg transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5 text-mindtrack-stone" />
                  </button>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                  {SIDEBAR_ITEMS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSectionChange(item.section);
                        onClose();
                      }}
                      disabled={activeSection === item.section}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        activeSection === item.section
                          ? "bg-mindtrack-sage/10 text-mindtrack-sage font-semibold cursor-default"
                          : "text-mindtrack-stone hover:bg-mindtrack-sage/5 active:bg-mindtrack-sage/10"
                      }`}
                    >
                      <div className="flex-shrink-0">{item.icon}</div>
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  ))}
                </nav>

                {/* Footer Info */}
                <div className="p-4 border-t border-mindtrack-sage/10">
                  <p className="text-xs text-mindtrack-stone/60 text-center mb-4">
                    Your safe space for emotional growth
                  </p>
                  
                  {/* Auth Button / Profile Menu */}
                  <div className="mt-2">
                    {user ? (
                      <ProfileMenu user={user} fullName={fullName} isCompact={true} />
                    ) : (
                      <AuthButton />
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}
    </>
  );
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  activeSection,
  onSectionChange,
  children,
}) => {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-mindtrack-cream">
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={onSectionChange}
        isMobile={isMobile}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className={`${!isMobile ? "ml-64" : ""}`}>
        {/* Mobile Header */}
        {isMobile && (
          <div className="sticky top-0 z-30 bg-mindtrack-cream border-b border-mindtrack-sage/10 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-mindtrack-sage text-white flex items-center justify-center font-semibold text-sm">
                <BookHeart className="w-7 h-7 text-white" />
              </div>
              
              <span className="font-semibold text-mindtrack-stone text-sm">
                MindTrack
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-mindtrack-sage/5 rounded-lg transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-mindtrack-stone" />
              ) : (
                <Menu className="w-5 h-5 text-mindtrack-stone" />
              )}
            </button>
          </div>
        )}

        {/* Content Area */}
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
