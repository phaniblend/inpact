/**
 * ContentAdapter - Builds AI prompts and calls AI API
 * 
 * Responsibilities:
 * - Builds structured prompts based on phase and challenge spec
 * - Calls AI API with strict constraints
 * - Returns structured content ONLY (no pedagogy explanation)
 * - Language-appropriate content generation
 */

import { callAI } from './aiService.js';
import { getCachedContent, cacheContent } from './lessonCache.js';

class ContentAdapter {
  constructor(challengeSpec) {
    this.challengeSpec = challengeSpec;
    this.challengeId = challengeSpec.id;
    this.domain = challengeSpec.domain;
  }

  /**
   * Check challenge type and determine appropriate help option
   * Returns a dynamically generated help option that's most appropriate for this challenge
   */
  async checkChallengeType() {
    const { title, description, domain } = this.challengeSpec;
    
    const prompt = `You are a coding teacher analyzing a coding challenge. Determine the BEST way to help a learner who doesn't fully understand what needs to be built.

Challenge: ${title}
Domain: ${domain}
Description: ${description}

Analyze this challenge and determine:
1. Does it produce visual UI output that can be shown? (e.g., React components, HTML pages, visual interfaces)
2. Would a real-world analogy help explain the concept? (e.g., Todo List → shopping list, NOT APIs/backend)
3. Would a deeper explanation help? (e.g., API endpoints, backend services, abstract concepts)

CRITICAL RULES:
- APIs, backend services, server-side code → showDeeperExplanation: true, showAnalogy: false, showUIOutput: false
- Visual DOM/UI challenges (React components, HTML pages) → showUIOutput: true
- Concepts with clear real-world parallels (Todo List, Shopping Cart) → showAnalogy: true
- Technical/abstract challenges WITHOUT visual output → showDeeperExplanation: true, showAnalogy: false
- DO NOT show analogy for backend/API challenges - they don't benefit from real-world analogies
- Generate a CLEAR, ACTIONABLE button label for deeper explanation (e.g., "Give me a deeper explanation", "Show me how it works", "Explain the architecture")

Respond with JSON only:
{
  "showUIOutput": true or false,
  "showAnalogy": true or false,
  "showDeeperExplanation": true or false,
  "deeperExplanationLabel": "custom label for deeper explanation option" (only if showDeeperExplanation is true),
  "reason": "brief explanation of your choices"
}`;

    try {
      console.log('\n=== Analyzing challenge and generating help options ===');
      const response = await callAI(prompt);
      const parsed = typeof response === 'string' ? JSON.parse(response) : response;
      const result = {
        showUIOutput: parsed.showUIOutput === true,
        showAnalogy: parsed.showAnalogy === true,
        showDeeperExplanation: parsed.showDeeperExplanation === true,
        deeperExplanationLabel: parsed.deeperExplanationLabel || 'Give me a deeper explanation',
        reason: parsed.reason || 'no reason provided',
      };
      console.log(`Challenge analysis result:`, result);
      return result;
    } catch (error) {
      console.error('Error analyzing challenge type:', error);
      // Default: show deeper explanation for backend/API challenges
      return { 
        showUIOutput: false, 
        showAnalogy: false, 
        showDeeperExplanation: true,
        deeperExplanationLabel: 'Give me a deeper explanation',
        reason: 'default fallback' 
      };
    }
  }

