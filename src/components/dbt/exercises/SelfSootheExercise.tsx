import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface SelfSootheExerciseProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onComplete: (data: Record<string, any>) => void;
  onCancel: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: Record<string, any>;
  isEditing: boolean;
}

const SelfSootheExercise: React.FC<SelfSootheExerciseProps> = ({
  onComplete,
  onCancel,
  initialData,
  isEditing
}) => {
  const [visionDone, setVisionDone] = useState(initialData?.senses?.vision?.done || false);
  const [visionNotes, setVisionNotes] = useState(initialData?.senses?.vision?.notes || "");

  const [hearingDone, setHearingDone] = useState(initialData?.senses?.hearing?.done || false);
  const [hearingNotes, setHearingNotes] = useState(initialData?.senses?.hearing?.notes || "");

  const [smellDone, setSmellDone] = useState(initialData?.senses?.smell?.done || false);
  const [smellNotes, setSmellNotes] = useState(initialData?.senses?.smell?.notes || "");

  const [tasteDone, setTasteDone] = useState(initialData?.senses?.taste?.done || false);
  const [tasteNotes, setTasteNotes] = useState(initialData?.senses?.taste?.notes || "");

  const [touchDone, setTouchDone] = useState(initialData?.senses?.touch?.done || false);
  const [touchNotes, setTouchNotes] = useState(initialData?.senses?.touch?.notes || "");

  const completedCount = [visionDone, hearingDone, smellDone, tasteDone, touchDone].filter(Boolean).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onComplete({
      senses: {
        vision: { done: visionDone, notes: visionNotes },
        hearing: { done: hearingDone, notes: hearingNotes },
        smell: { done: smellDone, notes: smellNotes },
        taste: { done: tasteDone, notes: tasteNotes },
        touch: { done: touchDone, notes: touchNotes }
      },
      completedCount
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="mb-6">
          <p className="text-mindtrack-stone/80 mb-4">
            Use your five senses to calm and comfort yourself during distress. 
            You don't need to do everything—mark the senses you engaged with and optionally note what helped.
          </p>
        </div>

        {/* Vision */}
        <div className="p-4 border border-mindtrack-sage/20 rounded-lg space-y-3">
          <div className="flex items-center gap-3">
            <Checkbox
              id="vision"
              checked={visionDone}
              onCheckedChange={(checked) => setVisionDone(checked as boolean)}
              className="w-5 h-5"
            />
            <Label htmlFor="vision" className="text-mindtrack-stone font-semibold cursor-pointer">
              Vision: Look at beautiful or calming images
            </Label>
          </div>
          {visionDone && (
            <Textarea
              value={visionNotes}
              onChange={(e) => setVisionNotes(e.target.value)}
              placeholder="What did you see? (optional)"
              className="mt-2 min-h-[60px] ml-8"
            />
          )}
        </div>

        {/* Hearing */}
        <div className="p-4 border border-mindtrack-sage/20 rounded-lg space-y-3">
          <div className="flex items-center gap-3">
            <Checkbox
              id="hearing"
              checked={hearingDone}
              onCheckedChange={(checked) => setHearingDone(checked as boolean)}
              className="w-5 h-5"
            />
            <Label htmlFor="hearing" className="text-mindtrack-stone font-semibold cursor-pointer">
              Hearing: Listen to soothing sounds or music
            </Label>
          </div>
          {hearingDone && (
            <Textarea
              value={hearingNotes}
              onChange={(e) => setHearingNotes(e.target.value)}
              placeholder="What did you listen to? (optional)"
              className="mt-2 min-h-[60px] ml-8"
            />
          )}
        </div>

        {/* Smell */}
        <div className="p-4 border border-mindtrack-sage/20 rounded-lg space-y-3">
          <div className="flex items-center gap-3">
            <Checkbox
              id="smell"
              checked={smellDone}
              onCheckedChange={(checked) => setSmellDone(checked as boolean)}
              className="w-5 h-5"
            />
            <Label htmlFor="smell" className="text-mindtrack-stone font-semibold cursor-pointer">
              Smell: Use pleasant scents like candles or essential oils
            </Label>
          </div>
          {smellDone && (
            <Textarea
              value={smellNotes}
              onChange={(e) => setSmellNotes(e.target.value)}
              placeholder="What scent did you use? (optional)"
              className="mt-2 min-h-[60px] ml-8"
            />
          )}
        </div>

        {/* Taste */}
        <div className="p-4 border border-mindtrack-sage/20 rounded-lg space-y-3">
          <div className="flex items-center gap-3">
            <Checkbox
              id="taste"
              checked={tasteDone}
              onCheckedChange={(checked) => setTasteDone(checked as boolean)}
              className="w-5 h-5"
            />
            <Label htmlFor="taste" className="text-mindtrack-stone font-semibold cursor-pointer">
              Taste: Enjoy a small treat mindfully
            </Label>
          </div>
          {tasteDone && (
            <Textarea
              value={tasteNotes}
              onChange={(e) => setTasteNotes(e.target.value)}
              placeholder="What did you taste? (optional)"
              className="mt-2 min-h-[60px] ml-8"
            />
          )}
        </div>

        {/* Touch */}
        <div className="p-4 border border-mindtrack-sage/20 rounded-lg space-y-3">
          <div className="flex items-center gap-3">
            <Checkbox
              id="touch"
              checked={touchDone}
              onCheckedChange={(checked) => setTouchDone(checked as boolean)}
              className="w-5 h-5"
            />
            <Label htmlFor="touch" className="text-mindtrack-stone font-semibold cursor-pointer">
              Touch: Feel comfortable textures or take a warm bath
            </Label>
          </div>
          {touchDone && (
            <Textarea
              value={touchNotes}
              onChange={(e) => setTouchNotes(e.target.value)}
              placeholder="What texture or touch helped? (optional)"
              className="mt-2 min-h-[60px] ml-8"
            />
          )}
        </div>

        <div className="mt-6 p-4 bg-mindtrack-stone/5 rounded-lg">
          <p className="text-sm text-mindtrack-stone/80">
            <span className="font-semibold text-mindtrack-sage">{completedCount}</span> of 5 senses marked as used
            {completedCount === 0 && <span className="block text-xs mt-1 text-mindtrack-stone/70">Partial completion is valid—this is a practice exercise, not a requirement.</span>}
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

export default SelfSootheExercise;
