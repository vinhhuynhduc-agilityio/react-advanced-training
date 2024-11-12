import React, { ReactNode } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  title: string;
  onClose: () => void;
  content: ReactNode;
}

const ModalDialog: React.FC<ModalProps> = ({
  title,
  onClose,
  content,
}) => {
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-lg shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ModalDialog Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-lg">
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>

        {/* ModalDialog Body */}
        <div className="p-4">{content}</div>
      </div>
    </div>, 
    document.body
  );
};

export default ModalDialog;
