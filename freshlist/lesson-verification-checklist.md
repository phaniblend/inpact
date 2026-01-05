# INPACT Lesson Quality Verification Checklist (v1.0)

Use this checklist to verify any algorithm lesson meets our teaching standards.

---

## ✅ METADATA COMPLIANCE

- [ ] `id` is in kebab-case
- [ ] `title` is human-readable
- [ ] `pattern` clearly names the algorithmic technique
- [ ] `difficulty` is one of: easy, medium, hard
- [ ] `language` is specified (e.g., "javascript")
- [ ] `status` is set to "PERFECT" only if all criteria pass
- [ ] `standardsVersion` is "lessonStandards.v1"
- [ ] `curriculum.lessonNumber` is correct sequential number
- [ ] `curriculum.tier` is one of: FOUNDATION, INTERMEDIATE, ADVANCED
- [ ] `curriculum.lessonOrderTag` follows format: FOUNDATION-XX, INTERMEDIATE-XX, or ADVANCED-XX
- [ ] `curriculum.introduces` lists ALL new concepts taught in this lesson
- [ ] `curriculum.assumesAlreadyTaught` lists ALL prerequisites
- [ ] No concept appears in BOTH introduces and assumesAlreadyTaught
- [ ] `curriculum.prerequisiteCheckRequired` is true ONLY for Lesson 1
- [ ] `curriculum.nextRecommended` suggests logical next lesson(s)

---

## ✅ PHASE 0: PREREQUISITES CHECK (Lesson 1 Only)

- [ ] Step 0 exists and is titled "prerequisite-check"
- [ ] Lists the selected language by name
- [ ] Lists ALL JavaScript constructs needed:
  - [ ] Variables (let, const) if used
  - [ ] Arrays if used
  - [ ] Loops if used
  - [ ] Functions and parameters if used
  - [ ] Objects if used
  - [ ] Return statements if used
  - [ ] Any other constructs (recursion, etc.)
- [ ] Offers binary choice: "Yes, I'm comfortable" or "No, please explain"
- [ ] Does NOT use outdated constructs (e.g., `var`)
- [ ] "No, please explain" branches to explanation steps
- [ ] Explanation steps cover each concept thoroughly
- [ ] Explanation steps eventually converge to problem statement

**For Lessons 2+:**
- [ ] NO prerequisite check step exists
- [ ] Assumes all concepts from previous lessons

---

## ✅ PHASE 1: PROBLEM UNDERSTANDING

### Step: Problem Statement
- [ ] Written in plain English (no jargon without explanation)
- [ ] Includes ONE concrete example with input and output
- [ ] States explicit constraints/rules
- [ ] Does NOT hint at the solution approach yet
- [ ] Example uses small, friendly numbers (not abstract symbols)
- [ ] Explains what "in place" means if applicable
- [ ] Explains any domain-specific terms

### Step: Tiny Examples
- [ ] Contains 2-4 examples
- [ ] Each example uses 3-5 elements maximum
- [ ] Examples are easy to mentally simulate
- [ ] Examples cover different cases (found, not found, edge cases)
- [ ] Format is consistent and clear

### Step: Thinking Challenge
- [ ] Presents 2-3 strategic approach options
- [ ] Forces learner to choose before teaching
- [ ] All choices are pedagogically valid (no trick options)
- [ ] Choices are labeled clearly
- [ ] Uses `choices` array with `label` and `next` fields
- [ ] All choice paths eventually converge to learning

---

## ✅ PHASE 2: BRUTE FORCE UNDERSTANDING (If Applicable)

### Step: Understanding Brute Force / Why Not [Naive Approach]
- [ ] Uses TINY examples (3-5 elements maximum)
- [ ] Shows step-by-step execution with explicit actions
- [ ] Uses clear format showing each action and result
- [ ] Demonstrates the approach works
- [ ] Explains WHY it's limited (concrete numbers, not Big-O)
- [ ] Uses phrases like "slow", "repeated work", "many checks"
- [ ] Ends with "Can we do better?" motivation
- [ ] Does NOT assume learner knows what "brute force" means

---

## ✅ PHASE 3: KEY INSIGHT

### Step: Core Idea / Key Insight
- [ ] Reframes the problem (what are we REALLY looking for?)
- [ ] Uses concrete example to show the pattern
- [ ] NO code yet, pure logic
- [ ] Uses accessible language
- [ ] Introduces the "aha" moment
- [ ] May include a formula or relationship

