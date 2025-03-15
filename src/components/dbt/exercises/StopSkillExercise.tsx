
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface StopSkillExerciseProps {
  onComplete: (data: Record<string, any>) => void;
  onCancel: () => void;
  initialData?: Record<string, any>;
  isEditing: boolean;
}

const StopSkillExercise: React.FC<StopSkillExerciseProps> = ({
  onComplete,
  onCancel,
  initialData,
  isEditing
}) => {
  const [triggerSituation, setTriggerSituation] = useState(initialData?.triggerSituation || "");
  const [stopAction, setStopAction] = useState(initialData?.stopAction || "");
  const [takeStep, setTakeStep] = useState(initialData?.takeStep || "");
  const [observeThoughts, setObserveThoughts] = useState(initialData?.observeThoughts || "");
  const [proceedPlan, setProceedPlan] = useState(initialData?.proceedPlan || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onComplete({
      triggerSituation,
      stopAction,
      takeStep,
      observeThoughts,
      proceedPlan
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="mb-6">
          <p className="text-mindtrack-stone/80 mb-4">
            The STOP Skill is a crisis survival strategy for when emotions threaten to overwhelm you.
            STOP stands for: Stop, Take a step back, Observe, and Proceed mindfully.
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <Label htmlFor="triggerSituation" className="text-mindtrack-stone">
              Describe a situation that triggers strong emotions:
            </Label>
            <Textarea
              id="triggerSituation"
              value={triggerSituation}
              onChange={(e) => setTriggerSituation(e.target.value)}
              className="mt-1 min-h-[80px]"
              placeholder="E.g., When my colleague criticizes my work in front of others..."
              required
            />
          </div>

          <div>
            <Label htmlFor="stopAction" className="text-mindtrack-stone">
              S - Stop: How will you physically stop yourself?
            </Label>
            <Textarea
              id="stopAction"
              value={stopAction}
              onChange={(e) => setStopAction(e.target.value)}
              className="mt-1 min-h-[80px]"
              placeholder="Describe how you'll pause before reacting (e.g., take a deep breath, count to 5)..."
              required
            />
          </div>

          <div>
            <Label htmlFor="takeStep" className="text-mindtrack-stone">
              T - Take a step back: How will you create space?
            </Label>
            <Textarea
              id="takeStep"
              value={takeStep}
              onChange={(e) => setTakeStep(e.target.value)}
              className="mt-1 min-h-[80px]"
              placeholder="Describe how you'll create physical or mental distance from the trigger..."
              required
            />
          </div>

          <div>
            <Label htmlFor="observeThoughts" className="text-mindtrack-stone">
              O - Observe: What will you notice about your thoughts and feelings?
            </Label>
            <Textarea
              id="observeThoughts"
              value={observeThoughts}
              onChange={(e) => setObserveThoughts(e.target.value)}
              className="mt-1 min-h-[80px]"
              placeholder="Describe how you'll observe your emotions, thoughts, and urges without judgment..."
              required
            />
          </div>

          <div>
            <Label htmlFor="proceedPlan" className="text-mindtrack-stone">
              P - Proceed mindfully: What's your effective action plan?
            </Label>
            <Textarea
              id="proceedPlan"
              value={proceedPlan}
              onChange={(e) => setProceedPlan(e.target.value)}
              className="mt-1 min-h-[80px]"
              placeholder="Describe how you'll respond in a way that aligns with your goals and values..."
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

export default StopSkillExercise;
