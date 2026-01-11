/**
 * Lesson Engine Controller
 * 
 * Handles HTTP requests for the lesson engine:
 * - Initialize lesson
 * - Get current phase content
 * - Process learner responses
 * - Get/save lesson state
 */

import LessonEngine from '../services/lessonEngine/LessonEngine.js';
import { getChallengeSpec } from '../services/lessonEngine/challengeSpecService.js';

/**
 * Initialize a lesson
 * POST /api/lesson-engine/init
 */
async function initLesson(req, res) {
  try {
    const { challengeId, domain } = req.body;
    
    if (!challengeId) {
      return res.status(400).json({ error: 'challengeId is required' });
    }
    
    // Get challenge spec (domain is optional - will search all coding challenge dirs)
    const challengeSpec = await getChallengeSpec(challengeId, domain);
    
    if (!challengeSpec) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    
    // Create lesson engine
    const engine = new LessonEngine(challengeSpec);
    
    // Get initial content
    const content = await engine.getCurrentPhaseContent();
    const state = engine.getState();
    
    // Store engine in session (in production, use Redis or database)
    // For now, we'll return state and client will manage it
    // In production: req.session.lessonEngine = engine;
    
    res.json({
      success: true,
      content,
      state,
      challengeId,
    });
  } catch (error) {
    console.error('Error initializing lesson:', error);
    res.status(500).json({ error: 'Failed to initialize lesson', details: error.message });
  }
}

/**
 * Get current phase content
 * GET /api/lesson-engine/content
 */
async function getContent(req, res) {
  try {
    const { state } = req.body;
    
    if (!state) {
      return res.status(400).json({ error: 'state is required' });
    }
    
    // Get challenge spec (domain stored in state)
    const challengeSpec = await getChallengeSpec(state.challengeId, state.domain);
    
    if (!challengeSpec) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    
    // Restore engine from state
    const engine = new LessonEngine(challengeSpec);
    engine.restoreState(state);
    
    // Get current content
    const content = await engine.getCurrentPhaseContent();
    const updatedState = engine.getState();
    
    res.json({
      success: true,
      content,
      state: updatedState,
    });
  } catch (error) {
    console.error('Error getting content:', error);
    res.status(500).json({ error: 'Failed to get content', details: error.message });
  }
}

/**
 * Process learner response
 * POST /api/lesson-engine/respond
 */
async function processResponse(req, res) {
  try {
    const { state, response } = req.body;
    
    if (!state || !response) {
      return res.status(400).json({ error: 'state and response are required' });
    }
    
    // Get challenge spec (domain stored in state)
    const challengeSpec = await getChallengeSpec(state.challengeId, state.domain);
    
    if (!challengeSpec) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    
    // Restore engine from state
    const engine = new LessonEngine(challengeSpec);
    engine.restoreState(state);
    
    // Process response
    const result = await engine.processResponse(response);
    const updatedState = engine.getState();
    
    res.json({
      success: true,
      content: result.complete ? null : result,
      state: updatedState,
      complete: result.complete || false,
    });
  } catch (error) {
    console.error('Error processing response:', error);
    res.status(500).json({ error: 'Failed to process response', details: error.message });
  }
}

/**
 * Complete drill-down (when construct is fully taught)
 * POST /api/lesson-engine/complete-drill-down
 */
async function completeDrillDown(req, res) {
  try {
    const { state, constructName } = req.body;
    
    if (!state || !constructName) {
      return res.status(400).json({ error: 'state and constructName are required' });
    }
    
    // Get challenge spec (domain stored in state)
    const challengeSpec = await getChallengeSpec(state.challengeId, state.domain);
    
    if (!challengeSpec) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    
    // Restore engine from state
    const engine = new LessonEngine(challengeSpec);
    engine.restoreState(state);
    
    // Complete drill-down
    const controller = engine.controller;
    const result = controller.completeDrillDown(constructName);
    const updatedState = engine.getState();
    
    // Get next content
    const content = await engine.getCurrentPhaseContent();
    
    res.json({
      success: true,
      content,
      state: updatedState,
    });
  } catch (error) {
    console.error('Error completing drill-down:', error);
    res.status(500).json({ error: 'Failed to complete drill-down', details: error.message });
  }
}

export {
  initLesson,
  getContent,
  processResponse,
  completeDrillDown,
};

