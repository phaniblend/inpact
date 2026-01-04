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
- [ ] `curriculum.lessonOrderTag` follows format: FOUNDATION-XX
- [ ] `curriculum.introduces` lists ALL new concepts taught in this lesson
- [ ] `curriculum.assumesAlreadyTaught` lists ALL prerequisites
- [ ] No concept appears in BOTH introduces and assumesAlreadyTaught

---

## ✅ PHASE 0: PREREQUISITES CHECK

- [ ] Step 0 exists and is titled "Language & Prerequisite Check"
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

---

## ✅ PHASE 1: PROBLEM UNDERSTANDING

### Step 1: Problem Statement
- [ ] Written in plain English (no jargon without explanation)
- [ ] Includes ONE concrete example with input and output
- [ ] States explicit constraints/rules
- [ ] Does NOT hint at the solution approach yet
- [ ] Example uses small, friendly numbers (not abstract symbols)

### Step 2: Thinking Challenge
- [ ] Presents 2-3 strategic approach options
- [ ] Forces learner to choose before teaching
- [ ] All choices are pedagogically valid (no trick options)
- [ ] Choices are labeled clearly (e.g., "1. Check every pair...")

---

## ✅ PHASE 2: BRUTE FORCE UNDERSTANDING

### Step 3: Understanding Brute Force
- [ ] Uses TINY examples (3-5 elements maximum)
- [ ] Shows step-by-step execution with explicit actions
- [ ] Uses format: "Take first element: [action] → result ❌"
- [ ] Demonstrates it works but is limited
- [ ] Explains WHY it's slow (concrete numbers, not Big-O)
- [ ] Ends with "Can we do better?" motivation
- [ ] Does NOT assume learner knows what "brute force" means

---

## ✅ PHASE 3: KEY INSIGHT

### Step 4: The Key Insight
- [ ] Reframes the problem (what are we REALLY looking for?)
- [ ] Uses concrete example to show the pattern
- [ ] NO code yet, pure logic
- [ ] Uses accessible language

### Step 5: Introducing the Technique
- [ ] Names the technique explicitly (e.g., "hash map", "two pointers")
- [ ] Explains what it IS (simple definition)
- [ ] Explains WHY it's powerful (concrete benefit)
- [ ] Uses visual/spatial metaphors when appropriate
- [ ] Does NOT assume learner knows the technique

---

## ✅ PHASE 4: STRATEGY WALKTHROUGH

### Step 6: Strategy Walkthrough
- [ ] Uses same tiny example from brute force (for comparison)
- [ ] Shows step-by-step execution of optimal approach
- [ ] Explicitly shows state changes at each step
- [ ] Uses format:
```
  **Start:** [initial state]
  **Look at position X:**
  - Calculate/check: [action]
  - State after: [updated state]
```
- [ ] Highlights when/why it's faster than brute force
- [ ] NO code syntax yet

---

## ✅ PHASE 5: PSEUDOCODE

### Step 7: Pseudocode
- [ ] Exists and is complete
- [ ] Each line is numbered
- [ ] Uses plain language, NOT programming syntax
- [ ] Covers the ENTIRE algorithm
- [ ] States that this maps to actual code
- [ ] Stored in `pseudocode` array in JSON
- [ ] Each pseudocode item has `id` and `text` fields

---

## ✅ PHASE 6: CODING (STEPWISE CONSTRUCTION)

### General Coding Phase Rules
- [ ] ONE concept per step
- [ ] Each step references pseudocode line numbers
- [ ] Shows incremental code growth (not full dumps)
- [ ] Every new line of code is explained
- [ ] Uses `example` field to show code snippets
- [ ] Each step has `pseudocodeLineIds` field mapping to pseudocode

### Coding Progression Order
- [ ] Step 1: Function signature
- [ ] Step 2: Setup (variables, data structures)
- [ ] Step 3: Main loop/iteration structure
- [ ] Step 4: Core logic inside loop
- [ ] Step 5: Edge cases/returns (if applicable)
- [ ] Final step: Complete solution shown

### Code Explanation Quality
- [ ] Every new construct is explained
- [ ] Example values shown where helpful
- [ ] No jargon without definition
- [ ] Explains WHY, not just WHAT

---

## ✅ PHASE 7: COMPLETION

### Final Code Step
- [ ] Shows complete, clean solution
- [ ] Brief summary of how it works
- [ ] Comparison to brute force (why it's better)

### Wrap-Up Step
- [ ] Lists 3-5 key takeaways
- [ ] Names the pattern explicitly
- [ ] States where this pattern appears next
- [ ] Provides motivation for practice
- [ ] action is set to "complete"

---

## ✅ TONE & LANGUAGE

- [ ] Uses "we" language (collaborative)
- [ ] Never uses "you should know this"
- [ ] Never uses condescending phrases
- [ ] Never uses outdated syntax (var, etc.)
- [ ] Explains every construct the first time it appears
- [ ] Uses tiny examples throughout (3-5 elements max)
- [ ] Explicit about state changes
- [ ] References pseudocode line numbers in coding steps

---

## ✅ JSON STRUCTURE

- [ ] Valid JSON (no syntax errors)
- [ ] All `stepId` values are unique
- [ ] All `next` references point to valid stepIds
- [ ] `action` field is either "next", "complete", or omitted (defaults to "next")
- [ ] `choices` array exists only for thinking challenge steps
- [ ] Each choice has `label` and `next` fields
- [ ] `pseudocodeLineIds` arrays contain valid pseudocode IDs
- [ ] No broken references

---

## ✅ CURRICULUM INTEGRATION

- [ ] `introduces` concepts are actually introduced (not assumed)
- [ ] `assumesAlreadyTaught` concepts are never re-explained
- [ ] Lesson builds on previous lessons logically
- [ ] No circular dependencies in curriculum

---

## 🎯 VERIFICATION COMMAND

Run this prompt in ChatGPT/Cursor to verify a lesson:
```
I have an INPACT algorithm lesson JSON file. Please verify it against the 
INPACT Lesson Quality Verification Checklist (v1.0). 

For each section, report:
✅ PASS - All criteria met
⚠️  PARTIAL - Some criteria met
❌ FAIL - Criteria not met

Provide specific line numbers and issues for any failures.

Here's the lesson:
[paste JSON]
```

---

## 📊 SCORING

- **PERFECT**: All checkboxes pass
- **GOOD**: 90%+ pass, minor issues only
- **NEEDS WORK**: 75-89% pass
- **INSUFFICIENT**: <75% pass

Only mark lesson status as "PERFECT" if ALL criteria pass.