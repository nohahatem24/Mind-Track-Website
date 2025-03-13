
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MuscleGroupsList from "./MuscleGroupsList";
import TimerDisplay from "./TimerDisplay";
import Instructions from "./Instructions";
import ControlButtons from "./ControlButtons";
import ExerciseCompleted from "./ExerciseCompleted";
import { formatTime } from "./utils";
import { ProgressiveMuscleRelaxationProps, muscleGroups } from "./types";

const ProgressiveMuscleRelaxationExercise = ({ 
  onComplete,
  onCancel,
  initialData,
  isEditing = false
}: ProgressiveMuscleRelaxationProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedGroups, setCompletedGroups] = useState<Record<string, boolean>>(
    initialData?.completedGroups || {}
  );
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [relaxing, setRelaxing] = useState(false);
  const [totalTime, setTotalTime] = useState(initialData?.totalTime || 0);
  const [sessionTimer, setSessionTimer] = useState(0);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          const nextValue = prev + 1;
          
          // Auto-switch to relaxation after 10 seconds of tension
          if (!relaxing && nextValue >= 10) {
            setRelaxing(true);
            return 0;
          }
          
          // Auto-mark group as complete after 15 seconds of relaxation
          if (relaxing && nextValue >= 15) {
            completeCurrentStep();
            return 0;
          }
          
          return nextValue;
        });
        
        // Update both timers
        setSessionTimer(prev => prev + 1);
        setTotalTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, relaxing]);
  
  const startMuscleGroup = () => {
    setTimerActive(true);
    setTimerSeconds(0);
    setRelaxing(false);
  };
  
  const switchToRelaxation = () => {
    setTimerSeconds(0);
    setRelaxing(true);
  };
  
  const completeCurrentStep = () => {
    // Mark the current muscle group as completed
    const updatedGroups = { ...completedGroups };
    updatedGroups[muscleGroups[currentStep]] = true;
    setCompletedGroups(updatedGroups);
    
    setTimerActive(false);
    
    // Move to next step if not at the end
    if (currentStep < muscleGroups.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const resetExercise = () => {
    setCurrentStep(0);
    setCompletedGroups({});
    setTimerActive(false);
    setTimerSeconds(0);
    setRelaxing(false);
    setSessionTimer(0);
  };
  
  const handleComplete = () => {
    onComplete({
      completedGroups,
      totalTime,
      sessionTime: sessionTimer,
      date: new Date().toISOString()
    });
  };
  
  const isExerciseComplete = Object.keys(completedGroups).length === muscleGroups.length;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-mindtrack-stone mb-2">
          Progressive Muscle Relaxation
        </h3>
        <p className="text-mindtrack-stone/80">
          Systematically tense and relax each muscle group to reduce physical tension and promote relaxation.
        </p>
        <div className="mt-2 text-sm text-mindtrack-sage">
          Session time: {formatTime(sessionTimer)}
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <MuscleGroupsList
            currentStep={currentStep}
            completedGroups={completedGroups}
          />
        </div>
        
        <div className="space-y-6">
          <div className="p-6 border border-mindtrack-sage/20 rounded-lg bg-mindtrack-sage/5">
            <h4 className="font-medium text-mindtrack-stone mb-4">
              {currentStep < muscleGroups.length ? `Current: ${muscleGroups[currentStep]}` : "Exercise Complete!"}
            </h4>
            
            {!isExerciseComplete && (
              <>
                {timerActive && (
                  <TimerDisplay seconds={timerSeconds} isRelaxing={relaxing} />
                )}
                
                <ControlButtons
                  timerActive={timerActive}
                  relaxing={relaxing}
                  startMuscleGroup={startMuscleGroup}
                  switchToRelaxation={switchToRelaxation}
                  completeCurrentStep={completeCurrentStep}
                />
                
                <Instructions isRelaxing={relaxing} />
              </>
            )}
            
            {isExerciseComplete && (
              <ExerciseCompleted
                resetExercise={resetExercise}
                handleComplete={handleComplete}
                isEditing={isEditing}
              />
            )}
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={onCancel}
              className="text-mindtrack-stone/70 hover:text-mindtrack-stone underline"
            >
              Cancel Exercise
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProgressiveMuscleRelaxationExercise;
