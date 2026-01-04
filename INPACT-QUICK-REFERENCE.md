# INPACT - Quick Reference Guide (Session Continuity)

**Use this document to quickly resume development if session ends**

---

## 🎯 CURRENT STATUS

**✅ Completed:** Landing page with navbar
**🚧 In Progress:** AlgorithmsHub (placeholder only)
**📋 Next:** Complete AlgorithmsHub → Practice Tutorial → Backend API

**Dev Server Running:** http://localhost:5173

---

## 🚀 IMMEDIATE NEXT FILE

### File: `frontend/src/pages/AlgorithmsHub.jsx` (FULL VERSION)

**Location:** `E:\projects\inpact\inpact\frontend\src\pages\AlgorithmsHub.jsx`

**Replace existing placeholder with:**

```javascript
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
    // Lessons 6-10 (free after registration)
    { id: 6, slug: 'longest-substring', title: 'Longest Substring', difficulty: 'medium', category: 'strings', isPremium: false },
    { id: 7, slug: 'valid-parentheses', title: 'Valid Parentheses', difficulty: 'easy', category: 'stack', isPremium: false },
    { id: 8, slug: 'climbing-stairs', title: 'Climbing Stairs', difficulty: 'easy', category: 'dp', isPremium: false },
    { id: 9, slug: 'coin-change', title: 'Coin Change', difficulty: 'medium', category: 'dp', isPremium: false },
    { id: 10, slug: 'house-robber', title: 'House Robber', difficulty: 'medium', category: 'dp', isPremium: false },
    // Lessons 11+ (premium)
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
    { id: 'all', name: 'All Levels', color: '' },
    { id: 'easy', name: 'Easy', color: 'bg-green-100 text-green-700' },
    { id: 'medium', name: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'hard', name: 'Hard', color: 'bg-red-100 text-red-700' },
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
              <div className="flex justify-center gap-4">
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
```

**Save this file, refresh browser, and you'll see the full AlgorithmsHub!**

---

## 📝 OTHER QUICK FILES TO POPULATE

### CodingHub (Similar to AlgorithmsHub)

**File:** `frontend/src/pages/CodingHub.jsx`

**Use AlgorithmsHub as template, but change:**
- "Algorithm Mastery" → "Full-Stack Coding"
- Languages → Frameworks (React, Angular, Node.js, etc.)
- `/learn/algorithm/` → `/learn/coding/`

---

### NotFound Page (Simple)

**File:** `frontend/src/pages/NotFound.jsx`

```javascript
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-inpact-bg">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-2xl text-inpact-gray mb-8">Page not found</p>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-4 bg-inpact-green text-black font-bold rounded-full hover:shadow-lg transition"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
```

---

### Login Page (Simple Form)

**File:** `frontend/src/pages/Login.jsx`

```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log('Login:', { email, password });
  };

  return (
    <div className="min-h-screen bg-inpact-bg">
      <Navbar />
      <div className="max-w-md mx-auto px-6 py-20">
        <div className="bg-white rounded-2xl p-8 shadow-card">
          <h1 className="text-3xl font-bold mb-6">Login to INPACT</h1>
          
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg mb-4"
            />
            
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg mb-6"
            />
            
            <button
              type="submit"
              className="w-full px-8 py-4 bg-inpact-green text-black font-bold rounded-full hover:shadow-lg transition"
            >
              Login
            </button>
          </form>

          <p className="text-center mt-6 text-inpact-gray">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-inpact-green font-semibold"
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

## 🔧 BACKEND QUICK START

### Backend Package.json

**File:** `backend/package.json`

```json
{
  "name": "inpact-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.4.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.3"
  }
}
```

**Run:** `cd backend && npm install`

---

### Backend Server (Minimal)

**File:** `backend/src/server.js`

```javascript
import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'INPACT API is running!' });
});

