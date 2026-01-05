/**
 * INPACT Lesson Generator v1.1
 * Local-only script (NOT for commit)
 * Uses OpenAI API
 */

import fs from "fs";
import path from "path";

// ===============================
// CONFIG
// ===============================

// ❗ Replace this with your real key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "YOUR_API_KEY_HERE";

const CONFIG = {
  MODEL: "gpt-4.1",          // or "gpt-4o"
  MAX_TOKENS: 6000,
  BATCH_SIZE: 5,
  OUTPUT_DIR: "./lessons/javascript",
  LANGUAGE: "JavaScript"
};

if (!OPENAI_API_KEY || OPENAI_API_KEY.startsWith("sk-PASTE")) {
  throw new Error("❌ OpenAI API key not set in script");
}

// ===============================
// OPENAI CALL
// ===============================

async function callOpenAI(systemPrompt, userPrompt) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: CONFIG.MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: CONFIG.MAX_TOKENS,
      temperature: 0.3
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API Error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// ===============================
// LESSON GENERATION
// ===============================

async function generateLesson(algoNumber, algoName) {
  console.log(`📚 Generating lesson for #${algoNumber} ${algoName}...`);

  console.log("  → Step 1/11: Getting metadata...");
  const metadata = {
    id: algoNumber,
    name: algoName,
    language: CONFIG.LANGUAGE
  };

  console.log("  → Step 2/11: Building prompts...");

  const systemPrompt = `
You are an expert instructional designer.
Generate INPACT lessons with strict pedagogy.
Do NOT summarize.
Do NOT skip phases.
Follow all 10 phases exactly.
`;

  const userPrompt = `
Generate a full INPACT lesson for:
Algorithm: ${metadata.name}
Language: ${metadata.language}

Requirements:
- 10 phases (Phase 1 to Phase 10)
- Phase 5 must be very detailed and step-by-step
- Show non-optimal approach first, then optimal
- No summaries
- No shortcuts
- No references to "same as above"

Output clean plain text (no markdown fences).
`;

  console.log("  → Step 3/11: Calling OpenAI...");

  const lessonText = await callOpenAI(systemPrompt, userPrompt);

  console.log("  → Step 4/11: Writing file...");

  fs.mkdirSync(CONFIG.OUTPUT_DIR, { recursive: true });

  const fileName = `${String(algoNumber).padStart(2, "0")}-${algoName
    .toLowerCase()
    .replace(/\s+/g, "-")}.txt`;

  fs.writeFileSync(
    path.join(CONFIG.OUTPUT_DIR, fileName),
    lessonText,
    "utf-8"
  );

  console.log(`  ✅ Lesson saved: ${fileName}`);
}

// ===============================
// MAIN
// ===============================

async function main() {
  console.log("═══════════════════════════════════════════");
  console.log("       INPACT Lesson Generator v1.1");
  console.log("═══════════════════════════════════════════\n");

  const algorithms = [
    { id: 1, name: "Two Sum" },
    { id: 2, name: "Reverse String" },
    { id: 3, name: "Valid Palindrome" },
    { id: 4, name: "Valid Anagram" },
    { id: 5, name: "Contains Duplicate" }
  ];

  let success = 0;
  let failed = 0;

  for (const algo of algorithms) {
    try {
      await generateLesson(algo.id, algo.name);
      success++;
    } catch (err) {
      failed++;
      console.error(`  ❌ Failed: ${algo.name}`);
      console.error(`     ${err.message}\n`);
    }
  }

  console.log("\n═══════════════════════════════════════════");
  console.log("                 SUMMARY");
  console.log("═══════════════════════════════════════════");
  console.log(`✅ Successful: ${success}`);
  console.log(`❌ Failed: ${failed}`);
}

main();
