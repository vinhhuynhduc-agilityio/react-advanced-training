import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaClock } from "react-icons/fa";

export interface IconRendererProps {
  onStatusValueChange: () => void;
  value: boolean
}

export const IconRenderer: React.FC<IconRendererProps> = (props) => {
  const [isComplete, setIsComplete] = useState<boolean>(props.value);

  // Update icon state when props.value changes
  useEffect(() => {
    setIsComplete(props.value);
  }, [props.value]);

  return (
    <span
      data-testid="status-icon" // Add data-testid here for testing
      className="flex justify-center items-center w-full h-full cursor-pointer"
      onClick={props.onStatusValueChange}
      aria-label='icon'
    >
      {isComplete ? (
        <FaCheckCircle data-testid="icon-check" color="#1CA1C1" size={20} />
      ) : (
        <FaClock data-testid="icon-clock" color="#FF5C4C" size={20} />
      )}
    </span>
  );
};
