import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaClock } from "react-icons/fa";
import { ICellRendererParams } from "ag-grid-community";

interface IconRendererProps extends ICellRendererParams {
  value: boolean;
}

export const IconRenderer: React.FC<IconRendererProps> = (props) => {
  const [isComplete, setIsComplete] = useState<boolean>(props.value);

  const handleClick = () => {
  };

  // Update icon state when props.value changes
  useEffect(() => {
    setIsComplete(props.value);
  }, [props.value]);

  return (
    <span onClick={handleClick} className="flex justify-center items-center w-full h-full cursor-pointer">
      {isComplete ? (
        <FaCheckCircle color="#1CA1C1" size={20} />
      ) : (
        <FaClock color="#FF5C4C" size={20} />
      )}
    </span>
  );
};
