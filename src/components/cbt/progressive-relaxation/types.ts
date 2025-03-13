
export interface ProgressiveMuscleRelaxationProps { 
  onComplete: (data: Record<string, any>) => void;
  onCancel: () => void;
  initialData?: Record<string, any>;
  isEditing?: boolean;
}

export interface MuscleGroupItemProps {
  group: string;
  isCurrent: boolean;
  isCompleted: boolean;
  index: number;
}

export interface TimerDisplayProps {
  seconds: number;
  isRelaxing: boolean;
}

export interface InstructionsProps {
  isRelaxing: boolean;
}

export interface ControlButtonsProps {
  timerActive: boolean;
  relaxing: boolean;
  startMuscleGroup: () => void;
  switchToRelaxation: () => void;
  completeCurrentStep: () => void;
}

export interface ExerciseCompletedProps {
  resetExercise: () => void;
  handleComplete: () => void;
  isEditing: boolean;
}

export const muscleGroups = [
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
