
export interface Activity {
  id: number;
  name: string;
  enjoyment: number;
  scheduled: string;
  moodBefore?: number;
  moodAfter?: number;
  completed: boolean;
}

export interface BehavioralActivationProps {
  onComplete: (data: Record<string, any>) => void;
  onCancel: () => void;
  initialData?: Record<string, any>;
  isEditing?: boolean;
}

export interface NewActivityState {
  name: string;
  enjoyment: number;
  scheduled: string;
}

export interface ActivityItemProps {
  activity: Activity;
  index: number;
  onUpdate: (id: number, field: string, value: any) => void;
  onRemove: (id: number) => void;
  onToggleComplete: (id: number) => void;
}

export interface AddActivityFormProps {
  newActivity: NewActivityState;
  setNewActivity: (activity: NewActivityState) => void;
  onAdd: () => void;
}
