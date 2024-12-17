import React from 'react';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'default';
  disabled?: boolean;
  ariaLabel?: string;
}

const buttonClasses = {
  default: 'px-4 py-2 border-none mr-7 bg-[#F4F5F9] text-[#1CA1C1] hover:bg-slate-300',
  primary: 'bg-slate-200 text-blue-600 font-bold',
  secondary: 'bg-slate-200 text-pink-600 font-bold',
};

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  type = 'button',
  variant = 'default',
  disabled = false,
  ariaLabel,
}) => {
  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed'
    : '';

  const combinedClasses = `${buttonClasses[variant]} ${disabledClasses}`.trim();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
      aria-label={ariaLabel}
    >
      {label}
    </button>
  );
};
