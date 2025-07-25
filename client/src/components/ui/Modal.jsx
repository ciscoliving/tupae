// src/components/ui/Modal.jsx
import React from "react";
import { FiX } from "react-icons/fi";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md p-6 rounded-lg shadow-lg relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-600 dark:text-gray-300">
            <FiX size={20} />
          </button>
        </div>

        {/* Body */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
