interface SpinnerProps {
  borderColor?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  borderColor = "border-t-blue-500",
}) => {
  const validBorderColors = [
    "border-t-blue-500",
    "border-t-red-500",
    "border-t-green-500",
    "border-t-yellow-500",
  ];

  const spinnerBorderClass = validBorderColors.includes(borderColor)
    ? borderColor
    : "border-t-blue-500";

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div
        className={`w-12 h-12 border-4 border-gray-300 ${spinnerBorderClass} rounded-full animate-spin`}
      ></div>
    </div>
  );
};
