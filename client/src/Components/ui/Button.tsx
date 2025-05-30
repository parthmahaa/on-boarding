import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
  return (
    <button
      {...props}
      className={clsx(
        'px-4 py-2 rounded-md font-medium text-sm flex items-center',
        variant === 'primary' && 'bg-blue-600 hover:bg-blue-700 text-white',
        variant === 'outline' && 'border border-gray-300 text-gray-800 bg-white hover:bg-gray-100',
        className
      )}
    >
      {children}
    </button>
  );
};
