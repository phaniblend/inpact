import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="text-2xl font-bold text-inpact-green">{`{IN}`}</span>
            <span className="text-2xl font-bold text-inpact-dark">PACT</span>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => navigate('/algorithms')}
              className="text-inpact-dark font-semibold hover:text-inpact-green transition"
            >
              Algorithms
            </button>
            
            <button 
              onClick={() => navigate('/coding')}
              className="text-inpact-dark font-semibold hover:text-inpact-green transition"
            >
              Coding
            </button>
            
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-inpact-dark font-semibold hover:text-inpact-green transition"
            >
              Dashboard
            </button>
          </div>
          
          {/* Login Button */}
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-2 border-2 border-inpact-green text-inpact-green font-semibold rounded-full hover:bg-inpact-green hover:text-black transition-all duration-200"
          >
            Login
          </button>
          
        </div>
      </div>
    </nav>
  );
}