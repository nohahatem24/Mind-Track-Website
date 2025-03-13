
import { InstructionsProps } from "./types";

const Instructions = ({ isRelaxing }: InstructionsProps) => {
  return (
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
  );
};

export default Instructions;
