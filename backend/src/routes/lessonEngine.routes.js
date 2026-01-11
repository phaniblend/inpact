/**
 * Lesson Engine Routes
 */

import express from 'express';
import {
  initLesson,
  getContent,
  processResponse,
  completeDrillDown,
} from '../controllers/lessonEngine.controller.js';

const router = express.Router();

// Initialize a lesson
router.post('/init', initLesson);

// Get current phase content
router.post('/content', getContent);

// Process learner response
router.post('/respond', processResponse);

// Complete drill-down
router.post('/complete-drill-down', completeDrillDown);

export default router;

