
import React from "react";

interface CategoryButtonProps { 
  children: React.ReactNode; 
  active: boolean; 
  onClick: () => void;
}

export const CategoryButton = ({ 
  children, 
  active, 
  onClick 
}: CategoryButtonProps) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
      active 
        ? "bg-mindtrack-sage text-white" 
        : "bg-white text-mindtrack-stone hover:bg-mindtrack-sage/5"
    }`}
  >
    {children}
  </button>
);

interface CategoryFilterProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const CategoryFilter = ({ selectedCategory, setSelectedCategory }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      <CategoryButton 
        active={selectedCategory === "all"}
        onClick={() => setSelectedCategory("all")}
      >
        All Techniques
      </CategoryButton>
      <CategoryButton 
        active={selectedCategory === "cognitive"}
        onClick={() => setSelectedCategory("cognitive")}
      >
        Cognitive
      </CategoryButton>
      <CategoryButton 
        active={selectedCategory === "behavioral"}
        onClick={() => setSelectedCategory("behavioral")}
      >
        Behavioral
      </CategoryButton>
      <CategoryButton 
        active={selectedCategory === "mindfulness"}
        onClick={() => setSelectedCategory("mindfulness")}
      >
        Mindfulness
      </CategoryButton>
    </div>
  );
};

export default CategoryFilter;
