
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface ProgressiveMuscleRelaxationProps { 
  onComplete: (data: Record<string, any>) => void;
  onCancel: () => void;
  initialData?: Record<string, any>;
  isEditing?: boolean;
}

const ProgressiveMuscleRelaxationExercise = ({ 
  onComplete,
  onCancel,
  initialData,
  isEditing = false
}: ProgressiveMuscleRelaxationProps) => {
  const muscleGroups = [
    "Feet and toes",
    "Calves",
    "Thighs",
    "Buttocks",
    "Abdomen",
    "Chest",
    "Back",
    "Arms and hands",
    "Shoulders",
    "Neck",
    "Face"
  ];
  
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
          <h4 className="font-medium text-mindtrack-stone">Muscle Groups</h4>
          <div className="space-y-2 max-h-[400px] overflow-y-auto p-1">
            {muscleGroups.map((group, index) => (
              <div 
                key={index}
                className={`p-3 border rounded-md ${
                  currentStep === index 
                    ? "border-mindtrack-sage bg-mindtrack-sage/5" 
                    : completedGroups[group]
                      ? "border-green-300 bg-green-50"
                      : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {completedGroups[group] && (
                      <Check className="w-4 h-4 text-green-500" />
                    )}
                    <span className={completedGroups[group] ? "line-through text-gray-500" : ""}>
                      {group}
                    </span>
                  </div>
                  
                  {currentStep === index && !completedGroups[group] && (
                    <span className="text-xs px-2 py-1 bg-mindtrack-sage/10 text-mindtrack-sage rounded-full">
                      Current
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="p-6 border border-mindtrack-sage/20 rounded-lg bg-mindtrack-sage/5">
            <h4 className="font-medium text-mindtrack-stone mb-4">
              {currentStep < muscleGroups.length ? `Current: ${muscleGroups[currentStep]}` : "Exercise Complete!"}
            </h4>
            
            {!isExerciseComplete && (
              <>
                {!timerActive ? (
                  <button
                    onClick={startMuscleGroup}
                    className="w-full py-3 mb-4 bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors"
                  >
                    Start Tensing This Muscle Group
                  </button>
                ) : (
                  <div className="mb-4 space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{timerSeconds}s</div>
                      <p className="text-sm text-mindtrack-stone/70">
                        {relaxing 
                          ? "Feel the relaxation... breathe deeply..." 
                          : "Tense the muscles... hold..."}
                      </p>
                    </div>
                    
                    {!relaxing && (
                      <button
                        onClick={switchToRelaxation}
                        className="w-full py-2 border border-mindtrack-sage text-mindtrack-sage rounded-md hover:bg-mindtrack-sage/5 transition-colors"
                      >
                        Release & Relax Now
                      </button>
                    )}
                    
                    {relaxing && (
                      <button
                        onClick={completeCurrentStep}
                        className="w-full py-2 bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors"
                      >
                        Complete & Move to Next
                      </button>
                    )}
                  </div>
                )}
                
                <div className="space-y-2">
                  <h5 className="font-medium text-sm text-mindtrack-stone">Instructions:</h5>
                  <ol className="list-decimal text-sm pl-5 space-y-1 text-mindtrack-stone/80">
                    <li>Get into a comfortable position</li>
                    <li>Focus on the current muscle group</li>
                    <li>Tense the muscles for 5-10 seconds</li>
                    <li>Release and notice the feeling of relaxation</li>
                    <li>Rest for 15-20 seconds before moving to the next group</li>
                  </ol>
                </div>
              </>
            )}
            
            {isExerciseComplete && (
              <div className="text-center space-y-4">
                <p className="text-mindtrack-stone/80">
                  Great job! You've completed the full progressive muscle relaxation exercise.
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={resetExercise}
                    className="px-4 py-2 border border-mindtrack-sage text-mindtrack-sage rounded-md hover:bg-mindtrack-sage/5 transition-colors"
                  >
                    Start Over
                  </button>
                  <button
                    onClick={handleComplete}
                    className="px-4 py-2 bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors"
                  >
                    {isEditing ? "Save Changes" : "Complete Exercise"}
                  </button>
                </div>
              </div>
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
