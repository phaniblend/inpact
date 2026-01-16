/**
 * INPACTTeacher Component - PRODUCTION VERSION
 * 
 * CORE GOAL: Teach learners to CRACK coding challenges by guiding thinking step-by-step.
 * NOT a documentation tool. NOT a concept explainer. NOT a lecture system.
 * 
 * ENFORCED AUTHORING RULES:
 * 1. Never answer before asking (PROBLEM → NEED → QUESTION → REVEAL)
 * 2. One goal per screen (problem framing OR decision OR implementation)
 * 3. No redundant screens (merge or remove overlapping explanation+question)
 * 4. Reason-first step titles (learner intent, not implementation)
 * 5. Minimum-code contract per step (what to implement NOW vs NOT YET)
 * 6. No premature pattern recall (reasoning prompts, not "Recall...")
 * 7. Adaptive help language (first: "Show me how", after: "Show me again")
 * 8. Challenge-scope discipline (exclude future enhancements, hypotheticals)
 * 9. Conversational tone (human, attention-grabbing, not documentation-style)
 * 10. Clear ending (cause→effect, challenge solved, next action)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../common/Spinner';
import { callAI } from '../../utils/aiAPI';

export default function INPACTTeacher({ challengeId, domain, onComplete }) {
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [currentStepId, setCurrentStepId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [useAIMode, setUseAIMode] = useState(true);
  const [currentPhase, setCurrentPhase] = useState('loading');
  const [aiContent, setAiContent] = useState({
    learningObjectives: null,
    challengeDescription: null,
    simpleFlow: null,
    prerequisites: null,
    prereqHeading: null,
    selectedPrereqs: [],
    buildSteps: [],
    
    conceptsToTeach: [],
    currentConceptIndex: 0,
    currentConcept: null,
    currentConceptLesson: null,
    completedConcepts: new Set(),
    teachingStack: [],
    
    userQuestion: '',
    questionAnswer: null,
    lastQuestion: '',
    showQuestionArea: false,
    
    currentStepIndex: 0,
    currentBuildQuestion: null,
    userCode: '',
    codeValidation: null,
    completedSteps: [],
    
    currentTeachingSequence: null,
    currentTeachingScreen: 0,
    pseudocode: null,
    
    // RULE 7: Track help exposure per step
    showMeExposureCount: {},
    
    stepProgress: {},
    progressPanelOpen: true
  });

  // ============================================
  // GLOBAL AUTHORING RULES (injected into all prompts)
  // ============================================
  
  const AUTHORING_RULES = `
STRICT AUTHORING RULES - VIOLATING THESE INVALIDATES THE OUTPUT:

RULE 1 - NEVER ANSWER BEFORE ASKING:
- Do NOT mention the solution concept (e.g., useState) before asking the learner to decide
- Pattern: PROBLEM → NEED → QUESTION → (reveal only after answer)
- If the question asks "which feature provides X", the intro must NOT name that feature

RULE 2 - ONE GOAL PER SCREEN:
- Each screen does exactly ONE thing: frame problem OR ask decision OR show implementation
- Never combine explanation + question on same screen

RULE 3 - NO REDUNDANT CONTENT:
- If explanation already reveals the answer, do NOT follow with a question asking the same thing
- Every screen must add NEW information or require a NEW decision

RULE 4 - REASON-FIRST TITLES:
- Step titles describe LEARNER INTENT, not implementation
- BAD: "Create increment handler", "Add button binding"
- GOOD: "Decide how the value changes", "Connect action to logic"

RULE 5 - MINIMUM-CODE CONTRACT:
- Every step must specify: what to implement NOW, what NOT to implement yet
- This prevents learners from jumping ahead or getting confused

RULE 6 - NO PREMATURE PATTERN RECALL:
- NEVER say "Recall the pattern...", "Remember the syntax...", "You already know..."
- Instead: "You need X and Y. Which approach provides both?"

RULE 7 - ADAPTIVE HELP LANGUAGE:
- First exposure to help: "Show me how to do this"
- Only after first exposure: "Show me again"
- NEVER use "again" on first attempt

RULE 8 - CHALLENGE-SCOPE ONLY:
- Include ONLY steps that solve THIS challenge
- Exclude: future enhancements, scalability, architecture, hypotheticals
- Each step must introduce a NEW DECISION or it should not exist

RULE 9 - CONVERSATIONAL TONE:
- Sound human and engaging, not like documentation
- BAD: "To ensure X, this step verifies Y..."
- GOOD: "Now that X exists, we need a way to Y..."

RULE 10 - CLEAR ENDING:
- Final screen: reinforce cause→effect, confirm challenge solved, clear next action
`;

  // ============================================
  // LOAD CHALLENGE
  // ============================================
  
  useEffect(() => {
    const loadChallenge = async () => {
      if (!challengeId || !domain) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const apiUrl = `/api/lessons/coding/${domain}/${challengeId}`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) throw new Error(`Challenge not found: ${response.status}`);
        
        const result = await response.json();
        
        if (result.success && result.data) {
          setChallenge(result.data);
          if (useAIMode) {
            await startAIFlow(result.data);
          } else if (result.data.flow?.length > 0) {
            setCurrentStepId(result.data.flow[0].stepId);
          } else {
            setError('Challenge has no flow steps');
          }
        } else {
          throw new Error('Failed to load challenge');
        }
      } catch (err) {
        console.error('Error loading challenge:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadChallenge();
  }, [challengeId, domain, useAIMode]);

  // ============================================
  // AI FLOW START
  // ============================================

  async function startAIFlow(challengeData) {
    try {
      setCurrentPhase('loading');
      const challengeDescription = challengeData.description || challengeData.title;
      const objectives = await generateLearningObjectives(challengeDescription);
      
      setAiContent(prev => ({
        ...prev,
        learningObjectives: objectives,
        challengeDescription: challengeDescription
      }));
      
      setCurrentPhase('objectives');
    } catch (err) {
      console.error('Error in AI flow:', err);
      setError('Failed to generate teaching content: ' + err.message);
    }
  }

  // ============================================
  // LEARNING OBJECTIVES (Rule 9: Conversational)
  // ============================================

  async function generateLearningObjectives(challengeDescription) {
    const prompt = `
Challenge: ${challengeDescription}
Framework: ${domain}

Generate 5-6 learning objectives - what the learner will be able to DO after completing this.

${AUTHORING_RULES}

SPECIFIC RULES FOR OBJECTIVES:
- Start with action verb: Build, Create, Implement, Write, Connect, Use
- Focus on SKILLS not knowledge
- Be specific and measurable
- Conversational, not academic

Return ONLY a numbered list:
1. [objective]
2. [objective]
`;

    const response = await callAI(prompt);
    const objectives = [];
    for (const line of response.split('\n')) {
      const match = line.match(/^\d+\.\s*(.+)$/);
      if (match) objectives.push(match[1].trim());
    }
    return objectives;
  }

  // ============================================
  // WHAT WE'LL BUILD (Rule 8: Challenge-scope only)
  // ============================================

  async function proceedToPhase1() {
    setCurrentPhase('loading');
    
    const prompt = `
Challenge: "${aiContent.challengeDescription}"
Framework: ${domain}

Generate a checklist (5-6 items) of ONLY what will be built to solve THIS challenge.

${AUTHORING_RULES}

SPECIFIC RULES:
- Each item = one visible feature or behavior
- Start each with ✓
- EXCLUDE: future improvements, scalability, edge cases not in requirements
- Focus on what user will SEE or DO

Return ONLY the checklist:
✓ [feature 1]
✓ [feature 2]
`;

    const simpleFlow = await callAI(prompt);
    setAiContent(prev => ({ ...prev, simpleFlow }));
    setCurrentPhase('phase_1');
  }

  // ============================================
  // PREREQUISITES (Rule 1: Don't reveal answers)
  // ============================================

  async function proceedToPhase2() {
    setCurrentPhase('loading');
    
    const headingPrompt = `
Challenge: "${aiContent.challengeDescription}"
Framework: ${domain}

Generate ONE heading line connecting this challenge to prerequisites.
Pattern: "To build [specific feature], these ${domain} concepts are needed:"
Under 15 words. Conversational tone.
Return ONLY the heading.
`;

    let prereqHeading;
    try {
      prereqHeading = (await callAI(headingPrompt)).trim().replace(/^["']|["']$/g, '');
    } catch {
      prereqHeading = `To build this ${domain} component, these concepts are needed:`;
    }
    
    const prompt = `
Challenge: ${aiContent.challengeDescription}
Framework: ${domain}

List ONLY coding concepts needed to WRITE THE CODE.

${AUTHORING_RULES}

INCLUDE: language features, framework concepts, specific APIs
EXCLUDE: build tools, project setup, styling (unless core), deployment

Return numbered list:
1. [concept]
2. [concept]
`;

    const response = await callAI(prompt);
    const prerequisites = [];
    for (const line of response.split('\n')) {
      const match = line.match(/^\d+\.\s*(.+)$/);
      if (match) prerequisites.push(match[1].trim());
    }
    
    setAiContent(prev => ({ ...prev, prerequisites, prereqHeading, selectedPrereqs: [] }));
    setCurrentPhase('phase_2');
  }

  /**
 * RECURSIVE TEACHING: Concept breakdown
 * Rule 7: Concept-first, API-last
 * Rule 4: Single construct per step
 */
