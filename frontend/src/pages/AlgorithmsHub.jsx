import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

export default function AlgorithmsHub() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulties, setSelectedDifficulties] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [selectedAlgo, setSelectedAlgo] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Fetch lessons from API
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        console.log('Fetching lessons from API...');
        // Try to use proxy first, fallback to direct URL
        const apiUrl = import.meta.env.DEV 
          ? '/api/lessons/algorithms'  // Use Vite proxy in development
          : '/api/lessons/algorithms';  // Relative path works in both dev and production
        const response = await fetch(apiUrl);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error:', errorText);
          throw new Error(`Failed to fetch lessons: ${response.status} ${errorText}`);
        }
        
        const result = await response.json();
        console.log('API Result:', result);
        
        if (result.success && result.data) {
          console.log(`Loaded ${result.data.length} lessons from API`);
          
          // Map API data to frontend format
          const mappedLessons = result.data.map(lesson => {
            // Remove 'lesson-' prefix from slug if present
            let cleanSlug = lesson.slug;
            if (cleanSlug && cleanSlug.startsWith('lesson-')) {
              cleanSlug = cleanSlug.replace(/^lesson-\d+-?/, '').replace(/^lesson-/, '');
            }
            
            return {
              id: lesson.id || 0,
              slug: cleanSlug || 'unknown',
              title: lesson.title || 'Untitled',
              difficulty: (lesson.difficulty || 'medium').charAt(0).toUpperCase() + (lesson.difficulty || 'medium').slice(1),
              category: mapPatternToCategory(lesson.pattern),
              description: `${lesson.pattern || 'algorithm'} problem`,
              isPremium: lesson.isPremium || false,
            };
          });
          
          console.log(`Mapped ${mappedLessons.length} lessons`);
          setLessons(mappedLessons);
        } else {
          console.error('API returned unsuccessful result:', result);
        }
      } catch (error) {
        console.error('Error fetching lessons:', error);
        alert(`Error loading algorithms: ${error.message}. Please check if the backend server is running on port 3001.`);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  // Map pattern to category
  const mapPatternToCategory = (pattern) => {
    const patternLower = pattern?.toLowerCase() || '';
    if (patternLower.includes('sort')) return 'Sorting';
    if (patternLower.includes('search') || patternLower.includes('binary')) return 'Searching';
    if (patternLower.includes('tree') || patternLower.includes('bst')) return 'Trees';
    if (patternLower.includes('graph')) return 'Graphs';
    if (patternLower.includes('dynamic') || patternLower.includes('dp')) return 'Dynamic Programming';
    if (patternLower.includes('string') || patternLower.includes('substring')) return 'Strings';
    if (patternLower.includes('array') || patternLower.includes('two-pointer')) return 'Arrays';
    if (patternLower.includes('stack') || patternLower.includes('queue')) return 'Stack';
    return 'General';
  };

  const languages = [
    { id: 'python', name: 'Python', emoji: '🐍' },
    { id: 'javascript', name: 'JavaScript', emoji: '💛' },
    { id: 'java', name: 'Java', emoji: '☕' },
    { id: 'cpp', name: 'C++', emoji: '⚡' },
    { id: 'typescript', name: 'TypeScript', emoji: '💙' },
  ];

  const difficulties = ['Easy', 'Medium', 'Hard'];
  
  // Extract unique categories from lessons
  const categories = React.useMemo(() => {
    const cats = new Set();
    lessons.forEach(lesson => {
      if (lesson.category) {
        cats.add(lesson.category);
      }
    });
    return Array.from(cats).sort();
  }, [lessons]);

  // Filter logic
  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lesson.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDifficulty = selectedDifficulties.length === 0 || selectedDifficulties.includes(lesson.difficulty);
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(lesson.category);
    
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredLessons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLessons = filteredLessons.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDifficulties, selectedCategories]);

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
    if (!selectedAlgo) {
      console.error('No algorithm selected');
      alert('Error: No algorithm selected. Please try again.');
      return;
    }
    
    const targetPath = `/learn/algorithm/${selectedAlgo.slug}?language=${langId}`;
    console.log('Navigating to:', targetPath);
    console.log('Selected algorithm:', selectedAlgo);
    
    // Close modal first
    setShowLanguageModal(false);
    
    // Small delay to ensure modal closes before navigation
    setTimeout(() => {
      navigate(targetPath);
    }, 100);
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
          Showing {startIndex + 1}-{Math.min(endIndex, filteredLessons.length)} of {filteredLessons.length} algorithms
          {filteredLessons.length !== lessons.length && ` (${lessons.length} total)`}
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="text-center py-20">
            <p className="text-2xl text-inpact-gray">Loading algorithms...</p>
          </div>
        )}

        {/* ALGORITHMS GRID (2 COLUMNS) */}
        {!loading && (
          <div className="grid md:grid-cols-2 gap-6">
            {paginatedLessons.map(lesson => (
            <div
              key={lesson.slug || lesson.id || `lesson-${lesson.title}`}
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
        )}

        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              Previous
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                // Show first page, last page, current page, and pages around current
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg border transition ${
                        currentPage === page
                          ? 'bg-inpact-green text-black font-bold border-inpact-green'
                          : 'bg-white border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="px-2">...</span>;
                }
                return null;
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              Next
            </button>
          </div>
        )}

        {/* NO RESULTS */}
        {!loading && filteredLessons.length === 0 && (
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
                <button
                  key={lang.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Language clicked:', lang.id, 'Selected algo:', selectedAlgo);
                    handleLanguageSelect(lang.id);
                  }}
                  className="bg-gray-50 rounded-xl p-6 text-center hover:bg-inpact-green hover:text-black transition cursor-pointer border-none focus:outline-none focus:ring-2 focus:ring-inpact-green"
                >
                  <div className="text-4xl mb-2">{lang.emoji}</div>
                  <div className="font-bold">{lang.name}</div>
                </button>
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