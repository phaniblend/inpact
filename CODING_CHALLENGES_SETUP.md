# Lesson Engine for Coding Challenges

## ✅ Updated Configuration

The lesson engine now works with **coding challenges** (NOT algorithms):
- ✅ React challenges (`react/` directory)
- ✅ Node.js challenges (`nodejs/` directory)
- ✅ Python challenges (`python/` directory)
- ✅ Java challenges (`java/` directory)
- ✅ Go challenges (`go/` directory)
- ✅ Swift challenges (`swift/` directory)
- ✅ Angular challenges (`angular/` directory)
- ✅ React TypeScript challenges (`react-typescript/` directory)

**Algorithms** (`algo/` directory) continue using existing lessons - they're already good!

## 🚀 How to Test

### URL Format

**With domain:**
```
http://localhost:5173/lesson-engine/{domain}/{challenge-id}
```

**Without domain (auto-detects):**
```
http://localhost:5173/lesson-engine/{challenge-id}
```

### Examples

**React Challenges:**
- `http://localhost:5173/lesson-engine/react/react-1-hello-world-component`
- `http://localhost:5173/lesson-engine/react/react-2-counter-component`
- `http://localhost:5173/lesson-engine/react/react-18-todo-list-addremove`

**Node.js Challenges:**
- `http://localhost:5173/lesson-engine/nodejs/nodejs-1-nodejs-basics`
- `http://localhost:5173/lesson-engine/nodejs/nodejs-2-express-setup`

**Python Challenges:**
- `http://localhost:5173/lesson-engine/python/python-1-python-basics`

**Java Challenges:**
- `http://localhost:5173/lesson-engine/java/java-1-hello-spring-boot`

## 📋 Challenge File Structure

Coding challenge files have this structure:
```json
{
  "id": "react-1-hello-world-component",
  "title": "Hello World Component",
  "technology": "React",
  "difficulty": "junior",
  "language": "javascript",
  "metadata": {
    "time_estimate": "5-15 min",
    "tests": "Component basics, JSX/template syntax",
    "challenge_number": "1"
  },
  "flow": [ ... ]
}
```

The engine automatically:
- Extracts constructs from `metadata.tests`
- Infers domain from directory or `technology` field
- Extracts description from `flow` steps or `metadata.challenge`
- Generates AI content following the pedagogy

## 🎯 What Changed

1. **Challenge Loading**: Now searches coding challenge directories instead of `algo/`
2. **Domain Support**: Accepts domain parameter (react, nodejs, python, etc.)
3. **Auto-Detection**: If domain not provided, searches all coding challenge directories
4. **Format Handling**: Handles both algo format (with curriculum) and coding challenge format (with metadata)

## 🔍 Finding Challenges

To find available challenges:
1. Check the domain directory (e.g., `react/`, `nodejs/`)
2. Use the filename without `.json` as the challenge ID
3. Example: `react/react-1-hello-world-component.json` → `react-1-hello-world-component`

## ✨ Next Steps

1. Test with a React challenge: `http://localhost:5173/lesson-engine/react/react-1-hello-world-component`
2. Test with a Node.js challenge
3. Test with other domains
4. The engine will generate AI content following the strict pedagogy!

---

**The lesson engine is now configured for coding challenges! 🚀**

