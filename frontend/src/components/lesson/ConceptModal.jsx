/**
 * ConceptModal Component
 * 
 * Displays conceptual explanation slides for base constructs
 * with next/prev navigation
 */

import React, { useState } from 'react';

export default function ConceptModal({ isOpen, onClose, slides, constructName, onUnderstand }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen || !slides || slides.length === 0) return null;

  const currentSlideData = slides[currentSlide];
  const isFirstSlide = currentSlide === 0;
  const isLastSlide = currentSlide === slides.length - 1;

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleClose = () => {
    setCurrentSlide(0);
    onClose();
  };

  const handleUnderstand = () => {
    setCurrentSlide(0);
    onUnderstand();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={handleClose}>
      <div 
        className="bg-white rounded-lg shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800 capitalize">{constructName}</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Progress indicator */}
        <div className="px-4 py-2 bg-gray-50 border-b">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Slide {currentSlide + 1} of {slides.length}</span>
            <div className="flex space-x-1">
              {slides.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 w-2 rounded-full ${
                    idx === currentSlide ? 'bg-inpact-green' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Slide Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">{currentSlideData.title}</h3>
          
          <div className="prose prose-lg max-w-none mb-4">
            {currentSlideData.content.split('\n').map((paragraph, idx) => {
              if (paragraph.trim() === '') return null;
              
              // Check if it's a heading
              if (paragraph.startsWith('##')) {
                return <h4 key={idx} className="text-lg font-bold mt-4 mb-2">{paragraph.replace('##', '').trim()}</h4>;
              }
              
              // Check if it's a list item
              if (paragraph.trim().startsWith('*') || paragraph.trim().startsWith('-')) {
                return <li key={idx} className="ml-6 mb-2 list-disc">{paragraph.replace(/^[\*\-\s]+/, '')}</li>;
              }
              
              // Check if it's bold text
              if (paragraph.includes('**')) {
                const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);
                return (
                  <p key={idx} className="mb-3 text-gray-700 leading-relaxed">
                    {parts.map((part, pIdx) => 
                      part.startsWith('**') && part.endsWith('**') ? (
                        <strong key={pIdx} className="font-semibold">{part.slice(2, -2)}</strong>
                      ) : (
                        part
                      )
                    )}
                  </p>
                );
              }
              
              return <p key={idx} className="mb-3 text-gray-700 leading-relaxed">{paragraph}</p>;
            })}
          </div>

          {/* Code Example */}
          {currentSlideData.codeExample && (
            <div className="mt-4 bg-gray-900 text-white p-4 rounded-lg">
              <pre className="font-mono text-sm overflow-x-auto whitespace-pre-wrap">
                {currentSlideData.codeExample}
              </pre>
            </div>
          )}
        </div>

        {/* Navigation Footer */}
        <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={isFirstSlide}
            className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          <div className="flex space-x-2">
            {isLastSlide ? (
              <button
                onClick={handleUnderstand}
                className="px-6 py-2 bg-inpact-green text-black font-bold rounded-lg hover:shadow-lg transition"
              >
                I Understand
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-inpact-green text-black font-bold rounded-lg hover:shadow-lg transition"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

