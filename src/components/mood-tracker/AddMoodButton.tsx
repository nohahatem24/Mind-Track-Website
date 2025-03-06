
import React from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface AddMoodButtonProps {
  onClick: () => void;
}

const AddMoodButton = ({ onClick }: AddMoodButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full mindtrack-card flex items-center justify-center gap-2 text-mindtrack-sage hover:text-mindtrack-sage/80"
    >
      <Plus className="w-5 h-5" />
      Log Your Current Mood
    </motion.button>
  );
};

export default AddMoodButton;
