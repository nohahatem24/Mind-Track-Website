
export interface Technique {
  id: string;
  title: string;
  description: string;
  steps: string[];
  benefits: string[];
  category: string;
  interactive: boolean;
}

export interface ExerciseEntry {
  id: string;
  techniqueId: string;
  date: string;
  timestamp: number;
  data: Record<string, any>;
}

export interface DBTTechniquesProps {
  showOnlyFavorites?: boolean;
}