### Step: Introducing the Technique
- [ ] Names the technique explicitly (e.g., "two pointers", "hash map", "binary search")
- [ ] Explains what it IS (simple definition)
- [ ] Explains WHY it's powerful (concrete benefit)
- [ ] Uses visual/spatial metaphors when appropriate
- [ ] Does NOT assume learner knows the technique
- [ ] Explains any new data structures being introduced

---

## ✅ PHASE 4: STRATEGY WALKTHROUGH

### Step: Strategy Walkthrough / Walkthrough
- [ ] Uses same tiny example from earlier (for comparison)
- [ ] Shows step-by-step execution of optimal approach
- [ ] Explicitly shows state changes at each step
- [ ] Uses consistent format with clear labels (Start, Next, Now)
- [ ] Shows pointer positions, variable values, or data structure state
- [ ] Highlights when/why it's faster than brute force
- [ ] NO code syntax yet - still conceptual
- [ ] Each step is numbered or clearly delineated

---

## ✅ PHASE 5: PSEUDOCODE

### Step: Pseudocode
- [ ] Step exists and is clearly titled "Pseudocode (Logic Plan)"
- [ ] Each line is numbered with unique id (ps1, ps2, etc.)
- [ ] Uses plain language, NOT programming syntax
- [ ] Covers the ENTIRE algorithm from start to finish
- [ ] States that this maps to actual code
- [ ] Stored in `pseudocode` array in JSON
- [ ] Each pseudocode item has `id` and `text` fields
- [ ] Pseudocode is at appropriate level of detail
- [ ] Indentation shows nested logic clearly

---

## ✅ PHASE 6: CODING (STEPWISE CONSTRUCTION)

### General Coding Phase Rules
- [ ] ONE concept per step
- [ ] Each step references pseudocode line numbers via `pseudocodeLineIds`
- [ ] Shows incremental code growth (not full dumps)
- [ ] Every new line of code is explained
- [ ] Uses `example` field to show code snippets
- [ ] Step titles follow format: "Step N: [what we're adding]"
- [ ] No step introduces more than 3-5 lines of new code

### Coding Progression Order
- [ ] Step 1: Function signature / Create the function
- [ ] Step 2: Setup (variables, data structures, pointers)
- [ ] Step 3: Main loop/iteration structure
- [ ] Step 4+: Core logic inside loop (one piece at a time)
- [ ] Later steps: Edge cases/returns if applicable
- [ ] Final step: Complete solution shown

### Code Explanation Quality
- [ ] Every new construct is explained
- [ ] Example values shown where helpful
- [ ] No jargon without definition
- [ ] Explains WHY, not just WHAT
- [ ] Uses comments in code examples sparingly (explanation is in prose)
- [ ] Variable names are clear and descriptive

### Specific Constructs (When Used)
- [ ] Operators explained: `===`, `!==`, `<`, `>`, `<=`, `>=`, `%`, `++`, `--`
- [ ] Methods explained: `Math.floor()`, `.length`, `.push()`, `.pop()`, etc.
- [ ] Loops explained: `for`, `while`, loop conditions
- [ ] Data structures explained: objects as maps, arrays, sets
- [ ] Helper functions explained when introduced

---

## ✅ PHASE 7: COMPLETION

