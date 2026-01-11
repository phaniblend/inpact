/**
 * LessonController - Finite State Machine for Lesson Engine
 * 
 * Manages the deterministic pedagogy flow:
 * 1. Context Setting
 * 2. Prerequisites (Awareness + Selection)
 * 3. Core Insight
 * 4. Syntax Decomposition
 * 5. Full Application
 * 6. Verification
 * 7. Connection & Transition
 * 
 * Handles:
 * - Phase transitions
 * - Recursive drill-down for prerequisites
 * - Resume after drill-down
 * - Pause/resume mechanics
 */

import {
  PHASE_CONTEXT_SETTING,
  PHASE_PREREQUISITES,
  PHASE_CORE_INSIGHT,
  PHASE_SYNTAX_DECOMPOSITION,
  PHASE_FULL_APPLICATION,
  PHASE_VERIFICATION,
  PHASE_CONNECTION,
} from './constants.js';

class LessonController {
  constructor(challengeSpec) {
    this.challengeSpec = challengeSpec;
    this.state = this.initializeState();
    // Store challengeId and domain in state for persistence
    this.state.challengeId = challengeSpec.id;
    this.state.domain = challengeSpec.domain;
  }

  /**
   * Initialize lesson state
   */
  initializeState() {
    return {
      phase: PHASE_CONTEXT_SETTING,
      activeConstruct: null,
      recursionStack: [],
      learnerResponses: {},
      score: 0,
      resumePoint: null,
      paused: true,
      phaseData: {
        contextSetting: {
          analogyRequested: false,
          confirmed: false,
          analogyChecked: false,
          canUseAnalogy: true, // Default, will be checked by AI
        },
        prerequisites: {
          selectedGaps: [],
          drillDownActive: false,
        },
        syntaxDecomposition: {
          currentConstructIndex: 0,
          constructsToTeach: [],
        },
        verification: {
          questions: [],
          answers: {},
          currentQuestionIndex: 0,
        },
      },
    };
  }

  /**
   * Get current phase
   */
  getCurrentPhase() {
    return this.state.phase;
  }

  /**
   * Check if lesson is paused
   */
  isPaused() {
    return this.state.paused;
  }

  /**
   * Get active construct being taught
   */
  getActiveConstruct() {
    return this.state.activeConstruct;
  }

  /**
   * Process learner response and advance state
   */
  processResponse(response) {
    const { type, value } = response;

    // Store response
    this.state.learnerResponses[this.state.phase] = response;

    // Process based on current phase
    switch (this.state.phase) {
      case PHASE_CONTEXT_SETTING:
        return this.handleContextSettingResponse(value);
      
      case PHASE_PREREQUISITES:
        return this.handlePrerequisitesResponse(value);
      
      case PHASE_CORE_INSIGHT:
        return this.handleCoreInsightResponse(value);
      
      case PHASE_SYNTAX_DECOMPOSITION:
        return this.handleSyntaxDecompositionResponse(value);
      
      case PHASE_FULL_APPLICATION:
        return this.handleFullApplicationResponse(value);
      
      case PHASE_VERIFICATION:
        return this.handleVerificationResponse(value);
      
      case PHASE_CONNECTION:
        return this.handleConnectionResponse(value);
      
      default:
        throw new Error(`Unknown phase: ${this.state.phase}`);
    }
  }

  /**
   * Phase 1: Context Setting
   */
  handleContextSettingResponse(value) {
    if (value === 'understand') {
      // Learner understands, proceed to prerequisites
      this.state.phase = PHASE_PREREQUISITES;
      this.state.paused = true;
      return { nextPhase: PHASE_PREREQUISITES, action: 'generate_prerequisites' };
    } else if (value === 'show_ui_output') {
      // Show UI output, then ask for confirmation
      this.state.phaseData.contextSetting.uiOutputRequested = true;
      this.state.paused = true;
      return { nextPhase: PHASE_CONTEXT_SETTING, action: 'show_ui_output' };
    } else if (value === 'show_analogy') {
      // Show analogy, then ask for confirmation
      this.state.phaseData.contextSetting.analogyRequested = true;
      this.state.paused = true;
      return { nextPhase: PHASE_CONTEXT_SETTING, action: 'show_analogy' };
    } else if (value === 'show_deeper_explanation') {
      // Show deeper explanation, then ask for confirmation
      this.state.phaseData.contextSetting.deeperExplanationRequested = true;
      this.state.paused = true;
      return { nextPhase: PHASE_CONTEXT_SETTING, action: 'show_deeper_explanation' };
    } else if (value === 'confirmed') {
      // After any help option, proceed to prerequisites
      this.state.phaseData.contextSetting.confirmed = true;
      this.state.phase = PHASE_PREREQUISITES;
      this.state.paused = true;
      return { nextPhase: PHASE_PREREQUISITES, action: 'generate_prerequisites' };
    }
    return { error: 'Invalid response in context setting' };
  }

