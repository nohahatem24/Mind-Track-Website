
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, X } from "lucide-react";
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
  const exerciseRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedGroups, setCompletedGroups] = useState<Record<string, boolean>>(
    initialData?.completedGroups || {}
  );
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [relaxing, setRelaxing] = useState(false);
  const [totalTime, setTotalTime] = useState(initialData?.totalTime || 0);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  
  const completeCurrentStep = useCallback(() => {
    setCurrentStep(prev => {
      const groupName = muscleGroups[prev].name;
      setCompletedGroups(groups => ({
        ...groups,
        [groupName]: true
      }));
      
      setTimerActive(false);
      
      // Move to next step if not at the end
      if (prev < muscleGroups.length - 1) {
        return prev + 1;
      }
      return prev;
    });
  }, []);
  
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
  }, [timerActive, relaxing, completeCurrentStep]);

  // Scroll to exercise when component mounts
  useEffect(() => {
    if (exerciseRef.current) {
      setTimeout(() => {
        exerciseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, []);
  
  const startMuscleGroup = () => {
    setTimerActive(true);
    setTimerSeconds(0);
    setRelaxing(false);
  };
  
  const switchToRelaxation = () => {
    setTimerSeconds(0);
    setRelaxing(true);
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
  const currentMuscleGroup = muscleGroups[currentStep];
  const groupName = currentMuscleGroup.name;
  
  return (
    <motion.div
      ref={exerciseRef}
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
              {currentStep < muscleGroups.length ? `Current: ${groupName}` : "Exercise Complete!"}
            </h4>
            
            {!isExerciseComplete && (
              <>
                <ControlButtons
                  timerActive={timerActive}
                  relaxing={relaxing}
                  startMuscleGroup={startMuscleGroup}
                  switchToRelaxation={switchToRelaxation}
                  completeCurrentStep={completeCurrentStep}
                />
                
                {/* Muscle Group Image - Display if available */}
                {currentMuscleGroup.imageUrl && (
                  <div className="mb-6">
                    <img
                      src={currentMuscleGroup.imageUrl}
                      alt={`${groupName} muscle group`}
                      className="w-full h-auto rounded-lg object-cover shadow-md"
                    />
                  </div>
                )}

                {timerActive && (
                  <TimerDisplay seconds={timerSeconds} isRelaxing={relaxing} />
                )}
                
                <Instructions isRelaxing={relaxing} />

                {/* YouTube Video Section - Display if video ID available */}
                {currentMuscleGroup.youtubeVideoId && (
                  <div className="mt-6 pt-6 border-t border-mindtrack-sage/20">
                    {!showVideo ? (
                      <button
                        onClick={() => setShowVideo(true)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-mindtrack-sage text-white rounded-lg hover:bg-mindtrack-sage/90 transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        Watch how to do this exercise
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-mindtrack-stone">Video Guide</p>
                          <button
                            onClick={() => setShowVideo(false)}
                            className="text-mindtrack-stone/60 hover:text-mindtrack-stone transition-colors"
                            title="Close video"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="relative w-full pt-[56.25%] bg-black rounded-lg overflow-hidden shadow-lg">
                          <iframe
                            className="absolute inset-0 w-full h-full"
                            src={`https://www.youtube.com/embed/${currentMuscleGroup.youtubeVideoId}?modestbranding=1`}
                            title={`${groupName} guide video`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
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
