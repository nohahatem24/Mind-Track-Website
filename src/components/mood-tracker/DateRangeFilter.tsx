import React, { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DateRangeFilterProps {
  dateRange: { startDate: string | null; endDate: string | null };
  setDateRange: (range: { startDate: string | null; endDate: string | null }) => void;
}

const DateRangeFilter = ({ dateRange, setDateRange }: DateRangeFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(dateRange.startDate || '');
  const [tempEndDate, setTempEndDate] = useState(dateRange.endDate || '');

  const handleApply = () => {
    setDateRange({
      startDate: tempStartDate || null,
      endDate: tempEndDate || null
    });
    setIsOpen(false);
  };

  const handleClear = () => {
    setTempStartDate('');
    setTempEndDate('');
    setDateRange({ startDate: null, endDate: null });
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempStartDate(dateRange.startDate || '');
    setTempEndDate(dateRange.endDate || '');
    setIsOpen(false);
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const hasActiveRange = dateRange.startDate || dateRange.endDate;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
          hasActiveRange
            ? 'bg-mindtrack-sage text-white border-mindtrack-sage'
            : 'bg-white border-mindtrack-sage/20 text-mindtrack-stone hover:bg-mindtrack-sage/5'
        }`}
      >
        <Calendar className="w-4 h-4" />
        <span className="text-sm">
          {hasActiveRange ? (
            <>
              {dateRange.startDate && formatDateForDisplay(dateRange.startDate)}
              {dateRange.startDate && dateRange.endDate && ' - '}
              {dateRange.endDate && formatDateForDisplay(dateRange.endDate)}
            </>
          ) : (
            'Date Range'
          )}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 p-4 bg-white rounded-lg shadow-lg border border-mindtrack-sage/20 z-50 min-w-[300px]"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-mindtrack-stone">Select Date Range</h4>
              <button
                onClick={handleCancel}
                className="p-1 hover:bg-mindtrack-sage/5 rounded transition-colors"
                title="Close date range picker"
                aria-label="Close date range picker"
              >
                <X className="w-4 h-4 text-mindtrack-stone" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-mindtrack-stone mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={tempStartDate}
                  onChange={(e) => setTempStartDate(e.target.value)}
                  max={tempEndDate || undefined}
                  title="Select start date"
                  aria-label="Start date"
                  className="w-full px-3 py-2 border border-mindtrack-sage/20 rounded-md focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/30 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-mindtrack-stone mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={tempEndDate}
                  onChange={(e) => setTempEndDate(e.target.value)}
                  min={tempStartDate || undefined}
                  title="Select end date"
                  aria-label="End date"
                  className="w-full px-3 py-2 border border-mindtrack-sage/20 rounded-md focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/30 text-sm"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t border-mindtrack-sage/10">
              <button
                onClick={handleClear}
                className="flex-1 px-3 py-2 text-sm text-mindtrack-stone hover:bg-mindtrack-sage/5 rounded-md transition-colors"
              >
                Clear
              </button>
              <button
                onClick={handleApply}
                className="flex-1 px-3 py-2 text-sm bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors"
              >
                Apply
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DateRangeFilter;