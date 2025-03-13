
import { ExerciseData } from "./types";

// Helper to get cognitive distortion name from id
const getDistortionName = (id: string) => {
  const distortions: Record<string, string> = {
    "all-or-nothing": "All-or-Nothing Thinking",
    "overgeneralization": "Overgeneralization",
    "mental-filter": "Mental Filter",
    "disqualifying-positive": "Disqualifying the Positive",
    "jumping-conclusions": "Jumping to Conclusions",
    "catastrophizing": "Catastrophizing",
    "emotional-reasoning": "Emotional Reasoning",
    "should-statements": "Should Statements",
    "labeling": "Labeling",
    "personalization": "Personalization"
  };
  
  return distortions[id] || id;
};

// Format seconds into minutes and seconds
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

interface HistoryRendererProps {
  entry: ExerciseData;
}

export const HistoryRenderer = ({ entry }: HistoryRendererProps) => {
  switch (entry.techniqueId) {
    case "cog-restructuring":
      return (
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Negative thought:</span>
            <p className="ml-2 text-mindtrack-stone/80">{entry.data.negativeThought || "Not provided"}</p>
          </div>
          
          {entry.data.selectedDistortions?.length > 0 && (
            <div>
              <span className="font-medium">Cognitive distortions:</span>
              <ul className="ml-2 list-disc pl-5">
                {entry.data.selectedDistortions.map((id: string) => (
                  <li key={id} className="text-mindtrack-stone/80">
                    {getDistortionName(id)}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {entry.data.evidence?.supporting && (
            <div>
              <span className="font-medium">Supporting evidence:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.evidence.supporting}</p>
            </div>
          )}
          
          {entry.data.evidence?.contradicting && (
            <div>
              <span className="font-medium">Contradicting evidence:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.evidence.contradicting}</p>
            </div>
          )}
          
          {entry.data.balancedThought && (
            <div>
              <span className="font-medium">Balanced thought:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.balancedThought}</p>
            </div>
          )}
        </div>
      );
      
    case "thought-record":
      return (
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Situation:</span>
            <p className="ml-2 text-mindtrack-stone/80">{entry.data.situation || "Not provided"}</p>
          </div>
          
          {entry.data.automaticThoughts && (
            <div>
              <span className="font-medium">Automatic thoughts:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.automaticThoughts}</p>
            </div>
          )}
          
          {entry.data.emotions && (
            <div>
              <span className="font-medium">Emotions:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.emotions}</p>
            </div>
          )}
          
          {entry.data.balancedPerspective && (
            <div>
              <span className="font-medium">Balanced perspective:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.balancedPerspective}</p>
            </div>
          )}
          
          <div className="flex gap-4">
            <div>
              <span className="font-medium">Before rating:</span>
              <span className="ml-2 text-mindtrack-stone/80">{entry.data.beforeRating}/10</span>
            </div>
            <div>
              <span className="font-medium">After rating:</span>
              <span className="ml-2 text-mindtrack-stone/80">{entry.data.afterRating}/10</span>
            </div>
          </div>
        </div>
      );
      
    case "grounding":
      return (
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">5 things seen:</span>
            <ul className="ml-2 list-disc pl-5">
              {entry.data.see?.map((item: string, index: number) => (
                <li key={index} className="text-mindtrack-stone/80">{item}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <span className="font-medium">4 things felt:</span>
            <ul className="ml-2 list-disc pl-5">
              {entry.data.touch?.map((item: string, index: number) => (
                <li key={index} className="text-mindtrack-stone/80">{item}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <span className="font-medium">3 things heard:</span>
            <ul className="ml-2 list-disc pl-5">
              {entry.data.hear?.map((item: string, index: number) => (
                <li key={index} className="text-mindtrack-stone/80">{item}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <span className="font-medium">2 things smelled:</span>
            <ul className="ml-2 list-disc pl-5">
              {entry.data.smell?.map((item: string, index: number) => (
                <li key={index} className="text-mindtrack-stone/80">{item}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <span className="font-medium">1 thing tasted:</span>
            <p className="ml-2 text-mindtrack-stone/80">{entry.data.taste?.[0] || "Not provided"}</p>
          </div>
        </div>
      );
      
    case "progressive-relaxation":
      return (
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Completed muscle groups:</span>
            <ul className="ml-2 list-disc pl-5">
              {Object.entries(entry.data.completedGroups || {}).map(([group, completed]) => 
                completed ? <li key={group} className="text-mindtrack-stone/80">{group}</li> : null
              )}
            </ul>
          </div>
          {entry.data.totalTime && (
            <div>
              <span className="font-medium">Total time:</span>
              <p className="ml-2 text-mindtrack-stone/80">{formatTime(entry.data.totalTime)}</p>
            </div>
          )}
        </div>
      );
      
    case "deep-breathing":
      return (
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Completed cycles:</span>
            <p className="ml-2 text-mindtrack-stone/80">{entry.data.cycles || 0}</p>
          </div>
          {entry.data.totalTime && (
            <div>
              <span className="font-medium">Total time:</span>
              <p className="ml-2 text-mindtrack-stone/80">{formatTime(entry.data.totalTime)}</p>
            </div>
          )}
        </div>
      );
      
    default:
      return (
        <div className="text-sm text-mindtrack-stone/80">
          Exercise completed. No detailed data available.
        </div>
      );
  }
};
