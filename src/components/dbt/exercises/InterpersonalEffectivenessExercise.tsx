
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface InterpersonalEffectivenessExerciseProps {
  onComplete: (data: Record<string, any>) => void;
  onCancel: () => void;
  initialData?: Record<string, any>;
  isEditing: boolean;
}

const InterpersonalEffectivenessExercise: React.FC<InterpersonalEffectivenessExerciseProps> = ({
  onComplete,
  onCancel,
  initialData,
  isEditing
}) => {
  const [situation, setSituation] = useState(initialData?.situation || "");
  const [describe, setDescribe] = useState(initialData?.describe || "");
  const [express, setExpress] = useState(initialData?.express || "");
  const [assert, setAssert] = useState(initialData?.assert || "");
  const [reinforce, setReinforce] = useState(initialData?.reinforce || "");
  const [mindful, setMindful] = useState(initialData?.mindful || "");
  const [appear, setAppear] = useState(initialData?.appear || "");
  const [negotiate, setNegotiate] = useState(initialData?.negotiate || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onComplete({
      situation,
      describe,
      express,
      assert,
      reinforce,
      mindful,
      appear,
      negotiate
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="mb-6">
          <p className="text-mindtrack-stone/80 mb-4">
            The DEAR MAN technique helps you communicate effectively to achieve your objectives while maintaining relationships.
            This exercise will guide you through planning a challenging conversation using this structured approach.
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <Label htmlFor="situation" className="text-mindtrack-stone">
              Describe the conversation or situation:
            </Label>
            <Textarea
              id="situation"
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              className="mt-1 min-h-[80px]"
              placeholder="E.g., Need to discuss boundaries with a friend who frequently cancels plans..."
              required
            />
          </div>

          <div>
            <Label htmlFor="describe" className="text-mindtrack-stone">
              D - Describe the facts objectively:
            </Label>
            <Textarea
              id="describe"
              value={describe}
              onChange={(e) => setDescribe(e.target.value)}
              className="mt-1 min-h-[80px]"
              placeholder="Just state the facts without judgments or accusations..."
              required
            />
          </div>

          <div>
            <Label htmlFor="express" className="text-mindtrack-stone">
              E - Express your feelings and opinions:
            </Label>
            <Textarea
              id="express"
              value={express}
              onChange={(e) => setExpress(e.target.value)}
              className="mt-1 min-h-[80px]"
              placeholder="Use 'I' statements to express how you feel about the situation..."
              required
            />
          </div>

          <div>
            <Label htmlFor="assert" className="text-mindtrack-stone">
              A - Assert your wishes clearly:
            </Label>
            <Textarea
              id="assert"
              value={assert}
              onChange={(e) => setAssert(e.target.value)}
              className="mt-1 min-h-[80px]"
              placeholder="State exactly what you want to happen..."
              required
            />
          </div>

          <div>
            <Label htmlFor="reinforce" className="text-mindtrack-stone">
              R - Reinforce why this would be positive:
            </Label>
            <Textarea
              id="reinforce"
              value={reinforce}
              onChange={(e) => setReinforce(e.target.value)}
              className="mt-1 min-h-[80px]"
              placeholder="Explain the benefits for the other person or your relationship..."
              required
            />
          </div>

          <div>
            <Label htmlFor="mindful" className="text-mindtrack-stone">
              M - Mindful of your objective:
            </Label>
            <Textarea
              id="mindful"
              value={mindful}
              onChange={(e) => setMindful(e.target.value)}
              className="mt-1 min-h-[80px]"
              placeholder="How will you stay focused on your goal during the conversation?"
              required
            />
          </div>

          <div>
            <Label htmlFor="appear" className="text-mindtrack-stone">
              A - Appear confident:
            </Label>
            <Textarea
              id="appear"
              value={appear}
              onChange={(e) => setAppear(e.target.value)}
              className="mt-1 min-h-[80px]"
              placeholder="How will you maintain confident body language and tone?"
              required
            />
          </div>

          <div>
            <Label htmlFor="negotiate" className="text-mindtrack-stone">
              N - Negotiate if needed:
            </Label>
            <Textarea
              id="negotiate"
              value={negotiate}
              onChange={(e) => setNegotiate(e.target.value)}
              className="mt-1 min-h-[80px]"
              placeholder="What compromises are you willing to consider?"
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

export default InterpersonalEffectivenessExercise;
