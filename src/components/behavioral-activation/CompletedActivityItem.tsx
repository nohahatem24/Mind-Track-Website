import { Trash2 } from "lucide-react";
import { Activity } from "./types";

interface CompletedActivityItemProps {
  activity: Activity;
  index: number;
  onRemove: (id: number) => void;
}

const CompletedActivityItem = ({ 
  activity, 
  index,
  onRemove
}: CompletedActivityItemProps) => {
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

  const moodImprovement = (activity.moodAfter || 0) - (activity.moodBefore || 0);
  const moodEmoji = (mood: number | undefined) => {
    if (!mood) return '😐';
    return mood <= 3 ? '😔' : mood <= 6 ? '😐' : mood <= 8 ? '🙂' : '😊';
  };

  return (
    <div className="p-4 rounded-lg border-2 border-green-200 bg-green-50/50">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 space-y-3">
          <h4 className="font-semibold text-green-900 text-lg">Activity {index + 1}: {activity.name}</h4>
          
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1 text-green-800">
              <span className="font-medium">📅</span>
              <span>{formattedDate} at {formattedTime}</span>
            </div>
            <div className="flex items-center gap-1 text-green-800">
              <span className="font-medium">✨ Expected enjoyment:</span>
              <span className="font-semibold">{activity.enjoyment}/10</span>
            </div>
          </div>

          {/* Mood Before and After */}
          <div className="grid md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-green-200">
            <div className="flex items-center gap-3">
              <div className="text-center flex-1">
                <p className="text-xs font-medium text-green-700 mb-1">Mood Before</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl">{moodEmoji(activity.moodBefore)}</span>
                  <span className="text-2xl font-bold text-green-900">{activity.moodBefore}/10</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-center flex-1">
                <p className="text-xs font-medium text-green-700 mb-1">Mood After</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl">{moodEmoji(activity.moodAfter)}</span>
                  <span className="text-2xl font-bold text-green-900">{activity.moodAfter}/10</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mood Change Indicator */}
          {moodImprovement !== 0 && (
            <div className={`p-3 rounded-md text-sm font-medium ${
              moodImprovement > 0 
                ? 'bg-green-100 border border-green-300 text-green-800'
                : 'bg-orange-100 border border-orange-300 text-orange-800'
            }`}>
              {moodImprovement > 0 
                ? `✨ Mood improved by ${moodImprovement} point${moodImprovement !== 1 ? 's' : ''}!`
                : `📊 Mood changed by ${moodImprovement} point${moodImprovement !== -1 ? 's' : ''}`
              }
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onRemove(activity.id)}
          className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
          title="Delete activity"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CompletedActivityItem;
