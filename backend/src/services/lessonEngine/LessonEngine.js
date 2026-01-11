/**
 * LessonEngine - Main orchestrator for the lesson engine
 * 
 * Coordinates:
 * - LessonController (FSM)
 * - ContentAdapter (AI content generation)
 * - State persistence
 * - Phase content generation
 */

import LessonController from './LessonController.js';
import ContentAdapter from './ContentAdapter.js';

class LessonEngine {
  constructor(challengeSpec) {
    this.challengeSpec = challengeSpec;
    this.controller = new LessonController(challengeSpec);
    this.contentAdapter = new ContentAdapter(challengeSpec);
    this.contentCache = {}; // Cache generated content
  }

  /**
   * Get current phase content (what to show learner)
   */
  async getCurrentPhaseContent() {
    const phase = this.controller.getCurrentPhase();
    const state = this.controller.getState();
    
    // Check cache first
    const phaseDataKey = phase.toLowerCase().replace(/_/g, '');
    const cacheKey = `${phase}_${JSON.stringify(state.phaseData[phaseDataKey] || {})}`;
    if (this.contentCache[cacheKey]) {
      return this.contentCache[cacheKey];
    }

    let content;
    
    switch (phase) {
      case 'CONTEXT_SETTING':
        content = await this.getContextSettingContent(state);
        break;
      
      case 'PREREQUISITES':
        content = await this.getPrerequisitesContent(state);
        break;
      
      case 'CORE_INSIGHT':
        content = await this.getCoreInsightContent(state);
        break;
      
      case 'SYNTAX_DECOMPOSITION':
        content = await this.getSyntaxDecompositionContent(state);
        break;
      
      case 'FULL_APPLICATION':
        content = await this.getFullApplicationContent(state);
        break;
      
      case 'VERIFICATION':
        content = await this.getVerificationContent(state);
        break;
      
      case 'CONNECTION':
        content = await this.getConnectionContent(state);
        break;
      
      default:
        throw new Error(`Unknown phase: ${phase}`);
    }

    // Cache and return
    this.contentCache[cacheKey] = content;
    return content;
  }

