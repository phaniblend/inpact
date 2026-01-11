import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import lessonEngineRoutes from './routes/lessonEngine.routes.js';
import authRoutes from './routes/auth.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend directory
const envPath = path.join(__dirname, '../.env');
dotenv.config({ path: envPath });

// Log for debugging (remove in production)
console.log('Environment loaded from:', envPath);
console.log('OPENAI_API_KEY configured:', process.env.OPENAI_API_KEY ? 'Yes (key exists)' : 'No');

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173', 'http://localhost:5174'],
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

// ===============================
// CACHE SYSTEM FOR AI RESPONSES
// ===============================
const cacheFile = path.join(__dirname, '../.cache/ai-responses.json');
const cacheDir = path.join(__dirname, '../.cache');

// In-memory cache for fast access
let responseCache = new Map();

// Load cache from file on startup
async function loadCache() {
  try {
    // Ensure cache directory exists
    await fs.mkdir(cacheDir, { recursive: true });
    
    if (await fileExists(cacheFile)) {
      const cacheData = await fs.readFile(cacheFile, 'utf-8');
      const cache = JSON.parse(cacheData);
      
      // Load into memory
      for (const [key, value] of Object.entries(cache)) {
        responseCache.set(key, value);
      }
      console.log(`📦 Loaded ${responseCache.size} cached AI responses`);
    }
  } catch (error) {
    console.error('Error loading cache:', error.message);
  }
}

// Save cache to file
async function saveCache() {
  try {
    const cacheObj = Object.fromEntries(responseCache);
    await fs.writeFile(cacheFile, JSON.stringify(cacheObj, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving cache:', error.message);
  }
}

// Normalize question for cache key
function normalizeQuestion(question) {
  return question
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\b(what|how|why|when|where|is|are|can|could|should|will|do|does|did)\b/g, '') // Remove common question words
    .trim();
}

// Extract keywords from question
function extractKeywords(question) {
  const normalized = normalizeQuestion(question);
  const words = normalized.split(/\s+/).filter(w => w.length > 2); // Filter out short words
  return [...new Set(words)].sort(); // Remove duplicates and sort
}

// Generate cache key
function generateCacheKey(concept, question, language) {
  const normalized = normalizeQuestion(question);
  return `${concept || 'general'}:${language || 'javascript'}:${normalized}`;
}

// Find similar cached question
function findSimilarCached(concept, question, language) {
  const questionKeywords = extractKeywords(question);
  if (questionKeywords.length === 0) return null;
  
  let bestMatch = null;
  let bestScore = 0;
  const minSimilarity = 0.5; // 50% keyword match required (lowered to catch more similar questions)
  
  for (const [key, cached] of responseCache.entries()) {
    // Check if same concept and language
    if (cached.concept !== (concept || 'general')) continue;
    if (cached.language !== (language || 'javascript')) continue;
    
    // Calculate keyword similarity
    const cachedKeywords = extractKeywords(cached.question);
    const commonKeywords = questionKeywords.filter(k => cachedKeywords.includes(k));
    const similarity = commonKeywords.length / Math.max(questionKeywords.length, cachedKeywords.length);
    
    if (similarity >= minSimilarity && similarity > bestScore) {
      bestScore = similarity;
      bestMatch = cached;
    }
  }
  
  return bestMatch;
}

// Initialize cache on startup
loadCache();

// Ask a Question endpoint - uses OpenAI API with caching
app.post('/api/mentor/ask-question', async (req, res) => {
  try {
    const { concept, question, language } = req.body;

    if (!question) {
      return res.status(400).json({ 
        success: false, 
        message: 'Question is required' 
      });
    }

    // Check cache first - exact match
    const cacheKey = generateCacheKey(concept, question, language);
    const exactMatch = responseCache.get(cacheKey);
    
    if (exactMatch) {
      console.log(`✅ Cache HIT (exact): "${question.substring(0, 50)}..."`);
      return res.json({ 
        success: true, 
        answer: exactMatch.answer,
        cached: true
      });
    }

    // Check for similar questions in cache
    const similarMatch = findSimilarCached(concept, question, language);
    if (similarMatch) {
      console.log(`✅ Cache HIT (similar): "${question.substring(0, 50)}..." -> "${similarMatch.question.substring(0, 50)}..."`);
      return res.json({ 
        success: true, 
        answer: similarMatch.answer,
        cached: true
      });
    }

    // Cache miss - need to call OpenAI
    console.log(`❌ Cache MISS - calling OpenAI API for: "${question.substring(0, 50)}..."`);
    
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey || openaiApiKey === 'YOUR_API_KEY_HERE') {
      console.error('OpenAI API key not configured');
      return res.status(500).json({ 
        success: false, 
        message: 'OpenAI API key not configured. Please set OPENAI_API_KEY in backend/.env file.' 
      });
    }

    // Build the prompt for OpenAI
    const systemPrompt = `You are an expert programming mentor helping students learn algorithms and data structures. 
Provide clear, concise, and educational answers. Use examples in ${language || 'JavaScript'} when relevant.`;

    const userPrompt = concept 
      ? `Context: The student is learning about "${concept}".

Question: ${question}

Please provide a helpful, educational answer that explains the concept clearly.`
      : `Question: ${question}

Please provide a helpful, educational answer about programming and algorithms.`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // Using cheaper model to save costs
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 800, // Reduced from 1000 to save tokens
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API Error:', response.status, errorText);
      let errorMessage = 'Failed to get answer from AI. Please try again.';
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorMessage;
      } catch (e) {
        // If parsing fails, use the text as is
        errorMessage = errorText || errorMessage;
      }
      return res.status(500).json({ 
        success: false, 
        message: errorMessage 
      });
    }

    const data = await response.json();
    const answer = data.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate an answer. Please try rephrasing your question.';

    // Store in cache
    const cacheEntry = {
      question: question.trim(),
      answer: answer,
      concept: concept || 'general',
      language: language || 'javascript',
      timestamp: new Date().toISOString()
    };
    
    responseCache.set(cacheKey, cacheEntry);
    
    // Save cache to file (async, don't wait)
    saveCache().catch(err => console.error('Error saving cache:', err));

    console.log(`💾 Cached new response. Total cached: ${responseCache.size} | Estimated cost saved: ~$${((responseCache.size - 1) * 0.002).toFixed(4)}`);

    res.json({ 
      success: true, 
      answer: answer,
      cached: false
    });
  } catch (error) {
    console.error('Error in ask-question endpoint:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: `An error occurred while processing your question: ${error.message}`,
      error: error.message 
    });
  }
});

