
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
      <div className="space-y-2 max-h-[400px] overflow-y-auto p-1">
        {muscleGroups.map((group, index) => (
          <MuscleGroupItem
            key={index}
            group={group}
            isCurrent={currentStep === index}
            isCompleted={completedGroups[group] || false}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default MuscleGroupsList;
