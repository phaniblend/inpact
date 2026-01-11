# Quick Test Instructions

## ✅ You DON'T Need an AI API Key to Test!

The engine works **perfectly without an API key** - it uses mock responses for development. This is ideal for testing the pedagogy flow!

## 🚀 Start Testing Now

### 1. Servers Should Be Starting
- Backend: `http://localhost:3001`
- Frontend: `http://localhost:5173`

### 2. Test Any Challenge

Open in browser: `http://localhost:5173/lesson-engine/{challenge-id}`

**Examples:**
- `http://localhost:5173/lesson-engine/two-sum`
- `http://localhost:5173/lesson-engine/binary-search`
- `http://localhost:5173/lesson-engine/reverse-string`
- `http://localhost:5173/lesson-engine/valid-anagram`

### 3. Available Challenges

Any `.json` file in the `algo/` directory can be tested! Just use the filename without `.json`:

- `two-sum.json` → `/lesson-engine/two-sum`
- `binary-search.json` → `/lesson-engine/binary-search`
- `reverse-string.json` → `/lesson-engine/reverse-string`
- `valid-anagram.json` → `/lesson-engine/valid-anagram`
- `contains-duplicate.json` → `/lesson-engine/contains-duplicate`
- `group-anagrams.json` → `/lesson-engine/group-anagrams`
- `three-sum.json` → `/lesson-engine/three-sum`
- ... and 100+ more!

## 🎯 What to Test

1. **Context Setting** - Problem statement + analogy option
2. **Prerequisites** - Select gaps to trigger drill-down
3. **Core Insight** - One-sentence solution
4. **Syntax Decomposition** - Construct teaching
5. **Full Application** - Complete solution
6. **Verification** - Questions and scoring
7. **Connection** - Summary and next concept

## 🔑 Optional: Add AI API Key

If you want **real AI responses** (not mocks):

1. Get API key from: https://platform.openai.com/api-keys
2. Create `backend/.env`:
```env
OPENAI_API_KEY=sk-your-key-here
```
3. Restart backend server

**But this is optional!** Mock mode works great for testing.

## 🐛 If Something Doesn't Work

1. Check browser console (F12)
2. Check backend terminal for errors
3. Verify challenge ID matches filename in `algo/` directory
4. Try a different challenge (e.g., `two-sum`)

## ✨ Expected Flow

1. **Phase 1**: See problem statement → Choose "understand" or "show analogy"
2. **Phase 2**: See prerequisites list → Choose "all good" or select gaps
3. **Phase 3**: See core insight → Confirm understanding
4. **Phase 4**: See syntax teaching → Learn constructs one-by-one
5. **Phase 5**: See full solution → Confirm understanding
6. **Phase 6**: Answer questions → Get scored
7. **Phase 7**: See summary → Lesson complete!

---

**Ready to test! Open: `http://localhost:5173/lesson-engine/two-sum`** 🚀