  /**
   * Phase 2: Prerequisites
   */
  handlePrerequisitesResponse(value) {
    // Check if we're in the middle of prerequisite checking
    if (this.state.phaseData.prerequisites?.checkingPrerequisite) {
      // Handle prerequisite check response (yes/no)
      const constructName = this.state.activeConstruct;
      return this.handlePrerequisiteCheckResponse(value, constructName);
    }
    
    // Check if we're teaching a construct
    if (this.state.phaseData.prerequisites?.teachingConstruct) {
      if (value === 'understood') {
        // Construct understood, complete drill-down
        const constructName = this.state.activeConstruct;
        return this.completeDrillDown(constructName);
      }
    }
    
    // Initial prerequisites phase
    if (value === 'all_good') {
      // All prerequisites met, proceed to core insight
      this.state.phase = PHASE_CORE_INSIGHT;
      this.state.paused = true;
      return { nextPhase: PHASE_CORE_INSIGHT, action: 'generate_core_insight' };
    } else if (Array.isArray(value) && value.length > 0) {
      // Learner selected gaps, trigger recursive drill-down
      this.state.phaseData.prerequisites.selectedGaps = value;
      this.state.phaseData.prerequisites.drillDownActive = true;
      
      // Start drill-down with first selected construct
      const firstConstruct = value[0];
      this.state.activeConstruct = firstConstruct;
      this.state.paused = true;
      
      return {
        nextPhase: PHASE_PREREQUISITES,
        action: 'drill_down',
        construct: firstConstruct,
      };
    } else if (value === 'prereqs_met' || value === 'prereqs_not_met') {
      // Response to prerequisite check
      const constructName = this.state.activeConstruct;
      return this.handlePrerequisiteCheckResponse(value, constructName);
    }
    return { error: 'Invalid response in prerequisites' };
  }

  /**
   * Handle prerequisite response during drill-down
   * Implements recursive prerequisite checking
   */
  handlePrerequisiteCheckResponse(value, constructName) {
    if (value === 'prereqs_met') {
      // Prerequisites satisfied, teach the construct
      this.state.phaseData.prerequisites.checkingPrerequisite = false;
      this.state.phaseData.prerequisites.teachingConstruct = true;
      this.state.activeConstruct = constructName;
      this.state.paused = true;
      return {
        nextPhase: PHASE_PREREQUISITES,
        action: 'teach_construct',
        construct: constructName,
      };
    } else if (value === 'prereqs_not_met') {
      // Need to drill down into prerequisites
      // Get prerequisites from dependency graph
      return this.initiatePrerequisiteDrillDown(constructName);
    }
    return { error: 'Invalid response in prerequisite check' };
  }

