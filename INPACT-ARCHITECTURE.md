# INPACT - System Architecture & Design Document

**Version:** 1.0  
**Date:** December 29, 2025  
**Status:** Active Development

---

## 📐 ARCHITECTURE OVERVIEW

### System Layers

```
┌────────────────────────────────────────────────────┐
│              PRESENTATION LAYER                     │
│         (React + Vite + JavaScript)                │
│                                                     │
│  - Landing Page                                    │
│  - Algorithms Hub                                  │
│  - Practice Tutorial (Split Screen IDE)           │
│  - Dashboard                                       │
└────────────────┬───────────────────────────────────┘
                 │
                 │ HTTPS / REST API
                 │
┌────────────────▼───────────────────────────────────┐
│              APPLICATION LAYER                      │
│         (Express + Node.js + JavaScript)           │
│                                                     │
│  Routes → Controllers → Services → Data           │
└────────┬──────┬──────┬──────┬─────────────────────┘
         │      │      │      │
         ▼      ▼      ▼      ▼
    ┌────────┐ ┌─────┐ ┌──────┐ ┌──────┐
    │Database│ │Auth │ │Docker│ │Stripe│
    │Postgres│ │Fire │ │Exec  │ │Pay   │
    └────────┘ └─────┘ └──────┘ └──────┘
```

---

## 🗂️ FILE STRUCTURE (DETAILED)

### Frontend Structure (All JavaScript!)