  /**
   * Generate deeper explanation for challenges that need it
   */
  async generateDeeperExplanation(problemStatement) {
    const { title, description, domain, language } = this.challengeSpec;
    
    const prompt = `You are a coding teacher. A learner is struggling to understand what they need to build for this challenge. Provide a clearer, more detailed explanation.

Challenge: ${title}
Domain: ${domain}
Language: ${language || 'not specified'}
Description: ${description}

Problem Statement:
${Array.isArray(problemStatement) ? problemStatement.map((p, i) => `${i + 1}. ${p}`).join('\n') : problemStatement}

Generate a deeper explanation that:
- Breaks down what the challenge is asking for in simpler terms
- Explains the key concepts involved
- Clarifies any technical jargon
- Provides context about why each requirement matters
- Uses clear, beginner-friendly language

Format your response as JSON:
{
  "explanation": "Clear, detailed explanation of what needs to be built and why",
  "keyConcepts": ["concept1", "concept2", ...] // Main concepts the learner needs to understand
}`;

    try {
      console.log('\n=== Generating deeper explanation ===');
      const response = await callAI(prompt);
      const parsed = typeof response === 'string' ? JSON.parse(response) : response;
      return {
        explanation: parsed.explanation || '',
        keyConcepts: parsed.keyConcepts || [],
      };
    } catch (error) {
      console.error('Error generating deeper explanation:', error);
      return {
        explanation: 'A detailed explanation will help you understand what needs to be built.',
        keyConcepts: [],
      };
    }
  }

  /**
   * Generate UI output preview for simple DOM render challenges
   * Returns actual HTML/CSS/JS code that can be rendered in an iframe
   */
  async generateUIOutput() {
    const { title, description, domain, language } = this.challengeSpec;
    
    const prompt = `You are a coding teacher. Generate the actual HTML/CSS/JavaScript code that demonstrates what the UI/output will look like for this challenge.

Challenge: ${title}
Domain: ${domain}
Language: ${language || 'javascript'}
Description: ${description}

Generate a complete, standalone HTML page that shows the expected output. Include:
- HTML structure
- CSS styling (inline or in <style> tag)
- Any necessary JavaScript (inline or in <script> tag)

The code should be a complete, runnable HTML page that can be rendered in an iframe.

Format your response as JSON:
{
  "html": "<!DOCTYPE html>...complete HTML code...",
  "description": "Brief description of what the output shows"
}`;

    try {
      console.log('\n=== Generating UI output code ===');
      const response = await callAI(prompt);
      const parsed = typeof response === 'string' ? JSON.parse(response) : response;
      return {
        html: parsed.html || '<html><body><p>Output preview</p></body></html>',
        description: parsed.description || 'Visual output preview',
      };
    } catch (error) {
      console.error('Error generating UI output:', error);
      return {
        html: '<html><body style="padding: 20px; font-family: Arial;"><h1>Output Preview</h1><p>Visual output will appear here when you complete the challenge.</p></body></html>',
        description: 'Visual output preview',
      };
    }
  }

  /**
   * Generate content for Phase 1: Context Setting
   */
  async generateContextSetting(analogyRequested = false) {
    const prompt = this.buildContextSettingPrompt(analogyRequested);
    const response = await callAI(prompt);
    
    return {
      problemStatement: this.extractProblemStatement(response),
      analogy: analogyRequested ? this.extractAnalogy(response) : null,
    };
  }

  /**
   * Generate content for Phase 2: Prerequisites
   */
  async generatePrerequisites() {
    // Check cache
    const cached = await getCachedContent(this.challengeId, this.domain, 'prerequisites');
    if (cached) {
      console.log(`✓ Using cached prerequisites`);
      return cached.content;
    }
    
    try {
      const prompt = this.buildPrerequisitesPrompt();
      const response = await callAI(prompt);
      
      const prerequisites = this.extractPrerequisites(response);
      
      // Ensure we have at least an empty array
      const result = {
        prerequisites: Array.isArray(prerequisites) ? prerequisites : [],
      };
      
      // Cache it
      await cacheContent(this.challengeId, this.domain, 'prerequisites', result);
      
      return result;
    } catch (error) {
      console.error('Error generating prerequisites:', error);
      // Return empty prerequisites on error
      return {
        prerequisites: [],
      };
    }
  }

  /**
   * Generate content for Phase 3: Core Insight
   */
  async generateCoreInsight() {
    const prompt = this.buildCoreInsightPrompt();
    const response = await callAI(prompt);
    
    return {
      coreInsight: this.extractCoreInsight(response),
    };
  }

