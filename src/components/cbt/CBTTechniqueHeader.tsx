
import React from "react";
import { motion } from "framer-motion";

interface CBTTechniqueHeaderProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
}

const CBTTechniqueHeader: React.FC<CBTTechniqueHeaderProps> = ({
  selectedCategory,
  setSelectedCategory,
  showHistory,
  setShowHistory
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="mb-8"
    >
      <h2 className="section-title">CBT Techniques & Exercises</h2>
      <p className="text-mindtrack-stone/80 max-w-2xl mb-6">
        Evidence-based cognitive behavioral therapy exercises to help manage emotions, change unhelpful thinking patterns, and develop healthier behaviors.
      </p>
      
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <CategoryFilter 
          selectedCategory={selectedCategory} 
          setSelectedCategory={setSelectedCategory} 
        />
        
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="px-4 py-2 border border-mindtrack-sage text-mindtrack-sage rounded-md hover:bg-mindtrack-sage/5"
        >
          {showHistory ? "Hide History" : "View History"}
        </button>
      </div>
    </motion.div>
  );
};

// Using a local import to avoid circular dependencies
const CategoryFilter = ({ 
  selectedCategory, 
  setSelectedCategory 
}: { 
  selectedCategory: string, 
  setSelectedCategory: (category: string) => void 
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setSelectedCategory("all")}
        className={`px-4 py-2 rounded-md transition-colors ${
          selectedCategory === "all"
            ? "bg-mindtrack-sage text-white"
            : "border border-mindtrack-sage text-mindtrack-sage hover:bg-mindtrack-sage/5"
        }`}
      >
        All
      </button>
      <button
        onClick={() => setSelectedCategory("cognitive")}
        className={`px-4 py-2 rounded-md transition-colors ${
          selectedCategory === "cognitive"
            ? "bg-mindtrack-sage text-white"
            : "border border-mindtrack-sage text-mindtrack-sage hover:bg-mindtrack-sage/5"
        }`}
      >
        Cognitive
      </button>
      <button
        onClick={() => setSelectedCategory("behavioral")}
        className={`px-4 py-2 rounded-md transition-colors ${
          selectedCategory === "behavioral"
            ? "bg-mindtrack-sage text-white"
            : "border border-mindtrack-sage text-mindtrack-sage hover:bg-mindtrack-sage/5"
        }`}
      >
        Behavioral
      </button>
      <button
        onClick={() => setSelectedCategory("mindfulness")}
        className={`px-4 py-2 rounded-md transition-colors ${
          selectedCategory === "mindfulness"
            ? "bg-mindtrack-sage text-white"
            : "border border-mindtrack-sage text-mindtrack-sage hover:bg-mindtrack-sage/5"
        }`}
      >
        Mindfulness
      </button>
    </div>
  );
};

export default CBTTechniqueHeader;
