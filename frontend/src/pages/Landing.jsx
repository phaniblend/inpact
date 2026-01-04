import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-inpact-bg">
      <Navbar />

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Master Coding Interviews.<br />
            <span className="text-inpact-green">One Lesson at a Time.</span>
          </h1>
          <p className="text-xl md:text-2xl text-inpact-gray mb-8 max-w-3xl mx-auto">
            Learn algorithms and data structures through hands-on practice in a real IDE. 
            No videos. Just code.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/algorithms')}
              className="px-8 py-4 bg-inpact-green text-black font-bold rounded-full hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              Start Learning Free
            </button>
            <button
              onClick={() => navigate('/coding')}
              className="px-8 py-4 border-2 border-inpact-dark text-inpact-dark font-semibold rounded-full hover:bg-inpact-dark hover:text-white transition-all duration-200"
            >
              Explore Challenges
            </button>
          </div>
        </div>

        {/* FEATURE HIGHLIGHT */}
        <div className="bg-inpact-dark rounded-2xl p-8 shadow-card max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-400 text-sm font-mono ml-2">practice.py</span>
          </div>
          <pre className="text-inpact-green font-mono text-sm">
{`def two_sum(nums, target):
    """
    Find two numbers that add up to target.
    Time: O(n) | Space: O(n)
    """
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i`}
          </pre>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">How INPACT Works</h2>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-14 h-14 bg-inpact-green text-black font-bold text-xl rounded-full flex items-center justify-center mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-bold mb-2">Pick a Topic</h3>
            <p className="text-inpact-gray">
              Choose from 100+ algorithms or 600+ coding challenges across 8 frameworks
            </p>
          </div>

          <div className="text-center">
            <div className="w-14 h-14 bg-inpact-green text-black font-bold text-xl rounded-full flex items-center justify-center mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-bold mb-2">Learn Step-by-Step</h3>
            <p className="text-inpact-gray">
              Follow interactive lessons in a split-screen IDE with real-time feedback
            </p>
          </div>

          <div className="text-center">
            <div className="w-14 h-14 bg-inpact-green text-black font-bold text-xl rounded-full flex items-center justify-center mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-bold mb-2">Code & Practice</h3>
            <p className="text-inpact-gray">
              Write actual code, run test cases, and get instant results
            </p>
          </div>

          <div className="text-center">
            <div className="w-14 h-14 bg-inpact-green text-black font-bold text-xl rounded-full flex items-center justify-center mx-auto mb-4">
              4
            </div>
            <h3 className="text-xl font-bold mb-2">Ace the Interview</h3>
            <p className="text-inpact-gray">
              Build confidence with patterns that appear in real FAANG interviews
            </p>
          </div>
        </div>
      </section>

      {/* LEARNING PATHS */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Choose Your Path</h2>
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Algorithms */}
          <div 
            onClick={() => navigate('/algorithms')}
            className="bg-white rounded-2xl p-10 shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer"
          >
            <div className="text-4xl mb-4">🧮</div>
            <h3 className="text-2xl font-bold mb-4">Algorithms & Data Structures</h3>
            <p className="text-lg text-inpact-gray mb-6">
              Master the fundamentals that power every coding interview. 100+ problems across 5 languages.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <span className="text-inpact-green">✓</span>
                <span>Arrays, Strings, Linked Lists</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-inpact-green">✓</span>
                <span>Trees, Graphs, Dynamic Programming</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-inpact-green">✓</span>
                <span>Sorting, Searching, Recursion</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-inpact-green">✓</span>
                <span>Python, JavaScript, Java, C++, TypeScript</span>
              </li>
            </ul>
            <div className="text-inpact-green font-semibold">
              Start with 10 FREE lessons →
            </div>
          </div>

          {/* Coding Challenges */}
          <div 
            onClick={() => navigate('/coding')}
            className="bg-white rounded-2xl p-10 shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer"
          >
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold mb-4">Full-Stack Coding</h3>
            <p className="text-lg text-inpact-gray mb-6">
              Build real features across modern frameworks. 600+ challenges to master web development.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <span className="text-inpact-green">✓</span>
                <span>React, Angular, Vue</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-inpact-green">✓</span>
                <span>Node.js, Python Flask/Django</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-inpact-green">✓</span>
                <span>Go, Java Spring Boot, Swift</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-inpact-green">✓</span>
                <span>REST APIs, Authentication, Testing</span>
              </li>
            </ul>
            <div className="text-inpact-green font-semibold">
              Start with 10 FREE lessons →
            </div>
          </div>

        </div>
      </section>

      {/* PRICING MODEL */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-inpact-dark text-white rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-6">Simple, Fair Pricing</h2>
          <div className="text-6xl font-bold text-inpact-green mb-4">$2</div>
          <p className="text-2xl mb-8">per lesson • lifetime access</p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-white/10 rounded-xl p-6">
              <div className="text-3xl mb-2">🎁</div>
              <h3 className="font-bold mb-2">First 10 FREE</h3>
              <p className="text-sm text-gray-300">Try before you buy. No credit card.</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <div className="text-3xl mb-2">💎</div>
              <h3 className="font-bold mb-2">Pay Once, Own Forever</h3>
              <p className="text-sm text-gray-300">No subscriptions. No recurring fees.</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <div className="text-3xl mb-2">🌍</div>
              <h3 className="font-bold mb-2">All Languages Included</h3>
              <p className="text-sm text-gray-300">Access every version of each lesson.</p>
            </div>
          </div>

          <p className="text-gray-400 text-sm">
            vs LeetCode ($35/month) • Codecademy ($40/month) • AlgoExpert ($99/year)
          </p>
        </div>
      </section>

      {/* WHO IS THIS FOR */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Who Is INPACT For?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="bg-white rounded-2xl p-10 shadow-card">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold mb-4">Job Seekers</h3>
            <p className="text-inpact-gray">
              Preparing for technical interviews at top tech companies. Master the patterns that appear in real interviews.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-10 shadow-card">
            <div className="text-4xl mb-4">🔄</div>
            <h3 className="text-2xl font-bold mb-4">Career Switchers</h3>
            <p className="text-inpact-gray">
              Transitioning into tech from another field. Build a strong foundation in algorithms and modern frameworks.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-10 shadow-card">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-2xl font-bold mb-4">Students</h3>
            <p className="text-inpact-gray">
              Learning computer science fundamentals. Practice with real code, not just theory and videos.
            </p>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-inpact-gray">
          <p>&copy; 2025 INPACT. Master the interview, one lesson at a time.</p>
        </div>
      </footer>

    </div>
  );
}