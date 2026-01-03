
import { ProgressiveMuscleRelaxationProps, ProgressiveMuscleRelaxationData } from "./progressive-relaxation/types";
import ProgressiveMuscleRelaxationExercise from "./progressive-relaxation/ProgressiveMuscleRelaxation";

// This is a wrapper component that forwards all props to the actual implementation
const ProgressiveRelaxation = (props: ProgressiveMuscleRelaxationProps) => {
  return <ProgressiveMuscleRelaxationExercise {...props} />;
};

export default ProgressiveRelaxation;
