# INPACT - Interactive Programming Challenge Teaching Platform

A production-grade lesson engine for teaching coding challenges using deterministic pedagogy combined with AI-generated content.

## 🚀 Quick Start

### Local Development

```bash
# Install all dependencies
npm run install:all

# Run both backend and frontend in dev mode
npm run dev

# Or run separately:
npm run dev:backend  # Backend on http://localhost:3001
npm run dev:frontend  # Frontend on http://localhost:5173
```

### Production Build

```bash
# Build frontend
npm run build

# Start production server (serves both backend and frontend)
npm start
```

## 📁 Monorepo Structure

```
inpact/
├── backend/          # Express.js API server
├── frontend/         # React + Vite frontend
├── algo/            # Algorithm lessons (existing, not using lesson engine)
├── react/           # React coding challenges (using lesson engine)
├── nodejs/          # Node.js coding challenges (using lesson engine)
├── python/          # Python coding challenges (using lesson engine)
└── ...              # Other coding challenge directories
```

## 🚂 Railway Deployment

This repo is configured for Railway deployment:

1. **Connect to Railway**: Link your GitHub repo
2. **Auto-deploy**: Railway will detect the monorepo structure
3. **Environment Variables**: Set `OPENAI_API_KEY` in Railway dashboard
4. **Build**: Railway runs `npm run build` automatically
5. **Start**: Railway runs `npm start` to serve both backend and frontend

### Railway Configuration

- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Port**: Automatically set by Railway (uses `$PORT`)

### Required Environment Variables

```env
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=production
PORT=3001
```

## 🎯 Lesson Engine

The lesson engine follows a strict 7-phase pedagogy:

1. **Context Setting** - Problem statement + analogy
2. **Prerequisites** - Construct awareness + gap selection
3. **Core Insight** - One-sentence solution idea
4. **Syntax Decomposition** - Construct teaching
5. **Full Application** - Complete solution
6. **Verification** - Questions and scoring
7. **Connection** - Summary and next concept

### Usage

**Coding Challenges (using lesson engine):**
```
http://localhost:3001/lesson-engine/react/react-1-hello-world-component
http://localhost:3001/lesson-engine/nodejs/nodejs-1-nodejs-basics
```

**Algorithms (existing lessons):**
```
http://localhost:3001/learn/algorithm/two-sum
```

## 📚 Documentation

- [Lesson Engine Docs](./docs/LESSON_ENGINE.md)
- [Setup Guide](./LESSON_ENGINE_SETUP.md)
- [Testing Guide](./TESTING_GUIDE.md)

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: React, Vite, TailwindCSS
- **AI**: OpenAI API (for lesson content generation)
- **Deployment**: Railway

## 📝 License

Private repository
