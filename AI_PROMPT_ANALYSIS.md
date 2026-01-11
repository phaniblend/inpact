# AI Prompt Analysis - Context Setting with Analogy

## Current Prompt (After Improvements)

When user selects "Show a real-world analogy", this prompt is sent:

```
You are a coding teacher. Generate a concise problem statement for a coding challenge.

Challenge: {title}
Domain: {domain}
Language: {language}
Description: {description}

Also provide a real-world analogy that connects to the problem.

IMPORTANT CONSTRAINTS:
- Output ONLY valid JSON, no markdown, no code blocks
- problemStatement must be an array of strings (each string is one bullet point)
- Each bullet point should be a clear, actionable instruction (NOT numbered steps)
- analogy must be a single string (2-3 sentences connecting the challenge to a real-world scenario)
- NO pedagogy explanation
- NO phase names
- NO numbered steps (use bullet points instead)
- Coding-focused only
- Be concise and clear

Example format:
{
  "problemStatement": ["Create a React component that displays text", "Make it reusable", "Add basic styling"],
  "analogy": "Building this component is like creating a welcome sign for your store - it greets users and sets the first impression."
}

Now generate the response for this challenge:
```

## Expected Response Format

```json
{
  "problemStatement": [
    "Create a functional React component that displays 'Hello, World!' on the screen",
    "Ensure the component is reusable in different parts of the application",
    "Style the component using basic CSS for better visibility",
    "Test the component to confirm it renders correctly without errors"
  ],
  "analogy": "Building a 'Hello, World!' component is like creating a welcome mat for your home. Just as a mat greets guests at the entrance, this component greets users visiting your application. It sets the tone for what they can expect inside."
}
```

## What We Fixed

1. ✅ **Explicit format** - "array of strings" not "bullet points"
2. ✅ **No numbered steps** - Explicitly says "NOT numbered steps"
3. ✅ **Example provided** - Shows exact format expected
4. ✅ **Response cleaning** - Removes markdown code blocks if AI adds them
5. ✅ **Number removal** - Strips "1. ", "2. " prefixes automatically
6. ✅ **Logging** - See exact prompt and response in console

## How to View the Logs

1. **Restart your backend server** (to get the new logging)
2. **Trigger the lesson engine** (select "Show a real-world analogy")
3. **Check backend console** - You'll see:

```
=== AI PROMPT ===
[Full prompt text]
================

=== AI RESPONSE ===
[Raw OpenAI response]
==================
```

## What to Check

### In the Prompt:
- ✅ Challenge description is clear
- ✅ Format example is helpful
- ✅ Constraints are explicit

### In the Response:
- ✅ Is it valid JSON?
- ✅ Are items in problemStatement array?
- ✅ Is analogy a single string?
- ✅ Any markdown code blocks? (we strip these now)

## Next Steps

1. **Restart backend** to get logging
2. **Test again** with "Show a real-world analogy"
3. **Check console logs** for prompt/response
4. **Share logs** if you want further refinements

---

**The improved prompt should give better results! Check the logs to see what's actually happening.**