  /**
   * Generate content for Phase 4: Syntax Decomposition
   * For base constructs, generates conceptual explanation slides
   */
  async generateSyntaxDecomposition(constructName) {
    // Check cache
    const cached = await getCachedContent(this.challengeId, this.domain, 'syntax_decomposition', constructName);
    if (cached) {
      console.log(`✓ Using cached syntax decomposition for ${constructName}`);
      return cached.content;
    }
    
    // Check if it's a base construct - generate conceptual slides
    const { isBaseConstruct } = await import('./constructDependencyGraph.js');
    if (isBaseConstruct(constructName)) {
      return await this.generateBaseConstructExplanation(constructName);
    }
    
    // Generate new content for non-base constructs
    const prompt = this.buildSyntaxDecompositionPrompt(constructName);
    const response = await callAI(prompt);
    
    const syntaxUnit = this.extractSyntaxUnit(response);
    
    // Cache it
    await cacheContent(this.challengeId, this.domain, 'syntax_decomposition', syntaxUnit, constructName);
    
    return syntaxUnit;
  }

  /**
   * Generate conceptual explanation slides for base constructs
   */
  async generateBaseConstructExplanation(constructName) {
    const { title, description, domain, language } = this.challengeSpec;
    const lang = language || (domain === 'python' ? 'python' : 
                              domain === 'java' ? 'java' : 
                              domain === 'go' ? 'go' : 
                              domain === 'swift' ? 'swift' : 'javascript');
    
    const prompt = `You are a coding teacher explaining a fundamental programming concept to a complete beginner. Write in a noob-friendly, ${lang}-first style.

Construct: ${constructName}
Language: ${lang}
Domain: ${domain}

Generate a beginner-friendly explanation broken into logical slides. Each slide should:
- Focus on ONE clear concept
- Use simple, plain English (no jargon)
- Include concrete, real-world examples
- Be digestible (not overwhelming)
- Use analogies when helpful

For base constructs like "variables", follow this structure:
1. **What is [construct]?** - Plain English with simple analogy (e.g., "a named box in memory", "a label stuck on a value")
2. **Why do we need [construct]?** - Show the problem it solves with before/after code examples
3. **How to create/use [construct]** - Show the syntax with ${lang} examples, explain different keywords/types
4. **Common types/forms** - If applicable, show different variations
5. **Common mistakes** - Show what NOT to do with examples

CRITICAL:
- Use plain English, not technical jargon
- Each slide should be self-contained
- Code examples should be simple and clear
- Use analogies (like "named box", "label", etc.)
- Show real problems it solves

Format your response as JSON with slides array:
{
  "slides": [
    {
      "title": "What is ${constructName}?",
      "content": "Plain English explanation with simple analogy. Use everyday language. Example: 'A variable is a named box in memory where you store a value so you can use it later. Think of it as a label stuck on a value.'",
      "codeExample": "optional simple code example if relevant"
    },
    {
      "title": "Why do we need ${constructName}?",
      "content": "Explain the problem it solves. Show why we can't just use values directly. Use before/after examples.",
      "codeExample": "// Without variables:\nconsole.log(10 + 10);\nconsole.log(10 * 2);\n\n// With variables:\nlet x = 10;\nconsole.log(x + x);\nconsole.log(x * 2);"
    },
    {
      "title": "How to create ${constructName}",
      "content": "Show the syntax. Explain different keywords (let, const, var for JS). Use rule of thumb: 'use const by default, let only when needed'",
      "codeExample": "let age = 25;\nconst name = 'Rahul';"
    },
    ...
  ],
  "syntax": "final syntax summary",
  "microExample": "simple, complete example"
}

Keep each slide focused and digestible. Maximum 6-7 slides. Use the style from the example - noob-friendly, ${lang}-first, keeping it simple and concrete.`;

    try {
      console.log(`\n=== Generating base construct explanation for ${constructName} ===`);
      const response = await callAI(prompt);
      const parsed = typeof response === 'string' ? JSON.parse(response) : response;
      
      const result = {
        slides: parsed.slides || [],
        syntax: parsed.syntax || '',
        microExample: parsed.microExample || '',
        isBaseConstruct: true,
      };
      
      // Cache it
      await cacheContent(this.challengeId, this.domain, 'syntax_decomposition', result, constructName);
      
      return result;
    } catch (error) {
      console.error('Error generating base construct explanation:', error);
      // Fallback to simple syntax
      return {
        slides: [
          {
            title: `What is ${constructName}?`,
            content: `${constructName} is a fundamental programming concept.`,
            codeExample: '',
          },
        ],
        syntax: `// ${constructName} syntax`,
        microExample: `// Example`,
        isBaseConstruct: true,
      };
    }
  }

