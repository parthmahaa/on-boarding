import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

interface DatePickerProps {
  id: string;
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
}

const formatDate = (date: Date | null): string => {
  if (!date) return '';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const DatePicker: React.FC<DatePickerProps> = ({ id, selectedDate, onChange }) => {
  const formattedDate = formatDate(selectedDate);
  
  return (
    <div className="relative">
      <input
        type="date"
        id={id}
        value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
        onChange={(e) => {
          const value = e.target.value;
          onChange(value ? new Date(value) : null);
        }}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
      </div>
    </div>
  );
};

export default DatePicker;