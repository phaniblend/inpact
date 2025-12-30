import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

export default function AlgorithmsHub() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulties, setSelectedDifficulties] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [selectedAlgo, setSelectedAlgo] = useState(null);

  // Mock lessons data
  const lessons = [
    { id: 1, slug: 'two-sum', title: 'Two Sum', difficulty: 'Easy', category: 'Arrays', description: 'Find two numbers that add up to a target', isPremium: false },
    { id: 2, slug: 'three-sum', title: 'Three Sum', difficulty: 'Medium', category: 'Arrays', description: 'Find three numbers that sum to zero', isPremium: false },
    { id: 3, slug: 'binary-search', title: 'Binary Search', difficulty: 'Easy', category: 'Searching', description: 'Search in sorted array', isPremium: false },
    { id: 4, slug: 'merge-sort', title: 'Merge Sort', difficulty: 'Medium', category: 'Sorting', description: 'Sort using merge sort', isPremium: false },
    { id: 5, slug: 'quick-sort', title: 'Quick Sort', difficulty: 'Medium', category: 'Sorting', description: 'Sort using quick sort', isPremium: false },
    { id: 6, slug: 'longest-substring', title: 'Longest Substring', difficulty: 'Medium', category: 'Strings', description: 'Longest substring without repeating', isPremium: false },
    { id: 7, slug: 'valid-parentheses', title: 'Valid Parentheses', difficulty: 'Easy', category: 'Stack', description: 'Check valid parentheses', isPremium: false },
    { id: 8, slug: 'climbing-stairs', title: 'Climbing Stairs', difficulty: 'Easy', category: 'Dynamic Programming', description: 'Count ways to climb', isPremium: false },
    { id: 9, slug: 'coin-change', title: 'Coin Change', difficulty: 'Medium', category: 'Dynamic Programming', description: 'Minimum coins needed', isPremium: false },
    { id: 10, slug: 'house-robber', title: 'House Robber', difficulty: 'Medium', category: 'Dynamic Programming', description: 'Maximum money you can rob', isPremium: false },
    { id: 11, slug: 'longest-palindrome', title: 'Longest Palindrome', difficulty: 'Hard', category: 'Strings', description: 'Find longest palindromic substring', isPremium: true },
    { id: 12, slug: 'word-ladder', title: 'Word Ladder', difficulty: 'Hard', category: 'Graphs', description: 'Shortest transformation sequence', isPremium: true },
  ];

  const languages = [
    { id: 'python', name: 'Python', emoji: '🐍' },
    { id: 'javascript', name: 'JavaScript', emoji: '💛' },
    { id: 'java', name: 'Java', emoji: '☕' },
    { id: 'cpp', name: 'C++', emoji: '⚡' },
    { id: 'typescript', name: 'TypeScript', emoji: '💙' },
  ];

  const difficulties = ['Easy', 'Medium', 'Hard'];
  const categories = ['Arrays', 'Strings', 'Searching', 'Sorting', 'Dynamic Programming', 'Graphs', 'Stack', 'Trees'];

  // Filter logic
  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lesson.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDifficulty = selectedDifficulties.length === 0 || selectedDifficulties.includes(lesson.difficulty);
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(lesson.category);
    
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const toggleDifficulty = (diff) => {
    setSelectedDifficulties(prev =>
      prev.includes(diff) ? prev.filter(d => d !== diff) : [...prev, diff]
    );
  };

  const toggleCategory = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleAlgoClick = (algo) => {
    setSelectedAlgo(algo);
    setShowLanguageModal(true);
  };

  const handleLanguageSelect = (langId) => {
    navigate(`/learn/algorithm/${selectedAlgo.slug}?language=${langId}`);
    setShowLanguageModal(false);
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty === 'Easy') return 'bg-green-100 text-green-700';
    if (difficulty === 'Medium') return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="min-h-screen bg-inpact-bg">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Algorithm Challenges</h1>
          <p className="text-xl text-inpact-gray">Master 100+ algorithms across 5 languages</p>
        </div>

        {/* SEARCH BAR */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search algorithms by name, description, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl text-lg focus:outline-none focus:border-inpact-green transition"
          />
        </div>

        {/* FILTERS */}
        <div className="mb-8 bg-white rounded-xl p-6 shadow-card">
          
          {/* Difficulty Filters */}
          <div className="mb-6">
            <h3 className="font-bold mb-3">Difficulty</h3>
            <div className="flex gap-3 flex-wrap">
              {difficulties.map(diff => (
                <label key={diff} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedDifficulties.includes(diff)}
                    onChange={() => toggleDifficulty(diff)}
                    className="w-5 h-5 text-inpact-green rounded focus:ring-inpact-green"
                  />
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(diff)}`}>
                    {diff}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Category Filters */}
          <div>
            <h3 className="font-bold mb-3">Category</h3>
            <div className="flex gap-3 flex-wrap">
              {categories.map(cat => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="w-5 h-5 text-inpact-green rounded focus:ring-inpact-green"
                  />
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-semibold">
                    {cat}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {(selectedDifficulties.length > 0 || selectedCategories.length > 0) && (
            <button
              onClick={() => {
                setSelectedDifficulties([]);
                setSelectedCategories([]);
              }}
              className="mt-4 text-inpact-green font-semibold hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* RESULTS COUNT */}
        <div className="mb-4 text-inpact-gray">
          Showing {filteredLessons.length} of {lessons.length} algorithms
        </div>

        {/* ALGORITHMS GRID (2 COLUMNS) */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredLessons.map(lesson => (
            <div
              key={lesson.id}
              onClick={() => handleAlgoClick(lesson)}
              className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-inpact-gray">#{lesson.id}</span>
                  {!lesson.isPremium && lesson.id <= 10 && (
                    <span className="px-2 py-1 bg-inpact-green text-black text-xs font-bold rounded-full">
                      FREE
                    </span>
                  )}
                  {lesson.isPremium && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">
                      🔒 $2
                    </span>
                  )}
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${getDifficultyColor(lesson.difficulty)}`}>
                  {lesson.difficulty.toUpperCase()}
                </span>
              </div>

              <h3 className="text-xl font-bold mb-2">{lesson.title}</h3>
              <p className="text-sm text-inpact-gray mb-3">{lesson.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-inpact-gray bg-gray-100 px-3 py-1 rounded-full">
                  {lesson.category}
                </span>
                <span className="text-inpact-green font-semibold text-sm">
                  Start Challenge →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* NO RESULTS */}
        {filteredLessons.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-inpact-gray">No algorithms found</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDifficulties([]);
                setSelectedCategories([]);
              }}
              className="mt-4 px-6 py-2 bg-inpact-green text-black font-bold rounded-full"
            >
              Clear filters
            </button>
          </div>
        )}

      </div>

      {/* LANGUAGE SELECTION MODAL */}
      {showLanguageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowLanguageModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-3xl font-bold mb-2">Choose Your Language</h2>
            <p className="text-inpact-gray mb-6">Select a programming language for: <strong>{selectedAlgo?.title}</strong></p>
            
            <div className="grid md:grid-cols-5 gap-4">
              {languages.map(lang => (
                <div
                  key={lang.id}
                  onClick={() => handleLanguageSelect(lang.id)}
                  className="bg-gray-50 rounded-xl p-6 text-center hover:bg-inpact-green hover:text-black transition cursor-pointer"
                >
                  <div className="text-4xl mb-2">{lang.emoji}</div>
                  <div className="font-bold">{lang.name}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowLanguageModal(false)}
              className="mt-6 w-full py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
}