
import { motion } from "framer-motion";

const GratitudeHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="mb-8"
    >
      <h2 className="section-title">Gratitude Journal</h2>
      <p className="text-mindtrack-stone/80 max-w-2xl">
        Take a moment to reflect on the positive aspects of your day. What are you grateful for? 
        Research shows that regular gratitude practice can improve mental wellbeing and shift focus 
        toward positive emotions.
      </p>
    </motion.div>
  );
};

export default GratitudeHeader;