// Get all algorithms
app.get('/api/lessons/algorithms', async (req, res) => {
  try {
    const algoDir = path.join(__dirname, '../../algo');
    const files = await fs.readdir(algoDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    
    const lessons = await Promise.all(
      jsonFiles.map(async (file, index) => {
        const content = await fs.readFile(path.join(algoDir, file), 'utf-8');
        const lesson = JSON.parse(content);
        return {
          id: index + 1,
          slug: file.replace('.json', ''),
          title: lesson.title || file.replace('.json', '').replace(/-/g, ' '),
          difficulty: lesson.difficulty || 'medium',
          category: lesson.category || 'general',
          isPremium: index >= 10,
        };
      })
    );
    
    res.json({ success: true, data: lessons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single algorithm by slug
app.get('/api/lessons/algorithms/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const filePath = path.join(__dirname, '../../algo', `${slug}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    const lesson = JSON.parse(content);
    
    res.json({ success: true, data: lesson });
  } catch (error) {
    res.status(404).json({ success: false, message: 'Lesson not found' });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 INPACT API running on http://localhost:${PORT}`);
});
```

**Run:** `cd backend && npm run dev`

---

## 🔗 CONNECT FRONTEND TO BACKEND

### Update Frontend to Use Real API

**File:** `frontend/src/services/api.js`

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
```

---

**File:** `frontend/src/services/lessonService.js`

```javascript
import api from './api';

export const getAllAlgorithms = async () => {
  const response = await api.get('/lessons/algorithms');
  return response.data.data;
};

export const getLessonBySlug = async (slug) => {
  const response = await api.get(`/lessons/algorithms/${slug}`);
  return response.data.data;
};
```

---

### Update AlgorithmsHub to Use API

**Replace mock data in AlgorithmsHub.jsx:**

```javascript
import { getAllAlgorithms } from '../services/lessonService';

// Add at top of component
const [lessons, setLessons] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchLessons = async () => {
    try {
      const data = await getAllAlgorithms();
      setLessons(data);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setLoading(false);
    }
  };
  
  fetchLessons();
}, []);
```

---

## ⚡ QUICK TEST CHECKLIST

### Frontend Tests

1. **Landing Page:**
   - [ ] Navigate to http://localhost:5173
   - [ ] See homepage with INPACT branding
   - [ ] Click "Start Learning" → Goes to /algorithms
   - [ ] Click "Explore Projects" → Goes to /coding

2. **AlgorithmsHub:**
   - [ ] See language selection cards
   - [ ] Click Python → See algorithm list
   - [ ] See FREE badges on lessons 1-10
   - [ ] See 🔒 $2 on lessons 11+
   - [ ] Filter by difficulty works
   - [ ] Filter by category works
   - [ ] Click lesson → Goes to /learn/algorithm/:slug

### Backend Tests

1. **API Health:**
   - [ ] http://localhost:3001/api/health
   - [ ] Returns `{ success: true, message: '...' }`

2. **Get Algorithms:**
   - [ ] http://localhost:3001/api/lessons/algorithms
   - [ ] Returns array of lessons
   - [ ] Each lesson has: id, slug, title, difficulty, category, isPremium

3. **Get Single Lesson:**
   - [ ] http://localhost:3001/api/lessons/algorithms/two-sum
   - [ ] Returns full lesson JSON
   - [ ] Contains: flow, starterCode, testCases

---

## 🆘 TROUBLESHOOTING

### Frontend Won't Start

```bash
cd E:\projects\inpact\inpact\frontend
npm install
npm run dev
```

### Backend Won't Start

```bash
cd E:\projects\inpact\inpact\backend
npm install
npm run dev
```

### Port Already in Use

```bash
# Kill process on port 5173 (frontend)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Kill process on port 3001 (backend)
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### CORS Error

Make sure backend has:
```javascript
app.use(cors());
```

### Can't Read algo/ Files

Check backend path:
```javascript
const algoDir = path.join(__dirname, '../../algo');
console.log('Algo directory:', algoDir);
```

Should be: `E:\projects\inpact\inpact\algo`

---

## 📊 SESSION RESUME CHECKLIST

If resuming from a new session, check:

1. [ ] Frontend running? `npm run dev` in frontend/
2. [ ] Backend running? `npm run dev` in backend/
3. [ ] What was last file completed?
4. [ ] What was next file to work on?
5. [ ] Are there any errors in console?
6. [ ] Did user test last feature?

---

## 🎯 PRIORITY ORDER (ALWAYS)

1. **AlgorithmsHub** (show lessons)
2. **Practice Tutorial** (split-screen IDE)
3. **Backend API** (serve lessons)
4. **Code Execution** (run code)
5. **Registration** (lesson 6)
6. **Payments** (lesson 11)
7. **Dashboard** (progress tracking)

---

**Last Updated:** December 29, 2025  
**Current File:** AlgorithmsHub.jsx (full version ready above)  
**Next File:** PracticeTutorial.jsx  
**Status:** Ready to continue building! 🚀
