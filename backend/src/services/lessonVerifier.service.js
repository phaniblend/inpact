import { lessonStandards } from "./lessonStandards.v1.js";

/**
 * Verify whether a lesson meets pedagogical and structural standards.
 * Returns a score, missing rules, and maturity status.
 */
export function verifyLesson(lesson) {
  let score = 100;
  const missing = [];

  /**
   * RULE: Pseudocode must exist
   */
  if (!lesson.pseudocode || !Array.isArray(lesson.pseudocode)) {
    score -= 30;
    missing.push({
      rule: "MISSING_PSEUDOCODE",
      severity: "high"
    });
  }

  /**
   * RULE: Thinking / Brain-Teaser challenge must exist and be meaningful
   */
  if (!hasThinkingChallenge(lesson)) {
    score -= 25;
    missing.push({
      rule: "MISSING_THINKING_CHALLENGE",
      severity: "high"
    });
  }

  /**
   * RULE: Brute-force approach must be present
   */
  if (!lesson.approach?.bruteforce) {
    score -= 15;
    missing.push({
      rule: "MISSING_BRUTEFORCE_LOGIC",
      severity: "medium"
    });
  }

  /**
   * RULE: Optimized approach must be present
   */
  if (!lesson.approach?.optimized) {
    score -= 15;
    missing.push({
      rule: "MISSING_OPTIMIZED_LOGIC",
      severity: "medium"
    });
  }

  /**
   * Final maturity status
   */
  const status =
    score === lessonStandards.scoring.perfect
      ? "PERFECT"
      : "NEEDS_FIX";

  return {
    status,
    score,
    missing,
    standardsVersion: lessonStandards.version
  };
}

/**
 * A valid thinking challenge:
 * - exists
 * - has a prompt
 * - prompt is non-trivial (forces thinking)
 */
function hasThinkingChallenge(lesson) {
  return (
    lesson.thinkingChallenge &&
    typeof lesson.thinkingChallenge.prompt === "string" &&
    lesson.thinkingChallenge.prompt.trim().length > 30
  );
}
