# Deployment Guide

## Quick Start

Your Windsurf World Tour Stats app is ready to deploy! Here's how:

## 🚀 Deploy to Vercel (Recommended)

### Option 1: Vercel CLI (Fastest)

1. Install Vercel CLI globally:
```bash
npm i -g vercel
```

2. Deploy from your project directory:
```bash
vercel
```

3. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? **wwwts-web-app** (or your preferred name)
   - In which directory is your code located? **.**
   - Want to override the settings? **N**

4. Set environment variables in Vercel dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add: `VITE_API_URL` = `your-production-fastapi-url`

5. Redeploy to apply environment variables:
```bash
vercel --prod
```

### Option 2: GitHub Integration

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit: WWWTS web app"
git branch -M main
git remote add origin your-github-repo-url
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Configure:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables: Add `VITE_API_URL`
6. Click "Deploy"

## 📝 Pre-Deployment Checklist

- [ ] FastAPI backend is deployed and accessible
- [ ] Update `.env` with production API URL
- [ ] Test API endpoints are working
- [ ] Run `npm run build` locally to ensure no errors
- [ ] Check that all images/assets are loading

## 🔧 Environment Variables

Required for production:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Your FastAPI backend URL | `https://api.yoursite.com` |

## 🧪 Test Production Build Locally

Before deploying, test the production build:

```bash
npm run build
npm run preview
```

Then open `http://localhost:4173` to test.

## 📊 Expected API Endpoints

Ensure your FastAPI backend has these endpoints:

- `GET /riders` - All riders
- `GET /riders/featured` - Featured rider for landing page
- `GET /events` - All events
- `GET /events/recent` - Recent events (limit 3)
- `GET /stats/quick` - Quick stats object

## 🎨 Post-Deployment

After deployment:

1. Test all pages work correctly
2. Verify API integration is functioning
3. Check mobile responsiveness
4. Test navigation between pages
5. Verify loading states appear correctly

## 🐛 Troubleshooting

**Issue**: White screen after deployment
- **Solution**: Check browser console for errors. Usually an API URL issue.

**Issue**: API calls failing
- **Solution**: Verify `VITE_API_URL` is set correctly in Vercel and includes protocol (https://)

**Issue**: Routes not working (404 on refresh)
- **Solution**: Ensure `vercel.json` is present with rewrites configuration

**Issue**: Styles not loading
- **Solution**: Run `npm run build` locally first to check for Tailwind errors

## 📞 Need Help?

- Check Vercel deployment logs
- Verify FastAPI backend is accessible from production
- Ensure CORS is configured on your FastAPI backend to allow your Vercel domain
