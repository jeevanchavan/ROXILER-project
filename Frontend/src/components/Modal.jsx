import React from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded border border-gray-300 w-full max-w-md p-6 shadow-md relative">
        <div className="flex justify-between items-center pb-3 mb-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
