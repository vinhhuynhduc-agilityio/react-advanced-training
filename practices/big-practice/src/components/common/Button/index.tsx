import React from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false
}) => {
  const buttonClasses = disabled
    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
    : 'bg-[#F4F5F9] text-[#1CA1C1] hover:bg-slate-300';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 border-none mr-7 ${buttonClasses}`}
    >
      {label}
    </button>
  );
};