```
frontend/
├── public/
│   └── (static assets when needed)
│
├── src/
│   ├── pages/                      [9 PAGE COMPONENTS]
│   │   ├── Landing.jsx             ✅ DONE - Full landing page
│   │   ├── AlgorithmsHub.jsx       🚧 IN PROGRESS - Placeholder
│   │   ├── CodingHub.jsx           📋 TODO - Similar to AlgorithmsHub
│   │   ├── PracticeTutorial.jsx    📋 TODO - CRITICAL (Split-screen IDE)
│   │   ├── Dashboard.jsx           📋 TODO - User progress
│   │   ├── Profile.jsx             📋 TODO - User settings
│   │   ├── Login.jsx               📋 TODO - Login form
│   │   ├── Register.jsx            📋 TODO - Registration form
│   │   └── NotFound.jsx            📋 TODO - 404 page
│   │
│   ├── components/                 [25+ REUSABLE COMPONENTS]
│   │   │
│   │   ├── layout/                 [LAYOUT COMPONENTS]
│   │   │   ├── Navbar.jsx          ✅ DONE - Top navigation
│   │   │   ├── Footer.jsx          📋 TODO - Site footer
│   │   │   ├── Layout.jsx          📋 TODO - Wrapper component
│   │   │   └── ProtectedRoute.jsx  📋 TODO - Auth guard
│   │   │
│   │   ├── modals/                 [MODAL DIALOGS]
│   │   │   ├── RegistrationModal.jsx   📋 TODO - Lesson 6 signup
│   │   │   ├── PaymentModal.jsx        📋 TODO - Lesson 11 payment
│   │   │   └── BaseModal.jsx           📋 TODO - Modal wrapper
│   │   │
│   │   ├── lesson/                 [PRACTICE TUTORIAL COMPONENTS]
│   │   │   ├── InstructionsPanel.jsx   📋 TODO - Left pane (35%)
│   │   │   ├── CodeEditor.jsx          📋 TODO - Right pane (65%)
│   │   │   ├── OutputPanel.jsx         📋 TODO - Code execution results
│   │   │   ├── ProgressBar.jsx         📋 TODO - Step X of Y
│   │   │   ├── StepNavigation.jsx      📋 TODO - Prev/Next buttons
│   │   │   └── TestResults.jsx         📋 TODO - Test case results
│   │   │
│   │   ├── cards/                  [CARD COMPONENTS]
│   │   │   ├── LessonCard.jsx          📋 TODO - Individual lesson
│   │   │   ├── LanguageCard.jsx        📋 TODO - Python, JS, etc.
│   │   │   ├── FrameworkCard.jsx       📋 TODO - React, Angular, etc.
│   │   │   └── CategoryCard.jsx        📋 TODO - Sorting, DP, etc.
│   │   │
│   │   └── common/                 [COMMON UI COMPONENTS]
│   │       ├── Button.jsx              📋 TODO - Reusable button
│   │       ├── Input.jsx               📋 TODO - Form input
│   │       ├── Card.jsx                📋 TODO - Generic card
│   │       ├── Badge.jsx               📋 TODO - Difficulty badge
│   │       ├── Spinner.jsx             📋 TODO - Loading spinner
│   │       └── Toast.jsx               📋 TODO - Notifications
│   │
│   ├── hooks/                      [CUSTOM REACT HOOKS]
│   │   ├── useAuth.js              📋 TODO - Authentication logic
│   │   ├── useLesson.js            📋 TODO - Fetch lessons
│   │   ├── useProgress.js          📋 TODO - Track progress
│   │   └── usePayment.js           📋 TODO - Stripe checkout
│   │
│   ├── services/                   [API SERVICE LAYER]
│   │   ├── api.js                  📋 TODO - Axios setup
│   │   ├── authService.js          📋 TODO - Login/register
│   │   ├── lessonService.js        📋 TODO - GET lessons
│   │   ├── progressService.js      📋 TODO - Save/load progress
│   │   ├── paymentService.js       📋 TODO - Stripe checkout
│   │   └── codeExecutionService.js 📋 TODO - POST /execute
│   │
│   ├── store/                      [REDUX STATE MANAGEMENT]
│   │   ├── store.js                📋 TODO - Redux store config
│   │   └── slices/
│   │       ├── authSlice.js        📋 TODO - User state
│   │       ├── lessonSlice.js      📋 TODO - Lesson data
│   │       ├── progressSlice.js    📋 TODO - Progress tracking
│   │       └── uiSlice.js          📋 TODO - Modal state, etc.
│   │
│   ├── utils/                      [UTILITY FUNCTIONS]
│   │   ├── constants.js            📋 TODO - API URLs, colors
│   │   ├── helpers.js              📋 TODO - Utility functions
│   │   └── validation.js           📋 TODO - Form validation
│   │
│   ├── styles/                     [GLOBAL STYLES]
│   │   ├── index.css               ✅ DONE - Tailwind imports
│   │   └── globals.css             📋 TODO - Custom CSS
│   │
│   ├── assets/                     [STATIC ASSETS]
│   │   └── images/
│   │
│   ├── App.jsx                     ✅ DONE - Router setup
│   └── main.jsx                    ✅ DONE - React entry point
│
├── index.html                      ✅ DONE - HTML entry
├── package.json                    ✅ DONE - Dependencies
├── vite.config.js                  ✅ DONE - Vite config
├── tailwind.config.js              ✅ DONE - INPACT colors
├── postcss.config.js               ✅ DONE - PostCSS
├── .eslintrc.json                  📋 TODO - ESLint rules
├── .prettierrc                     📋 TODO - Prettier config
├── .env.example                    📋 TODO - Environment template
└── .gitignore                      📋 TODO - Git ignore rules
```

### Backend Structure (All JavaScript!)

