# Railway Deployment Guide

## 🚂 Deploying to Railway

This monorepo is configured for Railway deployment with the frontend served from the backend.

### Step 1: Connect Repository

1. Go to [Railway Dashboard](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account
5. Select repository: `phaniblend/inpact`

### Step 2: Configure Environment Variables

In Railway dashboard, add these environment variables:

```env
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=production
```

**Note**: Railway automatically sets `PORT` - don't override it.

### Step 3: Configure Build Settings

Railway will auto-detect:
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Root Directory**: `/` (root of monorepo)

### Step 4: Deploy

Railway will:
1. Install dependencies (`npm install` in root)
2. Install backend dependencies (`cd backend && npm install`)
3. Install frontend dependencies (`cd frontend && npm install`)
4. Build frontend (`npm run build`)
5. Start server (`npm start`)

### Step 5: Access Your App

Once deployed, Railway provides a URL like:
```
https://your-app-name.up.railway.app
```

Both backend API and frontend are served from this single URL:
- **API**: `https://your-app-name.up.railway.app/api/*`
- **Frontend**: `https://your-app-name.up.railway.app/*`

## 📁 Monorepo Structure

```
inpact/
├── package.json          # Root package.json with build/start scripts
├── railway.toml         # Railway configuration
├── .nixpacks.toml       # Nixpacks build configuration
├── Procfile             # Process file (alternative)
├── backend/             # Express.js backend
│   ├── src/
│   │   └── server.js    # Serves both API and frontend
│   └── package.json
└── frontend/            # React frontend
    ├── dist/            # Built frontend (generated)
    └── package.json
```

## 🔧 How It Works

1. **Build Phase**: 
   - Installs all dependencies
   - Builds frontend to `frontend/dist/`

2. **Start Phase**:
   - Runs `npm start` which executes `cd backend && npm start`
   - Backend serves:
     - API routes: `/api/*`
     - Static files: `frontend/dist/*`
     - SPA fallback: All other routes → `index.html`

## 🎯 Testing Locally (Production Mode)

```bash
# Build frontend
npm run build

# Start production server
npm start

# Access at http://localhost:3001
```

## 🐛 Troubleshooting

### Frontend Not Loading

1. Check if `frontend/dist/` exists
2. Verify build completed: `npm run build`
3. Check Railway build logs

### API Not Working

1. Check environment variables in Railway dashboard
2. Verify `OPENAI_API_KEY` is set
3. Check Railway logs for errors

### Port Issues

Railway automatically sets `PORT` - don't override it. The backend uses:
```javascript
const PORT = process.env.PORT || 3001;
```

### Build Fails

1. Check Node.js version (requires >= 18.0.0)
2. Verify all dependencies install correctly
3. Check Railway build logs for specific errors

## 📊 Monitoring

Railway provides:
- **Logs**: Real-time application logs
- **Metrics**: CPU, Memory, Network usage
- **Deployments**: Deployment history and rollback

## 🔄 Continuous Deployment

Railway automatically deploys on:
- Push to `main` branch (if configured)
- Manual deployment from dashboard

## ✅ Success Checklist

- [ ] Repository connected to Railway
- [ ] Environment variables set (`OPENAI_API_KEY`)
- [ ] Build completes successfully
- [ ] Server starts without errors
- [ ] Frontend loads at root URL
- [ ] API endpoints work (`/api/health`)
- [ ] Lesson engine works (`/lesson-engine/react/react-1-hello-world-component`)

---

**Your app is now ready for Railway deployment! 🚀**

