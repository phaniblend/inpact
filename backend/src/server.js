import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'INPACT API is running!' });
});

// Get all algorithms
app.get('/api/lessons/algorithms', async (req, res) => {
  try {
    // Point to the generated-lessons-v2 directory
    const algoDir = path.join(__dirname, '../../algo/generated/generated-lessons-v2');
    const files = await fs.readdir(algoDir);
    const jsonFiles = files.filter(f => f.endsWith('.json') && f.startsWith('lesson-'));
    
    const lessons = await Promise.all(
      jsonFiles.map(async (file) => {
        try {
          const content = await fs.readFile(path.join(algoDir, file), 'utf-8');
          const lesson = JSON.parse(content);
          return {
            id: lesson.curriculum?.lessonNumber || parseInt(file.match(/\d+/)?.[0] || '0'),
            slug: lesson.id || file.replace('.json', ''),
            title: lesson.title || file.replace('.json', '').replace(/-/g, ' '),
            difficulty: lesson.difficulty || 'medium',
            pattern: lesson.pattern || 'general',
            tier: lesson.curriculum?.tier || 'FOUNDATION',
            isPremium: (lesson.curriculum?.lessonNumber || 0) > 10,
          };
        } catch (err) {
          console.error(`Error reading ${file}:`, err.message);
          return null;
        }
      })
    );
    
    const validLessons = lessons.filter(l => l !== null).sort((a, b) => a.id - b.id);
    res.json({ success: true, data: validLessons });
  } catch (error) {
    console.error('Error getting algorithms:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single algorithm by slug
app.get('/api/lessons/algorithms/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const algoDir = path.join(__dirname, '../../algo/generated/generated-lessons-v2');
    
    // Try to find the file - check main directory first, then subdirectories
    let filePath = path.join(algoDir, `${slug}.json`);
    
    // If not found in main dir, check subdirectories (GOOD_AS_IS, etc.)
    if (!await fileExists(filePath)) {
      const subdirs = ['GOOD_AS_IS', 'NEEDS_AI_FIX', 'FIXED_BY_AI'];
      for (const subdir of subdirs) {
        const subdirPath = path.join(algoDir, subdir);
        try {
          const testPath = path.join(subdirPath, `${slug}.json`);
          if (await fileExists(testPath)) {
            filePath = testPath;
            break;
          }
        } catch (e) {
          // Subdirectory doesn't exist, continue
        }
      }
    }
    
    // If still not found, try to find by matching slug in lesson files
    if (!await fileExists(filePath)) {
      // Check main directory
      let files = [];
      try {
        files = await fs.readdir(algoDir);
      } catch (e) {
        // Directory doesn't exist
      }
      
      // Also check subdirectories
      const subdirs = ['GOOD_AS_IS', 'NEEDS_AI_FIX', 'FIXED_BY_AI'];
      for (const subdir of subdirs) {
        try {
          const subdirPath = path.join(algoDir, subdir);
          const subFiles = await fs.readdir(subdirPath);
          files.push(...subFiles.map(f => path.join(subdir, f)));
        } catch (e) {
          // Subdirectory doesn't exist, continue
        }
      }
      
      const matchingFile = files.find(f => {
        const fileName = path.basename(f);
        return fileName.endsWith('.json') && 
               (fileName.includes(slug) || fileName.replace('lesson-', '').replace('.json', '').includes(slug));
      });
      
      if (matchingFile) {
        filePath = path.join(algoDir, matchingFile);
      }
    }
    
    if (!await fileExists(filePath)) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }
    
    const content = await fs.readFile(filePath, 'utf-8');
    const lesson = JSON.parse(content);
    
    res.json({ success: true, data: lesson });
  } catch (error) {
    console.error('Error getting lesson:', error);
    res.status(404).json({ success: false, message: 'Lesson not found' });
  }
});

// Helper function to check if file exists
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 INPACT Backend Server running on http://localhost:${PORT}`);
  console.log(`📚 Serving lessons from: ${path.join(__dirname, '../../algo/generated/generated-lessons-v2')}`);
});
