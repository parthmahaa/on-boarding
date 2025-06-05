import React from 'react';

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ id, checked, onChange, label }) => {
  return (
    <div className="flex items-center">
      <label className="toggle-switch">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="toggle-slider"></span>
      </label>
      {label && (
        <label htmlFor={id} className="ml-2 text-sm text-gray-700">
          {label}
        </label>
      )}
    </div>
  );
};

export default ToggleSwitch;