  /**
   * Initiate recursive drill-down for prerequisites
   * Works globally for all languages and domains
   */
  async initiatePrerequisiteDrillDown(constructName) {
    const { getConstructPrerequisites, isBaseConstruct } = await import('./constructDependencyGraph.js');
    
    // Determine language from challenge spec or domain (global support)
    const language = this.challengeSpec?.language || 
                     (this.state.domain === 'python' ? 'python' :
                      this.state.domain === 'java' ? 'java' :
                      this.state.domain === 'go' ? 'go' :
                      this.state.domain === 'swift' ? 'swift' :
                      'javascript');
    
    const prerequisites = getConstructPrerequisites(constructName, language);
    
    if (prerequisites.length === 0 || isBaseConstruct(constructName)) {
      // Base construct - should not happen here, but teach it
      this.state.phaseData.prerequisites.checkingPrerequisite = false;
      this.state.phaseData.prerequisites.teachingConstruct = true;
      this.state.paused = true;
      return {
        nextPhase: PHASE_PREREQUISITES,
        action: 'teach_construct',
        construct: constructName,
      };
    }
    
    // Push current construct to recursion stack
    this.state.recursionStack.push({
      constructName: constructName,
      resumePhase: PHASE_PREREQUISITES,
      context: {
        waitingForConstruct: constructName,
      },
    });
    
    // Start with first prerequisite
    const firstPrereq = prerequisites[0];
    this.state.activeConstruct = firstPrereq;
    this.state.phaseData.prerequisites.currentPrerequisitePath = [constructName, ...prerequisites];
    this.state.phaseData.prerequisites.currentPrerequisiteIndex = 0;
    this.state.phaseData.prerequisites.checkingPrerequisite = true;
    this.state.phaseData.prerequisites.teachingConstruct = false;
    
    this.state.paused = true;
    return {
      nextPhase: PHASE_PREREQUISITES,
      action: 'check_prerequisite',
      construct: firstPrereq,
    };
  }

  /**
   * Handle drill-down completion
   * Called when a construct has been fully taught
   * Resumes recursive prerequisite checking
   */
  completeDrillDown(constructName) {
    const currentPath = this.state.phaseData.prerequisites.currentPrerequisitePath || [];
    const currentIndex = this.state.phaseData.prerequisites.currentPrerequisiteIndex || 0;
    
    // Check if we're in the middle of a prerequisite path
    if (currentPath.length > 0 && currentIndex < currentPath.length - 1) {
      // Move to next prerequisite in path
      const nextIndex = currentIndex + 1;
      const nextConstruct = currentPath[nextIndex];
      
      this.state.phaseData.prerequisites.currentPrerequisiteIndex = nextIndex;
      this.state.activeConstruct = nextConstruct;
      this.state.paused = true;
      
      return {
        nextPhase: PHASE_PREREQUISITES,
        action: 'check_prerequisite',
        construct: nextConstruct,
      };
    }
    
    // All prerequisites satisfied, pop recursion stack
    if (this.state.recursionStack.length > 0) {
      const frame = this.state.recursionStack.pop();
      const parentConstruct = frame.constructName;
      
      // Now teach the parent construct
      this.state.activeConstruct = parentConstruct;
      this.state.phaseData.prerequisites.currentPrerequisitePath = [];
      this.state.phaseData.prerequisites.currentPrerequisiteIndex = 0;
      
      this.state.paused = true;
      return {
        nextPhase: PHASE_PREREQUISITES,
        action: 'teach_construct',
        construct: parentConstruct,
      };
    }
    
    // No more recursion, check if there are more selected gaps
    const selectedGaps = this.state.phaseData.prerequisites.selectedGaps || [];
    const remainingGaps = selectedGaps.filter(gap => gap !== constructName);

    if (remainingGaps.length === 0) {
      // All gaps filled, resume original lesson
      this.state.phaseData.prerequisites.drillDownActive = false;
      this.state.activeConstruct = null;
      this.state.phaseData.prerequisites.currentPrerequisitePath = [];
      this.state.phaseData.prerequisites.currentPrerequisiteIndex = 0;
      
      // Proceed to core insight
      this.state.phase = PHASE_CORE_INSIGHT;
      this.state.paused = true;
      return { nextPhase: PHASE_CORE_INSIGHT, action: 'generate_core_insight' };
    } else {
      // More gaps to fill, continue with next
      this.state.phaseData.prerequisites.selectedGaps = remainingGaps;
      this.state.activeConstruct = remainingGaps[0];
      this.state.paused = true;
      return {
        nextPhase: PHASE_PREREQUISITES,
        action: 'drill_down',
        construct: remainingGaps[0],
      };
    }
  }

  /**
   * Phase 3: Core Insight
   */
  handleCoreInsightResponse(value) {
    if (value === 'understood') {
      this.state.phase = PHASE_SYNTAX_DECOMPOSITION;
      this.state.paused = true;
      return { nextPhase: PHASE_SYNTAX_DECOMPOSITION, action: 'generate_syntax_decomposition' };
    }
    return { error: 'Invalid response in core insight' };
  }

