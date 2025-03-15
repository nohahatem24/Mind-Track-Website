
import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface WiseMindExerciseProps {
  onComplete: (data: Record<string, any>) => void;
  onCancel: () => void;
  initialData?: Record<string, any>;
  isEditing: boolean;
}

const WiseMindExercise: React.FC<WiseMindExerciseProps> = ({
  onComplete,
  onCancel,
  initialData,
  isEditing
}) => {
  const [situation, setSituation] = useState(initialData?.situation || "");
  const [emotionalMind, setEmotionalMind] = useState(initialData?.emotionalMind || "");
  const [rationalMind, setRationalMind] = useState(initialData?.rationalMind || "");
  const [wiseMind, setWiseMind] = useState(initialData?.wiseMind || "");
  const [reflection, setReflection] = useState(initialData?.reflection || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onComplete({
      situation,
      emotionalMind,
      rationalMind,
      wiseMind,
      reflection
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="mb-6">
          <p className="text-mindtrack-stone/80 mb-4">
            The Wise Mind exercise helps you balance emotional and logical thinking. 
            Describe a situation where you need to make a decision, then examine it from 
            different perspectives to find a balanced approach.
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <Label htmlFor="situation" className="text-mindtrack-stone">
              Describe the situation requiring a decision:
            </Label>
            <Textarea
              id="situation"
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              className="mt-1 min-h-[80px]"
              placeholder="E.g., I need to decide whether to confront my friend about something that upset me..."
              required
            />
          </div>

          <div>
            <Label htmlFor="emotionalMind" className="text-mindtrack-stone">
              Emotional Mind: What does your emotional self want to do?
            </Label>
            <Textarea
              id="emotionalMind"
              value={emotionalMind}
              onChange={(e) => setEmotionalMind(e.target.value)}
              className="mt-1 min-h-[80px]"
              placeholder="Write how you feel and what your emotions are telling you to do..."
              required
            />
          </div>

          <div>
            <Label htmlFor="rationalMind" className="text-mindtrack-stone">
              Rational Mind: What does your logical self suggest?
            </Label>
            <Textarea
              id="rationalMind"
              value={rationalMind}
              onChange={(e) => setRationalMind(e.target.value)}
              className="mt-1 min-h-[80px]"
              placeholder="Write what seems most logical or practical in this situation..."
              required
            />
          </div>

          <div>
            <Label htmlFor="wiseMind" className="text-mindtrack-stone">
              Wise Mind: How can you integrate both perspectives?
            </Label>
            <Textarea
              id="wiseMind"
              value={wiseMind}
              onChange={(e) => setWiseMind(e.target.value)}
              className="mt-1 min-h-[80px]"
              placeholder="Describe a balanced approach that honors both your emotions and logical thinking..."
              required
            />
          </div>

          <div>
            <Label htmlFor="reflection" className="text-mindtrack-stone">
              Reflection: How does this balanced approach feel?
            </Label>
            <Textarea
              id="reflection"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              className="mt-1 min-h-[80px]"
              placeholder="Reflect on how this integrated perspective feels compared to purely emotional or logical thinking..."
              required
            />
          </div>
        </div>
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
          className="px-4 py-2 bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors"
        >
          {isEditing ? "Update" : "Complete"} Exercise
        </button>
      </div>
    </form>
  );
};

export default WiseMindExercise;
