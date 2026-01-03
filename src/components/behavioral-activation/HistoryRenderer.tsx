import { Activity } from "./types";
import { ExerciseData } from "../cbt/types";

interface BehavioralActivationHistoryProps {
  entry: ExerciseData;
  data?: Record<string, unknown>;
}

export const BehavioralActivationHistoryRenderer = ({ entry, data }: BehavioralActivationHistoryProps) => {
  const plannedActivities = (data?.activities || entry.data?.activities || []) as Activity[];

  if (plannedActivities.length === 0) {
    return <p className="text-sm text-mindtrack-stone/70">No activities planned.</p>;
  }

  return (
    <div className="space-y-3 text-sm">
      {plannedActivities.map((activity, index) => {
        const scheduledDate = new Date(activity.scheduled);
        const formattedTime = scheduledDate.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        });
        const formattedDate = scheduledDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        });

        return (
          <div key={activity.id} className={`p-3 rounded-md border ${
            activity.status === 'completed'
              ? 'bg-green-50 border-green-200'
              : 'bg-amber-50 border-amber-200'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-mindtrack-stone">
                    {activity.name}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    activity.status === 'completed'
                      ? 'bg-green-200 text-green-800'
                      : 'bg-amber-200 text-amber-800'
                  }`}>
                    {activity.status === 'completed' ? '✓ Done' : '⏳ Pending'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-mindtrack-stone/70 mb-2">
                  <span>📅 {formattedDate} at {formattedTime}</span>
                  <span>✨ Expected enjoyment: {activity.enjoyment}/10</span>
                </div>

                {activity.status === 'completed' && (activity.moodBefore !== undefined || activity.moodAfter !== undefined) && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-white p-2 rounded border border-mindtrack-sage/10">
                      <p className="text-xs font-medium text-mindtrack-stone mb-1">Before</p>
                      <div className="flex items-center gap-1">
                        <span className="text-lg">
                          {!activity.moodBefore || activity.moodBefore <= 3 
                            ? '😔' 
                            : activity.moodBefore <= 6 
                            ? '😐' 
                            : activity.moodBefore <= 8 
                            ? '🙂' 
                            : '😊'}
                        </span>
                        <span className="font-bold text-mindtrack-sage">{activity.moodBefore || '-'}/10</span>
                      </div>
                    </div>

                    <div className="bg-white p-2 rounded border border-mindtrack-sage/10">
                      <p className="text-xs font-medium text-mindtrack-stone mb-1">After</p>
                      <div className="flex items-center gap-1">
                        <span className="text-lg">
                          {!activity.moodAfter || activity.moodAfter <= 3 
                            ? '😔' 
                            : activity.moodAfter <= 6 
                            ? '😐' 
                            : activity.moodAfter <= 8 
                            ? '🙂' 
                            : '😊'}
                        </span>
                        <span className="font-bold text-mindtrack-sage">{activity.moodAfter || '-'}/10</span>
                      </div>
                    </div>
                  </div>
                )}

                {activity.status === 'completed' && activity.moodBefore !== undefined && activity.moodAfter !== undefined && (
                  <div className="mt-2 text-xs font-medium">
                    {activity.moodAfter > activity.moodBefore 
                      ? `✨ Mood improved by ${activity.moodAfter - activity.moodBefore} point${activity.moodAfter - activity.moodBefore !== 1 ? 's' : ''}` 
                      : activity.moodAfter < activity.moodBefore 
                      ? `📊 Mood decreased by ${activity.moodBefore - activity.moodAfter} point${activity.moodBefore - activity.moodAfter !== 1 ? 's' : ''}`
                      : '→ Mood remained the same'
                    }
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