```
backend/
├── src/
│   ├── routes/                     [API ROUTES]
│   │   ├── auth.routes.js          📋 TODO - /api/auth/*
│   │   ├── lessons.routes.js       📋 TODO - /api/lessons/*
│   │   ├── progress.routes.js      📋 TODO - /api/progress/*
│   │   ├── payments.routes.js      📋 TODO - /api/payments/*
│   │   ├── execute.routes.js       📋 TODO - /api/execute
│   │   └── index.js                📋 TODO - Route aggregator
│   │
│   ├── controllers/                [REQUEST HANDLERS]
│   │   ├── auth.controller.js      📋 TODO - Login, register
│   │   ├── lessons.controller.js   📋 TODO - Get lessons
│   │   ├── progress.controller.js  📋 TODO - Save/load progress
│   │   ├── payments.controller.js  📋 TODO - Stripe checkout
│   │   └── execute.controller.js   📋 TODO - Run code
│   │
│   ├── services/                   [BUSINESS LOGIC]
│   │   ├── auth.service.js         📋 TODO - JWT, password hash
│   │   ├── lesson.service.js       📋 TODO - Read JSON files
│   │   ├── progress.service.js     📋 TODO - DB operations
│   │   ├── stripe.service.js       📋 TODO - Stripe API
│   │   ├── codeExecution.service.js 📋 TODO - Docker exec
│   │   └── firebase.service.js     📋 TODO - Firebase Admin
│   │
│   ├── middleware/                 [REQUEST MIDDLEWARE]
│   │   ├── auth.middleware.js      📋 TODO - Verify JWT
│   │   ├── errorHandler.js         📋 TODO - Global errors
│   │   ├── validation.middleware.js 📋 TODO - Validate requests
│   │   └── rateLimiter.js          📋 TODO - Rate limiting
│   │
│   ├── config/                     [CONFIGURATION]
│   │   ├── database.js             📋 TODO - Prisma client
│   │   ├── firebase.js             📋 TODO - Firebase admin
│   │   ├── stripe.js               📋 TODO - Stripe config
│   │   └── env.js                  📋 TODO - Environment vars
│   │
│   ├── utils/                      [UTILITIES]
│   │   ├── validation.js           📋 TODO - Validation schemas
│   │   ├── logger.js               📋 TODO - Winston logger
│   │   └── helpers.js              📋 TODO - Helper functions
│   │
│   ├── server.js                   📋 TODO - HTTP server
│   └── app.js                      📋 TODO - Express app
│
├── prisma/                         [DATABASE]
│   ├── schema.prisma               📋 TODO - Database schema
│   └── seed.js                     📋 TODO - Seed with lessons
│
├── tests/                          [TESTS]
│   └── setup.js                    📋 TODO - Test config
│
├── package.json                    📋 TODO - Dependencies
├── nodemon.json                    📋 TODO - Nodemon config
├── .env.example                    📋 TODO - Environment template
└── .gitignore                      📋 TODO - Git ignore rules
```

---

## 🎨 DESIGN SYSTEM (INPACT Branding)

### Color Palette

```javascript
// tailwind.config.js
colors: {
  'inpact-green': '#9bf945',    // Primary brand color
  'inpact-dark': '#0f172a',     // Navy (text, headers)
  'inpact-bg': '#f5f7fa',       // Light gray background
  'inpact-text': '#1f2933',     // Dark gray text
  'inpact-gray': '#6b7280',     // Muted text
  'inpact-card': '#ffffff',     // White cards
}
```

### Typography

```javascript
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace'],
}
```

**Font Sizes:**
- H1: `text-5xl md:text-6xl` (60px on desktop)
- H2: `text-4xl` (36px)
- H3: `text-2xl` (24px)
- Body: `text-xl` (20px) for descriptions
- Small: `text-base` (16px) for labels

### Shadows

```javascript
boxShadow: {
  'card': '0 10px 30px rgba(0, 0, 0, 0.06)',
  'card-hover': '0 15px 40px rgba(0, 0, 0, 0.1)',
}
```

### Components

**Numbered Badges:**
```jsx
<div className="w-14 h-14 bg-inpact-green text-black font-bold text-xl rounded-full flex items-center justify-center">
  1
</div>
```

**Primary Button:**
```jsx
<button className="px-8 py-4 bg-inpact-green text-black font-bold rounded-full hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
  Start Learning
</button>
```

**Secondary Button:**
```jsx
<button className="px-8 py-4 border-2 border-inpact-dark text-inpact-dark font-semibold rounded-full hover:bg-inpact-dark hover:text-white transition-all duration-200">
  Explore Projects
</button>
```

