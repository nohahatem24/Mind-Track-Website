
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  message: string;
}

const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mindtrack-card flex items-center gap-3 text-mindtrack-stone/70"
    >
      <AlertCircle className="w-5 h-5" />
      <p>{message}</p>
    </motion.div>
  );
};

export default EmptyState;
