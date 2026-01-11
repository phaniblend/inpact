/**
 * useLessonEngine Hook
 * 
 * Manages lesson engine state and interactions
 */

import { useState, useCallback } from 'react';
import axios from 'axios';

// API base URL - works in both dev and production
// In production, frontend is served from backend, so relative paths work
const API_BASE = '/api/lesson-engine';

export function useLessonEngine() {
  const [state, setState] = useState(null);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [complete, setComplete] = useState(false);

  /**
   * Initialize a lesson
   */
  const initLesson = useCallback(async (challengeId, domain = null) => {
    setLoading(true);
    setError(null);
    setComplete(false);
    
    try {
      const response = await axios.post(`${API_BASE}/init`, { challengeId, domain });
      setState(response.data.state);
      setContent(response.data.content);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Process learner response
   */
  const processResponse = useCallback(async (response) => {
    if (!state) {
      throw new Error('Lesson not initialized');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await axios.post(`${API_BASE}/respond`, {
        state,
        response: {
          type: 'choice',
          value: response,
          timestamp: Date.now(),
        },
      });
      
      setState(result.data.state);
      setContent(result.data.content);
      setComplete(result.data.complete || false);
      
      return result.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [state]);

  /**
   * Complete drill-down (when construct is fully taught)
   */
  const completeDrillDown = useCallback(async (constructName) => {
    if (!state) {
      throw new Error('Lesson not initialized');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await axios.post(`${API_BASE}/complete-drill-down`, {
        state,
        constructName,
      });
      
      setState(result.data.state);
      setContent(result.data.content);
      
      return result.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [state]);

  /**
   * Refresh content (get current phase content)
   */
  const refreshContent = useCallback(async () => {
    if (!state) {
      throw new Error('Lesson not initialized');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await axios.post(`${API_BASE}/content`, { state });
      setState(result.data.state);
      setContent(result.data.content);
      return result.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [state]);

  return {
    state,
    content,
    loading,
    error,
    complete,
    initLesson,
    processResponse,
    completeDrillDown,
    refreshContent,
  };
}

