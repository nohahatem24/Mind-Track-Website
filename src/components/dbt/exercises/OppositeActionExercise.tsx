import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface OppositeActionExerciseProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onComplete: (data: Record<string, any>) => void;
  onCancel: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: Record<string, any>;
  isEditing: boolean;
}

const OppositeActionExercise: React.FC<OppositeActionExerciseProps> = ({
  onComplete,
  onCancel,
  initialData,
  isEditing
}) => {
  const [emotion, setEmotion] = useState(initialData?.emotion || "");
  const [actionUrge, setActionUrge] = useState(initialData?.actionUrge || "");
  const [fitsTheFacts, setFitsTheFacts] = useState(initialData?.fitsTheFacts || "");
  const [oppositeAction, setOppositeAction] = useState(initialData?.oppositeAction || "");
  const [practiced, setPracticed] = useState(initialData?.practiced || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate minimum required fields
    if (!emotion.trim() || !actionUrge.trim() || !fitsTheFacts) {
      alert("Please complete: emotion, action urge, and facts check.");
      return;
    }

    onComplete({
      emotion,
      actionUrge,
      fitsTheFacts,
      oppositeAction: fitsTheFacts === "no" ? oppositeAction : null,
      practiced,
      completedAt: new Date().toISOString()
    });
  };

  const shouldShowOppositeAction = fitsTheFacts === "no";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="mb-6">
          <p className="text-mindtrack-stone/80 mb-4">
            Opposite Action is a DBT skill to change emotions that don't fit the facts.
            If your emotion matches the situation, it's valid. If it doesn't, act opposite to that urge.
          </p>
        </div>

        {/* Emotion Selection */}
        <div className="space-y-3">
          <Label htmlFor="emotion" className="text-mindtrack-stone font-semibold">
            What emotion are you experiencing?
          </Label>
          <Textarea
            id="emotion"
            value={emotion}
            onChange={(e) => setEmotion(e.target.value)}
            placeholder="E.g., anger, sadness, shame, anxiety..."
            className="min-h-[60px]"
            required
          />
        </div>

        {/* Action Urge */}
        <div className="space-y-3">
          <Label htmlFor="actionUrge" className="text-mindtrack-stone font-semibold">
            What action urge does this emotion create?
          </Label>
          <Textarea
            id="actionUrge"
            value={actionUrge}
            onChange={(e) => setActionUrge(e.target.value)}
            placeholder="E.g., I want to yell, avoid everyone, hurt myself, run away..."
            className="min-h-[60px]"
            required
          />
        </div>

        {/* Facts Check */}
        <div className="p-4 border border-mindtrack-sage/20 rounded-lg space-y-3">
          <Label className="text-mindtrack-stone font-semibold">
            Does this emotion fit the facts of the situation?
          </Label>
          <RadioGroup value={fitsTheFacts} onValueChange={setFitsTheFacts}>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="yes" id="fits-yes" />
              <Label htmlFor="fits-yes" className="text-mindtrack-stone cursor-pointer">
                Yes — the emotion matches what happened
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="no" id="fits-no" />
              <Label htmlFor="fits-no" className="text-mindtrack-stone cursor-pointer">
                No — I'm overreacting or the emotion doesn't match the situation
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="mixed" id="fits-mixed" />
              <Label htmlFor="fits-mixed" className="text-mindtrack-stone cursor-pointer">
                Mixed — some parts fit, some don't
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Opposite Action (conditional) */}
        {shouldShowOppositeAction && (
          <div className="space-y-3 p-4 bg-mindtrack-sage/5 border border-mindtrack-sage/20 rounded-lg">
            <Label htmlFor="oppositeAction" className="text-mindtrack-stone font-semibold">
              What's the opposite action you could take?
            </Label>
            <p className="text-xs text-mindtrack-stone/70 mb-2">
              If you want to avoid, approach. If you want to attack, be gentle. If you want to give up, persist.
            </p>
            <Textarea
              id="oppositeAction"
              value={oppositeAction}
              onChange={(e) => setOppositeAction(e.target.value)}
              placeholder="E.g., reach out to someone, take a deep breath, do one small thing despite the urge..."
              className="min-h-[80px]"
            />
          </div>
        )}

        {/* Practice Toggle */}
        <div className="p-4 border border-mindtrack-sage/20 rounded-lg space-y-3">
          <div className="flex items-center gap-3">
            <Checkbox
              id="practiced"
              checked={practiced}
              onCheckedChange={(checked) => setPracticed(checked as boolean)}
              className="w-5 h-5"
            />
            <Label htmlFor="practiced" className="text-mindtrack-stone font-semibold cursor-pointer">
              I practiced the opposite action
            </Label>
          </div>
          {practiced && (
            <p className="text-xs text-mindtrack-stone/70 ml-8">
              Even a small step counts. You're rewiring your emotional responses.
            </p>
          )}
        </div>

        <div className="mt-6 p-4 bg-mindtrack-stone/5 rounded-lg">
          <p className="text-sm text-mindtrack-stone/80">
            <span className="font-semibold text-mindtrack-sage">Status:</span>{" "}
            {fitsTheFacts === "yes"
              ? "Your emotion fits the facts—that's valid."
              : fitsTheFacts === "no"
                ? practiced
                  ? "You practiced opposite action! This builds emotional resilience over time."
                  : "You identified the opposite action to try next time."
                : "You've identified where your emotion might be amplified."}
          </p>
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

export default OppositeActionExercise;
