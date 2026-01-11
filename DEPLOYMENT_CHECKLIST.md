# Railway Deployment Checklist

## ✅ Pre-Deployment

- [x] Root `package.json` created with build/start scripts
- [x] `railway.toml` configured
- [x] `.nixpacks.toml` configured
- [x] `Procfile` created
- [x] Backend updated to serve frontend static files
- [x] Frontend API calls use relative paths (no hardcoded localhost)
- [x] Vite config updated for production builds
- [x] Server listens on `0.0.0.0` and uses `PORT` env variable
- [x] `.gitignore` updated

## 🚀 Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Configure for Railway monorepo deployment"
   git push origin main
   ```

2. **Connect to Railway**
   - Go to https://railway.app
   - New Project → Deploy from GitHub
   - Select `phaniblend/inpact`

3. **Set Environment Variables**
   - `OPENAI_API_KEY` = your API key
   - `NODE_ENV` = `production` (optional, Railway sets this)

4. **Deploy**
   - Railway auto-detects build/start commands
   - Monitor build logs
   - Check deployment URL

## 🧪 Post-Deployment Testing

- [ ] Health check: `https://your-app.up.railway.app/api/health`
- [ ] Frontend loads: `https://your-app.up.railway.app`
- [ ] API works: `https://your-app.up.railway.app/api/lessons/algorithms`
- [ ] Lesson engine: `https://your-app.up.railway.app/lesson-engine/react/react-1-hello-world-component`

## 📝 Notes

- Railway automatically sets `PORT` - don't override
- Frontend is built during deployment
- Both API and frontend served from same URL
- All API calls use relative paths (no CORS issues)

---

**Ready to deploy! 🚂**

