
import React from 'react';
import { List, Calendar } from 'lucide-react';

interface ViewToggleProps {
  calendarView: boolean;
  setCalendarView: (value: boolean) => void;
}

const ViewToggle = ({ calendarView, setCalendarView }: ViewToggleProps) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => setCalendarView(false)}
        className={`px-4 py-2 rounded-md ${!calendarView ? 'bg-mindtrack-sage text-white' : 'bg-gray-100 text-mindtrack-stone'}`}
      >
        <List className="w-4 h-4 inline mr-1" />
        List View
      </button>
      <button
        onClick={() => setCalendarView(true)}
        className={`px-4 py-2 rounded-md ${calendarView ? 'bg-mindtrack-sage text-white' : 'bg-gray-100 text-mindtrack-stone'}`}
      >
        <Calendar className="w-4 h-4 inline mr-1" />
        Calendar View
      </button>
    </div>
  );
};

export default ViewToggle;
