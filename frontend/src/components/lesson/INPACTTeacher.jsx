/**
 * INPACTTeacher Component
 * 
 * Coding challenge teacher component
 * Uses the flow array from challenge JSON files (matching standalone version)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../common/Spinner';

export default function INPACTTeacher({ challengeId, domain, onComplete }) {
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [currentStepId, setCurrentStepId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load challenge with flow array
  useEffect(() => {
    const loadChallenge = async () => {
      if (!challengeId || !domain) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const apiUrl = `/api/lessons/coding/${domain}/${challengeId}`;
        console.log('Fetching challenge from:', apiUrl);
        const response = await fetch(apiUrl);
        console.log('Response status:', response.status, response.statusText);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error response:', errorText);
          throw new Error(`Challenge not found: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('API Response:', result);
        
        if (result.success && result.data) {
          console.log('Challenge loaded:', result.data.title);
          console.log('Flow array length:', result.data.flow?.length || 0);
          setChallenge(result.data);
          // Start with first step in flow
          if (result.data.flow && result.data.flow.length > 0) {
            setCurrentStepId(result.data.flow[0].stepId);
          } else {
            console.warn('Challenge has no flow array!');
            setError('Challenge has no flow steps');
          }
        } else {
          console.error('Invalid response format:', result);
          throw new Error('Failed to load challenge: Invalid response format');
        }
      } catch (err) {
        console.error('Error loading challenge:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadChallenge();
  }, [challengeId, domain]);

  // Get current step from flow
  const getCurrentStep = () => {
    if (!challenge || !currentStepId || !challenge.flow) return null;
    const step = challenge.flow.find(step => step.stepId === currentStepId);
    if (!step) {
      console.error(`Step not found: ${currentStepId}. Available steps:`, challenge.flow.map(s => s.stepId));
      return challenge.flow[0] || null;
    }
    return step;
  };

  const currentStep = getCurrentStep();

  // Save completion to localStorage
  const saveCompletion = (challengeId, domain) => {
    try {
      const key = `apt_completed_challenges`;
      const completed = JSON.parse(localStorage.getItem(key) || '[]');
      const completionId = `${domain}/${challengeId}`;
      
      if (!completed.includes(completionId)) {
        completed.push(completionId);
        localStorage.setItem(key, JSON.stringify(completed));
        console.log('✅ Challenge completion saved:', completionId);
      }
    } catch (err) {
      console.error('Error saving completion:', err);
    }
  };

  // Check if challenge is already completed
  const isChallengeCompleted = (challengeId, domain) => {
    try {
      const key = `apt_completed_challenges`;
      const completed = JSON.parse(localStorage.getItem(key) || '[]');
      const completionId = `${domain}/${challengeId}`;
      return completed.includes(completionId);
    } catch (err) {
      return false;
    }
  };

  // Handle choice/action selection
  const handleChoice = (nextStepId) => {
    if (!nextStepId) return;
    
    // Check if we've reached the end
    const nextStep = challenge.flow.find(s => s.stepId === nextStepId);
    if (!nextStep) {
      // Challenge complete
      saveCompletion(challengeId, domain);
      if (onComplete) {
        onComplete({
          challengeId: challengeId,
          domain: domain,
          completedAt: new Date().toISOString(),
        });
      }
      return;
    }
    
    setCurrentStepId(nextStepId);
  };

  // Handle continue action
  const handleContinue = () => {
    if (currentStep?.next) {
      handleChoice(currentStep.next);
    } else {
      // No next step - challenge complete
      saveCompletion(challengeId, domain);
      if (onComplete) {
        onComplete({
          challengeId: challengeId,
          domain: domain,
          completedAt: new Date().toISOString(),
        });
      }
    }
  };

  // Enhanced markdown rendering
  const renderMarkdown = (text) => {
    if (!text) return null;
    
    const lines = text.split('\n');
    const elements = [];
    let currentParagraph = [];
    let inCodeBlock = false;
    let codeBlockContent = [];
    
    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const paraText = currentParagraph.join(' ').trim();
        if (paraText) {
          elements.push(renderParagraph(paraText, elements.length));
        }
        currentParagraph = [];
      }
    };
    
    const renderParagraph = (text, key) => {
      // Check for headings
      if (text.startsWith('**') && text.endsWith('**') && text.length > 4) {
        const headingText = text.slice(2, -2);
        if (headingText.includes(':') || headingText.length > 30) {
          return <h3 key={key} className="text-xl font-bold mt-6 mb-4 text-gray-900">{headingText}</h3>;
        }
        return <strong key={key} className="block mb-3 text-lg text-gray-900">{headingText}</strong>;
      }
      
      // Check for list items
      if (text.trim().startsWith('- ') || text.trim().startsWith('* ')) {
        const listText = text.trim().substring(2);
        return (
          <li key={key} className="ml-6 mb-2 list-disc">
            {renderInlineMarkdown(listText)}
          </li>
        );
      }
      
      // Check for numbered list items
      if (/^\d+\.\s/.test(text.trim())) {
        const listText = text.trim().replace(/^\d+\.\s/, '');
        return (
          <li key={key} className="ml-6 mb-2 list-decimal">
            {renderInlineMarkdown(listText)}
          </li>
        );
      }
      
      // Regular paragraph with inline markdown
      return (
        <p key={key} className="mb-4 leading-relaxed text-gray-700">
          {renderInlineMarkdown(text)}
        </p>
      );
    };
    
    const renderInlineMarkdown = (text) => {
      // Handle bold text **text**
      const parts = text.split(/(\*\*[^*]+\*\*)/g);
      return parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={idx}>{part.slice(2, -2)}</strong>;
        }
        // Handle inline code `code`
        if (part.includes('`')) {
          const codeParts = part.split(/`([^`]+)`/g);
          return codeParts.map((codePart, cIdx) => {
            if (cIdx % 2 === 1) {
              return <code key={cIdx} className="bg-gray-100 px-1 rounded font-mono text-sm">{codePart}</code>;
            }
            return codePart;
          });
        }
        return part;
      });
    };
    
    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      
      // Handle code blocks
      if (trimmed.startsWith('```')) {
        if (inCodeBlock) {
          // End code block
          flushParagraph();
          elements.push(
            <pre key={`code-${elements.length}`} className="bg-gray-900 text-white p-4 rounded font-mono text-sm overflow-x-auto my-4">
              {codeBlockContent.join('\n')}
            </pre>
          );
          codeBlockContent = [];
          inCodeBlock = false;
        } else {
          // Start code block
          flushParagraph();
          inCodeBlock = true;
        }
        return;
      }
      
      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }
      
      // Empty line - flush paragraph
      if (!trimmed) {
        flushParagraph();
        return;
      }
      
      // Check if this starts a new block element
      if (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length > 4) {
        flushParagraph();
        elements.push(renderParagraph(trimmed, elements.length));
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
        flushParagraph();
        elements.push(renderParagraph(trimmed, elements.length));
      } else {
        currentParagraph.push(trimmed);
      }
    });
    
    flushParagraph();
    return elements;
  };

  // Render content based on current flow step
  const renderContent = () => {
    if (!currentStep) return null;

    const { mentorSays, choices, action, example } = currentStep;

    return (
      <div className="space-y-6">
        {/* Display mentorSays text with enhanced markdown */}
        <div className="prose prose-lg max-w-none">
          {renderMarkdown(mentorSays)}
        </div>

        {/* Code example if present */}
        {example && (
          <div className="bg-gray-900 text-white p-4 rounded-lg">
            <pre className="font-mono text-sm overflow-x-auto whitespace-pre-wrap">
              {example}
            </pre>
          </div>
        )}

        {/* Choices from flow step */}
        {choices && choices.length > 0 && (
          <div className="space-y-3">
            {choices.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => handleChoice(choice.next)}
                className="w-full px-6 py-4 bg-inpact-green text-black font-semibold rounded-lg hover:shadow-lg transition text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-black rounded-full flex-shrink-0"></div>
                  <div className="flex-1 text-left">
                    <div className="font-bold">{choice.label}</div>
                    {choice.description && (
                      <div className="text-sm font-normal opacity-90 mt-1">
                        {choice.description}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Continue button if action is "continue" */}
        {action === 'continue' && currentStep.next && (
          <button
            onClick={handleContinue}
            className="w-full px-6 py-4 bg-inpact-green text-black font-bold rounded-lg hover:shadow-lg transition"
          >
            Continue
          </button>
        )}
      </div>
    );
  };

  if (loading && !challenge) {
    return (
      <div className="min-h-screen bg-inpact-dark flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-inpact-dark flex items-center justify-center">
        <div className="bg-red-500 text-white p-6 rounded-lg max-w-md">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => navigate(domain ? `/coding` : `/algorithms`)}
            className="px-4 py-2 bg-white text-red-500 rounded hover:bg-gray-100 font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Check if challenge is complete (no next step)
  const isComplete = currentStep && !currentStep.next && currentStep.action !== 'continue';
  
  if (isComplete) {
    saveCompletion(challengeId, domain);
    if (onComplete) {
      onComplete({
        challengeId: challengeId,
        domain: domain,
        completedAt: new Date().toISOString(),
      });
    }
  }

  return (
    <div className="min-h-screen bg-inpact-dark">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate(domain ? `/coding` : `/algorithms`)}
              className="text-white hover:text-inpact-green transition font-semibold mb-2"
            >
              ← Back to {domain ? 'Coding Hub' : 'Algorithms'}
            </button>
            <h1 className="text-white text-xl font-bold">
              {challenge?.title || challengeId || 'Coding Challenge'}
            </h1>
            {/* Debug indicator - remove in production */}
            <div className="text-xs text-inpact-green mt-1">
              🎯 Using Flow Array Content
            </div>
          </div>
          {domain && (
            <div className="text-white text-sm bg-gray-700 px-3 py-1 rounded">
              {domain.toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 max-h-[calc(100vh-200px)] overflow-y-auto">
          {renderContent()}
        </div>
      </div>

    </div>
  );
}

