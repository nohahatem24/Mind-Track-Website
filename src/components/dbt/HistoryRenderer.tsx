import { ExerciseEntry } from "./types";

// Format seconds into minutes and seconds
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

interface HistoryRendererProps {
  entry: ExerciseEntry;
}

export const HistoryRenderer = ({ entry }: HistoryRendererProps) => {
  switch (entry.techniqueId) {
    case "wise-mind":
      return (
        <div className="space-y-3 text-sm">
          {entry.data.situation && (
            <div>
              <span className="font-medium">Situation:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.situation}</p>
            </div>
          )}
          
          {entry.data.emotionalMind && (
            <div>
              <span className="font-medium">Emotional Mind: What your emotional self wants to do:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.emotionalMind}</p>
            </div>
          )}
          
          {entry.data.rationalMind && (
            <div>
              <span className="font-medium">Rational Mind: What your logical self suggests:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.rationalMind}</p>
            </div>
          )}
          
          {entry.data.wiseMind && (
            <div>
              <span className="font-medium">Wise Mind: Integrated perspective:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.wiseMind}</p>
            </div>
          )}
          
          {entry.data.reflection && (
            <div>
              <span className="font-medium">Reflection: How does this balanced approach feel:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.reflection}</p>
            </div>
          )}
        </div>
      );

    case "stop-skill":
      return (
        <div className="space-y-3 text-sm">
          {entry.data.triggerSituation && (
            <div>
              <span className="font-medium">Trigger Situation:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.triggerSituation}</p>
            </div>
          )}
          
          {entry.data.stopAction && (
            <div>
              <span className="font-medium">S - Stop: How you stopped:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.stopAction}</p>
            </div>
          )}
          
          {entry.data.takeStep && (
            <div>
              <span className="font-medium">T - Take a Step Back: How you created space:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.takeStep}</p>
            </div>
          )}
          
          {entry.data.observeThoughts && (
            <div>
              <span className="font-medium">O - Observe: What you noticed about thoughts and feelings:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.observeThoughts}</p>
            </div>
          )}
          
          {entry.data.proceedPlan && (
            <div>
              <span className="font-medium">P - Proceed Mindfully: Effective action plan:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.proceedPlan}</p>
            </div>
          )}
        </div>
      );

    case "emotion-regulation":
      return (
        <div className="space-y-3 text-sm">
          {entry.data.emotion && (
            <div>
              <span className="font-medium">Emotion:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.emotion}</p>
            </div>
          )}
          
          {entry.data.intensity && (
            <div>
              <span className="font-medium">Intensity:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.intensity}/10</p>
            </div>
          )}
          
          {entry.data.triggers && (
            <div>
              <span className="font-medium">Triggers:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.triggers}</p>
            </div>
          )}
          
          {entry.data.bodyResponse && (
            <div>
              <span className="font-medium">Physical body response:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.bodyResponse}</p>
            </div>
          )}
          
          {entry.data.urges && (
            <div>
              <span className="font-medium">Urges you had:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.urges}</p>
            </div>
          )}
          
          {entry.data.copingStrategy && (
            <div>
              <span className="font-medium">Coping strategy used:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.copingStrategy}</p>
            </div>
          )}
          
          {entry.data.selfCare && (
            <div>
              <span className="font-medium">Self-care steps:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.selfCare}</p>
            </div>
          )}
        </div>
      );

    case "interpersonal-effectiveness":
      return (
        <div className="space-y-3 text-sm">
          {entry.data.situation && (
            <div>
              <span className="font-medium">Situation:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.situation}</p>
            </div>
          )}
          
          {entry.data.describe && (
            <div>
              <span className="font-medium">D - Describe the facts objectively:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.describe}</p>
            </div>
          )}
          
          {entry.data.express && (
            <div>
              <span className="font-medium">E - Express your feelings and opinions:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.express}</p>
            </div>
          )}
          
          {entry.data.assert && (
            <div>
              <span className="font-medium">A - Assert your wishes clearly:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.assert}</p>
            </div>
          )}
          
          {entry.data.reinforce && (
            <div>
              <span className="font-medium">R - Reinforce the other person:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.reinforce}</p>
            </div>
          )}
          
          {entry.data.mindful && (
            <div>
              <span className="font-medium">M - Mindful of the objective:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.mindful}</p>
            </div>
          )}
          
          {entry.data.appear && (
            <div>
              <span className="font-medium">A - Appear confident:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.appear}</p>
            </div>
          )}
          
          {entry.data.negotiate && (
            <div>
              <span className="font-medium">N - Negotiate if needed:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.negotiate}</p>
            </div>
          )}
        </div>
      );

    case "mindfulness":
      return (
        <div className="space-y-2 text-sm">
          {entry.data.exercise && (
            <div>
              <span className="font-medium">Mindfulness exercise:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.exercise}</p>
            </div>
          )}
          
          {entry.data.duration && (
            <div>
              <span className="font-medium">Duration:</span>
              <p className="ml-2 text-mindtrack-stone/80">{formatTime(entry.data.duration)}</p>
            </div>
          )}
          
          {entry.data.observations && (
            <div>
              <span className="font-medium">Observations:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.observations}</p>
            </div>
          )}
          
          {entry.data.effectiveness && (
            <div>
              <span className="font-medium">Effectiveness:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.effectiveness}/10</p>
            </div>
          )}
          
          {entry.data.notes && (
            <div>
              <span className="font-medium">Notes:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.notes}</p>
            </div>
          )}
        </div>
      );

    case "self-soothe":
      return (
        <div className="space-y-3 text-sm">
          {entry.data.senses && (
            <>
              {entry.data.senses.vision?.done && (
                <div>
                  <span className="font-medium">✔ Vision: Looked at beautiful or calming images</span>
                  {entry.data.senses.vision.notes && (
                    <p className="ml-2 text-mindtrack-stone/80">{entry.data.senses.vision.notes}</p>
                  )}
                </div>
              )}
              
              {entry.data.senses.hearing?.done && (
                <div>
                  <span className="font-medium">✔ Hearing: Listened to soothing sounds or music</span>
                  {entry.data.senses.hearing.notes && (
                    <p className="ml-2 text-mindtrack-stone/80">{entry.data.senses.hearing.notes}</p>
                  )}
                </div>
              )}
              
              {entry.data.senses.smell?.done && (
                <div>
                  <span className="font-medium">✔ Smell: Used pleasant scents</span>
                  {entry.data.senses.smell.notes && (
                    <p className="ml-2 text-mindtrack-stone/80">{entry.data.senses.smell.notes}</p>
                  )}
                </div>
              )}
              
              {entry.data.senses.taste?.done && (
                <div>
                  <span className="font-medium">✔ Taste: Enjoyed a small treat mindfully</span>
                  {entry.data.senses.taste.notes && (
                    <p className="ml-2 text-mindtrack-stone/80">{entry.data.senses.taste.notes}</p>
                  )}
                </div>
              )}
              
              {entry.data.senses.touch?.done && (
                <div>
                  <span className="font-medium">✔ Touch: Felt comfortable textures or warm sensations</span>
                  {entry.data.senses.touch.notes && (
                    <p className="ml-2 text-mindtrack-stone/80">{entry.data.senses.touch.notes}</p>
                  )}
                </div>
              )}
            </>
          )}
          
          {entry.data.completedCount && (
            <div className="pt-2 border-t border-mindtrack-sage/10">
              <span className="font-medium">Senses engaged:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.completedCount} of 5</p>
            </div>
          )}
        </div>
      );

    case "opposite-action":
      return (
        <div className="space-y-3 text-sm">
          {entry.data.emotion && (
            <div>
              <span className="font-medium">Emotion experienced:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.emotion}</p>
            </div>
          )}
          
          {entry.data.actionUrge && (
            <div>
              <span className="font-medium">Action urge:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.actionUrge}</p>
            </div>
          )}
          
          {entry.data.fitsTheFacts && (
            <div>
              <span className="font-medium">Does the emotion fit the facts?</span>
              <p className="ml-2 text-mindtrack-stone/80 capitalize">
                {entry.data.fitsTheFacts === "yes" && "✔ Yes — the emotion matches what happened"}
                {entry.data.fitsTheFacts === "no" && "✗ No — I'm overreacting or the emotion doesn't match"}
                {entry.data.fitsTheFacts === "mixed" && "~ Mixed — some parts fit, some don't"}
              </p>
            </div>
          )}
          
          {entry.data.oppositeAction && (
            <div>
              <span className="font-medium">Opposite action identified:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.oppositeAction}</p>
            </div>
          )}
          
          {entry.data.practiced !== undefined && (
            <div className="pt-2 border-t border-mindtrack-sage/10">
              <span className="font-medium">
                {entry.data.practiced ? "✔ Practiced the opposite action" : "Did not practice opposite action"}
              </span>
              {entry.data.practiced && (
                <p className="ml-2 text-mindtrack-stone/70 text-xs mt-1">You're rewiring your emotional responses.</p>
              )}
            </div>
          )}
        </div>
      );

    case "mindfulness-practice":
      return (
        <div className="space-y-3 text-sm">
          {entry.data.completionState && (
            <div>
              <span className="font-medium">Completion state:</span>
              <p className="ml-2 text-mindtrack-stone/80 capitalize">
                {entry.data.completionState === "completed" && "✔ Completed — finished the full minute"}
                {entry.data.completionState === "interrupted" && "⏸ Interrupted — paused or stopped early"}
              </p>
            </div>
          )}
          
          {entry.data.duration && (
            <div>
              <span className="font-medium">Exercise duration:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.duration} seconds total</p>
            </div>
          )}
          
          {entry.data.timeCompleted !== undefined && (
            <div>
              <span className="font-medium">Time practiced:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.timeCompleted} seconds</p>
            </div>
          )}
          
          {entry.data.completionState === "interrupted" && (
            <div className="pt-2 border-t border-mindtrack-sage/10">
              <p className="text-mindtrack-stone/70 text-xs italic">
                Even a few seconds of mindfulness counts. This is practice, not perfection.
              </p>
            </div>
          )}
          
          {entry.data.completionState === "completed" && (
            <div className="pt-2 border-t border-mindtrack-sage/10">
              <p className="text-mindtrack-stone/70 text-xs italic">
                Great work! You maintained focus for the full minute.
              </p>
            </div>
          )}
        </div>
      );

    case "radical-acceptance":
      return (
        <div className="space-y-3 text-sm">
          {entry.data.situation && (
            <div>
              <span className="font-medium">Reality I was struggling to accept:</span>
              <p className="ml-2 text-mindtrack-stone/80 italic">"{entry.data.situation}"</p>
            </div>
          )}
          
          {entry.data.resistancePatterns && entry.data.resistancePatterns.length > 0 && (
            <div>
              <span className="font-medium">How I was resisting it:</span>
              <ul className="ml-2 text-mindtrack-stone/80 space-y-1">
                {entry.data.resistancePatterns.map((pattern: string) => (
                  <li key={pattern}>• {pattern}</li>
                ))}
              </ul>
            </div>
          )}
          
          {entry.data.resistanceOther && (
            <div>
              <span className="font-medium">Other resistance I noticed:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.resistanceOther}</p>
            </div>
          )}
          
          {entry.data.bodyPracticeAttempted && (
            <div>
              <span className="font-medium">✔ Practiced body acceptance</span>
              <p className="ml-2 text-mindtrack-stone/70 text-xs">Grounding with shoulders, breath, and touch.</p>
            </div>
          )}
          
          {entry.data.acceptanceStatement && (
            <div className="pt-2 border-t border-mindtrack-sage/10">
              <span className="font-medium">My acceptance statement:</span>
              <p className="ml-2 text-mindtrack-stone/80 italic text-sm">"{entry.data.acceptanceStatement}"</p>
              {entry.data.phase === 4 && (
                <p className="ml-2 text-mindtrack-stone/70 text-xs mt-2">
                  This statement acknowledges what is, without approval or resignation.
                </p>
              )}
            </div>
          )}
        </div>
      );

    default:
      return (
        <div className="space-y-2 text-sm">
          {entry.data.notes ? (
            <div>
              <span className="font-medium">Notes:</span>
              <p className="ml-2 text-mindtrack-stone/80">{entry.data.notes}</p>
            </div>
          ) : (
            <p className="text-mindtrack-stone/80">Exercise completed. No detailed data available.</p>
          )}
        </div>
      );
  }
};
