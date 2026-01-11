/**
 * Challenge Spec Service
 * 
 * Loads and transforms challenge specifications from various sources
 * (JSON files, database, etc.)
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get challenge spec by ID
 * @param {string} challengeId - Challenge identifier
 * @returns {Promise<Object>} Challenge spec
 */
/**
 * Get challenge spec by ID and domain
 * @param {string} challengeId - Challenge identifier
 * @param {string} domain - Domain: 'react' | 'nodejs' | 'python' | 'java' | 'go' | 'swift' | 'angular' | 'react-typescript'
 * @returns {Promise<Object>} Challenge spec
 */
async function getChallengeSpec(challengeId, domain = null) {
  // Coding challenge directories (NOT algo - those have existing lessons)
  const codingChallengeDirs = ['react', 'nodejs', 'python', 'java', 'go', 'swift', 'angular', 'react-typescript'];
  
  // If domain is provided, use it directly
  if (domain && codingChallengeDirs.includes(domain)) {
    const challengePath = path.join(__dirname, '../../../', domain, `${challengeId}.json`);
    try {
      const content = await fs.readFile(challengePath, 'utf-8');
      const lesson = JSON.parse(content);
      return transformLessonToChallengeSpec(lesson, challengeId, domain);
    } catch (error) {
      console.warn(`Challenge ${challengeId} not found in ${domain} directory:`, error.message);
    }
  }
  
  // Try to find in all coding challenge directories
  for (const dir of codingChallengeDirs) {
    const challengePath = path.join(__dirname, '../../../', dir, `${challengeId}.json`);
    try {
      const content = await fs.readFile(challengePath, 'utf-8');
      const lesson = JSON.parse(content);
      return transformLessonToChallengeSpec(lesson, challengeId, dir);
    } catch (error) {
      // Continue to next directory
      continue;
    }
  }
  
  // If not found, return default spec
  console.warn(`Challenge ${challengeId} not found in coding challenge directories, using default spec`);
  return getDefaultChallengeSpec(challengeId, domain || 'general');
}

/**
 * Transform lesson JSON to ChallengeSpec format
 */
function transformLessonToChallengeSpec(lesson, challengeId, domain = null) {
  // Extract constructs from curriculum (for algo format) or metadata (for coding challenge format)
  const constructs = [];
  
  // Algo format: has curriculum.assumesAlreadyTaught and curriculum.introduces
  if (lesson.curriculum && lesson.curriculum.assumesAlreadyTaught) {
    lesson.curriculum.assumesAlreadyTaught.forEach(constructName => {
      constructs.push({
        name: constructName,
        level: 'micro',
        prerequisites: [], // Would need to build dependency graph
        base: true, // Assume base for now
      });
    });
  }
  
  if (lesson.curriculum && lesson.curriculum.introduces) {
    lesson.curriculum.introduces.forEach(constructName => {
      constructs.push({
        name: constructName,
        level: 'micro',
        prerequisites: [], // Would need to build dependency graph
        base: false,
      });
    });
  }
  
  // Coding challenge format: extract from metadata.tests or infer from technology
  if (constructs.length === 0 && lesson.metadata && lesson.metadata.tests) {
    // Parse constructs from tests field (e.g., "Component basics, JSX/template syntax")
    const testConcepts = lesson.metadata.tests.split(',').map(t => t.trim().toLowerCase());
    testConcepts.forEach(concept => {
      constructs.push({
        name: concept,
        level: 'micro',
        prerequisites: [],
        base: true,
      });
    });
  }
  
  // If still no constructs, infer from technology/domain
  if (constructs.length === 0 && domain) {
    const domainConstructs = {
      'react': ['components', 'jsx', 'props', 'state'],
      'nodejs': ['modules', 'async', 'http', 'express'],
      'python': ['functions', 'classes', 'modules', 'decorators'],
      'java': ['classes', 'methods', 'interfaces', 'annotations'],
      'go': ['packages', 'functions', 'interfaces', 'goroutines'],
      'swift': ['classes', 'structs', 'protocols', 'closures'],
      'angular': ['components', 'directives', 'services', 'dependency-injection'],
    };
    
    const defaultConstructs = domainConstructs[domain] || ['functions', 'variables', 'control-flow'];
    defaultConstructs.forEach(constructName => {
      constructs.push({
        name: constructName,
        level: 'micro',
        prerequisites: [],
        base: true,
      });
    });
  }
  
  // Determine domain from file location or lesson metadata
  let detectedDomain = domain;
  if (!detectedDomain) {
    detectedDomain = lesson.technology ? lesson.technology.toLowerCase() : 
                     lesson.pattern ? 'dsa' : 'general';
  }
  
  // Extract description from various possible fields
  let description = '';
  if (lesson.problemStatement?.description) {
    description = lesson.problemStatement.description;
  } else if (lesson.description) {
    description = lesson.description;
  } else if (lesson.metadata?.challenge) {
    description = lesson.metadata.challenge;
  } else if (lesson.flow && lesson.flow.length > 0) {
    // Extract from first flow step's mentorSays
    const firstStep = lesson.flow.find(s => s.stepId === 'problem-illustration' || s.stepId === 'title');
    if (firstStep && firstStep.mentorSays) {
      description = firstStep.mentorSays.substring(0, 200); // First 200 chars
    }
  }
  
  return {
    id: challengeId,
    title: lesson.title || challengeId,
    domain: detectedDomain,
    language: lesson.language || 'javascript',
    description: description || 'Coding challenge',
    constructs: constructs.length > 0 ? constructs : getDefaultConstructs(lesson.language || 'javascript'),
  };
}

/**
 * Get default challenge spec (fallback)
 */
function getDefaultChallengeSpec(challengeId, domain = 'general') {
  return {
    id: challengeId,
    title: challengeId,
    domain: domain,
    language: 'javascript',
    description: 'Coding challenge',
    constructs: getDefaultConstructs('javascript'),
  };
}

/**
 * Get default constructs for a language
 */
function getDefaultConstructs(language) {
  const commonConstructs = [
    { name: 'variables', level: 'micro', prerequisites: [], base: true },
    { name: 'arrays', level: 'micro', prerequisites: ['variables'], base: false },
    { name: 'loops', level: 'micro', prerequisites: ['variables', 'arrays'], base: false },
    { name: 'functions', level: 'micro', prerequisites: ['variables'], base: false },
    { name: 'objects', level: 'micro', prerequisites: ['variables'], base: false },
  ];
  
  // Add language-specific constructs
  if (language === 'javascript') {
    commonConstructs.push(
      { name: 'hash-map', level: 'micro', prerequisites: ['objects'], base: false }
    );
  } else if (language === 'python') {
    commonConstructs.push(
      { name: 'dictionaries', level: 'micro', prerequisites: ['objects'], base: false }
    );
  }
  
  return commonConstructs;
}

export { getChallengeSpec };

// Also export for CommonJS compatibility if needed
// module.exports = { getChallengeSpec };

