
import React from "react";
import WiseMindExercise from "./exercises/WiseMindExercise";
import StopSkillExercise from "./exercises/StopSkillExercise";
import EmotionRegulationExercise from "./exercises/EmotionRegulationExercise";
import InterpersonalEffectivenessExercise from "./exercises/InterpersonalEffectivenessExercise";
import SelfSootheExercise from "./exercises/SelfSootheExercise";
import OppositeActionExercise from "./exercises/OppositeActionExercise";
import OneMinuteMindfulnessExercise from "./exercises/OneMinuteMindfulnessExercise";
import RadicalAcceptanceExercise from "./exercises/RadicalAcceptanceExercise";

interface ExerciseRendererProps {
  techniqueId: string;
  editingHistoryEntry: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  completeExercise: (id: string, data: Record<string, any>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateExercise: (entryId: string, data: Record<string, any>) => void;
  cancelExercise: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: Record<string, any>;
}

const ExerciseRenderer: React.FC<ExerciseRendererProps> = ({
  techniqueId,
  editingHistoryEntry,
  completeExercise,
  updateExercise,
  cancelExercise,
  initialData
}) => {
  switch (techniqueId) {
    case "wise-mind":
      return (
        <WiseMindExercise 
          onComplete={(data) => editingHistoryEntry 
            ? updateExercise(editingHistoryEntry, data) 
            : completeExercise(techniqueId, data)}
          onCancel={cancelExercise}
          initialData={initialData}
          isEditing={!!editingHistoryEntry}
        />
      );
    case "stop-skill":
      return (
        <StopSkillExercise 
          onComplete={(data) => editingHistoryEntry 
            ? updateExercise(editingHistoryEntry, data) 
            : completeExercise(techniqueId, data)}
          onCancel={cancelExercise}
          initialData={initialData}
          isEditing={!!editingHistoryEntry}
        />
      );
    case "emotion-regulation":
      return (
        <EmotionRegulationExercise 
          onComplete={(data) => editingHistoryEntry 
            ? updateExercise(editingHistoryEntry, data) 
            : completeExercise(techniqueId, data)}
          onCancel={cancelExercise}
          initialData={initialData}
          isEditing={!!editingHistoryEntry}
        />
      );
    case "interpersonal-effectiveness":
      return (
        <InterpersonalEffectivenessExercise 
          onComplete={(data) => editingHistoryEntry 
            ? updateExercise(editingHistoryEntry, data) 
            : completeExercise(techniqueId, data)}
          onCancel={cancelExercise}
          initialData={initialData}
          isEditing={!!editingHistoryEntry}
        />
      );
    case "self-soothe":
      return (
        <SelfSootheExercise 
          onComplete={(data) => editingHistoryEntry 
            ? updateExercise(editingHistoryEntry, data) 
            : completeExercise(techniqueId, data)}
          onCancel={cancelExercise}
          initialData={initialData}
          isEditing={!!editingHistoryEntry}
        />
      );
    case "opposite-action":
      return (
        <OppositeActionExercise 
          onComplete={(data) => editingHistoryEntry 
            ? updateExercise(editingHistoryEntry, data) 
            : completeExercise(techniqueId, data)}
          onCancel={cancelExercise}
          initialData={initialData}
          isEditing={!!editingHistoryEntry}
        />
      );
    case "mindfulness-practice":
      return (
        <OneMinuteMindfulnessExercise 
          onComplete={(data) => editingHistoryEntry 
            ? updateExercise(editingHistoryEntry, data) 
            : completeExercise(techniqueId, data)}
          onCancel={cancelExercise}
          initialData={initialData}
          isEditing={!!editingHistoryEntry}
        />
      );
    case "radical-acceptance":
      return (
        <RadicalAcceptanceExercise 
          onComplete={(data) => editingHistoryEntry 
            ? updateExercise(editingHistoryEntry, data) 
            : completeExercise(techniqueId, data)}
          onCancel={cancelExercise}
          initialData={initialData}
          isEditing={!!editingHistoryEntry}
        />
      );
    default:
      return (
        <div className="text-center py-8">
          <p className="text-mindtrack-stone/70">
            This interactive exercise is coming soon!
          </p>
          <button 
            onClick={cancelExercise}
            className="mt-4 px-4 py-2 text-mindtrack-stone hover:bg-mindtrack-sage/5 rounded-md transition-colors"
          >
            Go Back
          </button>
        </div>
      );
  }
};

export default ExerciseRenderer;
