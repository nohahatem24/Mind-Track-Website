/**
 * Sticky Crisis Button Component
 * Mobile-optimized persistent button for quick access to crisis resources
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

interface StickyCrisisButtonProps {
  onClick: () => void;
  isVisible?: boolean;
  isShowingAlert?: boolean;
}

export const StickyCrisisButton: React.FC<StickyCrisisButtonProps> = ({
  onClick,
  isVisible = true,
  isShowingAlert = false,
}) => {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.8,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all ${
        isShowingAlert
          ? 'bg-gradient-to-br from-red-500 to-red-600 animate-pulse'
          : 'bg-gradient-to-br from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700'
      } text-white md:bottom-8 md:right-8 lg:hidden`}
      title="Open Crisis Resources"
      aria-label="Open Crisis Resources and Support"
    >
      <motion.div
        animate={isShowingAlert ? { rotate: 360 } : { rotate: 0 }}
        transition={{
          duration: isShowingAlert ? 0.5 : 0,
          repeat: isShowingAlert ? Infinity : 0,
        }}
      >
        {isShowingAlert ? (
          <AlertTriangle className="w-8 h-8" />
        ) : (
          <ShieldAlert className="w-8 h-8" />
        )}
      </motion.div>
    </motion.button>
  );
};

/**
 * Crisis Alert Banner Component
 * Shows when suicidal ideation is detected in journal/mood entries
 */
interface CrisisAlertBannerProps {
  isVisible: boolean;
  onDismiss: () => void;
  onViewResources: () => void;
}

export const CrisisAlertBanner: React.FC<CrisisAlertBannerProps> = ({
  isVisible,
  onDismiss,
  onViewResources,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : -20,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-600 to-rose-600 text-white p-4 shadow-lg"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 flex-shrink-0" />
          <div>
            <p className="font-bold">We care about your safety</p>
            <p className="text-sm text-white/90">
              It sounds like you might be struggling. Immediate support is available.
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={onViewResources}
            className="bg-white text-red-600 hover:bg-red-50 font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Get Help
          </button>
          <button
            onClick={onDismiss}
            className="text-white/80 hover:text-white font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Offline Indicator Component
 * Shows when using cached resources offline
 */
interface OfflineIndicatorProps {
  isOffline: boolean;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ isOffline }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isOffline ? 1 : 0 }}
      className={`fixed bottom-24 right-6 z-40 bg-orange-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold ${
        isOffline ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      📡 Offline - Using cached resources
    </motion.div>
  );
};
