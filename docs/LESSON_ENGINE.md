# Lesson Engine Documentation

## Overview

The Lesson Engine is a production-grade, reusable system for teaching coding challenges using a **strict, deterministic pedagogy** combined with **live AI calls** for challenge-specific content.

## Core Design Principles

1. **Pedagogy controls FLOW. AI controls CONTENT.**
2. **Language- and domain-agnostic** - works for any coding domain or language
3. **No construct is taught unless prerequisites are verified**
4. **Missing knowledge triggers recursive drill-down**
5. **Teaching always proceeds bottom-up**
6. **After branching, lesson resumes EXACTLY where it paused**
7. **Learner-facing UI NEVER shows phase names or pedagogy jargon**

## Architecture

### Components

1. **LessonController** (`backend/src/services/lessonEngine/LessonController.js`)
   - Finite State Machine managing lesson phases
   - Handles recursion stack for drill-downs
   - Manages pause/resume mechanics

2. **ContentAdapter** (`backend/src/services/lessonEngine/ContentAdapter.js`)
   - Builds AI prompts based on phase and challenge spec
   - Calls AI API with strict constraints
   - Returns structured content only

3. **LessonEngine** (`backend/src/services/lessonEngine/LessonEngine.js`)
   - Main orchestrator
   - Coordinates controller and content adapter
   - Formats content for learner display

4. **AI Service** (`backend/src/services/lessonEngine/aiService.js`)
   - Abstracts AI provider (OpenAI, Anthropic, etc.)
   - Handles API calls and error handling
   - Falls back to mock responses if API key not configured

### Data Models

- **ChallengeSpec**: Challenge metadata (id, title, domain, language, constructs)
- **Construct**: Programming construct with prerequisites
- **LessonState**: Current lesson state (phase, recursion stack, responses, score)

## Pedagogy Flow (Internal Only)

The engine follows these phases internally (NOT visible to learner):

### Phase 1: Context Setting
- Generate problem statement (1-4 bullets)
- Ask learner preference: understand or show analogy
- Show analogy if requested
- Confirm readiness

### Phase 2: Prerequisites (Awareness + Selection)
- Generate prerequisite list
- Display numbered list
- Ask learner to select gaps
- Trigger recursive drill-down for selected constructs

### Phase 3: Core Insight
- Generate one-sentence core solution idea
- Ask for confirmation

### Phase 4: Syntax Decomposition
- Teach ONE construct at a time
- Show syntax, explanation, micro example
- Verify understanding after each

### Phase 5: Full Application
- Generate complete working solution
- Walk through execution
- Confirm understanding

### Phase 6: Verification (Mandatory)
- Generate 3-7 questions (prediction, reasoning, application)
- Score responses
- Decision:
  - <70% → restart from Phase 3
  - 70-90% → brief review, continue
  - >90% → proceed

### Phase 7: Connection & Transition
- Summarize learning (2-3 sentences)
- Indicate next concept
- Ask readiness to continue

## Recursive Drill-Down Rule

At ANY knowledge check:

1. If learner is not confident in construct C:
   - Identify prerequisites of C
   - Ask learner about confidence in those prerequisites
   - If any prerequisite is unmet:
     - Recursively repeat this process
2. Continue until reaching a base construct (no prerequisites)
3. Teach from the lowest unmet construct upward
4. Verify understanding at EACH level
5. Resume the original lesson EXACTLY where it paused

## API Endpoints

### POST `/api/lesson-engine/init`
Initialize a lesson.

**Request:**
```json
{
  "challengeId": "two-sum"
}
```

**Response:**
```json
{
  "success": true,
  "content": { ... },
  "state": { ... },
  "challengeId": "two-sum"
}
```

### POST `/api/lesson-engine/content`
Get current phase content.

**Request:**
```json
{
  "state": { ... }
}
```

**Response:**
```json
{
  "success": true,
  "content": { ... },
  "state": { ... }
}
```

### POST `/api/lesson-engine/respond`
Process learner response.

**Request:**
```json
{
  "state": { ... },
  "response": {
    "type": "choice",
    "value": "understand",
    "timestamp": 1234567890
  }
}
```

**Response:**
```json
{
  "success": true,
  "content": { ... },
  "state": { ... },
  "complete": false
}
```

### POST `/api/lesson-engine/complete-drill-down`
Complete a drill-down (construct fully taught).

**Request:**
```json
{
  "state": { ... },
  "constructName": "arrays"
}
```

**Response:**
```json
{
  "success": true,
  "content": { ... },
  "state": { ... }
}
```

## Frontend Usage

### Using the Hook

```jsx
import { useLessonEngine } from '../hooks/useLessonEngine';

function MyComponent() {
  const {
    state,
    content,
    loading,
    error,
    complete,
    initLesson,
    processResponse,
    completeDrillDown,
  } = useLessonEngine();

  useEffect(() => {
    initLesson('two-sum');
  }, []);

  const handleChoice = (value) => {
    processResponse(value);
  };

  return (
    <div>
      {content && (
        <div>
          <p>{content.displayText}</p>
          {content.choices?.map((choice, i) => (
            <button key={i} onClick={() => handleChoice(choice.value)}>
              {choice.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Using the Component

```jsx
import LessonEngineView from './components/lesson/LessonEngineView';

// In your router:
<Route path="/lesson-engine/:challengeId" element={<LessonEngineView />} />
```

## Configuration

### Environment Variables

Add to `backend/.env`:

```env
OPENAI_API_KEY=your_api_key_here
```

If not configured, the engine will use mock responses for development.

### Challenge Spec Format

Challenges are loaded from JSON files in the `algo/` directory. The engine automatically transforms them to `ChallengeSpec` format.

Example challenge structure:
```json
{
  "id": "two-sum",
  "title": "Two Sum",
  "language": "javascript",
  "curriculum": {
    "assumesAlreadyTaught": ["arrays", "loops", "hash-map"],
    "introduces": ["complement-calculation"]
  }
}
```

## AI Prompt Constraints

When calling AI:
- **Coding-focused only**
- **Language-appropriate**
- **No pedagogy explanation**
- **No phase names**
- **Minimal verbosity**
- **Deterministic structure**
- **Output must fit into predefined slots**

## State Persistence

The lesson state can be persisted and restored. The state includes:
- Current phase
- Recursion stack
- Learner responses
- Verification score
- Phase-specific data

## Error Handling

- AI API errors fall back to mock responses
- Invalid responses return error messages
- State validation ensures consistency
- Frontend displays user-friendly error messages

## Testing

The engine works with or without an OpenAI API key:
- **With API key**: Uses real AI responses
- **Without API key**: Uses mock responses for development

## Future Enhancements

- [ ] Support for multiple AI providers
- [ ] Advanced answer evaluation (fuzzy matching)
- [ ] State persistence to database
- [ ] Analytics and progress tracking
- [ ] Custom construct dependency graphs
- [ ] Multi-language support for UI

## Notes

- Phase names are **NEVER** shown to learners
- All content is generated dynamically via AI
- No hardcoded challenge content
- Recursion is fully supported (not flattened)
- Engine is completely reusable across domains

