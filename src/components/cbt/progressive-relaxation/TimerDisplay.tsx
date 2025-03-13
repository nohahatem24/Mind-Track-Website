
import { TimerDisplayProps } from "./types";

const TimerDisplay = ({ seconds, isRelaxing }: TimerDisplayProps) => {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold">{seconds}s</div>
      <p className="text-sm text-mindtrack-stone/70">
        {isRelaxing 
          ? "Feel the relaxation... breathe deeply..." 
          : "Tense the muscles... hold..."}
      </p>
    </div>
  );
};

export default TimerDisplay;