**Card:**
```jsx
<div className="bg-white rounded-2xl p-10 shadow-card hover:shadow-card-hover transition-all duration-200">
  {/* Content */}
</div>
```

**Terminal Box:**
```jsx
<div className="bg-inpact-dark rounded-2xl p-8 shadow-card">
  <pre className="text-inpact-green font-mono text-sm">
    {/* Code */}
  </pre>
</div>
```

---

## 🔐 AUTHENTICATION FLOW

### Registration Flow

```
User → Registration Modal (Lesson 6)
  ↓
Choose: Email OR Google OR GitHub
  ↓
IF Email:
  - POST /api/auth/register { email, password, name }
  - Backend: Hash password (bcrypt)
  - Backend: Create user in DB
  - Backend: Generate JWT token
  - Return: { token, user }
  ↓
IF OAuth:
  - Redirect to Google/GitHub OAuth
  - Callback: POST /api/auth/oauth/google { code }
  - Backend: Exchange code for user info
  - Backend: Create/find user in DB
  - Backend: Generate JWT token
  - Return: { token, user }
  ↓
Frontend: Store token in localStorage
Frontend: Update Redux auth state
Frontend: Redirect to lesson 6
```

### Login Flow

```
User → Login Page
  ↓
Enter: Email + Password
  ↓
POST /api/auth/login { email, password }
  ↓
Backend: Find user by email
Backend: Compare passwords (bcrypt)
Backend: Generate JWT token
  ↓
Return: { token, user }
  ↓
Frontend: Store token in localStorage
Frontend: Update Redux auth state
Frontend: Redirect to dashboard
```

### Protected Routes

```javascript
// ProtectedRoute.jsx
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  
  if (!token) {
    return navigate('/login');
  }
  
  return children;
}

// Usage in App.jsx
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

---

## 💳 PAYMENT FLOW (Stripe)

### Lesson 11 Payment Flow

```
User → Completes Lesson 10
  ↓
Clicks "NEXT" to Lesson 11
  ↓
Frontend: Check if user has paid for lesson 11
  - GET /api/payments/check/:lessonId
  ↓
IF NOT PAID:
  - Show Payment Modal
  - Display: "$2 Lifetime Access"
  - Click: "Pay with Stripe"
  ↓
Frontend: Create Stripe checkout session
  - POST /api/payments/checkout { lessonId }
  ↓
Backend: Create Stripe session
  stripe.checkout.sessions.create({
    line_items: [{ price: 'price_...', quantity: 1 }],
    mode: 'payment',
    success_url: '/learn/algorithm/lesson-11?unlocked=true',
    cancel_url: '/algorithms',
  })
  ↓
Return: { sessionUrl }
  ↓
Frontend: Redirect to Stripe checkout page
  ↓
User: Enters card details on Stripe
  ↓
Stripe: Processes payment
  ↓
Stripe: Sends webhook to /api/payments/webhook
  ↓
Backend: Verify webhook signature
Backend: Create payment record in DB
Backend: Update user access
  ↓
Stripe: Redirects to success_url
  ↓
Frontend: Show "Payment successful! Lesson unlocked"
Frontend: Load Lesson 11
```

### Payment Webhook Handler

```javascript
// backend/src/controllers/payments.controller.js
exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // Create payment record
      await prisma.payment.create({
        data: {
          userId: session.metadata.userId,
          lessonId: session.metadata.lessonId,
          stripePaymentId: session.payment_intent,
          amount: session.amount_total,
          status: 'succeeded',
        }
      });
    }
    
    res.json({ received: true });
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
```

---

## 💻 CODE EXECUTION FLOW (Docker)

### Run Code Flow

```
User → Writes code in Monaco Editor
  ↓
Clicks "RUN" button
  ↓
Frontend: Get current code + test cases
  ↓
