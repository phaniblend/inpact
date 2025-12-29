# INPACT - Software Requirements Specification (SRS)

**Project:** INPACT - Interview Prep Platform  
**Version:** 1.0  
**Date:** December 29, 2025  
**Status:** In Development - Landing Page Complete

---

## 📋 TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [User Flow](#user-flow)
5. [Monetization Strategy](#monetization-strategy)
6. [Feature Requirements](#feature-requirements)
7. [Development Progress](#development-progress)
8. [Next Steps](#next-steps)

---

## 1. PROJECT OVERVIEW

### Purpose
INPACT is an interactive coding education platform that teaches algorithms and full-stack development through hands-on practice in a split-screen IDE environment.

### Key Differentiators
- ✅ **Learn by doing** - Real IDE, not video tutorials
- ✅ **Pay once** - $2/lesson lifetime access (no subscriptions)
- ✅ **Try before buy** - First 10 lessons free
- ✅ **Comprehensive** - 100+ algorithms + 600+ coding challenges
- ✅ **Multi-language** - 5 languages for algorithms, 8 frameworks for coding

### Target Users
1. **Job Seekers** - Preparing for technical interviews
2. **Career Switchers** - Transitioning into tech
3. **Students** - Building practical skills
4. **Interview Preppers** - FAANG interview preparation

---

## 2. SYSTEM ARCHITECTURE

### High-Level Architecture

```
┌─────────────────────────────────────────────┐
│           FRONTEND (React + Vite)            │
│                                              │
│  Landing → Algorithms/Coding Hub             │
│         → Practice Tutorial (Split Screen)   │
│         → Dashboard/Profile                  │
│                                              │
└──────────────────┬──────────────────────────┘
                   │
                   │ REST API (JSON)
                   │
┌──────────────────▼──────────────────────────┐
│         BACKEND (Express + Node.js)         │
│                                              │
│  Routes → Controllers → Services             │
│                                              │
│  - Lesson Service (reads JSON files)        │
│  - Auth Service (Firebase)                  │
│  - Payment Service (Stripe)                 │
│  - Code Execution (Docker)                  │
│                                              │
└─────┬──────────┬──────────┬─────────────────┘
      │          │          │
      ▼          ▼          ▼
┌─────────┐ ┌────────┐ ┌─────────┐
│PostgreSQL│ │Firebase│ │ Docker  │
│(Prisma) │ │ Auth   │ │Sandbox  │
│         │ │        │ │         │
│-users   │ │-OAuth  │ │-Python  │
│-progress│ │-JWT    │ │-Node.js │
│-payments│ │        │ │-Java    │
└─────────┘ └────────┘ └─────────┘
```

### Directory Structure

```
E:\projects\inpact\inpact\
│
├── algo/                    (100+ algorithm JSONs)
├── nodejs/                  (Coding challenges)
├── python/                  (Coding challenges)
├── react/                   (Coding challenges)
├── react-typescript/        (Coding challenges)
├── swift/                   (Coding challenges)
├── angular/                 (Coding challenges)
├── go/                      (Coding challenges)
├── java/                    (Coding challenges)
│
├── frontend/                (React app)
│   ├── src/
│   │   ├── pages/           (9 pages)
│   │   ├── components/      (25+ components)
│   │   ├── hooks/           (4 custom hooks)
│   │   ├── services/        (6 API services)
│   │   ├── store/           (Redux store)
│   │   ├── utils/           (Helpers)
│   │   └── styles/          (CSS)
│   └── package.json
│
├── backend/                 (Express API)
│   ├── src/
│   │   ├── routes/          (6 route files)
│   │   ├── controllers/     (5 controllers)
│   │   ├── services/        (6 services)
│   │   ├── middleware/      (4 middleware)
│   │   └── config/          (4 config files)
│   ├── prisma/              (Database schema)
│   └── package.json
│
├── scripts/                 (Helper scripts)
├── docs/                    (Documentation)
└── docker/                  (Code execution containers)
```

---

## 3. TECHNOLOGY STACK

### Frontend (JavaScript - NO TypeScript!)

**Core:**
- React 18.3.1
- Vite 5.1.4 (Build tool)
- React Router 6.22.0 (Routing)

**State Management:**
- Redux Toolkit 2.2.1
- React Redux 9.1.0

**UI/Styling:**
- Tailwind CSS 3.4.1 (INPACT branding colors)
- PostCSS + Autoprefixer

**Code Editor:**
- Monaco Editor 4.6.0 (VS Code editor)

**HTTP & Utils:**
- Axios 1.6.7 (API calls)
- React Hot Toast 2.4.1 (Notifications)

**Code Quality:**
- ESLint 8.56.0
- Prettier (formatting)

### Backend (JavaScript - NO TypeScript!)

**Core:**
- Node.js 20+
- Express (Web framework)

**Database:**
- PostgreSQL 15
- Prisma (ORM)

**Authentication:**
- Firebase Auth (OAuth + Email)
- JWT tokens

**Payments:**
- Stripe (Checkout API)

**Code Execution:**
- Docker containers (Python, Node.js, Java)

**Utils:**
- Winston (Logging)
- Bcrypt (Password hashing)

---

## 4. USER FLOW

### Complete User Journey

```
1. Landing Page
   ↓
2. Choose Path: Algorithms OR Coding
   ↓
3. Browse Lessons (Filter by language/framework)
   ↓
4. Click Lesson → Practice Tutorial Opens
   ↓
5. Split Screen: 
   - Left (35%): Instructions
   - Right (65%): Code Editor
   ↓
6. Write Code → Run → See Output
   ↓
7. Complete Lessons 1-5 (FREE, no auth)
   ↓
8. Lesson 6: Registration Modal
   - Email OR Google/GitHub
   ↓
9. Complete Lessons 6-10 (FREE after registration)
   ↓
10. Lesson 11: Payment Modal
    - $2 Stripe checkout
    ↓
11. Lessons 11+: Lifetime access after payment
    ↓
12. Dashboard: Track progress, continue learning
```

### Monetization Triggers

**Lesson 1-5:**
- FREE
- No registration required
- Goal: Hook users

**Lesson 6:**
- **REGISTRATION MODAL**
- Email or OAuth
- Goal: Capture leads

**Lesson 6-10:**
- FREE after registration
- Goal: Build habit

**Lesson 11:**
- **PAYMENT MODAL**
- $2 one-time payment
- Lifetime access
- Goal: Convert to paid

**Lesson 11+:**
- Unlimited access after payment
- Goal: High LTV per user

---

## 5. MONETIZATION STRATEGY

### Pricing Model

**Free Tier:**
- Lessons 1-5: No registration
- Lessons 6-10: After registration
- Total: 10 free lessons per topic

**Paid Tier:**
- $2 per lesson (one-time)
- Lifetime access
- No subscriptions
- No recurring payments

### Revenue Projections

**Conservative:**
- 1,000 users/month
- 30% register (300 users)
- 20% pay (60 users)
- 60 users × $2 × 25 lessons = $3,000/month

**Moderate:**
- 5,000 users/month
- 35% register (1,750 users)
- 25% pay (438 users)
- 438 users × $2 × 30 lessons = $26,280/month

**Optimistic:**
- 10,000 users/month
- 40% register (4,000 users)
- 30% pay (1,200 users)
- 1,200 users × $2 × 40 lessons = $96,000/month

### vs Competitors

**LeetCode:** $35/month subscription = $420/year
**Codecademy:** $40/month = $480/year
**INPACT:** $2 × 50 lessons = $100 one-time

**Competitive Advantage:** 5x cheaper + lifetime access

---

## 6. FEATURE REQUIREMENTS

### MVP Features (Phase 1)

**Landing Page:** ✅ COMPLETE
- Hero section with value prop
- How it works (4 steps)
- Learning paths (Algorithms + Coding)
- Who is this for
- Footer

**Algorithms Hub:** 🚧 IN PROGRESS
- Language selection (Python, JS, Java, C++, TS)
- Category filtering (Sorting, DP, etc.)
- Lesson cards with:
  - Title
  - Difficulty badge
  - Lock icon (for lessons 11+)
  - FREE badge (for lessons 1-10)
- Click → Opens Practice Tutorial

**Coding Hub:** 📋 TODO
- Framework selection (React, Angular, Node.js, etc.)
- Challenge categories
- Lesson cards
- Click → Opens Practice Tutorial

**Practice Tutorial:** 📋 TODO (CRITICAL)
- Split screen layout:
  - Left 35%: Instructions panel
  - Right 65%: Monaco code editor
- Step-by-step navigation
- Run code button
- Output panel
- Progress tracking
- NEXT lesson button

**Registration Modal:** 📋 TODO
- Triggered at lesson 6
- Email input + password
- Google OAuth button
- GitHub OAuth button
- "5 more FREE lessons await" message

**Payment Modal:** 📋 TODO
- Triggered at lesson 11
- $2 pricing display
- Stripe checkout integration
- "Lifetime access" messaging
- 4 value propositions

**Dashboard:** 📋 TODO
- Progress overview
- Purchased lessons
- Continue learning section
- Achievements

### Phase 2 Features (Future)

- [ ] Progress persistence (save code)
- [ ] Achievements/badges
- [ ] Leaderboards
- [ ] Social login (Google, GitHub)
- [ ] Email notifications
- [ ] User profile customization
- [ ] Lesson ratings/reviews

---

## 7. DEVELOPMENT PROGRESS

### ✅ Completed

**Frontend Setup:**
- [x] Package.json (dependencies)
- [x] Vite config
- [x] index.html (entry point)
- [x] Tailwind config (INPACT colors)
- [x] PostCSS config
- [x] Global styles (CSS)
- [x] main.jsx (React entry)
- [x] App.jsx (Router setup)
- [x] Landing page (FULL implementation)
- [x] Navbar component (INPACT branding)
- [x] AlgorithmsHub placeholder

**Project Structure:**
- [x] All 100+ empty files created
- [x] Frontend folder structure
- [x] Backend folder structure
- [x] Scripts, docs, docker folders

**Branding:**
- [x] INPACT colors defined
- [x] Logo style: `{IN}PACT`
- [x] Green (#9bf945) + Navy (#0f172a) theme
- [x] ContributEd-inspired design

### 🚧 In Progress

**Frontend:**
- [ ] AlgorithmsHub (full implementation)
- [ ] Coding hub placeholder

### 📋 TODO (Priority Order)

**HIGH PRIORITY:**
1. **AlgorithmsHub Page** - Show all algorithm lessons
2. **Practice Tutorial Page** - Split-screen IDE
3. **Backend Lesson Service** - Read algo/*.json files
4. **Backend Execute Service** - Run code in Docker
5. **Registration Modal** - Email + OAuth
6. **Payment Modal** - Stripe integration

**MEDIUM PRIORITY:**
7. CodingHub page
8. Dashboard page
9. Profile page
10. Login/Register pages

**LOW PRIORITY:**
11. Achievements
12. Leaderboards
13. Social features

---

## 8. NEXT STEPS

### Immediate Actions (Session Continuity)

1. **Complete AlgorithmsHub Page:**
   - Language selection cards
   - List all algo/*.json files
   - Filter by difficulty/category
   - Click → Navigate to Practice Tutorial

2. **Build Practice Tutorial:**
   - Split-screen layout
   - Load lesson from backend API
   - Monaco code editor integration
   - Run code functionality
   - Output display

3. **Backend API - Lesson Endpoint:**
   - GET /api/lessons (list all)
   - GET /api/lessons/:slug (get single)
   - Reads from E:\projects\inpact\inpact\algo\

4. **Backend API - Execute Endpoint:**
   - POST /api/execute
   - Accepts: code, language, test cases
   - Returns: output, test results

### File Population Order

**Next Files to Code:**
1. `frontend/src/pages/AlgorithmsHub.jsx` (full version)
2. `frontend/src/pages/CodingHub.jsx` (placeholder)
3. `frontend/src/pages/PracticeTutorial.jsx` (CRITICAL)
4. `frontend/src/components/lesson/CodeEditor.jsx`
5. `frontend/src/components/lesson/InstructionsPanel.jsx`
6. `frontend/src/components/lesson/OutputPanel.jsx`
7. `backend/src/services/lesson.service.js` (read JSON files)
8. `backend/src/controllers/lessons.controller.js`
9. `backend/src/routes/lessons.routes.js`
10. `backend/src/server.js` (start Express)

---

## 9. CRITICAL DESIGN DECISIONS

### Why JavaScript (Not TypeScript)?

**Decision:** Use pure JavaScript for both frontend and backend

**Reasons:**
1. **Faster iteration** - No compilation step
2. **Simpler debugging** - Direct code execution
3. **Less tooling** - No tsconfig.json complexity
4. **Single developer** - Type safety less critical
5. **Build speed** - Faster CI/CD

**Trade-offs:**
- ❌ No compile-time type checking
- ✅ ESLint + JSDoc for quality
- ✅ Faster development velocity

### Why Not Move Lesson Files?

**Decision:** Backend reads lesson JSONs directly from existing folders

**Structure:**
```
algo/two-sum.json → Backend reads this file directly
react/react-1.json → Backend reads this file directly
```

**Reasons:**
1. **No duplication** - Don't store in database AND files
2. **Easy updates** - Edit JSON files directly
3. **Git-friendly** - Track lesson changes
4. **Simpler architecture** - Database stores metadata only

**Database stores:**
- Lesson metadata (title, difficulty, slug)
- User progress
- Payment records

**NOT stored in DB:**
- Lesson content (read from files)

---

## 10. API ENDPOINTS (Backend)

### Lessons API

**GET /api/lessons**
- Returns: Array of all lessons
- Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "slug": "two-sum",
      "title": "Two Sum",
      "type": "algorithm",
      "difficulty": "easy",
      "isPremium": false,
      "lessonNumber": 1
    }
  ]
}
```

**GET /api/lessons/:slug**
- Returns: Full lesson content from JSON file
- Response:
```json
{
  "success": true,
  "data": {
    "slug": "two-sum",
    "title": "Two Sum",
    "flow": [ /* lesson steps */ ],
    "starterCode": "def two_sum(nums, target):\n    pass",
    "testCases": [ /* test cases */ ]
  }
}
```

**GET /api/lessons/algorithms/:language**
- Returns: All algorithms for a language
- Example: /api/lessons/algorithms/python

**GET /api/lessons/coding/:framework**
- Returns: All coding challenges for a framework
- Example: /api/lessons/coding/react

### Execute API

**POST /api/execute**
- Request:
```json
{
  "language": "python",
  "code": "def two_sum(nums, target):\n    return [0, 1]",
  "testCases": [
    { "input": {"nums": [2,7,11,15], "target": 9}, "expected": [0,1] }
  ]
}
```
- Response:
```json
{
  "success": true,
  "output": "[0, 1]\n",
  "testResults": [
    { "passed": true, "actual": [0,1], "expected": [0,1] }
  ],
  "executionTime": 234
}
```

### Auth API

**POST /api/auth/register**
- Email + password registration
- Returns: JWT token

**POST /api/auth/login**
- Email + password login
- Returns: JWT token

**POST /api/auth/oauth/google**
- Google OAuth callback
- Returns: JWT token

### Progress API

**GET /api/progress/:userId**
- Returns: All progress for user

**POST /api/progress**
- Save lesson progress
- Tracks: currentStep, code, completion

### Payments API

**POST /api/payments/checkout**
- Create Stripe checkout session
- Returns: Stripe session URL

**POST /api/payments/webhook**
- Stripe webhook handler
- Updates payment status

---

## 11. DATABASE SCHEMA

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  hashed_password VARCHAR(255),
  auth_provider VARCHAR(50) DEFAULT 'email',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Lessons Table (Metadata Only!)
```sql
CREATE TABLE lessons (
  id UUID PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  lesson_number INT NOT NULL,
  type VARCHAR(50) NOT NULL,  -- 'algorithm' | 'coding'
  language VARCHAR(50),        -- 'python' | 'javascript' | etc
  framework VARCHAR(50),       -- 'react' | 'angular' | etc
  title VARCHAR(255) NOT NULL,
  difficulty VARCHAR(20),      -- 'easy' | 'medium' | 'hard'
  category VARCHAR(100),
  is_premium BOOLEAN DEFAULT false,
  file_path VARCHAR(500) NOT NULL,  -- '../algo/two-sum.json'
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Lesson Progress Table
```sql
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  lesson_id UUID REFERENCES lessons(id),
  status VARCHAR(50) DEFAULT 'not_started',
  current_step INT DEFAULT 0,
  current_code TEXT,
  tests_passed INT DEFAULT 0,
  completed_at TIMESTAMP,
  UNIQUE(user_id, lesson_id)
);
```

### Payments Table
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  lesson_id UUID REFERENCES lessons(id),
  stripe_payment_id VARCHAR(255) UNIQUE,
  amount INT NOT NULL,  -- in cents
  status VARCHAR(50),   -- 'pending' | 'succeeded' | 'failed'
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 12. DEPLOYMENT STRATEGY

### Frontend Deployment (Vercel)

**Steps:**
1. Connect GitHub repo to Vercel
2. Configure build:
   - Build command: `npm run build`
   - Output directory: `dist`
3. Environment variables:
   - VITE_API_URL
   - VITE_STRIPE_PUBLIC_KEY
4. Deploy → Get URL: inpact-learn.vercel.app

### Backend Deployment (Railway)

**Steps:**
1. Connect GitHub repo to Railway
2. Configure:
   - Start command: `node src/server.js`
3. Add services:
   - PostgreSQL database
4. Environment variables:
   - DATABASE_URL
   - STRIPE_SECRET_KEY
   - FIREBASE credentials
5. Deploy → Get API URL

### Domain Setup

**Custom Domain:**
- www.inpactlearn.live
- Frontend: Vercel
- Backend: Railway
- Configure DNS

---

## 13. TESTING STRATEGY

### Frontend Testing

**Unit Tests (Jest + React Testing Library):**
- Component rendering
- User interactions
- State management

**E2E Tests (Playwright):**
- User registration flow
- Lesson completion flow
- Payment flow

### Backend Testing

**Unit Tests (Jest):**
- Service logic
- Controller responses
- Middleware validation

**Integration Tests:**
- API endpoints
- Database operations
- External service mocks

### Manual Testing Checklist

- [ ] Landing page loads
- [ ] Navigation works
- [ ] Algorithms hub shows lessons
- [ ] Practice tutorial loads
- [ ] Code editor works
- [ ] Code execution works
- [ ] Registration modal appears at lesson 6
- [ ] Payment modal appears at lesson 11
- [ ] Stripe checkout works
- [ ] Dashboard shows progress

---

## 14. SUCCESS METRICS

### User Acquisition
- Landing page visitors
- Conversion to first lesson
- Source attribution

### Engagement
- Lessons started per user
- Lessons completed per user
- Time spent per lesson
- Return rate (D1, D7, D30)

### Monetization
- Registration rate (lesson 6)
- Payment conversion rate (lesson 11)
- Average revenue per user (ARPU)
- Lifetime value (LTV)

### Quality
- Lesson completion rate
- Code execution success rate
- User satisfaction (NPS)
- Support tickets per 100 users

---

## 15. RISKS & MITIGATION

### Technical Risks

**Risk:** Code execution security
**Mitigation:** Docker sandboxing, resource limits, timeout

**Risk:** Database performance
**Mitigation:** Indexing, caching, connection pooling

**Risk:** Payment fraud
**Mitigation:** Stripe fraud detection, rate limiting

### Business Risks

**Risk:** Low conversion at lesson 11
**Mitigation:** Strong lesson 1-10, clear value prop

**Risk:** User churn
**Mitigation:** Engaging content, progress tracking

**Risk:** Competitor pricing
**Mitigation:** Differentiation (no subscriptions)

---

## 16. FUTURE ENHANCEMENTS

### Phase 2 (Month 2-3)
- Social login (Google, GitHub)
- Achievement badges
- Leaderboards
- Email notifications
- Progress analytics

### Phase 3 (Month 4-6)
- Community features
- Discussion forums
- Code reviews
- Mentor matching

### Phase 4 (Month 7-12)
- Mobile app (React Native)
- Offline mode
- Video explanations
- Live coding sessions
- Team subscriptions

---

## 17. CONTACT & SUPPORT

**Developer:** Claude (AI Assistant)
**Human Assistant:** Venky
**Repository:** https://github.com/phaniblend/inpact.git
**Location:** E:\projects\inpact\inpact\

---

**Last Updated:** December 29, 2025
**Status:** Landing Page Complete, Algorithms Hub In Progress
**Next Priority:** Complete Algorithms Hub → Practice Tutorial
