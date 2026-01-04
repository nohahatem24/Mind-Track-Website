import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Play, Pause, RotateCcw } from "lucide-react";

interface OneMinuteMindfulnessExerciseProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onComplete: (data: Record<string, any>) => void;
  onCancel: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: Record<string, any>;
  isEditing: boolean;
}

const OneMinuteMindfulnessExercise: React.FC<OneMinuteMindfulnessExerciseProps> = ({
  onComplete,
  onCancel,
  initialData,
  isEditing
}) => {
  const DURATION = 60; // 1 minute in seconds

  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [completionState, setCompletionState] = useState<"in-progress" | "completed" | "interrupted" | null>(
    initialData?.completionState || null
  );

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setCompletionState("completed");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleStart = () => {
    if (timeLeft > 0) {
      setIsRunning(true);
      setCompletionState("in-progress");
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setTimeLeft(DURATION);
    setIsRunning(false);
    setCompletionState(null);
  };

  const handleInterrupt = () => {
    setIsRunning(false);
    setCompletionState("interrupted");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!completionState) {
      alert("Please complete or interrupt the exercise before submitting.");
      return;
    }

    onComplete({
      duration: DURATION,
      timeCompleted: DURATION - timeLeft,
      completionState,
      completedAt: new Date().toISOString()
    });
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const displayTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  const progressPercent = ((DURATION - timeLeft) / DURATION) * 100;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="mb-6">
          <p className="text-mindtrack-stone/80 mb-4">
            A simple one-minute mindfulness practice. Focus on your breath.
            Let thoughts come and go without judgment. You can pause or interrupt anytime.
          </p>
        </div>

        {/* Timer Display */}
        <div className="p-8 bg-mindtrack-sage/5 border-2 border-mindtrack-sage/20 rounded-lg text-center space-y-4">
          <div className="text-6xl font-bold text-mindtrack-sage font-mono">
            {displayTime}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-mindtrack-sage/10 rounded-full h-2 overflow-hidden">
            <div
              className="bg-mindtrack-sage h-full transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center gap-3 mt-6">
            {!isRunning ? (
              <>
                <button
                  type="button"
                  onClick={handleStart}
                  disabled={completionState === "completed" || completionState === "interrupted"}
                  className="flex items-center gap-2 px-4 py-2 bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="w-4 h-4" />
                  {timeLeft === DURATION ? "Start" : "Resume"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handlePause}
                className="flex items-center gap-2 px-4 py-2 bg-mindtrack-stone/20 text-mindtrack-stone rounded-md hover:bg-mindtrack-stone/30 transition-colors"
              >
                <Pause className="w-4 h-4" />
                Pause
              </button>
            )}

            {timeLeft < DURATION && (
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-mindtrack-stone/10 text-mindtrack-stone rounded-md hover:bg-mindtrack-stone/20 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Breathing Guidance */}
        <div className="p-4 border border-mindtrack-sage/20 rounded-lg bg-mindtrack-sage/2 text-center">
          <p className="text-sm text-mindtrack-stone/80 font-medium">
            Inhale for 4... Hold for 4... Exhale for 4...
          </p>
          <p className="text-xs text-mindtrack-stone/60 mt-2">
            Repeat this pattern at your own pace. There's no right or wrong way.
          </p>
        </div>

        {/* Completion State */}
        {completionState && (
          <div className="p-4 border border-mindtrack-sage/20 rounded-lg space-y-3">
            <Label className="text-mindtrack-stone font-semibold">How did the exercise go?</Label>
            <RadioGroup value={completionState || ""} onValueChange={(val) => setCompletionState(val as "in-progress" | "completed" | "interrupted")}>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="completed" id="completed" />
                <Label htmlFor="completed" className="text-mindtrack-stone cursor-pointer">
                  Completed — I finished the full minute
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="interrupted" id="interrupted" />
                <Label htmlFor="interrupted" className="text-mindtrack-stone cursor-pointer">
                  Interrupted — I paused or stopped early
                </Label>
              </div>
            </RadioGroup>
            {completionState === "completed" && (
              <p className="text-xs text-mindtrack-stone/70 p-2 bg-mindtrack-sage/5 rounded">
                Great work! You maintained focus for the full minute. That's a win.
              </p>
            )}
            {completionState === "interrupted" && (
              <p className="text-xs text-mindtrack-stone/70 p-2 bg-mindtrack-sage/5 rounded">
                That's okay. Even a few seconds of mindfulness counts. This is practice, not perfection.
              </p>
            )}
          </div>
        )}

        {completionState !== "interrupted" && (
          <div className="p-4 bg-mindtrack-stone/5 rounded-lg">
            <p className="text-sm text-mindtrack-stone/80">
              <span className="font-semibold text-mindtrack-sage">Time practiced:</span> {displayTime}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-mindtrack-stone hover:bg-mindtrack-sage/5 rounded-md transition-colors"
        >
          Cancel
        </button>
        {completionState && (
          <button
            type="submit"
            className="px-4 py-2 bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors"
          >
            {isEditing ? "Update" : "Complete"} Exercise
          </button>
        )}
        {!completionState && !isRunning && (
          <button
            type="button"
            onClick={handleInterrupt}
            className="px-4 py-2 bg-red-50 text-red-500 rounded-md hover:bg-red-100 transition-colors"
          >
            Mark as Interrupted
          </button>
        )}
      </div>
    </form>
  );
};

export default OneMinuteMindfulnessExercise;
