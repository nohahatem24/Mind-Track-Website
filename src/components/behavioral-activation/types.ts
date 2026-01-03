
export interface Activity {
  id: number;
  name: string;
  enjoyment: number;
  scheduled: string;
  moodBefore?: number;
  moodAfter?: number;
  status: 'pending' | 'completing' | 'completed';
}

export interface BehavioralActivationProps {
  onComplete: (data: BehavioralActivationData) => void;
  onCancel: () => void;
  initialData?: BehavioralActivationData;
  isEditing?: boolean;
}

export interface BehavioralActivationData {
  activities: Activity[];
  date?: string;
}

export interface NewActivityState {
  name: string;
  enjoyment: number;
  scheduled: string;
}

export interface ActivityItemProps {
  activity: Activity;
  index: number;
  onUpdate: (id: number, field: string, value: unknown) => void;
  onRemove: (id: number) => void;
  onMarkDone: (id: number) => void;
  onCompleteWithMoods: (id: number, moodBefore: number, moodAfter: number) => void;
}

export interface PendingActivityItemProps {
  activity: Activity;
  onMarkDone: (id: number) => void;
  onRemove: (id: number) => void;
  onCompleteMoods: (id: number, moodBefore: number, moodAfter: number) => void;
}

export interface AddActivityFormProps {
  newActivity: NewActivityState;
  setNewActivity: (activity: NewActivityState) => void;
  onAdd: () => void;
}
