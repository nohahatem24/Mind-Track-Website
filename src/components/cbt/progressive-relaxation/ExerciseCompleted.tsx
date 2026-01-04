
import { ExerciseCompletedProps } from "./types";

const ExerciseCompleted = ({ resetExercise, handleComplete, isEditing }: ExerciseCompletedProps) => {
  return (
    <div className="text-center space-y-4">
      <p className="text-mindtrack-stone/80">
        Congratulations! You've completed the full progressive muscle relaxation exercise.
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
  );
};

export default ExerciseCompleted;
