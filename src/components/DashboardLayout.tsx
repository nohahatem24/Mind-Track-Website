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
  AlertTriangle,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useI18n } from "@/i18n/I18nProvider";
import { supabase } from "@/integrations/supabase/client";
import AuthButton from "./auth/AuthButton";
import ProfileMenu from "./auth/ProfileMenu";
import { LanguageSwitcher } from "./LanguageSwitcher";

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
  {
    id: "crisis",
    label: "Crisis Resources",
    icon: <AlertTriangle className="w-5 h-5" />,
    section: "crisis",
  },
];

const Sidebar: React.FC<{
  activeSection: string;
  onSectionChange: (section: string) => void;
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
}> = ({ activeSection, onSectionChange, isMobile, isOpen, onClose }) => {
  const { t, isRTL } = useI18n();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [fullName, setFullName] = useState<string | undefined>();

  // Translation mapping for sidebar items
  const getSidebarLabel = (sectionId: string): string => {
    const labelMap: Record<string, string> = {
      dashboard: t('navigation.dashboard'),
      mood: t('dashboard.mood_today'),
      trigger: t('navigation.trigger_tracker'),
      gratitude: t('navigation.journal'),
      cbt: t('navigation.cbt_techniques'),
      dbt: t('navigation.dbt_techniques'),
      goals: t('navigation.goal_tracker'),
      relationships: t('navigation.relationships'),
      crisis: t('navigation.crisis_resources'),
    };
    return labelMap[sectionId] || sectionId;
  };

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
        className={`fixed top-0 h-screen w-64 bg-mindtrack-cream border-${isRTL ? 'l' : 'r'} border-mindtrack-sage/10 flex flex-col ${isRTL ? 'right-0' : 'left-0'}`}
        initial={{ [isRTL ? 'right' : 'x']: isRTL ? -256 : -256 }}
        animate={{ [isRTL ? 'right' : 'x']: 0 }}
        transition={{ duration: 0.3 }}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Logo / Header */}
        <button
        type="button"
        onClick={() => onSectionChange("dashboard")}
        className={`w-full p-6 border-b border-mindtrack-sage/10 hover:bg-mindtrack-sage/5 transition-colors rounded-lg`}
        >
        <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-2`}>
          <div className="w-10 h-10 rounded-lg bg-mindtrack-sage flex items-center justify-center">
          <BookHeart className="w-7 h-7 text-white" />
          </div>
          <span className={`font-semibold text-mindtrack-stone ${isRTL ? 'text-right' : ''}`}>
          MindTrack
          </span>
        </div>
        </button>

        {/* Navigation Items */}
        <nav className={`flex-1 p-4 space-y-2 overflow-y-auto ${isRTL ? 'rtl' : ''}`}>
        {SIDEBAR_ITEMS.map((item) => (
          <button
          type="button"
          key={item.id}
          onClick={() => onSectionChange(item.section)}
          disabled={activeSection === item.section}
          className={`w-full flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            activeSection === item.section
            ? "bg-mindtrack-sage/10 text-mindtrack-sage font-semibold cursor-default"
            : "text-mindtrack-stone hover:bg-mindtrack-sage/5 active:bg-mindtrack-sage/10"
          }`}
          >
          <div className="flex-shrink-0">{item.icon}</div>
          <span className={`text-sm font-medium ${isRTL ? 'text-right' : ''}`}>{getSidebarLabel(item.id)}</span>
          </button>
        ))}
        </nav>

        {/* Footer Info */}
        <div className={`p-4 border-t border-mindtrack-sage/10 ${isRTL ? 'rtl' : ''}`}>
        <p className={`text-xs text-mindtrack-stone/60 text-center mb-4 ${isRTL ? 'text-right' : ''}`}>
          {t('common.safe_space')}
        </p>
        
        {/* Language Switcher */}
        <div className="mb-3">
          <LanguageSwitcher />
        </div>
        
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
          initial={{ [isRTL ? 'right' : 'x']: isRTL ? -280 : -280 }}
          animate={{ [isRTL ? 'right' : 'x']: 0 }}
          exit={{ [isRTL ? 'right' : 'x']: isRTL ? -280 : -280 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-0 h-screen w-72 bg-mindtrack-cream flex flex-col z-50 ${isRTL ? 'right-0' : 'left-0'}`}
          dir={isRTL ? 'rtl' : 'ltr'}
          >
          {/* Header with Close */}
          <div className={`p-6 border-b border-mindtrack-sage/10 flex ${isRTL ? 'flex-row-reverse' : ''} items-center justify-between`}>
            <button
            type="button"
            onClick={() => {
              onSectionChange("dashboard");
              onClose();
            }}
            className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-2 hover:opacity-80 transition-opacity`}
            >
            <div className="w-10 h-10 rounded-lg bg-mindtrack-sage flex items-center justify-center">
              <BookHeart className="w-7 h-7 text-white" />
            </div>
            <span className={`font-semibold text-mindtrack-stone ${isRTL ? 'text-right' : ''}`}>
              MindTrack
            </span>
            </button>
            <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-mindtrack-sage/5 rounded-lg transition-colors"
            aria-label="Close menu"
            >
            <X className="w-5 h-5 text-mindtrack-stone" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className={`flex-1 p-4 space-y-2 overflow-y-auto ${isRTL ? 'rtl' : ''}`}>
            {SIDEBAR_ITEMS.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => {
              onSectionChange(item.section);
              onClose();
              }}
              disabled={activeSection === item.section}
              className={`w-full flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeSection === item.section
                ? "bg-mindtrack-sage/10 text-mindtrack-sage font-semibold cursor-default"
                : "text-mindtrack-stone hover:bg-mindtrack-sage/5 active:bg-mindtrack-sage/10"
              }`}
            >
              <div className="flex-shrink-0">{item.icon}</div>
              <span className={`text-sm font-medium ${isRTL ? 'text-right' : ''}`}>{getSidebarLabel(item.id)}</span>
            </button>
            ))}
          </nav>

          {/* Footer Info */}
          <div className={`p-4 border-t border-mindtrack-sage/10 ${isRTL ? 'rtl' : ''}`}>
            <p className={`text-xs text-mindtrack-stone/60 text-center mb-4 ${isRTL ? 'text-right' : ''}`}>
            {t('common.safe_space')}
            </p>
            
            {/* Language Switcher */}
            <div className="mb-3">
              <LanguageSwitcher />
            </div>
            
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
  const { isRTL } = useI18n();
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
      <div className={`${!isMobile ? (isRTL ? 'mr-64' : 'ml-64') : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Mobile Header */}
        {isMobile && (
          <div className={`sticky top-0 z-30 bg-mindtrack-cream border-b border-mindtrack-sage/10 p-4 flex ${isRTL ? 'flex-row-reverse' : ''} items-center justify-between gap-3`}>
            <button
              type="button"
              onClick={() => onSectionChange("dashboard")}
              className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-2 hover:opacity-80 transition-opacity`}
            >
              <div className="w-10 h-10 rounded-lg bg-mindtrack-sage text-white flex items-center justify-center font-semibold text-sm">
                <BookHeart className="w-7 h-7 text-white" />
              </div>
              
              <span className={`font-semibold text-mindtrack-stone text-lg ${isRTL ? 'text-right' : ''}`}>
                MindTrack
              </span>
            </button>
            <div className="flex-1"></div>
            <LanguageSwitcher />
            <button
              type="button"
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