async function teachConceptDirectly(concept) {
  setCurrentPhase('loading');
  
  // Step 1: Get dependencies for this concept
  const dependencies = await getConceptDependencies(concept);
  
  // Step 2: If dependencies exist, push current concept to stack and teach first dependency
  if (dependencies.length > 0) {
    const unlearned = dependencies.filter(d => !aiContent.completedConcepts.has(d));
    
    if (unlearned.length > 0) {
      // PAUSE current concept, teach dependency first
      setAiContent(prev => ({
        ...prev,
        teachingStack: [...(prev.teachingStack || []), { concept, remainingPrereqs: unlearned.slice(1) }]
      }));
      
      // Teach first unlearned dependency
      await teachConceptDirectly(unlearned[0]);
      return;
    }
  }
  
  // Step 3: No dependencies or all learned - show decision question for THIS concept
  await generateConceptQuestion(concept);
}
/**
 * RECURSIVE TEACHING: Get dependencies for a concept
 * Rule 1: Concept dependency extraction
 * Rule 9: Recursion termination at atomic concepts
 */
async function getConceptDependencies(concept) {
  const prompt = `
Concept: ${concept}
Framework: ${domain}

List ONLY the DIRECT prerequisites needed to understand "${concept}".

RULES:
- Maximum 2-3 dependencies (most critical only)
- Only concepts the learner must understand BEFORE this one
- Stop at atomic concepts (variables, values, basic operators need no deps)
- Do NOT include the concept itself

ATOMIC CONCEPTS (return empty array for these):
- variables, constants, values, literals
- basic operators (+, -, =)
- strings, numbers, booleans

Return JSON array of concept names ONLY:
["dependency1", "dependency2"]

If no dependencies needed, return: []
`;

  try {
    const response = await callAI(prompt);
    const jsonMatch = response.match(/\[[\s\S]*?\]/);
    if (jsonMatch) {
      const deps = JSON.parse(jsonMatch[0]);
      // Filter out already-learned concepts
      return deps.filter(d => d && typeof d === 'string' && d.trim());
    }
    return [];
  } catch (err) {
    console.warn('Could not get dependencies for', concept, err);
    return [];
  }
}

/**
 * RECURSIVE TEACHING: Generate decision question for a concept
 * Rule 1: Never answer before asking
 * Rule 2: One goal per screen (this is DECISION only)
 */
