# Prompt Improvements for Context Setting

## Current Issue

When user selects "Show a real-world analogy", the AI is returning:
- Numbered instructions (1, 2, 3, 4) instead of bullet points
- Instructions that look like steps rather than problem description

## Current Prompt

```
You are a coding teacher. Generate a concise problem statement for a coding challenge.

Challenge: {title}
Domain: {domain}
Language: {language}
Description: {description}

Also provide a real-world analogy that connects to the problem.

Constraints:
- Output ONLY the problem statement (1-4 bullet points)
- Include a real-world analogy (2-3 sentences)
- NO pedagogy explanation
- NO phase names
- Coding-focused only
- Be concise

Format your response as JSON:
{
  "problemStatement": ["bullet 1", "bullet 2", ...],
  "analogy": "real-world analogy text",
}
```

## Improved Prompt

The prompt has been updated to:
1. ✅ Explicitly state "array of strings" for problemStatement
2. ✅ Clarify "NOT numbered steps" - use bullet points
3. ✅ Add example format
4. ✅ Emphasize "actionable instruction" not "steps"
5. ✅ Better JSON format guidance

## What Changed

### Before:
- Vague "1-4 bullet points"
- No example
- Could be interpreted as numbered steps

### After:
- Explicit "array of strings"
- Example provided
- Clear: "NOT numbered steps"
- Emphasizes "actionable instruction"

## Testing

After restarting the server, check the console logs to see:
1. The exact prompt sent to OpenAI
2. The exact response received

This will help us further refine if needed.

## Next Steps

1. Test with the improved prompt
2. Check console logs for actual prompt/response
3. Adjust based on results