  /**
   * Phase 1: Context Setting
   */
  async getContextSettingContent(state) {
    // Ensure phaseData exists
    if (!state.phaseData.contextSetting) {
      state.phaseData.contextSetting = {
        analogyRequested: false,
        uiOutputRequested: false,
        deeperExplanationRequested: false,
        confirmed: false,
        challengeTypeChecked: false,
        showUIOutput: false,
        showAnalogy: false,
        showDeeperExplanation: false,
        deeperExplanationLabel: 'Give me a deeper explanation',
      };
    }
    
    const phaseData = state.phaseData.contextSetting;
    const { analogyRequested, uiOutputRequested, deeperExplanationRequested, confirmed, challengeTypeChecked } = phaseData;
    
    // Check challenge type (only once, cache the result)
    if (!challengeTypeChecked && !analogyRequested && !uiOutputRequested && !deeperExplanationRequested && !confirmed) {
      console.log('Analyzing challenge and generating appropriate help options...');
      const challengeType = await this.contentAdapter.checkChallengeType();
      phaseData.challengeTypeChecked = true;
      phaseData.showUIOutput = challengeType.showUIOutput;
      phaseData.showAnalogy = challengeType.showAnalogy;
      phaseData.showDeeperExplanation = challengeType.showDeeperExplanation;
      phaseData.deeperExplanationLabel = challengeType.deeperExplanationLabel || 'Give me a deeper explanation';
      console.log(`Options: UI Output=${challengeType.showUIOutput}, Analogy=${challengeType.showAnalogy}, Deeper Explanation=${challengeType.showDeeperExplanation} (${phaseData.deeperExplanationLabel})`);
    }
    
    const showUIOutput = phaseData.showUIOutput === true;
    const showAnalogy = phaseData.showAnalogy === true;
    const showDeeperExplanation = phaseData.showDeeperExplanation === true;
    
    if (!analogyRequested && !uiOutputRequested && !deeperExplanationRequested && !confirmed) {
      // Initial: show problem statement and ask preference
      const aiContent = await this.contentAdapter.generateContextSetting(false);
      
      // Build choices based on challenge type
      const choices = [
        { label: "I understand what I need to build", value: 'understand' },
      ];
      
      // Add UI output option for visual challenges
      if (showUIOutput) {
        choices.push({ label: "Show me the result/UI output", value: 'show_ui_output' });
      }
      
      // Add analogy option for concepts with real-world parallels
      if (showAnalogy) {
        choices.push({ label: "Show a real-world analogy", value: 'show_analogy' });
      }
      
      // Add deeper explanation option for technical/abstract challenges
      if (showDeeperExplanation) {
        choices.push({ label: phaseData.deeperExplanationLabel, value: 'show_deeper_explanation' });
      }
      
      // Store problem statement for later use
      state.phaseData.contextSetting.problemStatement = aiContent.problemStatement;
      
      return {
        displayText: this.formatProblemStatement(aiContent.problemStatement),
        choices,
        requiresInput: true,
        metadata: {
          problemStatement: aiContent.problemStatement,
          showUIOutput,
          showAnalogy,
          showDeeperExplanation,
          deeperExplanationLabel: phaseData.deeperExplanationLabel,
        },
      };
    } else if (uiOutputRequested && !confirmed) {
      // Show UI output preview and ask for confirmation
      const uiOutput = await this.contentAdapter.generateUIOutput();
      // Get problem statement from stored data or regenerate
      let problemStatement = state.phaseData.contextSetting.problemStatement;
      if (!problemStatement) {
        const aiContent = await this.contentAdapter.generateContextSetting(false);
        problemStatement = aiContent.problemStatement;
        state.phaseData.contextSetting.problemStatement = problemStatement;
      }
      
      return {
        displayText: this.formatProblemStatement(problemStatement),
        choices: [
          { label: "I'm ready to proceed", value: 'confirmed' },
        ],
        requiresInput: true,
        metadata: {
          uiOutput: {
            html: uiOutput.html,
            description: uiOutput.description,
            showModal: true, // Flag to trigger modal in frontend
          },
        },
      };
    } else if (analogyRequested && !confirmed) {
      // Show analogy and ask for confirmation
      const aiContent = await this.contentAdapter.generateContextSetting(true);
      
      return {
        displayText: this.formatProblemStatement(aiContent.problemStatement) + 
                     '\n\n' + aiContent.analogy,
        choices: [
          { label: "I'm ready to proceed", value: 'confirmed' },
        ],
        requiresInput: true,
        metadata: {
          problemStatement: aiContent.problemStatement,
          analogy: aiContent.analogy,
        },
      };
    } else if (deeperExplanationRequested && !confirmed) {
      // Show deeper explanation and ask for confirmation
      const problemStatement = state.phaseData.contextSetting.problemStatement || [];
      const deeperExplanation = await this.contentAdapter.generateDeeperExplanation(problemStatement);
      
      return {
        displayText: this.formatProblemStatement(problemStatement) + 
                     '\n\n**' + phaseData.deeperExplanationLabel + '**\n\n' + deeperExplanation.explanation +
                     (deeperExplanation.keyConcepts.length > 0 ? '\n\n**Key concepts:**\n' + deeperExplanation.keyConcepts.map(c => `- ${c}`).join('\n') : ''),
        choices: [
          { label: "I'm ready to proceed", value: 'confirmed' },
        ],
        requiresInput: true,
        metadata: {
          deeperExplanation: deeperExplanation,
        },
      };
    }
  }

