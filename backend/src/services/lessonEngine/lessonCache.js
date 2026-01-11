/**
 * Lesson Content Cache
 * 
 * Caches AI-generated lesson content to minimize API calls.
 * Also caches learner questions and answers.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cache directory
const CACHE_DIR = path.join(__dirname, '../../../cache/lessons');
const QUESTIONS_CACHE_DIR = path.join(__dirname, '../../../cache/questions');

// Ensure cache directories exist
async function ensureCacheDirs() {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    await fs.mkdir(QUESTIONS_CACHE_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating cache directories:', error);
  }
}

// Initialize on module load
ensureCacheDirs();

/**
 * Generate cache key from challenge and phase/content type
 */
function getCacheKey(challengeId, domain, contentType, constructName = null) {
  const parts = [challengeId, domain || 'general', contentType];
  if (constructName) {
    parts.push(constructName);
  }
  return parts.join('_').replace(/[^a-zA-Z0-9_]/g, '_');
}

/**
 * Get cache file path
 */
function getCacheFilePath(cacheKey) {
  return path.join(CACHE_DIR, `${cacheKey}.json`);
}

/**
 * Get cached content
 */
export async function getCachedContent(challengeId, domain, contentType, constructName = null) {
  try {
    const cacheKey = getCacheKey(challengeId, domain, contentType, constructName);
    const filePath = getCacheFilePath(cacheKey);
    
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Cache miss or error
    return null;
  }
}

/**
 * Cache content
 */
export async function cacheContent(challengeId, domain, contentType, content, constructName = null) {
  try {
    await ensureCacheDirs();
    const cacheKey = getCacheKey(challengeId, domain, contentType, constructName);
    const filePath = getCacheFilePath(cacheKey);
    
    const cacheData = {
      challengeId,
      domain,
      contentType,
      constructName,
      content,
      cachedAt: new Date().toISOString(),
    };
    
    await fs.writeFile(filePath, JSON.stringify(cacheData, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error caching content:', error);
    return false;
  }
}

/**
 * Get cached question/answer
 */
export async function getCachedQuestion(challengeId, domain, question) {
  try {
    const questionHash = Buffer.from(question).toString('base64').replace(/[^a-zA-Z0-9]/g, '_');
    const filePath = path.join(QUESTIONS_CACHE_DIR, `${challengeId}_${domain || 'general'}_${questionHash}.json`);
    
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}

/**
 * Cache question/answer
 */
export async function cacheQuestion(challengeId, domain, question, answer) {
  try {
    await ensureCacheDirs();
    const questionHash = Buffer.from(question).toString('base64').replace(/[^a-zA-Z0-9]/g, '_');
    const filePath = path.join(QUESTIONS_CACHE_DIR, `${challengeId}_${domain || 'general'}_${questionHash}.json`);
    
    const cacheData = {
      challengeId,
      domain,
      question,
      answer,
      cachedAt: new Date().toISOString(),
    };
    
    await fs.writeFile(filePath, JSON.stringify(cacheData, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error caching question:', error);
    return false;
  }
}

/**
 * Get all cached questions for a challenge
 */
export async function getAllCachedQuestions(challengeId, domain) {
  try {
    const files = await fs.readdir(QUESTIONS_CACHE_DIR);
    const prefix = `${challengeId}_${domain || 'general'}_`;
    const questionFiles = files.filter(f => f.startsWith(prefix) && f.endsWith('.json'));
    
    const questions = [];
    for (const file of questionFiles) {
      try {
        const data = await fs.readFile(path.join(QUESTIONS_CACHE_DIR, file), 'utf-8');
        const parsed = JSON.parse(data);
        questions.push(parsed);
      } catch (error) {
        // Skip invalid files
      }
    }
    
    return questions;
  } catch (error) {
    return [];
  }
}

