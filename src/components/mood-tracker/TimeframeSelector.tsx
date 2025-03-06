
import React from 'react';

interface TimeframeSelectorProps {
  timeframe: 'day' | 'week' | 'month' | 'year';
  setTimeframe: (timeframe: 'day' | 'week' | 'month' | 'year') => void;
}

const TimeframeSelector = ({ timeframe, setTimeframe }: TimeframeSelectorProps) => {
  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => setTimeframe('day')}
        className={`px-3 py-1 text-sm rounded-md ${timeframe === 'day' ? 'bg-mindtrack-sage text-white' : 'bg-gray-100 text-mindtrack-stone'}`}
      >
        Day
      </button>
      <button
        onClick={() => setTimeframe('week')}
        className={`px-3 py-1 text-sm rounded-md ${timeframe === 'week' ? 'bg-mindtrack-sage text-white' : 'bg-gray-100 text-mindtrack-stone'}`}
      >
        Week
      </button>
      <button
        onClick={() => setTimeframe('month')}
        className={`px-3 py-1 text-sm rounded-md ${timeframe === 'month' ? 'bg-mindtrack-sage text-white' : 'bg-gray-100 text-mindtrack-stone'}`}
      >
        Month
      </button>
      <button
        onClick={() => setTimeframe('year')}
        className={`px-3 py-1 text-sm rounded-md ${timeframe === 'year' ? 'bg-mindtrack-sage text-white' : 'bg-gray-100 text-mindtrack-stone'}`}
      >
        Year
      </button>
    </div>
  );
};

export default TimeframeSelector;
