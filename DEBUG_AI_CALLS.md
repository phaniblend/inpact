# Debugging AI Calls

## Logging Added

I've added console logging to capture:
1. **The exact prompt** sent to OpenAI
2. **The exact response** received from OpenAI

## How to See the Logs

1. Check your backend terminal/console
2. When you trigger the lesson engine, you'll see:

```
=== AI PROMPT ===
[The full prompt sent to OpenAI]
================

=== AI RESPONSE ===
[The raw response from OpenAI]
==================
```

## What to Look For

### In the Prompt:
- Is the challenge description clear?
- Are the constraints explicit?
- Is the format example helpful?

### In the Response:
- Is it valid JSON?
- Does it have markdown code blocks? (we now strip these)
- Are the problemStatement items numbered? (we now remove numbers)
- Is the analogy a single string?

## Current Improvements

1. ✅ **Better prompt** - More explicit about format
2. ✅ **Response cleaning** - Removes markdown code blocks
3. ✅ **Number removal** - Strips "1. ", "2. " prefixes from items
4. ✅ **Logging** - See exactly what's sent/received

## Next Steps

1. Restart the backend server
2. Test the lesson engine again
3. Check the console logs
4. Share the logs if you want further improvements

---

**The logs will help us refine the prompts further!**