async function generateConceptQuestion(concept) {
  const prompt = `
Concept: ${concept}
Framework: ${domain}

Generate a SHORT decision question to test if the learner understands when/why to use "${concept}".

${AUTHORING_RULES}

RULES:
- Do NOT explain the concept first
- Ask a "which/what" question about WHEN or WHY to use it
- Context: 1-2 sentences max describing a situation
- Options: 3 choices + "Show me" option
- Keep entire response under 100 words

Return JSON:
{
  "context": "Short situation (1-2 sentences)",
  "question": "Which/What/When question",
  "options": [
    {"id": "A", "text": "Wrong option", "correct": false},
    {"id": "B", "text": "Correct or wrong", "correct": true or false},
    {"id": "C", "text": "Wrong or correct", "correct": false or true},
    {"id": "D", "text": "Show me", "action": "show_explanation"}
  ]
}
`;

  try {
    const response = await callAI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    const question = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    
    if (question) {
      setAiContent(prev => ({
        ...prev,
        currentConcept: concept,
        currentConceptQuestion: question
      }));
      setCurrentPhase('concept_question');
    } else {
      throw new Error('Could not parse question');
    }
  } catch (err) {
    console.error('Error generating concept question:', err);
    // Fallback: show brief explanation directly
    await showConceptExplanation(concept);
  }
}
/**
 * RECURSIVE TEACHING: Brief explanation (shown only after question or on "Show me")
 * Rule 2: One goal per screen (this is EXPLANATION only)
 */
async function showConceptExplanation(concept) {
  setCurrentPhase('loading');
  
  const prompt = `
Concept: ${concept}
Framework: ${domain}

Explain "${concept}" in 3 SHORT parts:

1. WHAT (1 sentence): What is it?
2. WHY (1 sentence): When/why use it?
3. HOW (2-3 lines code): Minimal syntax example

Total: under 60 words + code.
NO lengthy explanations. NO "Imagine..." scenarios.
`;

  try {
    const response = await callAI(prompt);
    
    setAiContent(prev => ({
      ...prev,
      currentConcept: concept,
      currentConceptLesson: {
        concept,
        content: response,
        currentIndex: prev.completedConcepts?.size || 0,
        totalCount: (prev.conceptsToTeach?.length || 0) + (prev.teachingStack?.length || 0)
      }
    }));
    
    setCurrentPhase('teaching_concept');
  } catch (err) {
    console.error('Error generating explanation:', err);
    // Skip this concept and continue
    await markConceptComplete();
  }
}

/**
 * Handle answer to concept question
 */
