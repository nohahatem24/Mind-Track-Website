
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExerciseProps, BreathingPatternData, BreathingExerciseData } from "./types";
import { Clock, CheckCircle } from "lucide-react";

interface BreathingPattern {
  inhale: number;
  holdAfterInhale: number;
  exhale: number;
  holdAfterExhale: number;
}

const CALMING_TEXTS = [
  "Nothing else is required of you right now.",
  "Let the breath do the work.",
  "You are safe in this moment.",
  "There is nowhere you need to go.",
  "Notice the air entering. Notice it leaving.",
  "You're allowed to take this slowly.",
  "Your body knows how to breathe.",
  "If your mind wanders, gently return to the breath.",
  "This moment is enough.",
  "No fixing. Just noticing.",
  "Let your shoulders soften.",
  "You can rest here for a moment.",
  "Breathing in, breathing out — that's all.",
  "You don't need to control this. Just follow it.",
  "The present moment is holding you."
];

const DEFAULT_BREATHING_PATTERN: BreathingPattern = {
  inhale: 4,
  holdAfterInhale: 2,
  exhale: 6,
  holdAfterExhale: 2
};

const BreathingExercise = ({ 
  onComplete,
  onCancel,
  initialData,
  isEditing = false
}: ExerciseProps) => {
  // Type assertion for initialData to BreathingExerciseData
  const breathingData = initialData as unknown as BreathingExerciseData | undefined;
  
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "holdInhale" | "exhale" | "holdExhale">("inhale");
  const [count, setCount] = useState(0);
  const [cycles, setCycles] = useState((breathingData?.cycles as number) ?? 0);
  const [totalTime, setTotalTime] = useState((breathingData?.totalTime as number) ?? 0);
  const [sessionTime, setSessionTime] = useState(0);
  const [breathingPattern, setBreathingPattern] = useState<BreathingPattern>(
    (breathingData?.breathingPattern as BreathingPattern) ?? DEFAULT_BREATHING_PATTERN
  );
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  // Start/stop the breathing exercise
  const toggleExercise = () => {
    if (isActive) {
      setIsActive(false);
    } else {
      setIsActive(true);
      setPhase("inhale");
      setCount(0);
      setCurrentTextIndex(0);
    }
  };

  // Effect to handle the breathing animation and phase transitions
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isActive) {
      intervalId = setInterval(() => {
        setCount(prevCount => {
          const { inhale, holdAfterInhale, exhale, holdAfterExhale } = breathingPattern;
          
          if (phase === "inhale" && prevCount >= inhale - 1) {
            setPhase(holdAfterInhale > 0 ? "holdInhale" : "exhale");
            return 0;
          } else if (phase === "holdInhale" && prevCount >= holdAfterInhale - 1) {
            setPhase("exhale");
            return 0;
          } else if (phase === "exhale" && prevCount >= exhale - 1) {
            setPhase(holdAfterExhale > 0 ? "holdExhale" : "inhale");
            if (holdAfterExhale === 0) {
              setCycles(prev => prev + 1);
            }
            return 0;
          } else if (phase === "holdExhale" && prevCount >= holdAfterExhale - 1) {
            setPhase("inhale");
            setCycles(prev => prev + 1);
            return 0;
          }
          return prevCount + 1;
        });
        
        // Update timers
        setTotalTime(prev => prev + 1);
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isActive, phase, breathingPattern]);

  // Effect to rotate calming text every 7 seconds during active breathing
  useEffect(() => {
    let textIntervalId: NodeJS.Timeout;
    
    if (isActive) {
      textIntervalId = setInterval(() => {
        setCurrentTextIndex(prev => (prev + 1) % CALMING_TEXTS.length);
      }, 7000);
    }
    
    return () => {
      if (textIntervalId) clearInterval(textIntervalId);
    };
  }, [isActive]);

  const handleComplete = () => {
    onComplete({
      cycles,
      totalTime,
      sessionTime,
      breathingPattern,
      date: new Date().toISOString()
    });
  };

  // Format seconds into minutes and seconds
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Update breathing pattern with validation
  const updateBreathingPattern = (key: keyof BreathingPattern, value: string) => {
    if (isActive) return; // Don't allow changes during active exercise
    
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 0) return;
    
    // Set reasonable limits based on key
    let validValue = numValue;
    if (key === "inhale") {
      validValue = Math.min(12, numValue); // Max 12 seconds
    } else if (key === "exhale") {
      validValue = Math.min(20, numValue); // Max 20 seconds
    } else {
      validValue = Math.min(10, numValue); // Max 10 for holds
    }
    
    setBreathingPattern(prev => ({
      ...prev,
      [key]: validValue
    }));
  };

  const getPhaseDisplay = () => {
    switch (phase) {
      case "inhale":
        return "Breathe In";
      case "holdInhale":
        return "Hold";
      case "exhale":
        return "Breathe Out";
      case "holdExhale":
        return "Hold";
      default:
        return "Breathe";
    }
  };

  const getPhaseScale = () => {
    switch (phase) {
      case "inhale":
        return { scale: [1, 1.5] };
      case "holdInhale":
        return { scale: 1.5 };
      case "exhale":
        return { scale: [1.5, 1] };
      case "holdExhale":
        return { scale: 1 };
      default:
        return { scale: 1 };
    }
  };

  const getPhaseDuration = () => {
    switch (phase) {
      case "inhale":
        return breathingPattern.inhale;
      case "holdInhale":
        return breathingPattern.holdAfterInhale;
      case "exhale":
        return breathingPattern.exhale;
      case "holdExhale":
        return breathingPattern.holdAfterExhale;
      default:
        return 1;
    }
  };

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
          Follow the circle as it expands and contracts. Customize your breathing pattern below.
        </p>
        <div className="flex items-center justify-center gap-2 mt-2 text-sm text-mindtrack-sage">
          <Clock className="w-4 h-4" />
          <span>Session time: {formatTime(sessionTime)}</span>
        </div>
      </div>

      {!isActive && !isEditing && (
        <div className="grid grid-cols-4 gap-4 p-4 bg-mindtrack-sage/5 rounded-lg">
          <div>
            <label className="block text-xs font-medium text-mindtrack-stone mb-1">
              Inhale (seconds)
            </label>
            <input 
              type="number" 
              min="1" 
              max="12"
              value={breathingPattern.inhale}
              onChange={(e) => updateBreathingPattern("inhale", e.target.value)}
              onBlur={(e) => {
                if (e.target.value === "") {
                  setBreathingPattern(prev => ({ ...prev, inhale: DEFAULT_BREATHING_PATTERN.inhale }));
                }
              }}
              className="w-full p-2 border border-mindtrack-sage/20 rounded-md focus:outline-none focus:ring-1 focus:ring-mindtrack-sage"
              aria-label="Inhale duration in seconds"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-mindtrack-stone mb-1">
              Hold After Inhale
            </label>
            <input 
              type="number" 
              min="0" 
              max="10"
              value={breathingPattern.holdAfterInhale}
              onChange={(e) => updateBreathingPattern("holdAfterInhale", e.target.value)}
              onBlur={(e) => {
                if (e.target.value === "") {
                  setBreathingPattern(prev => ({ ...prev, holdAfterInhale: DEFAULT_BREATHING_PATTERN.holdAfterInhale }));
                }
              }}
              className="w-full p-2 border border-mindtrack-sage/20 rounded-md focus:outline-none focus:ring-1 focus:ring-mindtrack-sage"
              aria-label="Hold after inhale duration in seconds"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-mindtrack-stone mb-1">
              Exhale (seconds)
            </label>
            <input 
              type="number" 
              min="1" 
              max="20"
              value={breathingPattern.exhale}
              onChange={(e) => updateBreathingPattern("exhale", e.target.value)}
              onBlur={(e) => {
                if (e.target.value === "") {
                  setBreathingPattern(prev => ({ ...prev, exhale: DEFAULT_BREATHING_PATTERN.exhale }));
                }
              }}
              className="w-full p-2 border border-mindtrack-sage/20 rounded-md focus:outline-none focus:ring-1 focus:ring-mindtrack-sage"
              aria-label="Exhale duration in seconds"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-mindtrack-stone mb-1">
              Hold After Exhale
            </label>
            <input 
              type="number" 
              min="0" 
              max="10"
              value={breathingPattern.holdAfterExhale}
              onChange={(e) => updateBreathingPattern("holdAfterExhale", e.target.value)}
              onBlur={(e) => {
                if (e.target.value === "") {
                  setBreathingPattern(prev => ({ ...prev, holdAfterExhale: DEFAULT_BREATHING_PATTERN.holdAfterExhale }));
                }
              }}
              className="w-full p-2 border border-mindtrack-sage/20 rounded-md focus:outline-none focus:ring-1 focus:ring-mindtrack-sage"
              aria-label="Hold after exhale duration in seconds"
            />
          </div>
        </div>
      )}

      <div className="flex flex-col items-center justify-center">
        {/* Breathing Circle */}
        <div className="relative w-48 h-48 mb-6">
          <motion.div
            animate={getPhaseScale()}
            transition={{
              duration: getPhaseDuration(),
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-mindtrack-sage/20 rounded-full flex items-center justify-center"
          >
            <span className="text-lg font-medium text-mindtrack-stone">
              {getPhaseDisplay()}
            </span>
          </motion.div>
        </div>

        {/* Calming Text - Only visible during active breathing */}
        {isActive && (
          <motion.div
            key={currentTextIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md px-4 mb-8"
          >
            <div className="p-4 sm:p-6 rounded-lg border-2 border-mindtrack-sage/40 bg-mindtrack-sage/5 backdrop-blur-sm">
              <p className="text-base sm:text-lg md:text-xl font-medium text-mindtrack-stone/60 text-center leading-relaxed italic">
                {CALMING_TEXTS[currentTextIndex]}
              </p>
            </div>
          </motion.div>
        )}

        {/* Count and Phase Info */}
        <div className="text-center mb-4">
          <p className="text-2xl font-bold text-mindtrack-stone">{count + 1}</p>
          <p className="text-sm text-mindtrack-stone/70">
            {phase === "inhale" 
              ? `Inhale: ${breathingPattern.inhale} counts` 
              : phase === "holdInhale"
                ? `Hold: ${breathingPattern.holdAfterInhale} counts`
                : phase === "exhale" 
                ? `Exhale: ${breathingPattern.exhale} counts`
                : `Hold: ${breathingPattern.holdAfterExhale} counts`
            }
          </p>
        </div>

        {/* Cycles Counter */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2">
            <p className="text-lg font-medium text-mindtrack-stone">Completed Cycles: {cycles}</p>
            {cycles > 0 && <CheckCircle className="w-5 h-5 text-green-500" />}
          </div>
        </div>

        {/* Control Buttons */}
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
              onClick={handleComplete}
              className="px-6 py-3 border border-mindtrack-sage text-mindtrack-sage rounded-md hover:bg-mindtrack-sage/5 transition-colors"
            >
              {isEditing ? "Save Changes" : "Finish Exercise"}
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

export default BreathingExercise;

