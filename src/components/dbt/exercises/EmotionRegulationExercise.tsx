
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface EmotionRegulationExerciseProps {
  onComplete: (data: Record<string, any>) => void;
  onCancel: () => void;
  initialData?: Record<string, any>;
  isEditing: boolean;
}

const EmotionRegulationExercise: React.FC<EmotionRegulationExerciseProps> = ({
  onComplete,
  onCancel,
  initialData,
  isEditing
}) => {
  const [emotion, setEmotion] = useState(initialData?.emotion || "");
  const [intensity, setIntensity] = useState(initialData?.intensity || "");
  const [triggers, setTriggers] = useState(initialData?.triggers || "");
  const [bodyResponse, setBodyResponse] = useState(initialData?.bodyResponse || "");
  const [urges, setUrges] = useState(initialData?.urges || "");
  const [copingStrategy, setCopingStrategy] = useState(initialData?.copingStrategy || "");
  const [selfCare, setSelfCare] = useState(initialData?.selfCare || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onComplete({
      emotion,
      intensity,
      triggers,
      bodyResponse,
      urges,
      copingStrategy,
      selfCare
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="mb-6">
          <p className="text-mindtrack-stone/80 mb-4">
            Emotion Regulation skills help you understand and manage your emotional responses.
            This exercise will help you identify triggers, physical sensations, and develop effective coping strategies.
          </p>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emotion" className="text-mindtrack-stone">
                What emotion are you feeling?
              </Label>
              <Input
                id="emotion"
                value={emotion}
                onChange={(e) => setEmotion(e.target.value)}
                className="mt-1"
                placeholder="E.g., anger, sadness, anxiety..."
                required
              />
            </div>
            <div>
              <Label htmlFor="intensity" className="text-mindtrack-stone">
                Intensity (1-10):
              </Label>
              <Input
                id="intensity"
                type="number"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(e.target.value)}
                className="mt-1"
                placeholder="Rate from 1 (mild) to 10 (extreme)"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="triggers" className="text-mindtrack-stone">
              What triggered this emotion?
            </Label>
            <Textarea
              id="triggers"
              value={triggers}
              onChange={(e) => setTriggers(e.target.value)}
              className="mt-1 min-h-[80px]"
              placeholder="Describe events, thoughts, or situations that prompted this emotion..."
              required
            />
          </div>

          <div>
            <Label htmlFor="bodyResponse" className="text-mindtrack-stone">
              How does your body respond to this emotion?
            </Label>
            <Textarea
              id="bodyResponse"
              value={bodyResponse}
              onChange={(e) => setBodyResponse(e.target.value)}
              className="mt-1 min-h-[80px]"
              placeholder="Describe physical sensations (e.g., racing heart, muscle tension)..."
              required
            />
          </div>

          <div>
            <Label htmlFor="urges" className="text-mindtrack-stone">
              What urges or actions does this emotion create?
            </Label>
            <Textarea
              id="urges"
              value={urges}
              onChange={(e) => setUrges(e.target.value)}
              className="mt-1 min-h-[80px]"
              placeholder="What do you feel like doing when experiencing this emotion?"
              required
            />
          </div>

          <div>
            <Label htmlFor="copingStrategy" className="text-mindtrack-stone">
              Healthy coping strategies:
            </Label>
            <Textarea
              id="copingStrategy"
              value={copingStrategy}
              onChange={(e) => setCopingStrategy(e.target.value)}
              className="mt-1 min-h-[80px]"
              placeholder="List specific actions you can take to manage this emotion effectively..."
              required
            />
          </div>

          <div>
            <Label htmlFor="selfCare" className="text-mindtrack-stone">
              Self-care plan to reduce emotional vulnerability:
            </Label>
            <Textarea
              id="selfCare"
              value={selfCare}
              onChange={(e) => setSelfCare(e.target.value)}
              className="mt-1 min-h-[80px]"
              placeholder="List actions to maintain emotional balance (sleep, exercise, nutrition, etc.)..."
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

export default EmotionRegulationExercise;
