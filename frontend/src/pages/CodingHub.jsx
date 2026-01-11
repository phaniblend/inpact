import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

const CODING_DOMAINS = [
  { id: 'react', name: 'React', emoji: '⚛️', color: 'bg-blue-100 text-blue-700' },
  { id: 'nodejs', name: 'Node.js', emoji: '🟢', color: 'bg-green-100 text-green-700' },
  { id: 'python', name: 'Python', emoji: '🐍', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'java', name: 'Java', emoji: '☕', color: 'bg-orange-100 text-orange-700' },
  { id: 'go', name: 'Go', emoji: '🐹', color: 'bg-cyan-100 text-cyan-700' },
  { id: 'angular', name: 'Angular', emoji: '🅰️', color: 'bg-red-100 text-red-700' },
  { id: 'react-typescript', name: 'React + TypeScript', emoji: '💙', color: 'bg-blue-100 text-blue-700' },
];

export default function CodingHub() {
  const navigate = useNavigate();
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);

  // Check if challenge is completed
  const isChallengeCompleted = (challengeId, domainId) => {
    try {
      const key = `apt_completed_challenges`;
      const completed = JSON.parse(localStorage.getItem(key) || '[]');
      const completionId = `${domainId}/${challengeId}`;
      return completed.includes(completionId);
    } catch (err) {
      return false;
    }
  };

  // Fetch challenges for a domain
  const fetchChallenges = async (domain) => {
    if (!domain || !domain.id) {
      console.error('Invalid domain object:', domain);
      setChallenges([]);
      return;
    }
    
    setLoading(true);
    const domainId = domain.id;
    console.log('Fetching challenges for domain:', domainId);
    
    try {
      const response = await fetch(`/api/lessons/coding/${domainId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch challenges: ${response.status}`);
      }
      const result = await response.json();
      console.log('Challenges API response:', result);
      if (result.success && result.data) {
        console.log(`Loaded ${result.data.length} challenges for ${domain.name}`);
        setChallenges(result.data);
      } else {
        console.warn('No challenges data in response:', result);
        setChallenges([]);
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
      // Fallback to empty array
      setChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDomainClick = (domain) => {
    console.log('Domain clicked:', domain);
    setSelectedDomain(domain);
    if (domain && domain.id) {
      fetchChallenges(domain);
    } else {
      console.error('Domain object missing id:', domain);
    }
  };

  const handleChallengeClick = (challenge) => {
    navigate(`/lesson-engine/${selectedDomain.id}/${challenge.id}`);
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      junior: 'bg-green-100 text-green-700',
      mid: 'bg-yellow-100 text-yellow-700',
      senior: 'bg-red-100 text-red-700',
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-inpact-bg">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Coding Hub</h1>
          <p className="text-xl text-inpact-gray">
            Master coding challenges with our AI-powered lesson engine
          </p>
        </div>

        {!selectedDomain ? (
          // Domain Selection
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CODING_DOMAINS.map(domain => (
              <div
                key={domain.id}
                onClick={() => handleDomainClick(domain)}
                className="bg-white rounded-xl p-8 shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer text-center"
              >
                <div className="text-5xl mb-4">{domain.emoji}</div>
                <h3 className="text-2xl font-bold mb-2">{domain.name}</h3>
                <p className="text-sm text-inpact-gray mb-4">
                  Coding challenges
                </p>
                <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${domain.color}`}>
                  Start Learning →
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Challenges List
          <div>
            <button
              onClick={() => {
                setSelectedDomain(null);
                setChallenges([]);
              }}
              className="mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              ← Back to Domains
            </button>

            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">
                {selectedDomain.emoji} {selectedDomain.name} Challenges
              </h2>
              <p className="text-inpact-gray">
                Select a challenge to start learning with our AI-powered lesson engine
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-inpact-green mx-auto"></div>
                <p className="mt-4 text-inpact-gray">Loading challenges...</p>
              </div>
            ) : challenges.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-inpact-gray text-lg">No challenges found for {selectedDomain.name}</p>
                <p className="text-sm text-inpact-gray mt-2">Check browser console for details</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challenges.map(challenge => {
                  const isCompleted = isChallengeCompleted(challenge.id, selectedDomain.id);
                  return (
                    <div
                      key={challenge.id}
                      onClick={() => handleChallengeClick(challenge)}
                      className={`bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer ${
                        isCompleted ? 'ring-2 ring-green-400' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-inpact-gray font-mono">
                          {challenge.id}
                        </span>
                        <div className="flex items-center gap-2">
                          {isCompleted && (
                            <span className="text-green-500 text-lg" title="Completed">
                              ✓
                            </span>
                          )}
                          <span className={`px-3 py-1 text-xs font-bold rounded-full ${getDifficultyColor(challenge.difficulty)}`}>
                            {challenge.difficulty.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{challenge.title}</h3>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-xs text-inpact-gray bg-gray-100 px-3 py-1 rounded-full">
                          {selectedDomain.name}
                        </span>
                        <span className={`font-semibold text-sm ${
                          isCompleted ? 'text-green-600' : 'text-inpact-green'
                        }`}>
                          {isCompleted ? 'Review →' : 'Start Lesson →'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <h3 className="font-bold text-blue-900 mb-2">💡 About the Lesson Engine</h3>
              <p className="text-sm text-blue-800">
                Our AI-powered lesson engine follows a strict 7-phase pedagogy to teach coding challenges.
                Each lesson is personalized and adapts to your learning pace with recursive drill-downs for prerequisites.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
