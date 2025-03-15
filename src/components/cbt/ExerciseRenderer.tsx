
import React from "react";
import CognitiveRestructuringExercise from "./CognitiveRestructuringExercise";
import GroundingExercise from "./GroundingExercise";
import BreathingExercise from "./BreathingExercise";
import ThoughtRecord from "../ThoughtRecord";
import BehavioralActivation from "../BehavioralActivation";
import ProgressiveMuscleRelaxation from "./ProgressiveMuscleRelaxation";

interface ExerciseRendererProps {
  techniqueId: string;
  editingHistoryEntry: string | null;
  completeExercise: (id: string, data: Record<string, any>) => void;
  updateExercise: (entryId: string, data: Record<string, any>) => void;
  cancelExercise: () => void;
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
    case "cog-restructuring":
      return (
        <CognitiveRestructuringExercise 
          onComplete={(data) => editingHistoryEntry 
            ? updateExercise(editingHistoryEntry, data) 
            : completeExercise(techniqueId, data)}
          onCancel={cancelExercise}
          initialData={initialData}
          isEditing={!!editingHistoryEntry}
        />
      );
    case "thought-record":
      return (
        <ThoughtRecord 
          onComplete={(data) => editingHistoryEntry 
            ? updateExercise(editingHistoryEntry, data) 
            : completeExercise(techniqueId, data)}
          onCancel={cancelExercise}
          initialData={initialData}
          isEditing={!!editingHistoryEntry}
        />
      );
    case "behav-activation":
      return (
        <BehavioralActivation 
          onComplete={(data) => editingHistoryEntry 
            ? updateExercise(editingHistoryEntry, data) 
            : completeExercise(techniqueId, data)}
          onCancel={cancelExercise}
          initialData={initialData}
          isEditing={!!editingHistoryEntry}
        />
      );
    case "grounding":
      return (
        <GroundingExercise 
          onComplete={(data) => editingHistoryEntry 
            ? updateExercise(editingHistoryEntry, data) 
            : completeExercise(techniqueId, data)}
          onCancel={cancelExercise}
          initialData={initialData}
          isEditing={!!editingHistoryEntry}
        />
      );
    case "deep-breathing":
      return (
        <BreathingExercise
          onComplete={(data) => editingHistoryEntry 
            ? updateExercise(editingHistoryEntry, data) 
            : completeExercise(techniqueId, data)}
          onCancel={cancelExercise}
          initialData={initialData}
          isEditing={!!editingHistoryEntry}
        />
      );
    case "progressive-relaxation":
      return (
        <ProgressiveMuscleRelaxation
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
