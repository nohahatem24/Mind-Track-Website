import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Settings, User as UserIcon, ChevronDown, Trash2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
  };
}

interface ProfileMenuProps {
  user: User;
  fullName?: string;
  isCompact?: boolean;
}

const ProfileMenu = ({ user, fullName, isCompact = false }: ProfileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Get the first 2 letters of the name
  const getInitials = () => {
    const name = fullName || user.user_metadata?.full_name || user.email || "U";
    return name
      .split(" ")
      .slice(0, 2)
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get display name
  const getDisplayName = () => {
    return fullName || user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      setIsOpen(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to log out";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      // Delete user profile first
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
          .from("profiles")
          .delete()
          .eq("id", user.id);
      } catch (profileError) {
        console.error("Profile deletion error (non-blocking):", profileError);
      }

      // Delete the user account
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) throw error;

      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted.",
      });
      
      // Sign out after deletion
      await supabase.auth.signOut();
      setIsOpen(false);
      setShowDeleteConfirm(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete account";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCompact) {
    // Compact version for sidebar/menu
    return (
      <div className="relative w-full" ref={menuRef}>
        {/* Compact Profile Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-mindtrack-sage/10 transition-colors"
        >
          {/* Avatar with initials */}
          <div className="w-10 h-10 rounded-full bg-mindtrack-sage text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
            {getInitials()}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium text-mindtrack-stone truncate">
              {getDisplayName().split(" ")[0]}
            </p>
            <p className="text-xs text-mindtrack-stone/60 truncate">
              {user.email}
            </p>
          </div>
          <ChevronDown className={`w-4 h-4 text-mindtrack-stone transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Dropdown Menu for Compact */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-mindtrack-sage/10 z-50 overflow-hidden w-full"
            >
              {/* Menu Items */}
              <div className="py-1">
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-mindtrack-stone hover:bg-mindtrack-sage/5 transition-colors"
                  onClick={() => {
                    // TODO: Navigate to account settings
                    setIsOpen(false);
                  }}
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Account Settings</span>
                </button>
                
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-mindtrack-stone hover:bg-mindtrack-sage/5 transition-colors"
                  onClick={() => {
                    // TODO: Navigate to edit profile
                    setIsOpen(false);
                  }}
                >
                  <Settings className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              </div>

              {/* Divider */}
              <div className="border-t border-mindtrack-sage/10"></div>

              {/* Logout Button */}
              <div className="p-1">
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-mindtrack-sage hover:bg-mindtrack-sage/5 transition-colors disabled:opacity-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{isLoading ? "Logging out..." : "Log out"}</span>
                </button>
              </div>

              {/* Delete Account Button */}
              <div className="border-t border-red-200 p-1">
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Account</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999999] p-4 pointer-events-auto"
              onClick={() => setShowDeleteConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-lg shadow-2xl max-w-sm w-full p-6 z-[999999] pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-mindtrack-stone">Delete Account</h3>
                    <p className="mt-2 text-sm text-mindtrack-stone/70">
                      Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently deleted.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-4 py-2 rounded-lg border border-mindtrack-sage/30 text-mindtrack-stone hover:bg-mindtrack-sage/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Original non-compact version for header
  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-mindtrack-sage/10 transition-colors"
      >
        {/* Avatar with initials */}
        <div className="w-8 h-8 rounded-full bg-mindtrack-sage text-white flex items-center justify-center text-xs font-semibold">
          {getInitials()}
        </div>
        <div className="hidden sm:flex items-center gap-1">
          <span className="text-sm font-medium text-mindtrack-stone">{getDisplayName().split(" ")[0]}</span>
          <ChevronDown className={`w-4 h-4 text-mindtrack-stone transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-mindtrack-sage/10 z-50 overflow-hidden"
          >
            {/* Header with user info */}
            <div className="p-4 border-b border-mindtrack-sage/10 bg-mindtrack-sage/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-mindtrack-sage text-white flex items-center justify-center text-sm font-semibold">
                  {getInitials()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-mindtrack-stone truncate">
                    {getDisplayName()}
                  </p>
                  <p className="text-xs text-mindtrack-stone/60 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-mindtrack-stone hover:bg-mindtrack-sage/5 transition-colors"
                onClick={() => {
                  // TODO: Navigate to account settings
                  setIsOpen(false);
                }}
              >
                <UserIcon className="w-4 h-4" />
                <span>Account Settings</span>
              </button>
              
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-mindtrack-stone hover:bg-mindtrack-sage/5 transition-colors"
                onClick={() => {
                  // TODO: Navigate to edit profile
                  setIsOpen(false);
                }}
              >
                <Settings className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-mindtrack-sage/10"></div>

            {/* Logout Button */}
            <div className="p-1">
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-mindtrack-sage hover:bg-mindtrack-sage/5 transition-colors disabled:opacity-50"
              >
                <LogOut className="w-4 h-4" />
                <span>{isLoading ? "Logging out..." : "Log out"}</span>
              </button>
            </div>

            {/* Delete Account Button */}
            <div className="border-t border-red-200 p-1">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Account</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-mindtrack-stone">Delete Account</h3>
                  <p className="mt-2 text-sm text-mindtrack-stone/70">
                    Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently deleted.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-mindtrack-sage/30 text-mindtrack-stone hover:bg-mindtrack-sage/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileMenu;
