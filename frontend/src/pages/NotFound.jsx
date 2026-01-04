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
        <p className="text-2xl text-inpact-gray mb-8">Page Not Found</p>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-4 bg-inpact-green text-black font-bold rounded-full hover:shadow-lg transition"
        >
          ← Go Home
        </button>
      </div>
    </div>
  );
}
