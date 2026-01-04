export const lessonStandards = {
  version: "2025-12-30",

  required: {
    pseudocode: true,
    thinkingChallenge: true,
    bruteForceLogic: true,
    optimizedLogic: true,
  },

  pseudocode: {
    minLines: 4,
    maxLines: 10,
  },

  scoring: {
    perfect: 100,
    autofixThreshold: 70,
  }
};
