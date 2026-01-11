import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
  };

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
            
            {isAuthenticated && (
              <button 
                onClick={() => navigate('/dashboard')}
                className="text-inpact-dark font-semibold hover:text-inpact-green transition"
              >
                Dashboard
              </button>
            )}
          </div>
          
          {/* Auth Section */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-gray-100 transition"
              >
                {user?.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name || 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-inpact-green flex items-center justify-center text-white font-semibold">
                    {(user?.name || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="hidden md:block text-inpact-dark font-semibold">
                  {user?.name || 'User'}
                </span>
                <svg
                  className={`w-4 h-4 text-inpact-dark transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-inpact-dark hover:bg-gray-100 transition"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate('/dashboard');
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-inpact-dark hover:bg-gray-100 transition"
                  >
                    Dashboard
                  </button>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/register')}
                className="px-4 py-2 text-inpact-dark font-semibold hover:text-inpact-green transition"
              >
                Sign Up
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="px-6 py-2 border-2 border-inpact-green text-inpact-green font-semibold rounded-full hover:bg-inpact-green hover:text-black transition-all duration-200"
              >
                Login
              </button>
            </div>
          )}
          
        </div>
      </div>
    </nav>
  );
}