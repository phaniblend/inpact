/**
 * Data Models for Lesson Engine
 * 
 * These types define the structure for the deterministic pedagogy engine.
 * The engine is language- and domain-agnostic.
 */

/**
 * @typedef {Object} ChallengeSpec
 * @property {string} id - Unique identifier (kebab-case)
 * @property {string} title - Human-readable title
 * @property {string} domain - Domain: 'react' | 'js' | 'dsa' | 'sql' | 'backend' | 'system-design' | etc.
 * @property {string} [language] - Optional language: 'javascript' | 'python' | 'java' | 'cpp' | 'typescript'
 * @property {string} description - Challenge description
 * @property {Construct[]} constructs - Array of constructs with dependency graph
 */

/**
 * @typedef {Object} Construct
 * @property {string} name - Construct name (e.g., 'arrays', 'loops', 'hash-map')
 * @property {'micro' | 'nano' | 'pico'} level - Granularity level
 * @property {string[]} prerequisites - Array of prerequisite construct names
 * @property {boolean} base - True if this is a base construct (no prerequisites)
 */

/**
 * @typedef {Object} LessonState
 * @property {Phase} phase - Current phase
 * @property {string|null} activeConstruct - Currently active construct (if in drill-down)
 * @property {RecursionFrame[]} recursionStack - Stack for recursive drill-downs
 * @property {Object} learnerResponses - Accumulated learner responses
 * @property {number} score - Verification score (0-100)
 * @property {string|null} resumePoint - Where to resume after drill-down
 * @property {boolean} paused - Whether lesson is paused waiting for input
 * @property {Object} phaseData - Phase-specific data
 */

/**
 * @typedef {'CONTEXT_SETTING' | 'PREREQUISITES' | 'CORE_INSIGHT' | 'SYNTAX_DECOMPOSITION' | 'FULL_APPLICATION' | 'VERIFICATION' | 'CONNECTION'} Phase
 */

/**
 * @typedef {Object} RecursionFrame
 * @property {string} constructName - Construct being taught
 * @property {Phase} resumePhase - Phase to resume at
 * @property {Object} context - Context to restore
 */

/**
 * @typedef {Object} AIContent
 * @property {string} problemStatement - Generated problem statement (1-4 bullets)
 * @property {string} [analogy] - Real-world analogy (if requested)
 * @property {string[]} [prerequisites] - List of prerequisite constructs
 * @property {string} [coreInsight] - One-sentence core solution idea
 * @property {SyntaxUnit[]} [syntaxUnits] - Syntax decomposition units
 * @property {string} [fullSolution] - Complete working solution
 * @property {Question[]} [verificationQuestions] - Verification questions
 * @property {string} [summary] - Connection & transition summary
 */

/**
 * @typedef {Object} SyntaxUnit
 * @property {string} construct - Construct name
 * @property {string} syntax - Syntax example
 * @property {string} explanation - What it does
 * @property {string} microExample - Minimal example
 */

/**
 * @typedef {Object} Question
 * @property {'prediction' | 'reasoning' | 'application'} type
 * @property {string} question - Question text
 * @property {string} answer - Expected answer
 * @property {number} points - Points for correct answer
 */

/**
 * @typedef {Object} LearnerResponse
 * @property {string} type - Response type: 'choice' | 'text' | 'confirmation'
 * @property {string|string[]} value - Response value
 * @property {number} timestamp - Timestamp
 */

/**
 * @typedef {Object} PhaseContent
 * @property {Phase} phase
 * @property {string} displayText - Text to show learner (NO pedagogy jargon)
 * @property {Object} [choices] - Available choices (if any)
 * @property {boolean} requiresInput - Whether input is required
 * @property {Object} [metadata] - Additional metadata
 */

module.exports = {
  // Types are exported for JSDoc usage
};

