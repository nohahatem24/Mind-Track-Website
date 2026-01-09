
import { motion } from "framer-motion";
import { BookHeart, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";
import AuthButton from "./auth/AuthButton";
import ProfileMenu from "./auth/ProfileMenu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { supabase } from "@/integrations/supabase/client";

interface AuthUser {
  id: string;
  email: string | undefined;
  user_metadata?: {
    full_name?: string;
  };
}

interface MobileNavLinkProps {
  sectionId: string;
  children: React.ReactNode;
  onClick: (sectionId: string) => void;
}

const Navigation = () => {
  const { t, isRTL } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [fullName, setFullName] = useState<string | undefined>();
  const navigate = useNavigate();

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

  const handleMobileNavClick = (sectionId: string) => {
    // Close the mobile menu
    setIsOpen(false);
    
    // Navigate to the section
    navigateToSection(sectionId);
  };

  // Function to navigate to a section
  const navigateToSection = (sectionId: string) => {
    // Close mobile menu if open
    setIsOpen(false);
    
    // Check if we're already on the homepage
    if (window.location.pathname === "/") {
      // Select the tab first to ensure content is loaded
      const tabButtons = document.querySelectorAll('[data-tab-id]');
      const targetTab = Array.from(tabButtons).find(
        button => (button as HTMLElement).dataset.tabId === sectionId
      ) as HTMLElement | undefined;
      
      if (targetTab) {
        // Simulate click on the tab to activate it
        targetTab.click();
        
        // Then scroll to the section with a short delay to ensure content is rendered
        setTimeout(() => {
          const section = document.getElementById(sectionId);
          if (section) {
            const headerOffset = 80;
            const elementPosition = section.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 50);
      }
    } else {
      // If not on homepage, navigate there with anchor
      navigate(`/?section=${sectionId}`);
    }
  };

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-lg z-50 border-b border-mindtrack-sage/10" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mindtrack-container">
        <div className="flex items-center justify-between h-16">
          <motion.div 
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <Link to="/" className="flex items-center gap-2">
              <BookHeart className="w-6 h-6 text-mindtrack-sage" />
              <span className="text-xl font-semibold text-mindtrack-stone">MindTrack</span>
            </Link>
          </motion.div>

          <div className="hidden md:flex items-center space-x-6">
            <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} space-x-4`}>
              <NavLink sectionId="mood" onClick={navigateToSection}>{t('dashboard.mood_today')}</NavLink>
              <NavLink sectionId="trigger" onClick={navigateToSection}>{t('navigation.trigger_tracker')}</NavLink>
              <NavLink sectionId="gratitude" onClick={navigateToSection}>{t('navigation.journal')}</NavLink>
              <NavLink sectionId="cbt" onClick={navigateToSection}>{t('navigation.cbt_techniques')}</NavLink>
              <NavLink sectionId="dbt" onClick={navigateToSection}>{t('navigation.dbt_techniques')}</NavLink>
              <NavLink sectionId="goals" onClick={navigateToSection}>{t('navigation.goal_tracker')}</NavLink>
              <NavLink sectionId="relationships" onClick={navigateToSection}>{t('navigation.relationships')}</NavLink>
            </div>
            
            <LanguageSwitcher />
            <AuthButton />
          </div>

          <div className={`md:hidden flex items-center ${isRTL ? 'flex-row-reverse' : ''} gap-2`}>
            <LanguageSwitcher />
            <AuthButton />
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-mindtrack-sage/5 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-6 h-6 text-mindtrack-stone" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-mindtrack-sage/10"
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <div className={`mindtrack-container py-4 space-y-2 ${isRTL ? 'text-right' : ''}`}>
            <MobileNavLink sectionId="mood" onClick={handleMobileNavClick}>
              {t('dashboard.mood_today')}
            </MobileNavLink>
            <MobileNavLink sectionId="trigger" onClick={handleMobileNavClick}>
              {t('navigation.trigger_tracker')}
            </MobileNavLink>
            <MobileNavLink sectionId="gratitude" onClick={handleMobileNavClick}>
              {t('navigation.journal')}
            </MobileNavLink>
            <MobileNavLink sectionId="cbt" onClick={handleMobileNavClick}>
              {t('navigation.cbt_techniques')}
            </MobileNavLink>
            <MobileNavLink sectionId="dbt" onClick={handleMobileNavClick}>
              {t('navigation.dbt_techniques')}
            </MobileNavLink>
            <MobileNavLink sectionId="goals" onClick={handleMobileNavClick}>
              {t('navigation.goal_tracker')}
            </MobileNavLink>
            <MobileNavLink sectionId="relationships" onClick={handleMobileNavClick}>
              {t('navigation.relationships')}
            </MobileNavLink>

            {/* Divider */}
            <div className="my-3 border-t border-mindtrack-sage/10"></div>

            {/* Auth Section - Compact Profile Menu or Login Button */}
            <div className="px-4 py-3">
              {user ? (
                <ProfileMenu user={user} fullName={fullName} isCompact={true} />
              ) : (
                <AuthButton />
              )}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

const NavLink = ({ 
  sectionId, 
  children, 
  onClick 
}: { 
  sectionId: string;
  children: React.ReactNode;
  onClick: (sectionId: string) => void;
}) => (
  <button
    onClick={() => onClick(sectionId)}
    className="text-mindtrack-stone hover:text-mindtrack-sage transition-colors py-2"
  >
    {children}
  </button>
);

const MobileNavLink = ({ 
  sectionId, 
  children, 
  onClick 
}: MobileNavLinkProps) => (
  <button
    onClick={() => onClick(sectionId)}
    className="block w-full text-left py-2 px-4 text-mindtrack-stone hover:bg-mindtrack-sage/5 rounded-lg transition-colors"
  >
    {children}
  </button>
);

export default Navigation;
