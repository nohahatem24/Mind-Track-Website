
import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AuthComponent from "./AuthComponent";
import ProfileMenu from "./ProfileMenu";

interface AuthUser {
  id: string;
  email: string | undefined;
  user_metadata?: {
    full_name?: string;
  };
}

const AuthButton = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [fullName, setFullName] = useState<string | undefined>();
  const { toast } = useToast();

  // Check if user is logged in and fetch their profile
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data && data.session?.user) {
          const authUser = data.session.user;
          setUser({
            id: authUser.id,
            email: authUser.email,
            user_metadata: authUser.user_metadata,
          });

          // Fetch full name from profiles table if available
          if (authUser.id) {
            try {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const { data: profileData, error } = await (supabase as any)
                .from("profiles")
                .select("full_name")
                .eq("id", authUser.id)
                .single();

              if (!error && profileData && profileData.full_name) {
                setFullName(profileData.full_name);
              } else if (authUser.user_metadata?.full_name) {
                setFullName(authUser.user_metadata.full_name);
              }
            } catch (profileError) {
              // If profile fetch fails, fall back to user metadata
              if (authUser.user_metadata?.full_name) {
                setFullName(authUser.user_metadata.full_name);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }

      // Subscribe to auth changes
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (event === "SIGNED_IN" && session?.user) {
            const authUser = session.user;
            setUser({
              id: authUser.id,
              email: authUser.email,
              user_metadata: authUser.user_metadata,
            });
            if (authUser.user_metadata?.full_name) {
              setFullName(authUser.user_metadata.full_name);
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
      {user ? (
        <ProfileMenu user={user} fullName={fullName} />
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