  /**
   * Generate content for Phase 5: Full Application
   */
  async generateFullApplication() {
    const prompt = this.buildFullApplicationPrompt();
    const response = await callAI(prompt);
    
    return {
      fullSolution: this.extractFullSolution(response),
    };
  }

  /**
   * Generate content for Phase 6: Verification
   */
  async generateVerificationQuestions() {
    const prompt = this.buildVerificationPrompt();
    const response = await callAI(prompt);
    
    return {
      questions: this.extractQuestions(response),
    };
  }

  /**
   * Generate content for Phase 7: Connection & Transition
   */
  async generateConnection() {
    const prompt = this.buildConnectionPrompt();
    const response = await callAI(prompt);
    
    return {
      summary: this.extractSummary(response),
      nextConcept: this.extractNextConcept(response),
    };
  }

  /**
   * Build prompt for Phase 1: Context Setting
   */
  buildContextSettingPrompt(analogyRequested) {
    const { title, description, domain, language } = this.challengeSpec;
    
    return `You are a coding teacher. Generate a concise problem statement for a coding challenge.

Challenge: ${title}
Domain: ${domain}
Language: ${language || 'not specified'}
Description: ${description}

${analogyRequested ? 'Also provide a real-world analogy that connects to the problem.' : ''}

IMPORTANT CONSTRAINTS:
- Output ONLY valid JSON, no markdown, no code blocks
- problemStatement must be an array of strings (each string is one bullet point)
- Each bullet point should be a clear, actionable instruction (NOT numbered steps)
- ${analogyRequested ? 'analogy must be a single string (2-3 sentences connecting the challenge to a real-world scenario)' : ''}
- NO pedagogy explanation
- NO phase names
- NO numbered steps (use bullet points instead)
- Coding-focused only
- Be concise and clear

Example format:
{
  "problemStatement": ["Create a React component that displays text", "Make it reusable", "Add basic styling"],
  ${analogyRequested ? '"analogy": "Building this component is like creating a welcome sign for your store - it greets users and sets the first impression."' : ''}
}

Now generate the response for this challenge:`;
  }

