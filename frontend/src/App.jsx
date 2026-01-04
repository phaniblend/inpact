import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import AlgorithmsHub from './pages/AlgorithmsHub';
import CodingHub from './pages/CodingHub';
import PracticeTutorial from './pages/PracticeTutorial';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/algorithms" element={<AlgorithmsHub />} />
        <Route path="/coding" element={<CodingHub />} />
        <Route path="/learn/:type/:slug" element={<PracticeTutorial />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;