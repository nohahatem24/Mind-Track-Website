import React from 'react';
import { motion } from 'framer-motion';
import { useInteractionMode, type InteractionMode } from './InteractionModeContext';

const InteractionModeSelector: React.FC = () => {
  const { setMode } = useInteractionMode();

  const modes: Array<{ value: InteractionMode; label: string; description: string }> = [
    {
      value: 'observe',
      label: 'Observe Mode',
      description: 'Watch and learn without active participation',
    },
    {
      value: 'participate',
      label: 'Participate Mode',
      description: 'Actively engage in the exercise',
    },
    {
      value: 'mindfulness',
      label: 'Mindfulness Mode',
      description: 'Focus on present moment awareness',
    },
    {
      value: 'self-soothe',
      label: 'Self-Soothe Mode',
      description: 'Use calming and comforting techniques',
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-mindtrack-charcoal">Select Your Interaction Mode</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modes.map((modeOption) => (
          <motion.button
            key={modeOption.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMode(modeOption.value)}
            className="p-4 border-2 border-mindtrack-sage rounded-lg hover:bg-mindtrack-sage/10 transition-colors text-left"
          >
            <div className="font-semibold text-mindtrack-charcoal">{modeOption.label}</div>
            <div className="text-sm text-mindtrack-sage">{modeOption.description}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default InteractionModeSelector;
