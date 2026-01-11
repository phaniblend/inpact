# Lesson Engine Testing Guide

## 🚀 Quick Test

### 1. Start Servers

**Backend:**
```bash
cd backend
npm run dev
```
Server should start on `http://localhost:3001`

**Frontend:**
```bash
cd frontend
npm run dev
```
Server should start on `http://localhost:5173`

### 2. Test Any Challenge

Navigate to: `http://localhost:5173/lesson-engine/{challenge-id}`

**Available Challenges (from `algo/` directory):**
- `two-sum` - Two Sum problem
- `binary-search` - Binary Search
- `reverse-string` - Reverse String
- `valid-anagram` - Valid Anagram
- `contains-duplicate` - Contains Duplicate
- `group-anagrams` - Group Anagrams
- `top-k-frequent-elements` - Top K Frequent Elements
- `three-sum` - Three Sum
- `reverse-linked-list` - Reverse Linked List
- `merge-two-sorted-lists` - Merge Two Sorted Lists
- ... and many more!

**Example URLs:**
- `http://localhost:5173/lesson-engine/two-sum`
- `http://localhost:5173/lesson-engine/binary-search`
- `http://localhost:5173/lesson-engine/reverse-string`

### 3. AI API Key (Optional)

**Without API Key:**
- Engine uses **mock responses** for development
- Fully functional for testing the pedagogy flow
- All phases work correctly

**With API Key:**
1. Create `backend/.env` file:
```env
OPENAI_API_KEY=your_api_key_here
```

2. Restart backend server
3. Engine will use real AI responses

**To get OpenAI API Key:**
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add it to `backend/.env`

## 🧪 Testing the Pedagogy Flow

### Phase 1: Context Setting
- ✅ Problem statement appears
- ✅ Choice: "I understand" or "Show analogy"
- ✅ If analogy requested, shows real-world example

### Phase 2: Prerequisites
- ✅ Lists constructs needed
- ✅ Choice: "All good" or "I need help"
- ✅ If gaps selected, triggers drill-down

### Phase 3: Core Insight
- ✅ One-sentence solution idea
- ✅ Asks for confirmation

### Phase 4: Syntax Decomposition
- ✅ Teaches constructs one-by-one
- ✅ Shows syntax, explanation, example
- ✅ Verifies understanding after each

### Phase 5: Full Application
- ✅ Complete solution code
- ✅ Step-by-step walkthrough

### Phase 6: Verification
- ✅ 3-7 questions (prediction, reasoning, application)
- ✅ Text input for answers
- ✅ Score calculation
- ✅ Decision based on score:
  - <70% → restart from Phase 3
  - 70-90% → brief review
  - >90% → proceed

### Phase 7: Connection & Transition
- ✅ Summary of learning
- ✅ Next concept suggestion
- ✅ Lesson complete

## 🔍 Testing Recursive Drill-Down

1. Start a lesson (e.g., `two-sum`)
2. In Prerequisites phase, select "I need help"
3. Select one or more constructs (e.g., "arrays", "hash-map")
4. Engine should:
   - Show construct teaching content
   - If construct has prerequisites, check those first
   - Teach from bottom-up
   - Resume original lesson after drill-down

## 🐛 Troubleshooting

### Challenge Not Found
- Check challenge ID matches filename in `algo/` directory
- Example: `two-sum.json` → use `two-sum` as ID
- Check browser console for errors

### API Errors
- Without API key: Uses mock responses (this is fine!)
- With API key: Check `backend/.env` file
- Check backend console for API errors

### State Issues
- Check browser console for state errors
- Ensure state is passed correctly in API calls
- Try refreshing the page

### Frontend Not Loading
- Check if frontend server is running on port 5173
- Check browser console for errors
- Verify route is correct: `/lesson-engine/:challengeId`

## 📊 Expected Behavior

### Without API Key (Mock Mode)
- All phases work
- Content is generic but functional
- Perfect for testing pedagogy flow
- No API costs

### With API Key (Real AI)
- Content is challenge-specific
- More accurate and detailed
- Uses OpenAI API (costs apply)
- Better learning experience

## ✅ Success Criteria

1. ✅ Lesson initializes correctly
2. ✅ All 7 phases work in sequence
3. ✅ Prerequisites drill-down works
4. ✅ Verification scoring works
5. ✅ State persists between phases
6. ✅ Can test any challenge from `algo/` directory
7. ✅ Works with or without API key

## 🎯 Next Steps

1. Test with multiple challenges
2. Test recursive drill-down scenarios
3. Test verification scoring edge cases
4. Add API key for real AI responses
5. Customize constructs and dependencies

---

**Happy Testing! 🚀**

