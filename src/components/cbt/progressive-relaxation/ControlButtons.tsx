
import { ControlButtonsProps } from "./types";

const ControlButtons = ({ 
  timerActive, 
  relaxing, 
  startMuscleGroup, 
  switchToRelaxation, 
  completeCurrentStep 
}: ControlButtonsProps) => {
  if (!timerActive) {
    return (
      <button
        onClick={startMuscleGroup}
        className="w-full py-3 mb-4 bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors"
      >
        Start Tensing This Muscle Group
      </button>
    );
  }

  return (
    <div className="mb-4 space-y-3">
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
  );
};

export default ControlButtons;