POST /api/execute {
  language: 'python',
  code: 'def two_sum(nums, target):\n    return [0, 1]',
  testCases: [
    { input: { nums: [2,7,11,15], target: 9 }, expected: [0,1] }
  ]
}
  ↓
Backend: Create Docker container
  - Language: python:3.11-slim
  - Mount code as file
  - Resource limits: 512MB RAM, 30s timeout
  - Network disabled
  ↓
Backend: Execute code
  docker run --rm --memory=512m --network=none python:3.11 python script.py
  ↓
Backend: Capture output
  ↓
Backend: Run test cases
  - Compare actual vs expected
  - Track passed/failed
  ↓
Backend: Kill container
  ↓
Return: {
  success: true,
  output: '[0, 1]\n',
  testResults: [
    { passed: true, actual: [0,1], expected: [0,1] }
  ],
  executionTime: 234
}
  ↓
Frontend: Display output in OutputPanel
Frontend: Show test results (3/3 passed ✅)
Frontend: Enable "NEXT" button if all tests pass
```

### Docker Security

```javascript
// backend/src/services/codeExecution.service.js
const container = await docker.createContainer({
  Image: 'python:3.11-slim',
  Cmd: ['python', '-c', userCode],
  
  // Security limits
  HostConfig: {
    Memory: 512 * 1024 * 1024,  // 512MB
    MemorySwap: 512 * 1024 * 1024,
    CpuPeriod: 100000,
    CpuQuota: 50000,  // 50% CPU
    NetworkMode: 'none',  // No network access
    ReadonlyRootfs: true,  // Read-only filesystem
    Ulimits: [
      { Name: 'nofile', Soft: 1024, Hard: 1024 }
    ],
  },
  
  // 30 second timeout
  StopTimeout: 30,
});
```

---

## 📊 STATE MANAGEMENT (Redux)

### Redux Store Structure

```javascript
// frontend/src/store/store.js
{
  auth: {
    user: { id, email, name },
    token: 'jwt-token',
    isAuthenticated: boolean,
    loading: boolean,
  },
  
  lessons: {
    allLessons: [...],
    currentLesson: { ... },
    loading: boolean,
    error: null,
  },
  
  progress: {
    userProgress: {
      'lesson-uuid-1': { status, currentStep, code },
      'lesson-uuid-2': { ... },
    },
    loading: boolean,
  },
  
  ui: {
    showRegistrationModal: boolean,
    showPaymentModal: boolean,
    currentLessonId: string,
  }
}
```

### Example Slice

```javascript
// frontend/src/store/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: false,
  },
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
```

---

## 🗄️ LESSON SERVICE (Reading JSON Files)

### Backend Lesson Service

```javascript
// backend/src/services/lesson.service.js
const fs = require('fs').promises;
const path = require('path');

class LessonService {
  constructor() {
    this.algoDir = path.join(__dirname, '../../../algo');
    this.reactDir = path.join(__dirname, '../../../react');
    // ... other directories
  }
  
  // Get all algorithm lessons
  async getAllAlgorithms() {
    const files = await fs.readdir(this.algoDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    
    const lessons = await Promise.all(
      jsonFiles.map(async (file) => {
        const content = await fs.readFile(
          path.join(this.algoDir, file),
          'utf-8'
        );
        const lesson = JSON.parse(content);
        return {
          slug: file.replace('.json', ''),
          title: lesson.title || file,
          difficulty: lesson.difficulty || 'medium',
          // ... other metadata
        };
      })
    );
    
    return lessons;
  }
  
  // Get single lesson by slug
  async getLessonBySlug(slug) {
    const filePath = path.join(this.algoDir, `${slug}.json`);
    
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      return null;
    }
  }
  
  // Get algorithms by language (if lesson has language metadata)
  async getAlgorithmsByLanguage(language) {
    const allAlgos = await this.getAllAlgorithms();
    return allAlgos.filter(lesson => lesson.language === language);
  }
}