### Step: Final Code
- [ ] Shows complete, clean solution
- [ ] All code is properly formatted
- [ ] Brief summary of how it works (3-5 bullets)
- [ ] Comparison to brute force (why it's better)
- [ ] No new concepts introduced here
- [ ] Code is identical to the incremental build

### Step: Wrap-Up
- [ ] Lists 3-5 key takeaways under "What you learned"
- [ ] Names the pattern explicitly
- [ ] States where this pattern appears in future
- [ ] Provides motivation for practice
- [ ] `action` is set to "complete"
- [ ] Suggests next recommended lesson
- [ ] Keeps tone encouraging but not patronizing

---

## ✅ TONE & LANGUAGE

- [ ] Uses "we" language (collaborative)
- [ ] Never uses "you should know this"
- [ ] Never uses condescending phrases
- [ ] Never uses emotional language ("don't worry", "easy", emojis)
- [ ] Never uses outdated syntax (var, etc.)
- [ ] Explains every construct the first time it appears
- [ ] Uses tiny examples throughout (3-5 elements max)
- [ ] Explicit about state changes
- [ ] References pseudocode line numbers in coding steps
- [ ] Maintains calm, instructive, professional mentor tone
- [ ] No apologies ("sorry", "unfortunately")

---

## ✅ JSON STRUCTURE

- [ ] Valid JSON (no syntax errors)
- [ ] All `stepId` values are unique
- [ ] All `next` references point to valid stepIds
- [ ] `action` field is either "next", "complete", or omitted
- [ ] `choices` array exists only for thinking challenge steps
- [ ] Each choice has `label` and `next` fields
- [ ] `pseudocodeLineIds` arrays contain valid pseudocode IDs
- [ ] No broken references
- [ ] No circular flow (except intentional loops back to explanations)
- [ ] `mentorSays` field exists in every step
- [ ] `example` field used appropriately for code snippets

---

## ✅ CURRICULUM INTEGRATION

- [ ] `introduces` concepts are actually introduced (not assumed)
- [ ] `assumesAlreadyTaught` concepts are never re-explained
- [ ] Lesson builds on previous lessons logically
- [ ] No circular dependencies in curriculum
- [ ] Lesson number matches position in curriculum
- [ ] `nextRecommended` points to logical progression
- [ ] All assumed concepts were taught in earlier lessons

---

## ✅ EXAMPLES & WALKTHROUGHS

- [ ] All examples use 3-5 elements maximum
- [ ] Numbers are small and friendly (1-20 range typically)
- [ ] No abstract symbols unless necessary
- [ ] State changes are shown explicitly
- [ ] Format is consistent across all examples
- [ ] Examples are different from each other (cover different cases)

---

## ✅ SPECIAL PATTERNS

### For Two-Pointer Problems:
- [ ] Pointer positions shown explicitly in walkthrough
- [ ] Movement direction explained
- [ ] Stop condition explained

### For Binary Search Problems:
- [ ] Mid calculation shown
- [ ] Left/right adjustment explained
- [ ] Search space reduction highlighted

### For Hash Map Problems:
- [ ] Hash map state shown at each step
- [ ] Key-value pairs explained
- [ ] Lookup vs insertion differentiated

### For Slow-Fast Pointer Problems:
- [ ] Slow and fast positions shown
- [ ] When each pointer moves explained
- [ ] What gets copied/modified explained

---

## 🎯 VERIFICATION COMMAND

To verify a lesson using ChatGPT/Cursor/Claude, use this prompt:

```
I have an INPACT algorithm lesson JSON file. Please verify it against the 
INPACT Lesson Quality Verification Checklist (v1.0). 

For each major section, report:
✅ PASS - All criteria met
⚠️  PARTIAL - Some criteria met (list what's missing)
❌ FAIL - Criteria not met (list specific issues)

Provide specific stepId references and line numbers for any issues.

After verification, provide an overall score and recommendation.

Here's the lesson:
[paste JSON]
```

---

## 📊 SCORING RUBRIC

**Count all applicable checkboxes, then calculate:**

- **PERFECT (100%)**: All checkboxes pass → Status: PERFECT ✓
- **EXCELLENT (95-99%)**: 1-2 minor issues → Status: GOOD (fix minor issues)
- **GOOD (90-94%)**: 3-5 minor issues → Status: NEEDS MINOR REVISION
- **NEEDS WORK (75-89%)**: Multiple issues → Status: NEEDS REVISION
- **INSUFFICIENT (<75%)**: Major issues → Status: NEEDS MAJOR REVISION

**Only mark lesson status as "PERFECT" if score is 100%.**

---

## 🔍 COMMON ISSUES CHECKLIST

Quick scan for frequent problems:

- [ ] Does lesson 2+ have prerequisite check? (Should NOT)
- [ ] Are examples larger than 5 elements? (Should be 3-5)
- [ ] Is Big-O notation used before being taught? (Should use "slow", "fast")
- [ ] Are there code dumps without stepwise construction? (Should be incremental)
- [ ] Is `var` used anywhere? (Should only use `let` and `const`)
- [ ] Are there broken `next` references? (All must point to valid stepIds)
- [ ] Is pseudocode missing `id` fields? (All need unique IDs)
- [ ] Are `pseudocodeLineIds` missing from coding steps? (All need them)
- [ ] Does wrap-up introduce new concepts? (Should only summarize)
- [ ] Is tone overly friendly/emotional? (Should be neutral mentor)

---

## 📝 REVIEWER NOTES TEMPLATE

When reviewing a lesson, fill this out:

```
Lesson: [ID and Title]
Reviewer: [Name]
Date: [Date]

Overall Score: ___/100 (___%)
Recommendation: PERFECT / GOOD / NEEDS REVISION

Issues Found:
- [ ] [Description of issue - stepId reference]
- [ ] [Description of issue - stepId reference]

Strengths:
- [What this lesson does particularly well]

Next Actions:
- [What needs to be fixed]
```

---

**End of Verification Checklist**

Version: 1.0  
Last Updated: December 31, 2025  
Maintained by: INPACT Curriculum Team
