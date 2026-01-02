import React from 'react';

const BaseModal = React.forwardRef(({ isOpen, onClose, title, children }, ref) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-inpact-dark">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div ref={ref} className="p-6 overflow-y-auto overflow-x-hidden flex-1 break-words modal-content-scroll">
          {children}
        </div>
      </div>
    </div>
  );
});

BaseModal.displayName = 'BaseModal';

export default BaseModal;
