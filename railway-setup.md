# Railway Setup Guide

## Deploy Backend to Railway

1. **Create Railway Account**: Sign up at https://railway.app
2. **Deploy from GitHub**: 
   - Connect your GitHub repository
   - Select the `railway-backend` folder
   - Railway will auto-deploy

3. **Get Your URL**: 
   - Copy your Railway app URL (e.g., `https://your-app-name.up.railway.app`)
   - Update `API_URL` in `api.js` with your Railway URL

4. **Environment Variables** (if needed):
   - `PORT` - Railway sets automatically
   - `NODE_ENV` - Set to `production`

## Railway Free Tier
- **$5/month credit** - Usually covers small websites
- **Automatic scaling**
- **Custom domains** available
- **Database included**

## Switch Back to Free
To return to free localStorage, change in `api.js`:
```javascript
const USE_FREE_STORAGE = true;
```

Your website now uses Railway for backend storage with automatic fallback to localStorage if Railway is unavailable.