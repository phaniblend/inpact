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
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
  credentials: true
}));
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
    console.log(`Reading lessons from: ${algoDir}`);
    
    const files = await fs.readdir(algoDir);
    console.log(`Found ${files.length} files in directory`);
    
    const jsonFiles = files.filter(f => f.endsWith('.json') && f.startsWith('lesson-'));
    console.log(`Found ${jsonFiles.length} lesson JSON files`);
    
    if (jsonFiles.length === 0) {
      console.warn('No lesson files found! Checking all JSON files...');
      const allJsonFiles = files.filter(f => f.endsWith('.json'));
      console.log(`Total JSON files: ${allJsonFiles.length}`);
      if (allJsonFiles.length > 0) {
        console.log('Sample files:', allJsonFiles.slice(0, 5));
      }
    }
    
    const lessons = await Promise.all(
      jsonFiles.map(async (file) => {
        try {
          const content = await fs.readFile(path.join(algoDir, file), 'utf-8');
          const lesson = JSON.parse(content);
          // Extract slug from lesson.id or filename
          let slug = lesson.id || file.replace('.json', '');
          // Remove 'lesson-' prefix and lesson number if present
          if (slug.startsWith('lesson-')) {
            slug = slug.replace(/^lesson-\d+-?/, '').replace(/^lesson-/, '');
          }
          
          return {
            id: lesson.curriculum?.lessonNumber || parseInt(file.match(/\d+/)?.[0] || '0'),
            slug: slug,
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
    console.log(`Returning ${validLessons.length} valid lessons`);
    res.json({ success: true, data: validLessons });
  } catch (error) {
    console.error('Error getting algorithms:', error);
    res.status(500).json({ success: false, message: error.message, stack: error.stack });
  }
});

// Get single algorithm by slug
app.get('/api/lessons/algorithms/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const algoDir = path.join(__dirname, '../../algo/generated/generated-lessons-v2');
    
    // Try multiple filename patterns
    const possibleFilenames = [
      `${slug}.json`,                    // binary-search.json
      `lesson-${slug}.json`,             // lesson-binary-search.json
      `lesson-${slug.replace(/-/g, '-')}.json`  // Handle any dashes
    ];
    
    let filePath = null;
    
    // First, try direct filename matches in main directory
    for (const filename of possibleFilenames) {
      const testPath = path.join(algoDir, filename);
      if (await fileExists(testPath)) {
        filePath = testPath;
        break;
      }
    }
    
    // If not found, check subdirectories
    if (!filePath) {
      const subdirs = ['GOOD_AS_IS', 'NEEDS_AI_FIX', 'FIXED_BY_AI'];
      for (const subdir of subdirs) {
        const subdirPath = path.join(algoDir, subdir);
        try {
          for (const filename of possibleFilenames) {
            const testPath = path.join(subdirPath, filename);
            if (await fileExists(testPath)) {
              filePath = testPath;
              break;
            }
          }
          if (filePath) break;
        } catch (e) {
          // Subdirectory doesn't exist, continue
        }
      }
    }
    
    // If still not found, search all files for matching slug
    if (!filePath) {
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
      
      // Try to match by slug in filename or by lesson ID
      const matchingFile = files.find(f => {
        const fileName = path.basename(f);
        if (!fileName.endsWith('.json')) return false;
        
        // Remove 'lesson-' prefix and '.json' suffix for comparison
        const baseName = fileName.replace(/^lesson-/, '').replace(/\.json$/, '');
        
        // Check if slug matches the base name or is contained in it
        return baseName === slug || 
               baseName.includes(slug) || 
               fileName.includes(slug);
      });
      
      if (matchingFile) {
        filePath = path.join(algoDir, matchingFile);
      }
    }
    
    if (!filePath || !await fileExists(filePath)) {
      console.error(`Lesson not found: ${slug}. Searched in ${algoDir}`);
      return res.status(404).json({ success: false, message: `Lesson not found: ${slug}` });
    }
    
    const content = await fs.readFile(filePath, 'utf-8');
    const lesson = JSON.parse(content);
    
    console.log(`Found lesson: ${slug} -> ${path.basename(filePath)}`);
    res.json({ success: true, data: lesson });
  } catch (error) {
    console.error('Error getting lesson:', error);
    res.status(404).json({ success: false, message: 'Lesson not found', error: error.message });
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

// Serve frontend static files in production
const frontendBuildPath = path.join(__dirname, '../../frontend/dist');
try {
  if (await fileExists(frontendBuildPath)) {
    app.use(express.static(frontendBuildPath));
    // Serve React app for all non-API routes
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(frontendBuildPath, 'index.html'));
      }
    });
    console.log('📦 Serving frontend from:', frontendBuildPath);
  }
} catch (e) {
  console.log('⚠️  Frontend build not found, API-only mode');
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 INPACT Backend Server running on http://localhost:${PORT}`);
  console.log(`📚 Serving lessons from: ${path.join(__dirname, '../../algo/generated/generated-lessons-v2')}`);
  console.log(`💡 Access frontend at: http://localhost:${PORT} (if built) or http://localhost:5173 (dev server)`);
});
