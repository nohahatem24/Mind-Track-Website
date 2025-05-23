
import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AuthComponent from "./AuthComponent";

const AuthButton = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data && data.session) {
        setUser(data.session.user);
      }
      
      // Subscribe to auth changes
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            setUser(session.user);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
          }
        }
      );
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    };
    
    checkUser();
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      setUser(null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to log out",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {user ? (
        <div className="flex items-center gap-3">
          <div className="hidden md:block text-sm text-mindtrack-stone">
            {user.email}
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="px-4 py-2 border border-mindtrack-sage/30 rounded-lg text-mindtrack-sage hover:bg-mindtrack-sage/5 transition-colors"
          >
            {isLoading ? "Logging out..." : "Log out"}
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowAuthModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-mindtrack-sage text-white rounded-lg hover:bg-mindtrack-sage/90 transition-colors"
        >
          <User className="w-4 h-4" />
          <span>Log In</span>
        </button>
      )}

      {showAuthModal && <AuthComponent onClose={() => setShowAuthModal(false)} />}
    </>
  );
};

export default AuthButton;