  /**
   * Phase 4: Syntax Decomposition
   */
  handleSyntaxDecompositionResponse(value) {
    const { currentConstructIndex, constructsToTeach } = this.state.phaseData.syntaxDecomposition;
    
    if (value === 'understood') {
      // Move to next construct
      if (currentConstructIndex < constructsToTeach.length - 1) {
        this.state.phaseData.syntaxDecomposition.currentConstructIndex++;
        this.state.paused = true;
        return {
          nextPhase: PHASE_SYNTAX_DECOMPOSITION,
          action: 'teach_next_construct',
          constructIndex: this.state.phaseData.syntaxDecomposition.currentConstructIndex,
        };
      } else {
        // All constructs taught, proceed to full application
        this.state.phase = PHASE_FULL_APPLICATION;
        this.state.paused = true;
        return { nextPhase: PHASE_FULL_APPLICATION, action: 'generate_full_solution' };
      }
    }
    return { error: 'Invalid response in syntax decomposition' };
  }

  /**
   * Phase 5: Full Application
   */
  handleFullApplicationResponse(value) {
    if (value === 'understood') {
      this.state.phase = PHASE_VERIFICATION;
      this.state.paused = true;
      return { nextPhase: PHASE_VERIFICATION, action: 'generate_verification_questions' };
    }
    return { error: 'Invalid response in full application' };
  }

  /**
   * Phase 6: Verification
   */
  handleVerificationResponse(value) {
    const { currentQuestionIndex, questions } = this.state.phaseData.verification;
    
    if (typeof value === 'object' && value.answer !== undefined) {
      // Store answer
      this.state.phaseData.verification.answers[currentQuestionIndex] = value.answer;
      
      // Move to next question
      if (currentQuestionIndex < questions.length - 1) {
        this.state.phaseData.verification.currentQuestionIndex++;
        this.state.paused = true;
        return {
          nextPhase: PHASE_VERIFICATION,
          action: 'show_next_question',
          questionIndex: this.state.phaseData.verification.currentQuestionIndex,
        };
      } else {
        // All questions answered, calculate score
        const score = this.calculateVerificationScore();
        this.state.score = score;
        
        if (score < 70) {
          // Restart from core insight
          this.state.phase = PHASE_CORE_INSIGHT;
          this.state.paused = true;
          return { nextPhase: PHASE_CORE_INSIGHT, action: 'restart_from_core_insight', score };
        } else if (score >= 70 && score <= 90) {
          // Brief review, then continue
          this.state.phase = PHASE_CONNECTION;
          this.state.paused = true;
          return { nextPhase: PHASE_CONNECTION, action: 'brief_review', score };
        } else {
          // Proceed to connection
          this.state.phase = PHASE_CONNECTION;
          this.state.paused = true;
          return { nextPhase: PHASE_CONNECTION, action: 'generate_connection', score };
        }
      }
    }
    return { error: 'Invalid response in verification' };
  }

  /**
   * Calculate verification score
   */
  calculateVerificationScore() {
    const { questions, answers } = this.state.phaseData.verification;
    let totalPoints = 0;
    let earnedPoints = 0;

    questions.forEach((question, index) => {
      totalPoints += question.points;
      // Simple exact match for now (can be enhanced with fuzzy matching)
      if (answers[index] && answers[index].toLowerCase().trim() === question.answer.toLowerCase().trim()) {
        earnedPoints += question.points;
      }
    });

    return totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  }

  /**
   * Phase 7: Connection & Transition
   */
  handleConnectionResponse(value) {
    if (value === 'ready') {
      // Lesson complete
      this.state.paused = false;
      return { nextPhase: null, action: 'complete' };
    }
    return { error: 'Invalid response in connection' };
  }

  /**
   * Get current state (for persistence)
   */
  getState() {
    return JSON.parse(JSON.stringify(this.state));
  }

  /**
   * Restore state (for resumption)
   */
  restoreState(state) {
    this.state = state;
  }

  /**
   * Check if in drill-down mode
   */
  isInDrillDown() {
    return this.state.phaseData.prerequisites.drillDownActive;
  }

  /**
   * Get active construct (if in drill-down)
   */
  getActiveConstruct() {
    return this.state.activeConstruct;
  }
}

export default LessonController;