module.exports = new LessonService();
```

---

## 🔄 LESSON PROGRESS TRACKING

### Save Progress Flow

```
User → Completes a step in lesson
  ↓
Frontend: Auto-save every 30 seconds OR on step change
  ↓
POST /api/progress {
  lessonId: 'uuid',
  currentStep: 5,
  currentCode: 'def two_sum...',
  status: 'in_progress'
}
  ↓
Backend: Upsert progress record
  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: { currentStep, currentCode, status },
    create: { userId, lessonId, currentStep, currentCode, status }
  })
  ↓
Return: { success: true }
  ↓
Frontend: Update Redux progress state
```

### Load Progress Flow

```
User → Opens a lesson
  ↓
Frontend: Check if user has progress
  ↓
GET /api/progress/:lessonId
  ↓
Backend: Find progress record
  const progress = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId } }
  })
  ↓
Return: {
  currentStep: 5,
  currentCode: 'def two_sum...',
  status: 'in_progress'
}
  ↓
Frontend: Restore state
  - Jump to step 5
  - Load saved code into editor
  - Update progress bar
```

---

## 🚀 DEPLOYMENT ARCHITECTURE

### Production Architecture

```
                    ┌──────────────┐
                    │   Cloudflare │
                    │      CDN     │
                    └──────┬───────┘
                           │
                ┌──────────┴──────────┐
                │                     │
        ┌───────▼──────┐      ┌──────▼──────┐
        │   Vercel     │      │   Railway   │
        │  (Frontend)  │      │  (Backend)  │
        │              │      │             │
        │ React + Vite │◄────►│ Express API │
        └──────────────┘      └──────┬──────┘
                                     │
                          ┌──────────┼──────────┐
                          │          │          │
                    ┌─────▼────┐ ┌──▼───┐ ┌────▼─────┐
                    │PostgreSQL│ │Docker│ │ Stripe   │
                    │          │ │ Exec │ │          │
                    └──────────┘ └──────┘ └──────────┘
```

### Environment Variables

**Frontend (.env):**
```bash
VITE_API_URL=https://api.inpactlearn.live
VITE_STRIPE_PUBLIC_KEY=pk_live_...
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=...
```

**Backend (.env):**
```bash
DATABASE_URL=postgresql://...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
FIREBASE_PROJECT_ID=...
FIREBASE_PRIVATE_KEY=...
JWT_SECRET=...
NODE_ENV=production
PORT=3001
```

---

## 📈 PERFORMANCE OPTIMIZATION

### Frontend Optimizations

1. **Code Splitting:**
```javascript
// Lazy load pages
const PracticeTutorial = React.lazy(() => import('./pages/PracticeTutorial'));
```

2. **Image Optimization:**
- Use WebP format
- Lazy loading
- Responsive images

3. **Caching:**
```javascript
// Cache lesson data
const cachedLessons = localStorage.getItem('lessons');
if (cachedLessons) {
  return JSON.parse(cachedLessons);
}
```

### Backend Optimizations

1. **Database Indexing:**
```sql
CREATE INDEX idx_lessons_slug ON lessons(slug);
CREATE INDEX idx_progress_user ON lesson_progress(user_id);
```

2. **Response Caching:**
```javascript
// Cache lesson list for 1 hour
app.use('/api/lessons', cacheMiddleware(3600));
```

3. **Connection Pooling:**
```javascript
// Prisma connection pool
datasource db {
  url = env("DATABASE_URL")
  connection_limit = 10
}
```

---

## 🐛 ERROR HANDLING

### Frontend Error Boundaries

```javascript
// ErrorBoundary.jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please refresh.</h1>;
    }
    return this.props.children;
  }
}
```

### Backend Error Middleware

```javascript
// backend/src/middleware/errorHandler.js
exports.errorHandler = (err, req, res, next) => {
  console.error(err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
};
```

---

**Last Updated:** December 29, 2025  
**Status:** Active Development - Landing Page Complete
**Next:** Algorithms Hub → Practice Tutorial → Backend API