  /**
   * Build prompt for Phase 2: Prerequisites
   */
  buildPrerequisitesPrompt() {
    const { title, description, domain, language } = this.challengeSpec;
    
    return `You are a coding teacher. Analyze this coding challenge and identify ONLY the constructs that are ACTUALLY needed to solve it.

Challenge: ${title}
Domain: ${domain}
Language: ${language || 'not specified'}
Description: ${description}

CRITICAL: Be EXTREMELY selective. Only include constructs that are:
- Explicitly used in the solution
- Essential for understanding the challenge
- NOT just "nice to have" or "always used"

Examples:
- "Hello World" React component → Only: "Components", "JSX" (that's it! No arrays, loops, objects, hash maps)
- "Todo List" → Needs: "Arrays", "Functions", "State" (if React)
- "API endpoint" → Needs: "Functions", "Objects" (for JSON)
- "Counter" → Needs: "Variables", "Functions", "State" (if React)
- "Simple button click" → Needs: "Components", "Functions", "Events"

DO NOT include:
- Constructs that are "always used" but not specific to this challenge
- Over-general prerequisites (e.g., "Variables" for every challenge - it's assumed)
- Constructs that are implicit/assumed
- Constructs not actually used in the solution

For a "Hello World" component:
- It's just rendering text - doesn't need Arrays, Loops, Hash maps, Objects, Variables
- It's a simple component - might need Components, JSX, Functions (if functional component)

Generate ONLY the constructs that are SPECIFICALLY needed for THIS challenge. Be strict!

Format your response as JSON:
{
  "prerequisites": ["construct 1", "construct 2", ...]
}

Maximum 3-4 constructs for simple challenges. For "Hello World" type challenges, 1-2 constructs max!`;
  }

  /**
   * Build prompt for Phase 3: Core Insight
   */
  buildCoreInsightPrompt() {
    const { title, description, domain, language } = this.challengeSpec;
    
    return `You are a coding teacher. Generate ONE sentence describing the core solution idea.

Challenge: ${title}
Domain: ${domain}
Language: ${language || 'not specified'}
Description: ${description}

Generate a single, clear sentence that describes the core approach to solving this challenge.

Constraints:
- ONE sentence only
- Focus on the core idea/approach
- NO pedagogy explanation
- NO phase names
- Be specific and actionable

Format your response as JSON:
{
  "coreInsight": "one sentence core solution idea"
}`;
  }

  /**
   * Build prompt for Phase 4: Syntax Decomposition
   */
  buildSyntaxDecompositionPrompt(constructName) {
    const { title, domain, language } = this.challengeSpec;
    
    return `You are a coding teacher. Generate syntax teaching content for a specific construct.

Challenge: ${title}
Domain: ${domain}
Language: ${language || 'not specified'}
Construct to teach: ${constructName}

Generate:
1. Syntax example (minimal, language-appropriate)
2. Brief explanation of what it does
3. Micro example (small, concrete example)

Constraints:
- Minimal syntax only
- Language-appropriate
- NO commentary beyond explanation
- NO pedagogy labels
- Focus on the construct only

Format your response as JSON:
{
  "syntax": "syntax example",
  "explanation": "what it does",
  "microExample": "small concrete example"
}`;
  }

  /**
   * Build prompt for Phase 5: Full Application
   */
  buildFullApplicationPrompt() {
    const { title, description, domain, language } = this.challengeSpec;
    
    return `You are a coding teacher. Generate a complete working solution.

Challenge: ${title}
Domain: ${domain}
Language: ${language || 'not specified'}
Description: ${description}

Generate a complete, working solution in the specified language.

Constraints:
- Complete working code
- Language-appropriate
- Production-ready style
- NO pedagogy explanation
- NO phase names
- Include comments for clarity

Format your response as JSON:
{
  "fullSolution": "complete working code here"
}`;
  }

  /**
   * Build prompt for Phase 6: Verification
   */
  buildVerificationPrompt() {
    const { title, description, domain, language } = this.challengeSpec;
    
    return `You are a coding teacher. Generate verification questions.

Challenge: ${title}
Domain: ${domain}
Language: ${language || 'not specified'}
Description: ${description}

Generate 3-7 questions that test understanding. Mix:
- Prediction questions (what happens if...)
- Reasoning questions (why does...)
- Application questions (how would you...)

Constraints:
- 3-7 questions
- Mix of types
- Each question should have a clear expected answer
- NO pedagogy explanation
- NO phase names

Format your response as JSON:
{
  "questions": [
    {
      "type": "prediction|reasoning|application",
      "question": "question text",
      "answer": "expected answer",
      "points": 10
    },
    ...
  ]
}`;
  }

