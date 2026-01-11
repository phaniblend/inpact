import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('apt_token');
    const userData = localStorage.getItem('apt_user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        // Verify token is still valid
        verifyToken(token).then(isValid => {
          if (isValid) {
            setUser(parsedUser);
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('apt_token');
            localStorage.removeItem('apt_user');
          }
          setLoading(false);
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('apt_token');
        localStorage.removeItem('apt_user');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // Verify token with backend
  const verifyToken = async (token) => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      
      const result = await response.json();
      if (result.success) {
        setUser(result.user);
        localStorage.setItem('apt_user', JSON.stringify(result.user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  };

  const login = (token, userData) => {
    localStorage.setItem('apt_token', token);
    localStorage.setItem('apt_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('apt_token');
    localStorage.removeItem('apt_user');
    setUser(null);
    // Call backend logout endpoint
    fetch('/api/auth/logout', { method: 'POST' }).catch(console.error);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

