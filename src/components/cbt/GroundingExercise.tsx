
import React, { useState } from "react";
import { motion } from "framer-motion";

interface ExerciseProps {
  onComplete: (data: Record<string, any>) => void;
  onCancel: () => void;
  initialData?: Record<string, any>;
  isEditing?: boolean;
}

const GroundingExercise = ({ 
  onComplete,
  onCancel,
  initialData,
  isEditing = false
}: ExerciseProps) => {
  const [inputs, setInputs] = useState({
    see: initialData?.see || ["", "", "", "", ""],
    touch: initialData?.touch || ["", "", "", ""],
    hear: initialData?.hear || ["", "", ""],
    smell: initialData?.smell || ["", ""],
    taste: initialData?.taste || [""],
  });

  const updateInput = (category: keyof typeof inputs, index: number, value: string) => {
    setInputs(prev => {
      const newCategory = [...prev[category]];
      newCategory[index] = value;
      return { ...prev, [category]: newCategory };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      ...inputs,
      date: new Date().toISOString()
    });
  };

  const isFormValid = () => {
    return (
      inputs.see.filter(i => i.trim() !== "").length === 5 &&
      inputs.touch.filter(i => i.trim() !== "").length === 4 &&
      inputs.hear.filter(i => i.trim() !== "").length === 3 &&
      inputs.smell.filter(i => i.trim() !== "").length === 2 &&
      inputs.taste.filter(i => i.trim() !== "").length === 1
    );
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
      onSubmit={handleSubmit}
    >
      <div>
        <label className="block text-sm font-medium text-mindtrack-stone mb-2">
          5 things you can see
        </label>
        <div className="space-y-2">
          {inputs.see.map((input, index) => (
            <input
              key={`see-${index}`}
              type="text"
              value={input}
              onChange={(e) => updateInput("see", index, e.target.value)}
              placeholder={`Thing ${index + 1} you can see`}
              className="w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20"
              required
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-mindtrack-stone mb-2">
          4 things you can touch/feel
        </label>
        <div className="space-y-2">
          {inputs.touch.map((input, index) => (
            <input
              key={`touch-${index}`}
              type="text"
              value={input}
              onChange={(e) => updateInput("touch", index, e.target.value)}
              placeholder={`Thing ${index + 1} you can touch`}
              className="w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20"
              required
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-mindtrack-stone mb-2">
          3 things you can hear
        </label>
        <div className="space-y-2">
          {inputs.hear.map((input, index) => (
            <input
              key={`hear-${index}`}
              type="text"
              value={input}
              onChange={(e) => updateInput("hear", index, e.target.value)}
              placeholder={`Thing ${index + 1} you can hear`}
              className="w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20"
              required
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-mindtrack-stone mb-2">
          2 things you can smell
        </label>
        <div className="space-y-2">
          {inputs.smell.map((input, index) => (
            <input
              key={`smell-${index}`}
              type="text"
              value={input}
              onChange={(e) => updateInput("smell", index, e.target.value)}
              placeholder={`Thing ${index + 1} you can smell`}
              className="w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20"
              required
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-mindtrack-stone mb-2">
          1 thing you can taste
        </label>
        <input
          type="text"
          value={inputs.taste[0]}
          onChange={(e) => updateInput("taste", 0, e.target.value)}
          placeholder="Something you can taste"
          className="w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20"
          required
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-mindtrack-stone hover:bg-mindtrack-sage/5 rounded-md transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors disabled:opacity-50"
          disabled={!isFormValid()}
        >
          {isEditing ? "Save Changes" : "Complete Exercise"}
        </button>
      </div>
    </motion.form>
  );
};

export default GroundingExercise;
