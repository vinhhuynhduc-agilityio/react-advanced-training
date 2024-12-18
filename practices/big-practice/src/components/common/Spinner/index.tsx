interface SpinnerProps {
  borderColor?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ borderColor = 'border-t-blue-500' }) => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className={`w-12 h-12 border-4 border-gray-300 ${borderColor} rounded-full animate-spin`}   >
      </div>
    </div>
  );
};
