import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

export default function AlgorithmsHub() {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Mock lessons data (will be replaced with API call later)
  const lessons = [
    { id: 1, slug: 'two-sum', title: 'Two Sum', difficulty: 'easy', category: 'arrays', isPremium: false },
    { id: 2, slug: 'three-sum', title: 'Three Sum', difficulty: 'medium', category: 'arrays', isPremium: false },
    { id: 3, slug: 'binary-search', title: 'Binary Search', difficulty: 'easy', category: 'searching', isPremium: false },
    { id: 4, slug: 'merge-sort', title: 'Merge Sort', difficulty: 'medium', category: 'sorting', isPremium: false },
    { id: 5, slug: 'quick-sort', title: 'Quick Sort', difficulty: 'medium', category: 'sorting', isPremium: false },
    { id: 6, slug: 'longest-substring', title: 'Longest Substring', difficulty: 'medium', category: 'strings', isPremium: false },
    { id: 7, slug: 'valid-parentheses', title: 'Valid Parentheses', difficulty: 'easy', category: 'stack', isPremium: false },
    { id: 8, slug: 'climbing-stairs', title: 'Climbing Stairs', difficulty: 'easy', category: 'dp', isPremium: false },
    { id: 9, slug: 'coin-change', title: 'Coin Change', difficulty: 'medium', category: 'dp', isPremium: false },
    { id: 10, slug: 'house-robber', title: 'House Robber', difficulty: 'medium', category: 'dp', isPremium: false },
    { id: 11, slug: 'longest-palindrome', title: 'Longest Palindrome', difficulty: 'hard', category: 'strings', isPremium: true },
    { id: 12, slug: 'word-ladder', title: 'Word Ladder', difficulty: 'hard', category: 'graphs', isPremium: true },
  ];

  const languages = [
    { id: 'python', name: 'Python', emoji: '🐍', popular: true },
    { id: 'javascript', name: 'JavaScript', emoji: '💛', popular: true },
    { id: 'java', name: 'Java', emoji: '☕', popular: false },
    { id: 'cpp', name: 'C++', emoji: '⚡', popular: false },
    { id: 'typescript', name: 'TypeScript', emoji: '💙', popular: false },
  ];

  const categories = [
    { id: 'all', name: 'All Topics' },
    { id: 'arrays', name: 'Arrays' },
    { id: 'strings', name: 'Strings' },
    { id: 'searching', name: 'Searching' },
    { id: 'sorting', name: 'Sorting' },
    { id: 'dp', name: 'Dynamic Programming' },
    { id: 'graphs', name: 'Graphs' },
    { id: 'stack', name: 'Stack & Queue' },
  ];

  const difficulties = [
    { id: 'all', name: 'All Levels' },
    { id: 'easy', name: 'Easy' },
    { id: 'medium', name: 'Medium' },
    { id: 'hard', name: 'Hard' },
  ];

  // Filter lessons
  const filteredLessons = lessons.filter(lesson => {
    if (selectedDifficulty !== 'all' && lesson.difficulty !== selectedDifficulty) return false;
    if (selectedCategory !== 'all' && lesson.category !== selectedCategory) return false;
    return true;
  });

  const handleLessonClick = (slug) => {
    navigate(`/learn/algorithm/${slug}`);
  };

  return (
    <div className="min-h-screen bg-inpact-bg">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Algorithm Mastery</h1>
          <p className="text-xl text-inpact-gray">
            Master 100+ algorithm challenges across 5 languages. Start with 10 FREE lessons!
          </p>
        </div>

        {/* Language Selection (if not selected) */}
        {!selectedLanguage && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Choose Your Language</h2>
            <div className="grid md:grid-cols-5 gap-6">
              {languages.map(lang => (
                <div
                  key={lang.id}
                  onClick={() => setSelectedLanguage(lang.id)}
                  className="bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer text-center group"
                >
                  <div className="text-5xl mb-4">{lang.emoji}</div>
                  <h3 className="text-xl font-bold mb-2">{lang.name}</h3>
                  {lang.popular && (
                    <span className="inline-block px-3 py-1 bg-inpact-green text-black text-xs font-bold rounded-full">
                      POPULAR
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Algorithm List (if language selected) */}
        {selectedLanguage && (
          <>
            {/* Selected Language Banner */}
            <div className="bg-white rounded-2xl p-6 mb-8 flex items-center justify-between shadow-card">
              <div className="flex items-center gap-4">
                <span className="text-4xl">
                  {languages.find(l => l.id === selectedLanguage)?.emoji}
                </span>
                <div>
                  <h2 className="text-2xl font-bold">
                    {languages.find(l => l.id === selectedLanguage)?.name}
                  </h2>
                  <p className="text-inpact-gray">{filteredLessons.length} algorithms available</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLanguage(null)}
                className="px-6 py-2 border-2 border-inpact-dark text-inpact-dark font-semibold rounded-full hover:bg-inpact-dark hover:text-white transition"
              >
                Change Language
              </button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-8 flex-wrap">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg font-semibold"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              {/* Difficulty Filter */}
              <div className="flex gap-2">
                {difficulties.map(diff => (
                  <button
                    key={diff.id}
                    onClick={() => setSelectedDifficulty(diff.id)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      selectedDifficulty === diff.id
                        ? 'bg-inpact-green text-black'
                        : 'bg-white text-inpact-gray hover:bg-gray-100'
                    }`}
                  >
                    {diff.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Lessons Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {filteredLessons.map(lesson => (
                <div
                  key={lesson.id}
                  onClick={() => !lesson.isPremium || lesson.id <= 10 ? handleLessonClick(lesson.slug) : null}
                  className={`bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-200 ${
                    lesson.isPremium ? 'opacity-75' : 'cursor-pointer'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-inpact-gray">#{lesson.id}</span>
                      {!lesson.isPremium && lesson.id <= 10 && (
                        <span className="px-2 py-1 bg-inpact-green text-black text-xs font-bold rounded-full">
                          FREE
                        </span>
                      )}
                      {lesson.isPremium && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full flex items-center gap-1">
                          🔒 $2
                        </span>
                      )}
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      lesson.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                      lesson.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {lesson.difficulty.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{lesson.title}</h3>
                  <p className="text-sm text-inpact-gray capitalize">{lesson.category}</p>

                  {!lesson.isPremium || lesson.id <= 10 ? (
                    <div className="mt-4 text-inpact-green font-semibold">
                      Start Challenge →
                    </div>
                  ) : (
                    <div className="mt-4 text-inpact-gray text-sm">
                      Unlock with $2 lifetime access
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Info Banner */}
            <div className="mt-12 bg-inpact-dark text-white rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-3">🎯 Free for First 10 Lessons!</h3>
              <p className="text-lg mb-6">
                Try our platform risk-free. Lessons 11+ are just $2 each for lifetime access.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <span className="px-4 py-2 bg-white/20 rounded-full">✓ No subscriptions</span>
                <span className="px-4 py-2 bg-white/20 rounded-full">✓ Pay once, own forever</span>
                <span className="px-4 py-2 bg-white/20 rounded-full">✓ All languages included</span>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}