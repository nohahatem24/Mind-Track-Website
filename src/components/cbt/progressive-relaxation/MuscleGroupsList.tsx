
import { motion } from "framer-motion";
import MuscleGroupItem from "./MuscleGroupItem";
import { muscleGroups } from "./types";

interface MuscleGroupsListProps {
  currentStep: number;
  completedGroups: Record<string, boolean>;
}

const MuscleGroupsList = ({ currentStep, completedGroups }: MuscleGroupsListProps) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-mindtrack-stone">Muscle Groups</h4>
      <div className="space-y-2 p-1">
        {muscleGroups.map((muscleGroup, index) => {
          // Handle both old format (with trailing space) and new format for backward compatibility
          const isCompleted = completedGroups[muscleGroup.name] || completedGroups[`${muscleGroup.name} `] || false;
          return (
            <MuscleGroupItem
              key={index}
              group={muscleGroup.name}
              isCurrent={currentStep === index}
              isCompleted={isCompleted}
              index={index}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MuscleGroupsList;
