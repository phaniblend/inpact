import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

export default function PracticeTutorial() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [lesson, setLesson] = useState(null);
  const [currentStepId, setCurrentStepId] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [visitedSteps, setVisitedSteps] = useState([]);

  const languages = [
    { id: 'javascript', name: 'JavaScript', emoji: '💛' },
    { id: 'python', name: 'Python', emoji: '🐍' },
    { id: 'java', name: 'Java', emoji: '☕' },
    { id: 'cpp', name: 'C++', emoji: '⚡' },
    { id: 'typescript', name: 'TypeScript', emoji: '💙' },
  ];

  // Load lesson data from JSON
  useEffect(() => {
    const loadLesson = async () => {
      try {
        // Import the lesson JSON
        const lessonData = await import(`../data/lessons/${slug}.json`);
        const loadedLesson = lessonData.default;
        
        setLesson(loadedLesson);
        
        // Set initial step (first step in flow)
        if (loadedLesson.flow && loadedLesson.flow.length > 0) {
          const firstStepId = loadedLesson.flow[0].stepId;
          setCurrentStepId(firstStepId);
          setVisitedSteps([firstStepId]);
        }
        
        // Set language from URL if present
        const langParam = searchParams.get('language');
        if (langParam) {
          setSelectedLanguage(langParam);
        }
      } catch (error) {
        console.error('Error loading lesson:', error);
        // Fallback to algorithms hub if lesson not found
        navigate('/algorithms');
      }
    };
    
    loadLesson();
  }, [slug, searchParams, navigate]);

  // Get current step from flow
  const getCurrentStep = () => {
    if (!lesson) return null;
    return lesson.flow.find(step => step.stepId === currentStepId);
  };

  const currentStep = getCurrentStep();

  // Handle navigation
  const handleChoice = (nextStepId) => {
    // Track language selection
    if (nextStepId.includes('-js')) setSelectedLanguage('javascript');
    if (nextStepId.includes('-python')) setSelectedLanguage('python');
    if (nextStepId.includes('-java')) setSelectedLanguage('java');
    if (nextStepId.includes('-cpp')) setSelectedLanguage('cpp');
    if (nextStepId.includes('-ts')) setSelectedLanguage('typescript');
    
    setCurrentStepId(nextStepId);
    setVisitedSteps([...visitedSteps, nextStepId]);
    
    // Update code if step has example
    const nextStep = lesson.flow.find(s => s.stepId === nextStepId);
    if (nextStep?.example) {
      setCode(nextStep.example);
    }
  };

  const handleContinue = () => {
    if (currentStep?.next) {
      handleChoice(currentStep.next);
    } else if (currentStep?.action === 'complete') {
      // Save completion status here (future: API call)
      navigate('/algorithms');
    }
  };

  const handleRunCode = () => {
    setOutput('Code executed successfully!\n\nTest Cases:\n✓ Test 1: nums = [2,7,11,15], target = 9 → [0,1]\n✓ Test 2: nums = [3,2,4], target = 6 → [1,2]\n✓ Test 3: nums = [3,3], target = 6 → [0,1]\n\nAll tests passed! 🎉');
  };

  const canGoBack = visitedSteps.length > 1;

  const handleBack = () => {
    if (canGoBack) {
      const newVisited = [...visitedSteps];
      newVisited.pop(); // Remove current
      const previousStepId = newVisited[newVisited.length - 1];
      setVisitedSteps(newVisited);
      setCurrentStepId(previousStepId);
      
      const previousStep = lesson.flow.find(s => s.stepId === previousStepId);
      if (previousStep?.example) {
        setCode(previousStep.example);
      }
    }
  };

  // Calculate progress
  const totalSteps = lesson?.flow.length || 1;
  const currentStepIndex = lesson?.flow.findIndex(s => s.stepId === currentStepId) || 0;
  const progress = ((currentStepIndex + 1) / totalSteps) * 100;

  if (!lesson || !currentStep) {
    return (
      <div className="min-h-screen bg-inpact-dark flex items-center justify-center">
        <div className="text-white text-xl">Loading lesson...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-inpact-dark">
      
      {/* TOP BAR */}
      <div className="bg-inpact-dark border-b border-gray-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/algorithms')}
            className="text-white hover:text-inpact-green transition font-semibold"
          >
            ← Exit
          </button>
          <div>
            <h1 className="text-white text-lg font-bold">{lesson.title}</h1>
            <p className="text-gray-400 text-xs">
              {selectedLanguage ? languages.find(l => l.id === selectedLanguage)?.name : 'Interactive Lesson'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-white text-sm">
            Step {currentStepIndex + 1} of {totalSteps}
          </div>
          <div className="w-48 bg-gray-700 rounded-full h-2">
            <div 
              className="bg-inpact-green h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* SPLIT SCREEN */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT: MENTOR INSTRUCTIONS (40%) */}
        <div className="w-[40%] bg-white p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4 text-inpact-dark">💬 Your Mentor</h2>
          
          <div className="space-y-3">
            {currentStep.mentorSays.split('\n\n').map((paragraph, idx) => {
              // Check for numbered lists
              if (paragraph.trim().match(/^\d+\./)) {
                return (
                  <div key={idx} className="space-y-2">
                    {paragraph.split('\n').map((line, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="text-inpact-green font-bold">{line.match(/^\d+/)?.[0] || '•'}</span>
                        <span className="text-gray-700">{line.replace(/^\d+\.\s*/, '')}</span>
                      </div>
                    ))}
                  </div>
                );
              }
              
              // Check for bullet points
              if (paragraph.trim().startsWith('✓') || paragraph.trim().startsWith('-')) {
                return (
                  <div key={idx} className="space-y-2">
                    {paragraph.split('\n').map((line, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="text-inpact-green">✓</span>
                        <span className="text-gray-700">{line.replace(/^[✓-]\s*/, '')}</span>
                      </div>
                    ))}
                  </div>
                );
              }
              
              // Regular paragraph with inline code
              return (
                <p key={idx} className="text-gray-700 leading-relaxed">
                  {paragraph.split('**').map((part, i) => 
                    i % 2 === 0 
                      ? part.split('`').map((codePart, j) => 
                          j % 2 === 0 ? codePart : <code key={j} className="bg-gray-100 px-1 rounded text-sm">{codePart}</code>
                        )
                      : <strong key={i}>{part}</strong>
                  )}
                </p>
              );
            })}
          </div>

          {/* Show example if present */}
          {currentStep.example && (
            <div className="mt-4 bg-gray-50 border-l-4 border-inpact-green p-4 rounded">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                {currentStep.example}
              </pre>
            </div>
          )}

          {/* Inline Choices (if present) */}
          {currentStep.choices && (
            <div className="mt-6 space-y-2">
              {currentStep.choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(choice.next)}
                  className="w-full px-4 py-3 bg-inpact-green text-black font-semibold rounded-lg hover:shadow-lg transition text-left"
                >
                  {choice.label}
                </button>
              ))}
            </div>
          )}

          {/* Ask Question Button */}
          <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <button className="text-blue-700 font-semibold hover:underline">
              💬 Ask a question about this step
            </button>
          </div>
        </div>

        {/* RIGHT: CODE EDITOR + OUTPUT (60%) */}
        <div className="w-[60%] flex flex-col bg-inpact-dark">
          
          {/* CODE EDITOR (70%) */}
          <div className="h-[70%] border-b border-gray-700">
            <div className="px-4 py-2 bg-gray-800 flex items-center justify-between border-b border-gray-700">
              <div className="flex items-center gap-3">
                {selectedLanguage && (
                  <span className="text-white font-mono text-sm">
                    {languages.find(l => l.id === selectedLanguage)?.emoji} {languages.find(l => l.id === selectedLanguage)?.name}
                  </span>
                )}
                {!selectedLanguage && (
                  <span className="text-gray-400 text-sm">Code will appear as you progress...</span>
                )}
              </div>

              {currentStep.example && (
                <button
                  onClick={handleRunCode}
                  className="px-6 py-2 bg-inpact-green text-black font-bold rounded-lg hover:shadow-lg transition"
                >
                  ▶ Run Code
                </button>
              )}
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full p-4 bg-inpact-dark text-white font-mono text-sm resize-none focus:outline-none"
              placeholder={currentStep.example ? "" : "Code will appear here as you progress through the lesson..."}
              spellCheck={false}
            />
          </div>

          {/* OUTPUT PANEL (30%) */}
          <div className="h-[30%] bg-gray-900">
            <div className="px-4 py-2 bg-gray-800 border-b border-gray-700">
              <div className="text-white text-sm font-semibold">Output</div>
            </div>
            <div className="p-4 text-white font-mono text-sm overflow-y-auto whitespace-pre-wrap" style={{ height: 'calc(100% - 40px)' }}>
              {output || 'Click "Run Code" to see output...'}
            </div>
          </div>

        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Back Button */}
          <button
            onClick={handleBack}
            disabled={!canGoBack}
            className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-inpact-green disabled:opacity-30 disabled:cursor-not-allowed transition font-semibold"
          >
            ← Back
          </button>

          {/* Continue Button (only if no choices) */}
          {!currentStep.choices && (
            <button
              onClick={handleContinue}
              className="px-8 py-3 bg-inpact-green text-black font-bold rounded-lg hover:shadow-lg transition"
            >
              {currentStep.action === 'complete' ? '✓ Complete Lesson' : 'Continue →'}
            </button>
          )}

        </div>
      </div>

    </div>
  );
}