  /**
   * Build prompt for Phase 7: Connection & Transition
   */
  buildConnectionPrompt() {
    const { title, domain, language } = this.challengeSpec;
    
    return `You are a coding teacher. Generate a connection summary and next concept suggestion.

Challenge: ${title}
Domain: ${domain}
Language: ${language || 'not specified'}

Generate:
1. Summary of what was learned (2-3 sentences)
2. Next applicable concept or extension

Constraints:
- 2-3 sentence summary
- Suggest logical next concept
- NO pedagogy explanation
- NO phase names

Format your response as JSON:
{
  "summary": "2-3 sentence summary",
  "nextConcept": "next concept or extension"
}`;
  }

  /**
   * Extract problem statement from AI response
   */
  extractProblemStatement(response) {
    try {
      // Clean response - remove markdown code blocks if present
      let cleanedResponse = response.trim();
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/```\n?/g, '');
      }
      
      const parsed = typeof cleanedResponse === 'string' ? JSON.parse(cleanedResponse) : cleanedResponse;
      const problemStatement = parsed.problemStatement || [];
      
      // Ensure it's an array and clean up any numbered prefixes
      return problemStatement.map(item => {
        // Remove numbered prefixes like "1. ", "1) ", etc.
        return item.replace(/^\d+[\.\)]\s*/, '').trim();
      });
    } catch (e) {
      console.error('Error parsing problem statement:', e);
      console.error('Response was:', response);
      return ['Problem statement parsing error'];
    }
  }

  /**
   * Extract analogy from AI response
   */
  extractAnalogy(response) {
    try {
      // Clean response - remove markdown code blocks if present
      let cleanedResponse = response.trim();
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/```\n?/g, '');
      }
      
      const parsed = typeof cleanedResponse === 'string' ? JSON.parse(cleanedResponse) : cleanedResponse;
      return parsed.analogy || null;
    } catch (e) {
      console.error('Error parsing analogy:', e);
      console.error('Response was:', response);
      return null;
    }
  }

  /**
   * Extract prerequisites from AI response
   */
  extractPrerequisites(response) {
    try {
      const parsed = typeof response === 'string' ? JSON.parse(response) : response;
      return parsed.prerequisites || [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Extract core insight from AI response
   */
  extractCoreInsight(response) {
    try {
      const parsed = typeof response === 'string' ? JSON.parse(response) : response;
      return parsed.coreInsight || '';
    } catch (e) {
      return 'Core insight parsing error';
    }
  }

  /**
   * Extract syntax unit from AI response
   */
  extractSyntaxUnit(response) {
    try {
      const parsed = typeof response === 'string' ? JSON.parse(response) : response;
      return {
        syntax: parsed.syntax || '',
        explanation: parsed.explanation || '',
        microExample: parsed.microExample || '',
      };
    } catch (e) {
      return {
        syntax: '',
        explanation: 'Syntax unit parsing error',
        microExample: '',
      };
    }
  }

  /**
   * Extract full solution from AI response
   */
  extractFullSolution(response) {
    try {
      const parsed = typeof response === 'string' ? JSON.parse(response) : response;
      return parsed.fullSolution || '';
    } catch (e) {
      return '// Full solution parsing error';
    }
  }

  /**
   * Extract questions from AI response
   */
  extractQuestions(response) {
    try {
      const parsed = typeof response === 'string' ? JSON.parse(response) : response;
      return parsed.questions || [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Extract summary from AI response
   */
  extractSummary(response) {
    try {
      const parsed = typeof response === 'string' ? JSON.parse(response) : response;
      return parsed.summary || '';
    } catch (e) {
      return 'Summary parsing error';
    }
  }

  /**
   * Extract next concept from AI response
   */
  extractNextConcept(response) {
    try {
      const parsed = typeof response === 'string' ? JSON.parse(response) : response;
      return parsed.nextConcept || '';
    } catch (e) {
      return '';
    }
  }
}

export default ContentAdapter;

