require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { getLearningObjectives } = require('./openai-service');

const app = express();
const PORT = process.env.PORT || 3000;

// Check if API key is loaded
if (!process.env.OPENAI_API_KEY) {
  console.error('ERROR: OPENAI_API_KEY not found in .env file');
  console.error('Please add your OpenAI API key to the .env file');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API endpoint
app.post('/api/objectives', async (req, res) => {
  try {
    const { task, tech } = req.body;

    if (!task || !tech) {
      return res.status(400).json({
        success: false,
        error: 'Both task and tech fields are required'
      });
    }

    const result = await getLearningObjectives(task, tech);
    res.json(result);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ API key loaded: ${process.env.OPENAI_API_KEY ? 'Yes' : 'No'}`);
}).on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});