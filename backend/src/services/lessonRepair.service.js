export function applyDeterministicFixes(lesson, report) {
  const patched = { ...lesson };

  if (report.missing.includes("pseudocode")) {
    patched.pseudocode = [
      "create memory structure",
      "iterate through list",
      "calculate needed value",
      "check if value exists",
      "return result"
    ];
  }

  if (report.missing.includes("thinkingChallenge")) {
    patched.thinkingChallenge = {
      prompt:
        "If the list were extremely large, how could you avoid checking every possible pair?"
    };
  }

  return patched;
}
