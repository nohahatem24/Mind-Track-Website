
import React, { useState } from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface CognitiveDistortion {
  id: string;
  name: string;
  description: string;
}

interface ExerciseProps {
  onComplete: (data: Record<string, any>) => void;
  onCancel: () => void;
  initialData?: Record<string, any>;
  isEditing?: boolean;
}

const CognitiveRestructuringExercise = ({ 
  onComplete,
  onCancel,
  initialData,
  isEditing = false
}: ExerciseProps) => {
  const [negativeThought, setNegativeThought] = useState(initialData?.negativeThought || "");
  const [selectedDistortions, setSelectedDistortions] = useState<string[]>(initialData?.selectedDistortions || []);
  const [evidence, setEvidence] = useState({
    supporting: initialData?.evidence?.supporting || "",
    contradicting: initialData?.evidence?.contradicting || ""
  });
  const [balancedThought, setBalancedThought] = useState(initialData?.balancedThought || "");

  const distortions: CognitiveDistortion[] = [
    { 
      id: "all-or-nothing", 
      name: "All-or-Nothing Thinking", 
      description: "Seeing things in black-and-white categories" 
    },
    { 
      id: "overgeneralization", 
      name: "Overgeneralization", 
      description: "Viewing a negative event as a never-ending pattern of defeat" 
    },
    { 
      id: "mental-filter", 
      name: "Mental Filter", 
      description: "Focusing on a single negative detail and dwelling on it" 
    },
    { 
      id: "disqualifying-positive", 
      name: "Disqualifying the Positive", 
      description: "Rejecting positive experiences by insisting they 'don't count'" 
    },
    { 
      id: "jumping-conclusions", 
      name: "Jumping to Conclusions", 
      description: "Mind reading or fortune telling without checking the facts" 
    },
    { 
      id: "catastrophizing", 
      name: "Catastrophizing", 
      description: "Magnifying problems or minimizing your abilities" 
    },
    { 
      id: "emotional-reasoning", 
      name: "Emotional Reasoning", 
      description: "Assuming feelings reflect facts (\"I feel it, so it must be true\")" 
    },
    { 
      id: "should-statements", 
      name: "Should Statements", 
      description: "Self-criticism through \"should,\" \"must,\" or \"ought to\" statements" 
    },
    { 
      id: "labeling", 
      name: "Labeling", 
      description: "Attaching a negative label to yourself instead of describing the behavior" 
    },
    { 
      id: "personalization", 
      name: "Personalization", 
      description: "Taking responsibility for events outside your control" 
    }
  ];

  const toggleDistortion = (id: string) => {
    if (selectedDistortions.includes(id)) {
      setSelectedDistortions(selectedDistortions.filter(d => d !== id));
    } else {
      setSelectedDistortions([...selectedDistortions, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      negativeThought,
      selectedDistortions,
      evidence,
      balancedThought,
      date: new Date().toISOString()
    });
  };

  const isFormValid = () => {
    return (
      negativeThought.trim() !== "" &&
      selectedDistortions.length > 0 &&
      balancedThought.trim() !== ""
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
        <label className="block text-sm font-medium text-mindtrack-stone mb-1">
          Identify the negative thought or belief
        </label>
        <textarea
          value={negativeThought}
          onChange={(e) => setNegativeThought(e.target.value)}
          placeholder="Write down the negative thought..."
          className="w-full p-3 min-h-[80px] rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20 resize-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-mindtrack-stone mb-2">
          Recognize the cognitive distortion(s)
        </label>
        <div className="space-y-2 max-h-[250px] overflow-y-auto p-1">
          {distortions.map(distortion => (
            <div 
              key={distortion.id}
              className={`p-3 border rounded-md cursor-pointer transition-colors ${
                selectedDistortions.includes(distortion.id)
                  ? "border-mindtrack-sage bg-mindtrack-sage/5"
                  : "border-mindtrack-sage/20 hover:border-mindtrack-sage/40"
              }`}
              onClick={() => toggleDistortion(distortion.id)}
            >
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  selectedDistortions.includes(distortion.id)
                    ? "bg-mindtrack-sage text-white"
                    : "border border-mindtrack-sage/40"
                }`}>
                  {selectedDistortions.includes(distortion.id) && <Check className="w-3 h-3" />}
                </div>
                <h3 className="font-medium text-mindtrack-stone">{distortion.name}</h3>
              </div>
              <p className="mt-1 text-sm text-mindtrack-stone/80 pl-7">{distortion.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-mindtrack-stone mb-1">
            Evidence that supports the thought
          </label>
          <textarea
            value={evidence.supporting}
            onChange={(e) => setEvidence({ ...evidence, supporting: e.target.value })}
            placeholder="What evidence supports this thought?"
            className="w-full p-3 min-h-[100px] rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20 resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-mindtrack-stone mb-1">
            Evidence that contradicts the thought (optional)
          </label>
          <textarea
            value={evidence.contradicting}
            onChange={(e) => setEvidence({ ...evidence, contradicting: e.target.value })}
            placeholder="What evidence challenges this thought?"
            className="w-full p-3 min-h-[100px] rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20 resize-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-mindtrack-stone mb-1">
          Replace with a more balanced thought
        </label>
        <textarea
          value={balancedThought}
          onChange={(e) => setBalancedThought(e.target.value)}
          placeholder="Write a more balanced and realistic perspective..."
          className="w-full p-3 min-h-[100px] rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20 resize-none"
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

export default CognitiveRestructuringExercise;
