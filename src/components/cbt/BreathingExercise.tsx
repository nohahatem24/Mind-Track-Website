
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExerciseProps } from "./types";
import { Clock, CheckCircle } from "lucide-react";

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
  const [breathingPattern, setBreathingPattern] = useState({
    inhale: 4,
    hold: 2,
    exhale: 6
  });

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
          const { inhale, hold, exhale } = breathingPattern;
          
          if (phase === "inhale" && prevCount >= inhale - 1) {
            setPhase("hold");
            return 0;
          } else if (phase === "hold" && prevCount >= hold - 1) {
            setPhase("exhale");
            return 0;
          } else if (phase === "exhale" && prevCount >= exhale - 1) {
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

  // Update breathing pattern
  const updateBreathingPattern = (type: "inhale" | "hold" | "exhale", value: number) => {
    if (isActive) return; // Don't allow changes during active exercise
    setBreathingPattern(prev => ({
      ...prev,
      [type]: value
    }));
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
        <div className="grid grid-cols-3 gap-4 p-4 bg-mindtrack-sage/5 rounded-lg">
          <div>
            <label className="block text-xs font-medium text-mindtrack-stone mb-1">Inhale (seconds)</label>
            <input 
              type="number" 
              min="2" 
              max="8" 
              value={breathingPattern.inhale}
              onChange={(e) => updateBreathingPattern("inhale", Math.max(2, Math.min(8, parseInt(e.target.value) || 4)))}
              className="w-full p-2 border border-mindtrack-sage/20 rounded-md focus:outline-none focus:ring-1 focus:ring-mindtrack-sage"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-mindtrack-stone mb-1">Hold (seconds)</label>
            <input 
              type="number" 
              min="1" 
              max="6" 
              value={breathingPattern.hold}
              onChange={(e) => updateBreathingPattern("hold", Math.max(1, Math.min(6, parseInt(e.target.value) || 2)))}
              className="w-full p-2 border border-mindtrack-sage/20 rounded-md focus:outline-none focus:ring-1 focus:ring-mindtrack-sage"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-mindtrack-stone mb-1">Exhale (seconds)</label>
            <input 
              type="number" 
              min="3" 
              max="10" 
              value={breathingPattern.exhale}
              onChange={(e) => updateBreathingPattern("exhale", Math.max(3, Math.min(10, parseInt(e.target.value) || 6)))}
              className="w-full p-2 border border-mindtrack-sage/20 rounded-md focus:outline-none focus:ring-1 focus:ring-mindtrack-sage"
            />
          </div>
        </div>
      )}

      <div className="flex flex-col items-center justify-center">
        <div className="relative w-48 h-48 mb-6">
          <motion.div
            animate={{
              scale: phase === "inhale" ? [1, 1.5] : phase === "hold" ? 1.5 : [1.5, 1],
            }}
            transition={{
              duration: phase === "inhale" ? breathingPattern.inhale : phase === "exhale" ? breathingPattern.exhale : breathingPattern.hold,
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
            {phase === "inhale" 
              ? `Inhale: ${breathingPattern.inhale} counts` 
              : phase === "hold" 
                ? `Hold: ${breathingPattern.hold} counts` 
                : `Exhale: ${breathingPattern.exhale} counts`}
          </p>
        </div>

        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2">
            <p className="text-lg font-medium text-mindtrack-stone">Completed Cycles: {cycles}</p>
            {cycles > 0 && <CheckCircle className="w-5 h-5 text-green-500" />}
          </div>
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
