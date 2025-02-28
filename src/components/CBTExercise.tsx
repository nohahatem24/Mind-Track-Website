
import { useState, useEffect } from "react";
import { Check, Plus, X } from "lucide-react";
import { motion } from "framer-motion";

interface CognitiveDistortion {
  id: string;
  name: string;
  description: string;
}

// Cognitive Restructuring Exercise
export const CognitiveRestructuringExercise = ({ 
  onComplete,
  onCancel
}: { 
  onComplete: () => void;
  onCancel: () => void;
}) => {
  const [negativeThought, setNegativeThought] = useState("");
  const [selectedDistortions, setSelectedDistortions] = useState<string[]>([]);
  const [evidence, setEvidence] = useState({
    supporting: "",
    contradicting: ""
  });
  const [balancedThought, setBalancedThought] = useState("");

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
    onComplete();
  };

  const isFormValid = () => {
    return (
      negativeThought.trim() !== "" &&
      selectedDistortions.length > 0 &&
      (evidence.supporting.trim() !== "" || evidence.contradicting.trim() !== "") &&
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
            Evidence that contradicts the thought
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
          Complete Exercise
        </button>
      </div>
    </motion.form>
  );
};

// Grounding Technique Exercise
export const GroundingExercise = ({ 
  onComplete,
  onCancel
}: { 
  onComplete: () => void;
  onCancel: () => void;
}) => {
  const [inputs, setInputs] = useState({
    see: ["", "", "", "", ""],
    touch: ["", "", "", ""],
    hear: ["", "", ""],
    smell: ["", ""],
    taste: [""],
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
    onComplete();
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
          Complete Exercise
        </button>
      </div>
    </motion.form>
  );
};

// Breathing Exercise
export const BreathingExercise = ({ 
  onComplete,
  onCancel
}: { 
  onComplete: () => void;
  onCancel: () => void;
}) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [count, setCount] = useState(0);
  const [cycles, setCycles] = useState(0);

  // Start/stop the breathing exercise
  const toggleExercise = () => {
    if (isActive) {
      setIsActive(false);
    } else {
      setIsActive(true);
      setPhase("inhale");
      setCount(0);
    }
  };

  // Effect to handle the breathing animation
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isActive) {
      intervalId = setInterval(() => {
        setCount(prevCount => {
          if (phase === "inhale" && prevCount >= 4) {
            setPhase("hold");
            return 0;
          } else if (phase === "hold" && prevCount >= 2) {
            setPhase("exhale");
            return 0;
          } else if (phase === "exhale" && prevCount >= 6) {
            setPhase("inhale");
            setCycles(prev => prev + 1);
            return 0;
          }
          return prevCount + 1;
        });
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isActive, phase]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h3 className="text-lg font-medium text-mindtrack-stone mb-2">
          Deep Breathing Exercise
        </h3>
        <p className="text-mindtrack-stone/80">
          Follow the circle as it expands and contracts. Breathe in for 4 seconds, hold for 2 seconds, and exhale for 6 seconds.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="relative w-48 h-48 mb-6">
          <motion.div
            animate={{
              scale: phase === "inhale" ? [1, 1.5] : phase === "hold" ? 1.5 : [1.5, 1],
            }}
            transition={{
              duration: phase === "inhale" ? 4 : phase === "exhale" ? 6 : 2,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-mindtrack-sage/20 rounded-full flex items-center justify-center"
          >
            <span className="text-lg font-medium text-mindtrack-stone">
              {phase === "inhale" ? "Breathe In" : phase === "hold" ? "Hold" : "Breathe Out"}
            </span>
          </motion.div>
        </div>

        <div className="text-center mb-4">
          <p className="text-2xl font-bold text-mindtrack-stone">{count + 1}</p>
          <p className="text-sm text-mindtrack-stone/70">
            {phase === "inhale" ? "Inhale: 4 counts" : phase === "hold" ? "Hold: 2 counts" : "Exhale: 6 counts"}
          </p>
        </div>

        <div className="text-center mb-6">
          <p className="text-lg font-medium text-mindtrack-stone">Completed Cycles: {cycles}</p>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={toggleExercise}
            className="px-6 py-3 bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors"
          >
            {isActive ? "Pause" : "Start Breathing"}
          </button>
          {cycles > 0 && (
            <button
              type="button"
              onClick={onComplete}
              className="px-6 py-3 border border-mindtrack-sage text-mindtrack-sage rounded-md hover:bg-mindtrack-sage/5 transition-colors"
            >
              Finish Exercise
            </button>
          )}
        </div>
      </div>

      {!isActive && (
        <div className="text-center mt-8">
          <button
            type="button"
            onClick={onCancel}
            className="text-mindtrack-stone/70 hover:text-mindtrack-stone underline"
          >
            Cancel Exercise
          </button>
        </div>
      )}
    </motion.div>
  );
};
