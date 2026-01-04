
import { Check } from "lucide-react";
import { MuscleGroupItemProps } from "./types";

const MuscleGroupItem = ({ group, isCurrent, isCompleted, index }: MuscleGroupItemProps) => {
  return (
    <div 
      key={index}
      className={`p-3 border rounded-md ${
        isCompleted
          ? "border-green-300 bg-green-50"
          : isCurrent 
            ? "border-mindtrack-sage bg-mindtrack-sage/5" 
            : "border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isCompleted && (
            <Check className="w-4 h-4 text-green-500" />
          )}
          <span className={isCompleted ? "line-through text-gray-500" : ""}>
            {group}
          </span>
        </div>
        
        {isCurrent && !isCompleted && (
          <span className="text-xs px-2 py-1 bg-mindtrack-sage/10 text-mindtrack-sage rounded-full">
            Current
          </span>
        )}
      </div>
    </div>
  );
};

export default MuscleGroupItem;