async function handleConceptAnswer(option) {
  const { currentConcept } = aiContent;
  
  if (option.action === 'show_explanation' || !option.correct) {
    // Show explanation
    await showConceptExplanation(currentConcept);
  } else {
    // Correct - mark complete and continue
    await markConceptComplete();
  }
}
  // ============================================
  // BUILD STEPS (Rules 4, 5, 8)
  // Reason-first titles, scope contract, challenge-only
  // ============================================

  async function proceedToPhase3() {
    setCurrentPhase('loading');
    
    const prompt = `
Break this challenge into build steps:
${aiContent.challengeDescription}
Framework: ${domain}

${AUTHORING_RULES}

STEP GENERATION RULES:
1. REASON-FIRST TITLES (Rule 4):
   - BAD: "Create increment handler", "Add button binding"
   - GOOD: "Decide how the value changes", "Connect user action to logic"

2. SCOPE CONTRACT (Rule 5) - each step MUST have:
   - implement_now: what to code in THIS step
   - not_yet: what to NOT code yet (comes in later steps)

3. CHALLENGE-SCOPE ONLY (Rule 8):
   - Only steps that solve THIS challenge
   - No future enhancements, no hypotheticals
   - Each step must require a NEW DECISION

4. ORDERING:
   - State before UI
   - Handlers before buttons
   - One decision per step

Return JSON:
[
  {
    "step": 1,
    "title": "Store a value that updates the screen",
    "description": "The counter needs to track a number that React watches",
    "concept": "useState",
    "scope": {
      "implement_now": "State variable for count",
      "not_yet": "Buttons, handlers, display"
    }
  }
]

Generate 6-8 steps. Return ONLY valid JSON.
`;

    const response = await callAI(prompt);
    
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      let steps = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
      
      if (steps.length === 0) throw new Error('No steps parsed');
      
      // Validate each step has scope
      steps = steps.map((s, i) => ({
        ...s,
        step: i + 1,
        scope: s.scope || { implement_now: s.description, not_yet: 'Later steps' }
      }));
      
      setAiContent(prev => ({
        ...prev,
        buildSteps: steps,
        currentStepIndex: 0,
        userCode: '',
        completedSteps: [],
        currentBuildQuestion: null,
        showMeExposureCount: {}
      }));
      
      await generateBuildQuestion(steps[0]);
      
    } catch (err) {
      console.error('Error parsing build steps:', err);
      const fallback = [{
        step: 1,
        title: 'Build the solution',
        description: 'Implement the component',
        concept: 'component',
        scope: { implement_now: 'Full solution', not_yet: 'N/A' }
      }];
      setAiContent(prev => ({ ...prev, buildSteps: fallback, currentStepIndex: 0 }));
      await generateBuildQuestion(fallback[0]);
    }
  }

  // ============================================
  // BUILD QUESTION (Rules 1, 2, 6, 7, 9)
  // Question WITHOUT revealing answer first
  // ============================================

  async function generateBuildQuestion(stepConfig) {
    setCurrentPhase('loading');
    
    // RULE 7: Adaptive help language
    const stepKey = `step_${aiContent.currentStepIndex}`;
    const exposureCount = aiContent.showMeExposureCount[stepKey] || 0;
    const showMeText = exposureCount === 0 ? "Show me how to do this" : "Show me again";
    
    const prompt = `
Build step:
- Title: ${stepConfig.title}
- Description: ${stepConfig.description}
- Concept: ${stepConfig.concept}
- Scope: Implement now: ${stepConfig.scope?.implement_now} | Not yet: ${stepConfig.scope?.not_yet}

Challenge context: ${aiContent.challengeDescription}
Framework: ${domain}

${AUTHORING_RULES}

GENERATE A DECISION SCREEN:

CONTEXT (Rule 1 - do NOT reveal the answer):
- State the NEED: "To [achieve goal], we need a way to [capability]..."
- Do NOT mention the specific concept/API that solves it
- Under 40 words, conversational (Rule 9)

QUESTION:
- Ask which APPROACH provides the needed capability
- Frame as reasoning (Rule 6): "Which provides [X and Y]?"
- Do NOT say "Recall..." or "Remember..."

OPTIONS:
- A: Common beginner mistake (looks right but fails)
- B or C: Correct answer (RANDOMIZE position)
- C or B: Outdated or wrong-context approach
- D: "${showMeText}" (Rule 7)

Return JSON:
{
  "context": "To [goal], we need [capability]. This will allow [benefit].",
  "question": "Which approach provides [needed capability]?",
  "options": [
    {"id": "A", "text": "...", "correct": false},
    {"id": "B", "text": "...", "correct": true or false},
    {"id": "C", "text": "...", "correct": false or true},
    {"id": "D", "text": "${showMeText}", "action": "show_example"}
  ]
}
`;

    try {
      const response = await callAI(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const question = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
      
      if (question) {
        setAiContent(prev => ({ ...prev, currentBuildQuestion: question }));
        setCurrentPhase('phase_3_question');
      } else {
        throw new Error('Could not parse question');
      }
    } catch (err) {
      console.error('Error parsing question:', err);
      await showYourTurn(stepConfig);
    }
  }

  // ============================================
  // TEACHING SEQUENCE (Rules 1, 2, 3)
  // Show ONLY after learner requests help
  // Each screen = ONE purpose
  // ============================================

  async function generateTeachingSequence(stepConfig) {
    const prompt = `
Teach: ${stepConfig.concept}
For: ${stepConfig.description}
Framework: ${domain}

${AUTHORING_RULES}

Generate 4-screen teaching sequence. Each screen = ONE PURPOSE (Rule 2).

**Screen 1: "The Problem"**
- Show what fails WITHOUT this concept
- NO solution yet (Rule 1)
- NO CODE

**Screen 2: "The Solution"**
- NOW reveal the pattern
- Minimal code (3-5 lines)

**Screen 3: "Different Example"**
- Show pattern in DIFFERENT domain (forces pattern recognition)
- If counter → show inventory tracker
- If list → show bookmarks

**Screen 4: "Common Pitfalls"**
- 2 mistakes with ❌ wrong / ✅ right

Return JSON:
[
  {"screen": 1, "title": "The Problem", "content": "..."},
  {"screen": 2, "title": "The Solution", "content": "..."},
  {"screen": 3, "title": "Different Example", "content": "..."},
  {"screen": 4, "title": "Common Pitfalls", "content": "..."}
]
`;

    const response = await callAI(prompt);
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    throw new Error('Could not parse teaching sequence');
  }

  // ============================================
  // YOUR TURN (Rules 5, 6)
  // Show scope contract, no "Recall..."
  // ============================================

  async function showYourTurn(stepConfig) {
    setCurrentPhase('loading');
    
    const prompt = `
Task for learner:
- Step: ${stepConfig.title}
- Description: ${stepConfig.description}
- Implement now: ${stepConfig.scope?.implement_now}
- Not yet: ${stepConfig.scope?.not_yet}

${AUTHORING_RULES}

Generate task guidance:

RULES:
1. State WHAT to implement, not exact code (Rule 5)
2. NO "Remember..." or "Recall..." (Rule 6)
3. Frame as: "This step requires [X]. The approach involves [Y]."
4. Include scope reminder
5. End with reasoning question (not syntax question)
6. Under 50 words, conversational (Rule 9)

Return ONLY the task text.
`;

    const pseudocode = await callAI(prompt);
    
    setAiContent(prev => ({
      ...prev,
      pseudocode,
      userCode: '',
      codeValidation: null
    }));
    
    setCurrentPhase('phase_3_code');
  }

  // ============================================
  // HANDLERS
  // ============================================

  async function handlePrereqSelection(action) {
    if (action === 'skip') {
      await proceedToPhase3();
    } else if (action === 'teach') {
      const selected = aiContent.selectedPrereqs || [];
      if (selected.length === 0) return;
      setAiContent(prev => ({
        ...prev,
        conceptsToTeach: selected,
        currentConceptIndex: 0,
        teachingStack: [],
        completedConcepts: new Set()
      }));
      await teachConceptDirectly(selected[0]);
    }
  }

  async function markConceptComplete() {
    const { currentConcept, teachingStack, conceptsToTeach, completedConcepts } = aiContent;
    
    const newCompleted = new Set(completedConcepts || []);
    newCompleted.add(currentConcept);
    
    setAiContent(prev => ({
      ...prev,
      completedConcepts: newCompleted,
      questionAnswer: null,
      showQuestionArea: false
    }));
    
    if (teachingStack?.length > 0) {
      const stackTop = teachingStack[teachingStack.length - 1];
      if (stackTop.remainingPrereqs?.length > 0) {
        const nextPrereq = stackTop.remainingPrereqs[0];
        setAiContent(prev => ({
          ...prev,
          teachingStack: [...teachingStack.slice(0, -1), { ...stackTop, remainingPrereqs: stackTop.remainingPrereqs.slice(1) }],
          completedConcepts: newCompleted
        }));
        await teachConceptDirectly(nextPrereq);
      } else {
        setAiContent(prev => ({
          ...prev,
          teachingStack: teachingStack.slice(0, -1),
          completedConcepts: newCompleted
        }));
        await teachConceptDirectly(stackTop.concept);
      }
    } else {
      const currentIndex = conceptsToTeach.findIndex(c => c === currentConcept);
      if (currentIndex + 1 < conceptsToTeach.length) {
        setAiContent(prev => ({ ...prev, currentConceptIndex: currentIndex + 1, completedConcepts: newCompleted }));
        await teachConceptDirectly(conceptsToTeach[currentIndex + 1]);
      } else {
        await proceedToPhase3();
      }
    }
  }

  async function handleBuildAnswer(option) {
    const { buildSteps, currentStepIndex } = aiContent;
    const currentStep = buildSteps[currentStepIndex];
    const stepKey = `step_${currentStepIndex}`;
    
    if (option.action === 'show_example') {
      // RULE 7: Track exposure
      setAiContent(prev => ({
        ...prev,
        showMeExposureCount: { ...prev.showMeExposureCount, [stepKey]: (prev.showMeExposureCount[stepKey] || 0) + 1 }
      }));
      await showTeachingSequence(currentStep);
    } else if (option.correct) {
      await showYourTurn(currentStep);
    } else {
      // Wrong answer - track and show teaching
      setAiContent(prev => ({
        ...prev,
        showMeExposureCount: { ...prev.showMeExposureCount, [stepKey]: (prev.showMeExposureCount[stepKey] || 0) + 1 }
      }));
      await showTeachingSequence(currentStep);
    }
  }

  async function showTeachingSequence(stepConfig) {
    setCurrentPhase('loading');
    try {
      const sequence = await generateTeachingSequence(stepConfig);
      setAiContent(prev => ({ ...prev, currentTeachingSequence: sequence, currentTeachingScreen: 0 }));
      setCurrentPhase('phase_3_teaching');
    } catch (err) {
      console.error('Error generating teaching sequence:', err);
      await showYourTurn(stepConfig);
    }
  }

  function navigateTeachingScreen(direction) {
    const { currentTeachingSequence, currentTeachingScreen } = aiContent;
    const totalScreens = currentTeachingSequence?.length || 4;
    const newScreen = Math.max(0, Math.min(currentTeachingScreen + direction, totalScreens - 1));
    setAiContent(prev => ({ ...prev, currentTeachingScreen: newScreen }));
  }

  async function finishTeachingSequence() {
    const { buildSteps, currentStepIndex } = aiContent;
    await showYourTurn(buildSteps[currentStepIndex]);
  }

  function skipBuildStep() {
    const { buildSteps, currentStepIndex } = aiContent;
    if (currentStepIndex + 1 < buildSteps.length) {
      setAiContent(prev => ({ ...prev, currentStepIndex: currentStepIndex + 1, currentBuildQuestion: null, codeValidation: null }));
      generateBuildQuestion(buildSteps[currentStepIndex + 1]);
    } else {
      setCurrentPhase('complete');
    }
  }

  function previousBuildStep() {
    const { buildSteps, currentStepIndex } = aiContent;
    if (currentStepIndex > 0) {
      setAiContent(prev => ({ ...prev, currentStepIndex: currentStepIndex - 1, currentBuildQuestion: null, codeValidation: null }));
      generateBuildQuestion(buildSteps[currentStepIndex - 1]);
    }
  }

  async function validateUserCode() {
    const { buildSteps, currentStepIndex, userCode } = aiContent;
    const currentStep = buildSteps[currentStepIndex];
    
    if (!userCode.trim()) {
      setAiContent(prev => ({
        ...prev,
        codeValidation: { isCorrect: false, feedback: "No code entered.", suggestion: "Review the task and implement.", encouragement: "" }
      }));
      return;
    }
    
    setCurrentPhase('loading');
    
    const prompt = `
Evaluate code for: "${currentStep.title}"
Concept: ${currentStep.concept}
Should implement: ${currentStep.scope?.implement_now}
Should NOT have: ${currentStep.scope?.not_yet}

Code:
\`\`\`
${userCode}
\`\`\`

Return JSON:
{
  "isCorrect": true/false,
  "feedback": "What's correct or needs fixing (1 sentence)",
  "suggestion": "Specific fix if wrong, 'none' if correct",
  "encouragement": "Brief acknowledgment"
}

Be generous - if approach is right with minor syntax issues, mark correct.
`;

    try {
      const response = await callAI(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const validation = jsonMatch ? JSON.parse(jsonMatch[0]) : { isCorrect: false, feedback: "Could not validate.", suggestion: "Check syntax.", encouragement: "" };
      
      setAiContent(prev => ({ ...prev, codeValidation: validation }));
      
      if (validation.isCorrect) {
        const newCompletedSteps = [...aiContent.completedSteps, currentStepIndex];
        if (currentStepIndex + 1 < buildSteps.length) {
          setTimeout(() => {
            setAiContent(prev => ({ ...prev, completedSteps: newCompletedSteps, currentStepIndex: currentStepIndex + 1, userCode: '', codeValidation: validation }));
            generateBuildQuestion(buildSteps[currentStepIndex + 1]);
          }, 1500);
        } else {
          setAiContent(prev => ({ ...prev, completedSteps: newCompletedSteps }));
          setTimeout(() => setCurrentPhase('complete'), 1500);
        }
      } else {
        setCurrentPhase('phase_3_code');
      }
    } catch (err) {
      setAiContent(prev => ({ ...prev, codeValidation: { isCorrect: false, feedback: "Validation error.", suggestion: "Check syntax.", encouragement: "" } }));
      setCurrentPhase('phase_3_code');
    }
  }

  async function submitConceptQuestion(concept) {
    const question = aiContent.userQuestion?.trim();
    if (!question) return;
    
    setCurrentPhase('loading');
    const prompt = `Topic: ${concept}\nQuestion: ${question}\n\nProvide clear, helpful answer under 100 words. Conversational tone.`;
    
    try {
      const answer = await callAI(prompt);
      setAiContent(prev => ({ ...prev, questionAnswer: answer, lastQuestion: question, userQuestion: '', showQuestionArea: false }));
      setCurrentPhase('teaching_concept');
    } catch (err) {
      setCurrentPhase('teaching_concept');
    }
  }

  const saveCompletion = (challengeId, domain) => {
    try {
      const key = 'apt_completed_challenges';
      const completed = JSON.parse(localStorage.getItem(key) || '[]');
      const completionId = `${domain}/${challengeId}`;
      if (!completed.includes(completionId)) {
        completed.push(completionId);
        localStorage.setItem(key, JSON.stringify(completed));
      }
    } catch {}
  };

  // ============================================
  // MARKDOWN RENDERING
  // ============================================

  const renderMarkdown = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    const elements = [];
    let inCodeBlock = false;
    let codeContent = [];
    
    const renderInline = (t) => {
      const parts = t.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
      return parts.map((p, i) => {
        if (p.startsWith('**') && p.endsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>;
        if (p.startsWith('`') && p.endsWith('`')) return <code key={i} className="bg-gray-100 px-1 rounded font-mono text-sm text-purple-700">{p.slice(1, -1)}</code>;
        return p;
      });
    };
    
    lines.forEach((line, idx) => {
      const t = line.trim();
      if (t.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(<pre key={idx} className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm my-4 overflow-x-auto">{codeContent.join('\n')}</pre>);
          codeContent = [];
        }
        inCodeBlock = !inCodeBlock;
        return;
      }
      if (inCodeBlock) { codeContent.push(line); return; }
      if (!t) { elements.push(<div key={idx} className="h-2" />); return; }
      if (t.startsWith('✓') || t.startsWith('✅')) {
        elements.push(<div key={idx} className="flex gap-2 mb-2"><span className="text-green-500">✓</span><span>{renderInline(t.slice(1).trim())}</span></div>);
        return;
      }
      if (t.startsWith('❌')) {
        elements.push(<div key={idx} className="flex gap-2 mb-2 bg-red-50 p-2 rounded"><span className="text-red-500">❌</span><span className="text-red-700">{renderInline(t.slice(1).trim())}</span></div>);
        return;
      }
      if (t.startsWith('- ')) {
        elements.push(<li key={idx} className="ml-4 mb-1 list-disc">{renderInline(t.slice(2))}</li>);
        return;
      }
      elements.push(<p key={idx} className="mb-3 text-gray-700 leading-relaxed">{renderInline(t)}</p>);
    });
    return elements;
  };

  // ============================================
  // RENDER: OBJECTIVES
  // ============================================

  const renderLearningObjectives = () => {
    if (!aiContent.learningObjectives) return <Spinner />;
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">What You'll Build</h2>
        <p className="text-gray-600">After this challenge, you'll be able to:</p>
        <ul className="space-y-3 bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
          {aiContent.learningObjectives.map((obj, i) => (
            <li key={i} className="flex gap-3"><span className="font-bold text-purple-600">{i + 1}.</span><span className="text-gray-700">{obj}</span></li>
          ))}
        </ul>
        <button onClick={proceedToPhase1} className="w-full py-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700">Continue →</button>
      </div>
    );
  };

  // ============================================
  // RENDER: PHASE 1 - WHAT WE BUILD
  // ============================================

  const renderPhase1 = () => {
    if (!aiContent.simpleFlow) return <Spinner />;
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">The Challenge</h2>
        <p className="text-gray-600">Here's what we're building:</p>
        <div className="bg-gray-50 p-6 rounded-lg border">{renderMarkdown(aiContent.simpleFlow)}</div>
        <button onClick={proceedToPhase2} className="w-full py-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700">Check Prerequisites →</button>
      </div>
    );
  };

  // ============================================
  // RENDER: PHASE 2 - PREREQUISITES
  // ============================================

  const renderPhase2 = () => {
    if (!aiContent.prerequisites) return <Spinner />;
    const togglePrereq = (p) => setAiContent(prev => {
      const current = prev.selectedPrereqs || [];
      return { ...prev, selectedPrereqs: current.includes(p) ? current.filter(x => x !== p) : [...current, p] };
    });
    const selectedCount = (aiContent.selectedPrereqs || []).length;
    
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Prerequisites</h2>
        <p className="text-gray-600">{aiContent.prereqHeading}</p>
        <div className="space-y-2">
          {aiContent.prerequisites.map((p, i) => {
            const selected = (aiContent.selectedPrereqs || []).includes(p);
            return (
              <button key={i} onClick={() => togglePrereq(p)} className={`w-full px-4 py-3 rounded-lg border-2 text-left flex items-center gap-3 transition ${selected ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <span className={`w-5 h-5 rounded border-2 flex items-center justify-center ${selected ? 'border-purple-500 bg-purple-500 text-white' : 'border-gray-300'}`}>{selected && '✓'}</span>
                <span>{p}</span>
              </button>
            );
          })}
        </div>
        <p className="text-sm text-gray-500">Select any you'd like to review first.</p>
        <div className="flex gap-3">
          <button onClick={() => handlePrereqSelection('skip')} className="flex-1 py-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700">✓ Ready to Build</button>
          <button onClick={() => handlePrereqSelection('teach')} disabled={selectedCount === 0} className={`flex-1 py-4 font-bold rounded-lg ${selectedCount > 0 ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-100 text-gray-400'}`}>Review ({selectedCount})</button>
        </div>
      </div>
    );
  };
// ============================================
// RENDER: CONCEPT QUESTION (decision before explanation)
// ============================================

const renderConceptQuestion = () => {
  const { currentConcept, currentConceptQuestion, teachingStack, completedConcepts } = aiContent;
  if (!currentConceptQuestion) return <Spinner />;
  
  const depth = teachingStack?.length || 0;
  const learned = completedConcepts?.size || 0;
  
  return (
    <div className="space-y-6">
      {/* Breadcrumb showing recursive path */}
      {depth > 0 && (
        <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 text-sm">
          <span className="text-purple-600">Learning path: </span>
          <span className="text-purple-800">
            {teachingStack.map(s => s.concept).join(' → ')} → <strong>{currentConcept}</strong>
          </span>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">{currentConcept}</h2>
        {learned > 0 && (
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {learned} learned
          </span>
        )}
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
        <p className="text-gray-700">{currentConceptQuestion.context}</p>
      </div>
      
      <div>
        <h4 className="text-lg font-semibold mb-4">{currentConceptQuestion.question}</h4>
        <div className="space-y-3">
          {currentConceptQuestion.options?.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleConceptAnswer(opt)}
              className={`w-full px-4 py-4 rounded-lg border-2 text-left flex items-center gap-4 transition ${
                opt.action === 'show_explanation'
                  ? 'border-yellow-300 bg-yellow-50 hover:bg-yellow-100'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
              }`}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                opt.action === 'show_explanation' ? 'bg-yellow-200' : 'bg-gray-200'
              }`}>
                {opt.id}
              </span>
              <span>{opt.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
  // ============================================
  // RENDER: TEACHING CONCEPT
  // ============================================

  const renderTeachingConcept = () => {
    if (!aiContent.currentConceptLesson) return <Spinner />;
    const { concept, content, currentIndex, totalCount } = aiContent.currentConceptLesson;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{concept}</h2>
          {totalCount > 1 && <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{currentIndex + 1} of {totalCount}</span>}
        </div>
        <div className="prose max-w-none">{renderMarkdown(content)}</div>
        <div className="border-t pt-6">
          <button onClick={markConceptComplete} className="w-full py-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 mb-3">Continue →</button>
          <button onClick={() => setAiContent(prev => ({ ...prev, showQuestionArea: !prev.showQuestionArea }))} className="w-full py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-lg hover:border-purple-300">Ask a Question</button>
          {aiContent.showQuestionArea && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <textarea value={aiContent.userQuestion || ''} onChange={(e) => setAiContent(prev => ({ ...prev, userQuestion: e.target.value }))} placeholder="Your question..." className="w-full p-3 border rounded-lg min-h-[80px]" />
              <div className="flex gap-2 mt-3">
                <button onClick={() => submitConceptQuestion(concept)} className="px-4 py-2 bg-purple-600 text-white rounded-lg">Submit</button>
                <button onClick={() => setAiContent(prev => ({ ...prev, showQuestionArea: false }))} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
              </div>
            </div>
          )}
          {aiContent.questionAnswer && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <p className="font-semibold mb-2">Q: {aiContent.lastQuestion}</p>
              <div>{renderMarkdown(aiContent.questionAnswer)}</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ============================================
  // RENDER: PHASE 3 - BUILD QUESTION
  // ============================================

  const renderPhase3Question = () => {
    const { buildSteps, currentStepIndex, currentBuildQuestion, completedSteps } = aiContent;
    if (!currentBuildQuestion) return <Spinner />;
    
    const currentStep = buildSteps[currentStepIndex];
    const progress = (completedSteps.length / buildSteps.length) * 100;
    
    return (
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between mb-2">
            <h2 className="font-bold text-gray-900">Step {currentStepIndex + 1}: {currentStep.title}</h2>
            <span className="text-sm text-gray-600">{completedSteps.length}/{buildSteps.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} /></div>
        </div>
        
        {/* RULE 5: Scope contract */}
        {currentStep.scope && (
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-sm">
            <p><strong>This step:</strong> {currentStep.scope.implement_now}</p>
            <p className="text-yellow-700"><strong>Not yet:</strong> {currentStep.scope.not_yet}</p>
          </div>
        )}
        
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <p className="text-gray-700">{currentBuildQuestion.context}</p>
        </div>
        
        <div>
          <h4 className="text-lg font-semibold mb-4">{currentBuildQuestion.question}</h4>
          <div className="space-y-3">
            {currentBuildQuestion.options?.map((opt, i) => (
              <button key={i} onClick={() => handleBuildAnswer(opt)} className={`w-full px-4 py-4 rounded-lg border-2 text-left flex items-center gap-4 transition ${opt.action === 'show_example' ? 'border-yellow-300 bg-yellow-50 hover:bg-yellow-100' : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'}`}>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${opt.action === 'show_example' ? 'bg-yellow-200' : 'bg-gray-200'}`}>{opt.id}</span>
                <span>{opt.text}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between pt-4 border-t">
          <button onClick={previousBuildStep} disabled={currentStepIndex === 0} className={currentStepIndex === 0 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100 px-4 py-2 rounded'}>← Back</button>
          <button onClick={skipBuildStep} className="text-gray-600 hover:bg-gray-100 px-4 py-2 rounded">Skip →</button>
        </div>
      </div>
    );
  };

  // ============================================
  // RENDER: PHASE 3 - TEACHING SEQUENCE
  // ============================================

  const renderPhase3Teaching = () => {
    const { buildSteps, currentStepIndex, currentTeachingSequence, currentTeachingScreen } = aiContent;
    if (!currentTeachingSequence?.length) return <Spinner />;
    
    const currentStep = buildSteps[currentStepIndex];
    const screen = currentTeachingSequence[currentTeachingScreen];
    const totalScreens = currentTeachingSequence.length;
    const isLast = currentTeachingScreen >= totalScreens - 1;
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">{currentStep.concept}</h2>
            <p className="text-sm text-gray-600">{currentStep.title}</p>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: totalScreens }).map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i === currentTeachingScreen ? 'bg-purple-600' : i < currentTeachingScreen ? 'bg-green-500' : 'bg-gray-300'}`} />
            ))}
          </div>
        </div>
        
        <div className="bg-purple-600 text-white px-4 py-3 rounded-lg flex justify-between">
          <span className="font-bold">{screen.title}</span>
          <span className="text-purple-200">{currentTeachingScreen + 1}/{totalScreens}</span>
        </div>
        
        <div className="bg-white border rounded-lg p-6 min-h-[200px]">{renderMarkdown(screen.content)}</div>
        
        <div className="flex justify-between">
          <button onClick={() => navigateTeachingScreen(-1)} disabled={currentTeachingScreen === 0} className={currentTeachingScreen === 0 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100 px-4 py-2 rounded'}>← Back</button>
          {isLast ? (
            <button onClick={finishTeachingSequence} className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700">Ready to Implement →</button>
          ) : (
            <button onClick={() => navigateTeachingScreen(1)} className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Next →</button>
          )}
        </div>
      </div>
    );
  };

  // ============================================
  // RENDER: PHASE 3 - CODE
  // ============================================

  const renderPhase3Code = () => {
    const { buildSteps, currentStepIndex, userCode, codeValidation, completedSteps, pseudocode } = aiContent;
    const currentStep = buildSteps[currentStepIndex];
    const progress = (completedSteps.length / buildSteps.length) * 100;
    
    return (
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between mb-2">
            <h2 className="font-bold">Implement: {currentStep.title}</h2>
            <span className="text-sm text-gray-600">{currentStepIndex + 1}/{buildSteps.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full" style={{ width: `${progress}%` }} /></div>
        </div>
        
        {/* RULE 5: Scope contract */}
        {currentStep.scope && (
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-sm">
            <p><strong>Implement now:</strong> {currentStep.scope.implement_now}</p>
            <p className="text-yellow-700"><strong>Not yet:</strong> {currentStep.scope.not_yet}</p>
          </div>
        )}
        
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">{renderMarkdown(pseudocode || currentStep.description)}</div>
        
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-800 text-gray-400 px-4 py-2 text-sm flex justify-between">
            <span>Code</span><span className="bg-gray-700 px-2 rounded">{domain}</span>
          </div>
          <textarea value={userCode} onChange={(e) => setAiContent(prev => ({ ...prev, userCode: e.target.value, codeValidation: null }))} className="w-full h-40 p-4 font-mono text-sm bg-gray-900 text-green-400 focus:outline-none" placeholder="Write code here..." spellCheck={false} />
        </div>
        
        {codeValidation && (
          <div className={`p-4 rounded-lg border ${codeValidation.isCorrect ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
            <div className="flex gap-3">
              <span className="text-2xl">{codeValidation.isCorrect ? '✓' : '→'}</span>
              <div>
                <p className={codeValidation.isCorrect ? 'text-green-800' : 'text-orange-800'}>{codeValidation.feedback}</p>
                {codeValidation.suggestion && codeValidation.suggestion !== 'none' && !codeValidation.isCorrect && <p className="text-sm text-gray-600 mt-1">{codeValidation.suggestion}</p>}
              </div>
            </div>
          </div>
        )}
        
        <div className="flex gap-3">
          <button onClick={validateUserCode} className="flex-1 py-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700">✓ Check Code</button>
          <button onClick={skipBuildStep} className="px-6 py-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Skip →</button>
        </div>
        
        <div className="text-center">
          <button onClick={() => showTeachingSequence(buildSteps[currentStepIndex])} className="text-purple-600 hover:text-purple-800 text-sm underline">Need help? Review the concept</button>
        </div>
      </div>
    );
  };

  // ============================================
  // RENDER: COMPLETE (Rule 10)
  // ============================================

  const renderComplete = () => {
    const completedCount = aiContent.completedSteps?.length || 0;
    const totalSteps = aiContent.buildSteps?.length || 1;
    
    return (
      <div className="space-y-6">
        <div className="text-center py-6">
          <span className="text-5xl">✓</span>
          <h2 className="text-2xl font-bold mt-4">Challenge Complete</h2>
          <p className="text-gray-600 mt-2">{challenge?.title}</p>
        </div>
        
        {/* RULE 10: Cause → Effect */}
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="font-bold text-green-800 mb-3">What You Built</h3>
          <p className="text-green-700 mb-4">You solved the challenge by implementing {completedCount} of {totalSteps} steps.</p>
          <ul className="space-y-2">
            {aiContent.learningObjectives?.slice(0, 3).map((obj, i) => (
              <li key={i} className="flex gap-2 text-green-700"><span>✓</span><span>{obj}</span></li>
            ))}
          </ul>
        </div>
        
        {/* RULE 10: Clear next action */}
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-purple-800 font-medium">Next: Apply these skills to another challenge or review specific concepts.</p>
        </div>
        
        <div className="flex gap-4">
          <button onClick={() => navigate('/coding')} className="flex-1 py-4 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300">← More Challenges</button>
          <button onClick={() => { saveCompletion(challengeId, domain); onComplete?.({ challengeId, domain, completedAt: new Date().toISOString() }); }} className="flex-1 py-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700">Mark Complete</button>
        </div>
      </div>
    );
  };

  // ============================================
  // ERROR
  // ============================================

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-red-500 text-white p-6 rounded-lg max-w-md">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p className="mb-4">{error}</p>
          <button onClick={() => navigate('/coding')} className="px-4 py-2 bg-white text-red-500 rounded font-semibold">Go Back</button>
        </div>
      </div>
    );
  }

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <button onClick={() => navigate('/coding')} className="text-gray-300 hover:text-white mb-1">← Back</button>
            <h1 className="text-white text-xl font-bold">{challenge?.title || 'Loading...'}</h1>
          </div>
          {domain && <span className="text-white text-sm bg-purple-600 px-3 py-1 rounded-full">{domain}</span>}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-xl p-8 max-h-[calc(100vh-180px)] overflow-y-auto">
          {currentPhase === 'loading' && <div className="text-center py-12"><Spinner /><p className="mt-4 text-gray-600">Preparing...</p></div>}
          {currentPhase === 'objectives' && renderLearningObjectives()}
          {currentPhase === 'phase_1' && renderPhase1()}
          {currentPhase === 'phase_2' && renderPhase2()}
          {currentPhase === 'concept_question' && renderConceptQuestion()}
          {currentPhase === 'teaching_concept' && renderTeachingConcept()}
          {currentPhase === 'phase_3_question' && renderPhase3Question()}
          {currentPhase === 'phase_3_teaching' && renderPhase3Teaching()}
          {currentPhase === 'phase_3_code' && renderPhase3Code()}
          {currentPhase === 'complete' && renderComplete()}
        </div>
      </div>
    </div>
  );
}
