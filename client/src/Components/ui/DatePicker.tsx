import React from 'react';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  dateFormat?: string;
  className?: string;
  required?: boolean;
  showMonthDropdown?: boolean;
  showYearDropdown?: boolean;
  dropdownMode?: "scroll" | "select";
}

const DatePicker: React.FC<DatePickerProps> = ({
  selected,
  onChange,
  dateFormat = "dd-MMM-yyyy",
  className = "",
  required = false,
  showMonthDropdown = true,
  showYearDropdown = true,
  dropdownMode = "select"
}) => {
  return (
    <ReactDatePicker
      selected={selected}
      onChange={onChange}
      dateFormat={dateFormat}
      className={`w-full p-2 border border-gray-300 rounded-md ${className}`}
      required={required}
      showMonthDropdown={showMonthDropdown}
      showYearDropdown={showYearDropdown}
      dropdownMode={dropdownMode}
      isClearable
    />
  );
};

export default DatePicker;