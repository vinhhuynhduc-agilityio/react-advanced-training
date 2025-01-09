import clsx from "clsx";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'default';
  disabled?: boolean;
  ariaLabel?: string;
};

const buttonClasses = {
  default: 'rounded-md px-4 py-2 mr-7 bg-[#F4F5F9] text-[#1CA1C1] font-medium hover:bg-slate-300',
  primary: 'rounded-md py-2.5 px-5 bg-slate-200 text-blue-600 font-bold hover:bg-slate-300',
  secondary: 'rounded-md py-2.5 px-5 bg-slate-200 text-pink-600 font-bold hover:bg-slate-300',
};

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  type = 'button',
  variant = 'default',
  disabled = false,
  ariaLabel,
}) => {
  const combinedClasses = clsx(
    buttonClasses[variant],
    { 'opacity-50 cursor-not-allowed': disabled }
  );

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