// Serve frontend static files in production
const frontendBuildPath = path.join(__dirname, '../../frontend/dist');

// Always try to serve frontend (for Railway deployment)
app.use(express.static(frontendBuildPath));

// Serve React app for all non-API routes (SPA fallback)
app.get('*', async (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api')) {
    return next();
  }
  
  // Check if frontend build exists
  const indexPath = path.join(frontendBuildPath, 'index.html');
  try {
    if (await fileExists(indexPath)) {
      res.sendFile(indexPath);
    } else {
      // In development, redirect to frontend dev server
      if (process.env.NODE_ENV !== 'production') {
        res.redirect('http://localhost:5173' + req.path);
      } else {
        res.status(404).json({ error: 'Frontend not built. Run: npm run build' });
      }
    }
  } catch (error) {
    console.error('Error serving frontend:', error);
    res.status(500).json({ error: 'Frontend serving error' });
  }
});

// Log frontend serving status
if (await fileExists(frontendBuildPath)) {
  console.log('📦 Serving frontend from:', frontendBuildPath);
} else {
  console.log('⚠️  Frontend build not found. Run: npm run build');
}

// Cache stats endpoint
app.get('/api/mentor/cache-stats', (req, res) => {
  const stats = {
    totalCached: responseCache.size,
    cacheFile: cacheFile,
    cacheSize: responseCache.size,
    estimatedSavings: `$${((responseCache.size - 1) * 0.002).toFixed(4)}` // Rough estimate
  };
  res.json({ success: true, stats });
});

// Lesson Engine routes
app.use('/api/lesson-engine', lessonEngineRoutes);
app.use('/api/auth', authRoutes);