  /**
   * Phase 2: Prerequisites
   */
  async getPrerequisitesContent(state) {
    const phaseData = state.phaseData.prerequisites || {};
    const { selectedGaps, drillDownActive, checkingPrerequisite, teachingConstruct } = phaseData;
    const activeConstruct = this.controller.getActiveConstruct();
    
    // Check if we're checking prerequisites for a construct
    if (checkingPrerequisite && activeConstruct) {
      // Show prerequisite check question
      return await this.getConstructTeachingContent(activeConstruct);
    }
    
    // Check if we're teaching a construct
    if (teachingConstruct && activeConstruct) {
      // Teach the construct directly
      return await this.getConstructTeachingContent(activeConstruct);
    }
    
    if (drillDownActive && activeConstruct) {
      // In drill-down mode: check prerequisites first
      const { getConstructPrerequisites, isBaseConstruct } = await import('./constructDependencyGraph.js');
      const prerequisites = getConstructPrerequisites(activeConstruct, this.challengeSpec.language);
      const isBase = isBaseConstruct(activeConstruct);
      
      if (isBase || prerequisites.length === 0) {
        // Base construct - teach directly
        state.phaseData.prerequisites.teachingConstruct = true;
        state.phaseData.prerequisites.checkingPrerequisite = false;
        return await this.getConstructTeachingContent(activeConstruct);
      } else {
        // Has prerequisites - check them first
        state.phaseData.prerequisites.checkingPrerequisite = true;
        state.phaseData.prerequisites.teachingConstruct = false;
        return await this.getConstructTeachingContent(activeConstruct);
      }
    } else {
      // Show prerequisites list and ask for gaps
      try {
        const aiContent = await this.contentAdapter.generatePrerequisites();
        
        // Ensure prerequisites is an array
        const prerequisites = Array.isArray(aiContent?.prerequisites) ? aiContent.prerequisites : [];
        
        // If no prerequisites, skip directly to core insight
        if (prerequisites.length === 0) {
          this.controller.state.phase = 'CORE_INSIGHT';
          this.controller.state.paused = true;
          return await this.getCoreInsightContent(state);
        }
        
        return {
          displayText: this.formatPrerequisites(prerequisites),
          choices: [
            { label: "I'm good with all of these", value: 'all_good' },
            { label: "I need help with some of these", value: 'select_gaps' },
          ],
          requiresInput: true,
          metadata: {
            prerequisites: prerequisites,
            selectMode: true, // Allow selecting specific items
          },
        };
      } catch (error) {
        console.error('Error in getPrerequisitesContent:', error);
        // On error, skip to core insight
        this.controller.state.phase = 'CORE_INSIGHT';
        this.controller.state.paused = true;
        return await this.getCoreInsightContent(state);
      }
    }
  }

  /**
   * Phase 3: Core Insight
   */
  async getCoreInsightContent(state) {
    const aiContent = await this.contentAdapter.generateCoreInsight();
    
    return {
      displayText: aiContent.coreInsight,
      choices: [
        { label: "I understand", value: 'understood' },
      ],
      requiresInput: true,
      metadata: {
        coreInsight: aiContent.coreInsight,
      },
    };
  }

