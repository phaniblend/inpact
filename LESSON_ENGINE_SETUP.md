# Lesson Engine - Quick Setup Guide

## ✅ What's Been Built

A complete, production-grade lesson engine that follows strict pedagogy:

1. **Backend Components:**
   - `LessonController.js` - Finite State Machine for phase management
   - `ContentAdapter.js` - AI prompt building and content generation
   - `LessonEngine.js` - Main orchestrator
   - `aiService.js` - OpenAI API integration (with fallback to mocks)
   - `challengeSpecService.js` - Challenge loading and transformation
   - API endpoints in `lessonEngine.controller.js` and `lessonEngine.routes.js`

2. **Frontend Components:**
   - `useLessonEngine.js` - React hook for lesson engine
   - `LessonEngineView.jsx` - Main UI component
   - Route added to `App.jsx`

3. **Documentation:**
   - `docs/LESSON_ENGINE.md` - Complete documentation

## 🚀 Quick Start

### 1. Set Up OpenAI API Key (Optional)

Add to `backend/.env`:
```env
OPENAI_API_KEY=your_api_key_here
```

**Note:** If not configured, the engine uses mock responses for development.

### 2. Start Backend

```bash
cd backend
npm install  # if needed
npm run dev
```

### 3. Start Frontend

```bash
cd frontend
npm install  # if needed
npm run dev
```

### 4. Access Lesson Engine

Navigate to: `http://localhost:5173/lesson-engine/two-sum`

Replace `two-sum` with any challenge ID from your `algo/` directory.

## 📋 How It Works

### Pedagogy Flow (Internal)

1. **Context Setting** - Problem statement + optional analogy
2. **Prerequisites** - List constructs, learner selects gaps
3. **Core Insight** - One-sentence solution idea
4. **Syntax Decomposition** - Teach constructs one-by-one
5. **Full Application** - Complete solution walkthrough
6. **Verification** - 3-7 questions, score-based decision
7. **Connection** - Summary + next concept

### Key Features

- ✅ **Deterministic flow** - Pedagogy controls flow, AI controls content
- ✅ **Recursive drill-down** - Missing prerequisites trigger teaching
- ✅ **Resume after branching** - Lesson continues exactly where paused
- ✅ **Language-agnostic** - Works for any domain/language
- ✅ **No hardcoded content** - All content generated via AI
- ✅ **Learner-friendly** - No pedagogy jargon shown to users

## 🔧 API Usage

### Initialize Lesson
```javascript
POST /api/lesson-engine/init
Body: { "challengeId": "two-sum" }
```

### Process Response
```javascript
POST /api/lesson-engine/respond
Body: {
  "state": { ... },
  "response": { "type": "choice", "value": "understand" }
}
```

### Get Content
```javascript
POST /api/lesson-engine/content
Body: { "state": { ... } }
```

### Complete Drill-Down
```javascript
POST /api/lesson-engine/complete-drill-down
Body: { "state": { ... }, "constructName": "arrays" }
```

## 🎨 Frontend Usage

### Using the Hook

```jsx
import { useLessonEngine } from '../hooks/useLessonEngine';

function MyComponent() {
  const { state, content, initLesson, processResponse } = useLessonEngine();
  
  useEffect(() => {
    initLesson('two-sum');
  }, []);
  
  return (
    <div>
      {content?.displayText}
      {content?.choices?.map(choice => (
        <button onClick={() => processResponse(choice.value)}>
          {choice.label}
        </button>
      ))}
    </div>
  );
}
```

### Using the Component

The `LessonEngineView` component is already set up and can be accessed via:
- Route: `/lesson-engine/:challengeId`
- Example: `/lesson-engine/two-sum`

## 📝 Challenge Spec Format

Challenges are automatically loaded from JSON files in `algo/` directory.

The engine transforms them to `ChallengeSpec` format:
- Extracts constructs from `curriculum.assumesAlreadyTaught`
- Extracts constructs from `curriculum.introduces`
- Builds dependency graph (can be enhanced)

## 🐛 Troubleshooting

### AI Not Working?
- Check `OPENAI_API_KEY` in `backend/.env`
- Engine falls back to mock responses if key missing
- Check browser console for errors

### Challenge Not Found?
- Ensure challenge JSON exists in `algo/` directory
- Check challenge ID matches filename (without `.json`)
- Engine uses default spec if challenge not found

### State Issues?
- State is managed client-side (can be persisted to backend)
- Check browser console for state errors
- Ensure state is passed correctly between API calls

## 🔮 Future Enhancements

- [ ] Database persistence for lesson state
- [ ] Advanced answer evaluation (fuzzy matching)
- [ ] Analytics and progress tracking
- [ ] Custom construct dependency graphs
- [ ] Multi-language UI support
- [ ] Support for multiple AI providers

## 📚 Documentation

See `docs/LESSON_ENGINE.md` for complete documentation.

## ✨ Key Design Decisions

1. **Pedagogy is internal** - Learners never see phase names
2. **AI generates content** - No hardcoded challenge content
3. **Recursion is real** - Drill-downs can go multiple levels deep
4. **State is stateless** - Each API call includes full state (can be optimized)
5. **Language-agnostic** - Works for any domain/language combination

---

**Built with ❤️ following strict pedagogy principles**

