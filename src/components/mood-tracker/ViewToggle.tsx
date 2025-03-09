
import React from 'react';
import { Calendar } from 'lucide-react';

interface ViewToggleProps {
  calendarView: boolean;
  setCalendarView: (value: boolean) => void;
}

const ViewToggle = ({ calendarView, setCalendarView }: ViewToggleProps) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => setCalendarView(true)}
        className="px-4 py-2 rounded-md bg-mindtrack-sage text-white"
      >
        <Calendar className="w-4 h-4 inline mr-1" />
        Calendar View
      </button>
    </div>
  );
};

export default ViewToggle;