  /**
   * Phase 4: Syntax Decomposition
   * Teaches the constructs needed for the solution (from prerequisites)
   * Does NOT drill down into prerequisites - teaches them directly
   */
  async getSyntaxDecompositionContent(state) {
    const phaseDataKey = 'syntaxDecomposition';
    if (!state.phaseData[phaseDataKey]) {
      state.phaseData[phaseDataKey] = {};
    }
    const phaseData = state.phaseData[phaseDataKey];
    
    // Initialize constructs list if needed
    if (!phaseData.constructsToTeach || phaseData.constructsToTeach.length === 0) {
      // Extract constructs from prerequisites (these are the constructs the learner said they're comfortable with)
      // OR from challenge spec if no prerequisites were identified
      const prerequisites = state.phaseData.prerequisites?.prerequisites || [];
      if (prerequisites.length > 0) {
        // Use prerequisites - these are the constructs needed for the solution
        // We teach them directly, NOT their prerequisites
        phaseData.constructsToTeach = prerequisites;
      } else {
        // Fallback: use constructs from challenge spec
        const constructs = this.challengeSpec.constructs || [];
        phaseData.constructsToTeach = constructs.map(c => typeof c === 'string' ? c : c.name);
      }
      phaseData.currentConstructIndex = 0;
    }
    
    const currentConstructIndex = phaseData.currentConstructIndex || 0;
    const constructsToTeach = phaseData.constructsToTeach || [];
    
    // If no constructs to teach, skip to full application
    if (constructsToTeach.length === 0) {
      this.controller.state.phase = 'FULL_APPLICATION';
      this.controller.state.paused = true;
      return await this.getFullApplicationContent(state);
    }
    
    const constructName = constructsToTeach[currentConstructIndex];
    if (!constructName) {
      // No more constructs, move to full application
      this.controller.state.phase = 'FULL_APPLICATION';
      this.controller.state.paused = true;
      return await this.getFullApplicationContent(state);
    }
    
    // IMPORTANT: In Syntax Decomposition, we teach the construct directly
    // We do NOT drill down into its prerequisites - that's what the Prerequisites phase is for
    // If the learner needed help with prerequisites, they would have selected gaps in the Prerequisites phase
    const { isBaseConstruct } = await import('./constructDependencyGraph.js');
    
    // Generate syntax decomposition for the construct
    // For base constructs, this will generate conceptual slides
    // For non-base constructs, this will generate syntax/explanation
    const syntaxUnit = await this.contentAdapter.generateSyntaxDecomposition(constructName);
    
    return {
      displayText: this.formatSyntaxUnit(syntaxUnit, constructName),
      choices: [
        { label: "I understand", value: 'understood' },
      ],
      requiresInput: true,
      metadata: {
        construct: constructName,
        syntaxUnit,
        currentIndex: currentConstructIndex,
        total: constructsToTeach.length,
      },
    };
  }

  /**
   * Phase 5: Full Application
   */
  async getFullApplicationContent(state) {
    const aiContent = await this.contentAdapter.generateFullApplication();
    
    return {
      displayText: this.formatFullSolution(aiContent.fullSolution),
      choices: [
        { label: "I understand the solution", value: 'understood' },
      ],
      requiresInput: true,
      metadata: {
        fullSolution: aiContent.fullSolution,
      },
    };
  }

  /**
   * Phase 6: Verification
   */
  async getVerificationContent(state) {
    const phaseData = state.phaseData.verification || {};
    const { questions, currentQuestionIndex } = phaseData;
    
    // Generate questions if not already generated
    if (questions.length === 0) {
      const aiContent = await this.contentAdapter.generateVerificationQuestions();
      if (!state.phaseData.verification) {
        state.phaseData.verification = {};
      }
      state.phaseData.verification.questions = aiContent.questions;
    }
    
    const currentQuestion = (state.phaseData.verification?.questions || [])[currentQuestionIndex];
    
    return {
      displayText: this.formatQuestion(currentQuestion, currentQuestionIndex + 1, questions.length),
      requiresInput: true,
      inputType: 'text', // Text input for answer
      metadata: {
        question: currentQuestion,
        questionIndex: currentQuestionIndex,
        totalQuestions: questions.length,
      },
    };
  }

  /**
   * Phase 7: Connection & Transition
   */
  async getConnectionContent(state) {
    const aiContent = await this.contentAdapter.generateConnection();
    const score = state.score;
    
    let displayText = aiContent.summary;
    if (score > 0 && score < 90) {
      displayText += '\n\nYou scored ' + score + '%. Let\'s review briefly before moving on.';
    }
    displayText += '\n\nNext concept: ' + aiContent.nextConcept;
    
    return {
      displayText,
      choices: [
        { label: "I'm ready to continue", value: 'ready' },
      ],
      requiresInput: true,
      metadata: {
        summary: aiContent.summary,
        nextConcept: aiContent.nextConcept,
        score,
      },
    };
  }

