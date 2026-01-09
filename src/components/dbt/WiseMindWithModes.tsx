import React, { useState } from 'react';
import { motion } from 'framer-motion';
import WiseMindExercise from './exercises/WiseMindExercise';
import { InteractionModeProvider } from '../act/context/InteractionModeContext';
import InteractionModeSelector from '../act/context/InteractionModeSelector';
import { useInteractionMode } from '../act/context/InteractionModeContext';

interface WiseMindWithModesProps {
  onComplete: (data: Record<string, any>) => void;
  onCancel: () => void;
  initialData?: Record<string, any>;
  isEditing?: boolean;
}

const WiseMindContent: React.FC<WiseMindWithModesProps> = ({
  onComplete,
  onCancel,
  initialData,
  isEditing,
}) => {
  const { mode } = useInteractionMode();
  const [showModeSelector, setShowModeSelector] = useState(true);

  if (showModeSelector && !isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        <InteractionModeSelector />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModeSelector(false)}
          className="w-full px-6 py-4 bg-mindtrack-sage text-white rounded-lg font-semibold hover:bg-mindtrack-sage/90 transition-colors text-lg"
        >
          Begin Exercise
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Mode Indicator */}
      {!isEditing && (
        <div className="flex items-center justify-between p-4 bg-mindtrack-sage/10 rounded-lg border border-mindtrack-sage/20">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-mindtrack-stone">Mode:</span>
            <span className="text-sm text-mindtrack-sage font-semibold capitalize">
              {mode === 'observe' && '👁️ Observe'}
              {mode === 'participate' && '🎯 Participate'}
              {mode === 'mindfulness' && '🧘 Mindfulness'}
              {mode === 'self-soothe' && '💆 Self-Soothe'}
            </span>
          </div>
          <button
            onClick={() => setShowModeSelector(true)}
            className="text-sm text-mindtrack-sage hover:text-mindtrack-sage/80 font-semibold underline"
          >
            Change
          </button>
        </div>
      )}

      {/* Original Exercise Component */}
      <WiseMindExercise
        onComplete={onComplete}
        onCancel={onCancel}
        initialData={initialData}
        isEditing={isEditing ?? false}
      />
    </motion.div>
  );
};

const WiseMindWithModes: React.FC<WiseMindWithModesProps> = (props) => {
  return (
    <InteractionModeProvider>
      <WiseMindContent {...props} />
    </InteractionModeProvider>
  );
};

export default WiseMindWithModes;
