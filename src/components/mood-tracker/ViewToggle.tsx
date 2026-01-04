
import React from 'react';

interface ViewToggleProps {
  calendarView: boolean;
  setCalendarView: (value: boolean) => void;
}

const ViewToggle = ({ calendarView, setCalendarView }: ViewToggleProps) => {
  // This component is kept for compatibility but no longer renders the button
  // Calendar view is now always enabled
  return null;
};

export default ViewToggle;
