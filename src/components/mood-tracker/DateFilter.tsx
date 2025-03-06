
import React from 'react';

interface DateFilterProps {
  selectedDate: string | null;
  clearDateFilter: () => void;
}

const DateFilter = ({ selectedDate, clearDateFilter }: DateFilterProps) => {
  if (!selectedDate) return null;
  
  return (
    <button
      onClick={clearDateFilter}
      className="text-mindtrack-sage hover:underline"
    >
      Clear Date Filter
    </button>
  );
};

export default DateFilter;
