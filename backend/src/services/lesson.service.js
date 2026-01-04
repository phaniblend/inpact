const fs = require("fs").promises;
const path = require("path");

const { verifyLesson } = require("./lessonVerifier.service");
const { applyDeterministicFixes } = require("./lessonRepair.service");

class LessonService {
  constructor() {
    // IMPORTANT: aligns with your repo root structure
    // backend/src/services -> ../../../algo
    this.algoDir = path.join(__dirname, "../../../algo");
  }

  /**
   * Return minimal metadata for AlgorithmsHub
   */
  async getAllAlgorithms() {
    const files = await fs.readdir(this.algoDir);
    const jsonFiles = files.filter((f) => f.endsWith(".json"));

    const lessons = await Promise.all(
      jsonFiles.map(async (file) => {
        const content = await fs.readFile(
          path.join(this.algoDir, file),
          "utf-8"
        );
        const lesson = JSON.parse(content);

        return {
          slug: file.replace(".json", ""),
          title: lesson.title || file.replace(".json", ""),
          difficulty: lesson.difficulty || "medium",
          type: "algorithm",
        };
      })
    );

    return lessons;
  }

  /**
   * Core method: delivers a lesson that conforms to standards
   */
  async getLessonBySlug(slug) {
    const filePath = path.join(this.algoDir, `${slug}.json`);

    let content;
    try {
      content = await fs.readFile(filePath, "utf-8");
    } catch (err) {
      return null;
    }

    let lesson = JSON.parse(content);

    /**
     * FAST PATH:
     * If lesson already marked PERFECT for current standards,
     * skip all verification & repair
     */
    if (
      lesson.quality &&
      lesson.quality.status === "PERFECT" &&
      lesson.quality.standardsVersion
    ) {
      return lesson;
    }

    /**
     * STEP 1: Verify
     */
    const report = verifyLesson(lesson);

    /**
     * STEP 2: If perfect, stamp quality and return
     */
    if (report.status === "PERFECT") {
      lesson.quality = report;
      return lesson;
    }

    /**
     * STEP 3: Apply deterministic repairs (NO AI)
     */
    lesson = applyDeterministicFixes(lesson, report);

    /**
     * STEP 4: Re-verify after repair
     */
    const finalReport = verifyLesson(lesson);
    lesson.quality = finalReport;

    return lesson;
  }
}

module.exports = new LessonService();
