import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import INPACTTeacher from './components/lesson/INPACTTeacher';

/**
 * Coding Challenge Lesson Component
 * 
 * Uses INPACTTeacher to teach coding challenges
 * Gets framework (domain) and challenge ID from route params
 * OpenAI API key is handled by the backend (from backend/.env)
 */
export default function CodingChallengeLesson() {
  const { domain, challengeId } = useParams();
  const navigate = useNavigate();

  // Debug: Verify this component is being used
  console.log('🎯 CodingChallengeLesson component loaded!', { domain, challengeId });

  const handleComplete = (results) => {
    console.log('Challenge completed!', results);
    // Results contain: challengeId, domain, completedAt
    // You can handle completion here - save results, show stats, etc.
  };

  // If no challengeId, redirect to coding hub
  if (!challengeId) {
    navigate('/coding');
    return null;
  }

  return (
    <INPACTTeacher 
      challengeId={challengeId}
      domain={domain}
      onComplete={handleComplete}
    />
  );
}
