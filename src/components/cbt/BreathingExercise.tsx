
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ExerciseProps {
  onComplete: (data: Record<string, any>) => void;
  onCancel: () => void;
  initialData?: Record<string, any>;
  isEditing?: boolean;
}

const BreathingExercise = ({ 
  onComplete,
  onCancel,
  initialData,
  isEditing = false
}: ExerciseProps) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [count, setCount] = useState(0);
  const [cycles, setCycles] = useState(initialData?.cycles || 0);
  const [totalTime, setTotalTime] = useState(initialData?.totalTime || 0);
  const [sessionTime, setSessionTime] = useState(0);

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
        
        // Update timers
        setTotalTime(prev => prev + 1);
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isActive, phase]);

  const handleComplete = () => {
    onComplete({
      cycles,
      totalTime,
      sessionTime,
      date: new Date().toISOString()
    });
  };

  // Format seconds into minutes and seconds
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
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
          Follow the circle as it expands and contracts. Breathe in for 4 seconds, hold for 2 seconds, and exhale for 6 seconds.
        </p>
        <div className="mt-2 text-sm text-mindtrack-sage">
          Session time: {formatTime(sessionTime)}
        </div>
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
