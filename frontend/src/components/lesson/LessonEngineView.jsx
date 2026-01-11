/**
 * LessonEngineView Component
 * 
 * Main component for displaying the lesson engine
 * Follows the pedagogy flow without showing phase names
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLessonEngine } from '../../hooks/useLessonEngine';
import Spinner from '../common/Spinner';
import UIModal from './UIModal';
import ConceptModal from './ConceptModal';

export default function LessonEngineView() {
  const { challengeId, domain } = useParams();
  const navigate = useNavigate();
  const {
    state,
    content,
    loading,
    error,
    complete,
    initLesson,
    processResponse,
    completeDrillDown,
  } = useLessonEngine();

  const [selectedGaps, setSelectedGaps] = useState([]);
  const [selectedAllGood, setSelectedAllGood] = useState(false); // Track if "all good" is selected
  const [answerInput, setAnswerInput] = useState('');
  const [showUIModal, setShowUIModal] = useState(false);
  const [showConceptModal, setShowConceptModal] = useState(false);
  const [loadingButton, setLoadingButton] = useState(null); // Track which button is loading

  // Initialize lesson on mount
  useEffect(() => {
    if (challengeId && !state) {
      initLesson(challengeId, domain).catch(console.error);
    }
  }, [challengeId, domain, state, initLesson]);

  // Show UI modal when UI output is available
  useEffect(() => {
    if (content?.metadata?.uiOutput?.showModal) {
      setShowUIModal(true);
    }
  }, [content]);

  // Auto-open concept modal for base constructs
  useEffect(() => {
    if (content?.metadata?.construct && 
        content?.metadata?.syntaxUnit?.isBaseConstruct && 
        content?.metadata?.syntaxUnit?.slides) {
      setShowConceptModal(true);
    }
  }, [content]);

  // Handle choice selection
  const handleChoice = async (value) => {
    // Show loading state for buttons that require AI generation
    if (value === 'show_ui_output' || value === 'show_analogy' || value === 'show_deeper_explanation') {
      setLoadingButton(value);
    } else {
      setLoadingButton(value);
    }
    
    try {
      await processResponse(value);
      setAnswerInput('');
      setLoadingButton(null);
    } catch (err) {
      console.error('Error processing response:', err);
      setLoadingButton(null);
    }
  };

  // Handle prerequisite gap selection
  const handlePrerequisiteSelection = async () => {
    if (selectedGaps.length === 0) {
      // All good
      await handleChoice('all_good');
      setSelectedAllGood(false);
    } else {
      // Selected gaps - trigger drill-down
      await handleChoice(selectedGaps);
      setSelectedGaps([]);
    }
  };

  // Handle "all good" continue
  const handleAllGoodContinue = async () => {
    await handleChoice('all_good');
    setSelectedAllGood(false);
  };

  // Handle text answer (for verification)
  const handleAnswerSubmit = async () => {
    if (!answerInput.trim()) return;
    
    try {
      await processResponse({
        type: 'text',
        value: { answer: answerInput.trim() },
      });
      setAnswerInput('');
    } catch (err) {
      console.error('Error submitting answer:', err);
    }
  };

  // Handle construct understanding (in drill-down)
  const handleConstructUnderstood = async (constructName) => {
    try {
      await completeDrillDown(constructName);
    } catch (err) {
      console.error('Error completing drill-down:', err);
    }
  };

  // Render content based on current phase
  const renderContent = () => {
    if (!content) return null;

    const { displayText, choices, requiresInput, inputType, metadata } = content;

    return (
      <div className="space-y-6">
        {/* Display text */}
        <div className="prose prose-lg max-w-none">
          {displayText.split('\n').map((line, i) => {
            // Handle markdown-like formatting
            if (line.startsWith('**') && line.endsWith('**')) {
              return <strong key={i}>{line.slice(2, -2)}</strong>;
            }
            if (line.startsWith('```')) {
              return null; // Skip code block markers
            }
            if (line.includes('```')) {
              const parts = line.split('```');
              return (
                <div key={i} className="bg-gray-100 p-2 rounded font-mono text-sm">
                  {parts[1]}
                </div>
              );
            }
            return <p key={i}>{line}</p>;
          })}
        </div>

        {/* Prerequisites selection (if in select mode) */}
        {metadata?.selectMode && metadata?.prerequisites && (
          <div className="space-y-4">
            {/* "I'm good with all of these" option */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedAllGood}
                  onChange={(e) => {
                    setSelectedAllGood(e.target.checked);
                    if (e.target.checked) {
                      setSelectedGaps([]); // Clear any selected gaps
                    }
                  }}
                  className="w-4 h-4"
                />
                <span>I'm good with all of these</span>
              </label>
              {selectedAllGood && (
                <button
                  onClick={handleAllGoodContinue}
                  disabled={loading || loadingButton === 'all_good'}
                  className="w-full px-6 py-3 bg-inpact-green text-black font-bold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading || loadingButton === 'all_good' ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Continue'
                  )}
                </button>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">OR</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* "I need help with some of these" option with checkboxes */}
            <div className="space-y-4">
              <p className="font-semibold">I need help with some of these:</p>
              <div className="space-y-2">
                {metadata.prerequisites.map((prereq, index) => (
                  <label key={index} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedGaps.includes(prereq)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedGaps([...selectedGaps, prereq]);
                          setSelectedAllGood(false); // Unselect "all good" if selecting gaps
                        } else {
                          setSelectedGaps(selectedGaps.filter(g => g !== prereq));
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <span>{prereq}</span>
                  </label>
                ))}
              </div>
              {selectedGaps.length > 0 && (
                <button
                  onClick={handlePrerequisiteSelection}
                  disabled={loading || loadingButton}
                  className="w-full px-6 py-3 bg-inpact-green text-black font-bold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading || loadingButton ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Continue'
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Choices */}
        {choices && !metadata?.selectMode && (
          <div className="space-y-3">
            {choices.map((choice, idx) => {
              const isLoading = loadingButton === choice.value || loading;
              return (
                <button
                  key={idx}
                  onClick={() => handleChoice(choice.value)}
                  disabled={isLoading || loading}
                  className="w-full px-6 py-4 bg-inpact-green text-black font-semibold rounded-lg hover:shadow-lg transition text-left disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
                >
                  <span>{choice.label}</span>
                  {isLoading && (
                    <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Text input (for verification) */}
        {inputType === 'text' && (
          <div className="space-y-3">
            <textarea
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-inpact-green focus:outline-none"
              rows={4}
            />
            <button
              onClick={handleAnswerSubmit}
              disabled={!answerInput.trim()}
              className="px-6 py-3 bg-inpact-green text-black font-bold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Answer
            </button>
          </div>
        )}

        {/* Construct teaching (drill-down) */}
        {metadata?.construct && metadata?.syntaxUnit && (
          <div className="space-y-4">
            {metadata.syntaxUnit.isBaseConstruct && metadata.syntaxUnit.slides ? (
              // Base construct - modal will auto-open, show loading or minimal content
              <div className="text-center py-8">
                <p className="text-gray-600">Opening interactive tutorial...</p>
              </div>
            ) : (
              // Non-base construct - show syntax directly
              <>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">Syntax:</h3>
                  <pre className="bg-gray-800 text-white p-3 rounded font-mono text-sm overflow-x-auto">
                    {metadata.syntaxUnit.syntax}
                  </pre>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p><strong>What it does:</strong> {metadata.syntaxUnit.explanation}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p><strong>Example:</strong></p>
                  <pre className="bg-gray-800 text-white p-3 rounded font-mono text-sm overflow-x-auto mt-2">
                    {metadata.syntaxUnit.microExample}
                  </pre>
                </div>
                <button
                  onClick={() => handleConstructUnderstood(metadata.construct)}
                  className="px-6 py-3 bg-inpact-green text-black font-bold rounded-lg hover:shadow-lg transition"
                >
                  I understand
                </button>
              </>
            )}
          </div>
        )}

        {/* Full solution display */}
        {metadata?.fullSolution && (
          <div className="bg-gray-900 text-white p-4 rounded-lg">
            <pre className="font-mono text-sm overflow-x-auto whitespace-pre-wrap">
              {metadata.fullSolution}
            </pre>
          </div>
        )}

        {/* Progress indicator */}
        {metadata?.questionIndex !== undefined && (
          <div className="text-sm text-gray-600">
            Question {metadata.questionIndex + 1} of {metadata.totalQuestions}
          </div>
        )}

        {/* Score display */}
        {metadata?.score !== undefined && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="font-semibold">Your score: {metadata.score}%</p>
            {metadata.score < 70 && (
              <p className="text-sm text-gray-600 mt-2">
                Let's review the core concept again.
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading && !content) {
    return (
      <div className="min-h-screen bg-inpact-dark flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-inpact-dark flex items-center justify-center">
        <div className="bg-red-500 text-white p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => navigate('/algorithms')}
            className="mt-4 px-4 py-2 bg-white text-red-500 rounded hover:bg-gray-100"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (complete) {
    return (
      <div className="min-h-screen bg-inpact-dark flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">🎉 Lesson Complete!</h2>
          <p className="text-gray-700 mb-6">
            Great job completing this lesson! You've mastered the concepts.
          </p>
          <button
            onClick={() => navigate('/algorithms')}
            className="px-6 py-3 bg-inpact-green text-black font-bold rounded-lg hover:shadow-lg transition"
          >
            Continue Learning
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-inpact-dark">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate('/algorithms')}
              className="text-white hover:text-inpact-green transition font-semibold mb-2"
            >
              ← Exit
            </button>
            <h1 className="text-white text-xl font-bold">
              {state?.challengeId || 'Lesson'}
            </h1>
          </div>
          {state && (
            <div className="text-white text-sm">
              Phase: {state.phase?.replace(/_/g, ' ').toLowerCase() || 'Loading...'}
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {renderContent()}
        </div>
      </div>

      {/* UI Output Modal */}
      {content?.metadata?.uiOutput && (
        <UIModal
          isOpen={showUIModal}
          onClose={() => setShowUIModal(false)}
          html={content.metadata.uiOutput.html}
          description={content.metadata.uiOutput.description}
        />
      )}

      {/* Concept Explanation Modal */}
      {content?.metadata?.construct && content?.metadata?.syntaxUnit?.isBaseConstruct && (
        <ConceptModal
          isOpen={showConceptModal}
          onClose={() => setShowConceptModal(false)}
          slides={content.metadata.syntaxUnit.slides || []}
          constructName={content.metadata.construct}
          onUnderstand={() => {
            setShowConceptModal(false);
            handleConstructUnderstood(content.metadata.construct);
          }}
        />
      )}
    </div>
  );
}