  /**
   * Get construct teaching content (for drill-down)
   * Implements recursive prerequisite checking down to base constructs
   * Works globally for all languages and domains
   */
  async getConstructTeachingContent(constructName) {
    const { getConstructPrerequisites, isBaseConstruct } = await import('./constructDependencyGraph.js');
    
    // Get prerequisites from dependency graph (language-aware)
    const language = this.challengeSpec.language || 
                     (this.challengeSpec.domain === 'python' ? 'python' :
                      this.challengeSpec.domain === 'java' ? 'java' :
                      this.challengeSpec.domain === 'go' ? 'go' :
                      this.challengeSpec.domain === 'swift' ? 'swift' :
                      'javascript');
    const prerequisites = getConstructPrerequisites(constructName, language);
    const isBase = isBaseConstruct(constructName);
    
    if (isBase || prerequisites.length === 0) {
      // Base construct - teach it directly
      const syntaxUnit = await this.contentAdapter.generateSyntaxDecomposition(constructName);
      
      return {
        displayText: this.formatSyntaxUnit(syntaxUnit, constructName),
        choices: [
          { label: "I understand", value: 'understood' },
        ],
        requiresInput: true,
        metadata: {
          construct: constructName,
          syntaxUnit,
          isBase: true,
        },
      };
    } else {
      // Has prerequisites - ask about them first
      const prereqList = prerequisites.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ');
      
      return {
        displayText: `To understand ${constructName}, you need to know: ${prereqList}. Are you comfortable with these?`,
        choices: [
          { label: "Yes, I'm comfortable", value: 'prereqs_met' },
          { label: "No, I need help", value: 'prereqs_not_met' },
        ],
        requiresInput: true,
        metadata: {
          construct: constructName,
          prerequisites: prerequisites,
          isBase: false,
        },
      };
    }
  }

  /**
   * Process learner response
   */
  async processResponse(response) {
    const result = this.controller.processResponse(response);
    
    // Handle special actions
    if (result.action === 'drill_down') {
      // Drill-down initiated, get content for construct
      return await this.getCurrentPhaseContent();
    } else if (result.action === 'teach_construct') {
      // Teaching a construct, get content for it
      return await this.getCurrentPhaseContent();
    } else if (result.action === 'complete') {
      // Lesson complete
      return { complete: true };
    }
    
    // Get next phase content
    return await this.getCurrentPhaseContent();
  }

  /**
   * Format helpers (convert AI content to learner-facing text)
   */
  formatProblemStatement(bullets) {
    return bullets.map((bullet, i) => `${i + 1}. ${bullet}`).join('\n');
  }

  formatPrerequisites(prerequisites) {
    if (!Array.isArray(prerequisites) || prerequisites.length === 0) {
      return 'No specific prerequisites needed for this challenge.';
    }
    return `To solve this challenge, we will use:\n\n` +
           prerequisites.map((p, i) => `${i + 1}) ${p}`).join('\n') +
           '\n\nAre you comfortable with all of these?';
  }

  formatSyntaxUnit(syntaxUnit, constructName) {
    return `**${constructName}**\n\n` +
           `Syntax:\n\`\`\`\n${syntaxUnit.syntax}\n\`\`\`\n\n` +
           `What it does: ${syntaxUnit.explanation}\n\n` +
           `Example:\n\`\`\`\n${syntaxUnit.microExample}\n\`\`\``;
  }

  formatFullSolution(solution) {
    return `Here's the complete solution:\n\n\`\`\`\n${solution}\n\`\`\`\n\nLet's walk through it step by step.`;
  }

  formatQuestion(question, index, total) {
    return `Question ${index} of ${total} (${question.type}):\n\n${question.question}`;
  }

  /**
   * Get current state (for persistence)
   */
  getState() {
    return this.controller.getState();
  }

  /**
   * Restore state (for resumption)
   */
  restoreState(state) {
    this.controller.restoreState(state);
  }
}

export default LessonEngine;

