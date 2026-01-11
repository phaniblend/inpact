/**
 * UIModal Component
 * 
 * Displays a modal with an iframe showing the rendered UI output
 */

import React, { useEffect, useRef, useState } from 'react';

export default function UIModal({ isOpen, onClose, html, description }) {
  const iframeRef = useRef(null);
  const [htmlUrl, setHtmlUrl] = useState(null);

  useEffect(() => {
    if (isOpen && html) {
      // Create a blob URL from the HTML
      const htmlBlob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(htmlBlob);
      setHtmlUrl(url);

      // Cleanup on unmount or when modal closes
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [isOpen, html]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Expected Output</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Description */}
        {description && (
          <div className="p-4 bg-gray-50 border-b">
            <p className="text-gray-700">{description}</p>
          </div>
        )}

        {/* Iframe with rendered output */}
        <div className="flex-1 overflow-hidden" style={{ minHeight: '400px' }}>
          {htmlUrl && (
            <iframe
              ref={iframeRef}
              src={htmlUrl}
              className="w-full h-full border-0"
              title="UI Output Preview"
              sandbox="allow-scripts allow-same-origin"
              style={{ minHeight: '400px' }}
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-inpact-green text-black font-bold rounded-lg hover:shadow-lg transition"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}

