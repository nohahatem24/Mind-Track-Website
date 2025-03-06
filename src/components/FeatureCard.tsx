
import { motion } from "framer-motion";
import React from "react";

interface FeatureCardProps { 
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
}

const FeatureCard = ({ icon, title, description, onClick }: FeatureCardProps) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="mindtrack-card cursor-pointer"
    onClick={onClick}
  >
    <div className="text-mindtrack-sage mb-3">{icon}</div>
    <h3 className="text-lg font-semibold text-mindtrack-stone mb-2">{title}</h3>
    <p className="text-mindtrack-stone/80">{description}</p>
  </motion.div>
);

export default FeatureCard;
