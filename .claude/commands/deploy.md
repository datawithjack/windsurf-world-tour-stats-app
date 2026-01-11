---
description: Deploy frontend to Vercel production
allowed-tools: Bash
---

# Deploy Frontend to Vercel

Deploy the frontend application to Vercel production.

## Steps

1. **Build the frontend**
   ```bash
   cd frontend && npm run build
   ```

2. **Check for build errors** - If any errors, stop and report them

3. **Deploy to Vercel**
   ```bash
   cd frontend && vercel --prod
   ```

4. **Report the deployment URL** when complete

## Notes
- Frontend is in the `frontend/` subdirectory
- Vercel config is in `frontend/vercel.json`
- Environment variable `VITE_API_URL` should be set in Vercel dashboard
