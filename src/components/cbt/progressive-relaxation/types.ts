
export interface ProgressiveMuscleRelaxationData {
  completedGroups: Record<string, boolean>;
  totalTime: number;
  sessionTime: number;
  date: string;
}

export interface ProgressiveMuscleRelaxationProps { 
  onComplete: (data: ProgressiveMuscleRelaxationData) => void;
  onCancel: () => void;
  initialData?: ProgressiveMuscleRelaxationData;
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

export interface MuscleGroupData {
  name: string;
  imageUrl?: string;
  youtubeVideoId?: string;
}

export const muscleGroups: MuscleGroupData[] = [
  { name: "Feet and Toes", 
    imageUrl: "/feet-toes.png"
  },
  { name: "Calves",
    imageUrl: "/calves.png"
  },
  { name: "Thighs", 
    imageUrl: "/thighs.png"
  },
  { name: "Buttocks",
    imageUrl: "/buttocks.png"
  },
  { name: "Abdomen" },
  { name: "Chest" },
  { name: "Back" },
  { name: "Arms and hands" },
  { name: "Shoulders" },
  { name: "Neck" },
  { name: "Face" }
];

