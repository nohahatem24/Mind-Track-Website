import { ExerciseData } from "../cbt/types";
import { Activity } from "./types";

interface BehavioralActivationHistoryProps {
  entry: ExerciseData;
}

export const BehavioralActivationHistoryRenderer = ({ entry }: BehavioralActivationHistoryProps) => {
  const plannedActivities = (entry.data?.activities || []) as Activity[];

  if (plannedActivities.length === 0) {
    return <p className="text-sm text-mindtrack-stone/70">No activities planned.</p>;
  }

  return (
    <div className="space-y-2 text-sm">
      <div>
        <span className="font-medium">Planned activities:</span>
        <ul className="ml-2 list-disc pl-5">
          {plannedActivities.map((activity) => {
            const scheduledDate = new Date(activity.scheduled);
            const formattedTime = scheduledDate.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            });
            const formattedDate = scheduledDate.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric'
            });

            return (
              <li key={activity.id} className="text-mindtrack-stone/80">
                <span className="font-medium">{activity.name}</span> ({formattedDate} at {formattedTime})
                {activity.status === 'completed' ? (
                  <span className="text-green-600 ml-2">✓ Done</span>
                ) : (
                  <span className="text-amber-600 ml-2">⏳ Pending</span>
                )}
                {activity.enjoyment && (
                  <span className="text-mindtrack-stone/70 ml-2">- Expected: {activity.enjoyment}/10</span>
                )}
                {activity.status === 'completed' && (activity.moodBefore !== undefined || activity.moodAfter !== undefined) && (
                  <div className="ml-4 mt-1">
                    {activity.moodBefore !== undefined && (
                      <p className="text-mindtrack-stone/70">Mood before: {activity.moodBefore}/10</p>
                    )}
                    {activity.moodAfter !== undefined && (
                      <p className="text-mindtrack-stone/70">Mood after: {activity.moodAfter}/10</p>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