// Get raw challenge JSON with flow array (MUST come before /:domain route)
app.get('/api/lessons/coding/:domain/:challengeId', async (req, res) => {
  try {
    const { domain, challengeId } = req.params;
    const domainDirs = ['react', 'nodejs', 'python', 'java', 'go', 'swift', 'angular', 'react-typescript'];
    
    if (!domainDirs.includes(domain)) {
      return res.status(400).json({ success: false, message: 'Invalid domain' });
    }
    
    const challengePath = path.join(__dirname, '../../', domain, `${challengeId}.json`);
    console.log(`Looking for challenge at: ${challengePath}`);
    console.log(`__dirname is: ${__dirname}`);
    console.log(`Resolved path: ${path.resolve(challengePath)}`);
    
    // Check if file exists first
    try {
      await fs.access(challengePath);
      console.log(`File exists at: ${challengePath}`);
    } catch (accessErr) {
      console.error(`File does not exist at: ${challengePath}`);
      return res.status(404).json({ 
        success: false, 
        message: 'Challenge not found', 
        details: `File not found at ${challengePath}`,
        attemptedPath: challengePath
      });
    }
    
    try {
      const content = await fs.readFile(challengePath, 'utf-8');
      const challenge = JSON.parse(content);
      console.log(`Successfully loaded challenge: ${challengeId}`);
      res.json({ success: true, data: challenge });
    } catch (err) {
      console.error(`Error reading challenge ${challengeId} from ${challengePath}:`, err.message);
      res.status(404).json({ success: false, message: 'Challenge not found', details: err.message });
    }
  } catch (error) {
    console.error('Error getting challenge:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get coding challenges by domain
app.get('/api/lessons/coding/:domain', async (req, res) => {
  try {
    const { domain } = req.params;
    const domainDirs = ['react', 'nodejs', 'python', 'java', 'go', 'swift', 'angular', 'react-typescript'];
    
    if (!domainDirs.includes(domain)) {
      return res.status(400).json({ success: false, message: 'Invalid domain' });
    }
    
    const domainPath = path.join(__dirname, '../../', domain);
    const files = await fs.readdir(domainPath);
    const jsonFiles = files.filter(f => f.endsWith('.json') && !f.includes('consolidate'));
    
    const challenges = await Promise.all(
      jsonFiles.slice(0, 50).map(async (file) => {
        try {
          const content = await fs.readFile(path.join(domainPath, file), 'utf-8');
          const challenge = JSON.parse(content);
          
          return {
            id: challenge.id || file.replace('.json', ''),
            title: challenge.title || file.replace('.json', '').replace(/-/g, ' '),
            difficulty: challenge.difficulty || 'junior',
            technology: challenge.technology || domain,
            language: challenge.language || 'javascript',
            timeEstimate: challenge.metadata?.time_estimate || 'N/A',
          };
        } catch (err) {
          console.error(`Error reading ${file}:`, err.message);
          return null;
        }
      })
    );
    
    // Remove duplicates and nulls, then sort
    const seen = new Set();
    const validChallenges = challenges
      .filter(c => {
        if (c === null) return false;
        // Remove duplicates by ID
        if (seen.has(c.id)) return false;
        seen.add(c.id);
        return true;
      })
      .sort((a, b) => {
        // Sort by challenge number if available
        const aNum = parseInt(a.id.match(/\d+/)?.[0] || '999');
        const bNum = parseInt(b.id.match(/\d+/)?.[0] || '999');
        return aNum - bNum;
      });
    
    res.json({ success: true, data: validChallenges });
  } catch (error) {
    console.error('Error getting coding challenges:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all coding domains
app.get('/api/lessons/coding', async (req, res) => {
  try {
    const domains = [
      { id: 'react', name: 'React', count: 0 },
      { id: 'nodejs', name: 'Node.js', count: 0 },
      { id: 'python', name: 'Python', count: 0 },
      { id: 'java', name: 'Java', count: 0 },
      { id: 'go', name: 'Go', count: 0 },
      { id: 'swift', name: 'Swift', count: 0 },
      { id: 'angular', name: 'Angular', count: 0 },
      { id: 'react-typescript', name: 'React + TypeScript', count: 0 },
    ];
    
    // Count challenges in each domain
    for (const domain of domains) {
      try {
        const domainPath = path.join(__dirname, '../../', domain.id);
        const files = await fs.readdir(domainPath);
        domain.count = files.filter(f => f.endsWith('.json') && !f.includes('consolidate')).length;
      } catch (err) {
        // Domain directory doesn't exist or can't be read
        domain.count = 0;
      }
    }
    
    res.json({ success: true, data: domains });
  } catch (error) {
    console.error('Error getting coding domains:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start server
const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 INPACT Server running on http://${HOST}:${PORT}`);
  console.log(`📚 Serving lessons from: ${path.join(__dirname, '../../algo/generated/generated-lessons-v2')}`);
  console.log(`💡 Frontend served from: http://${HOST}:${PORT}`);
  console.log(`💾 Cache directory: ${cacheDir}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 OpenAI API Key: ${process.env.OPENAI_API_KEY ? 'Configured ✅' : 'Not configured ⚠️'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
