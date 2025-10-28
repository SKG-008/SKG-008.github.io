# Free Setup Guide for Virtual.Market

This guide shows how to set up the property listing website using only free services.

## Option 1: GitHub Pages + JSON File (Completely Free)

### Setup Steps:
1. **Create GitHub Repository**
   - Fork or create a new repository
   - Enable GitHub Pages in repository settings

2. **Configure API URL**
   - In `api.js`, update the GitHub repository information
   - Images will be stored as compressed base64 in the JSON file

3. **Deploy**
   - Push your code to GitHub
   - Access via GitHub Pages URL

### Limitations:
- Manual sync required for listings
- Images stored as base64 (compressed to ~50KB each)
- Max 3 images per listing

## Option 2: Free Hosting + Free Database

### Recommended Free Services:
1. **Frontend Hosting**: Netlify, Vercel, or GitHub Pages
2. **Backend**: Railway, Render, or Heroku (free tiers)
3. **Database**: MongoDB Atlas (free tier - 512MB)

### Setup Steps:

#### 1. MongoDB Atlas Setup (Free)
1. Create account at mongodb.com
2. Create free cluster (M0 Sandbox - 512MB)
3. Create database user
4. Get connection string

#### 2. Backend Setup (Railway - Free)
1. Create account at railway.app
2. Deploy from GitHub repository
3. Add environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `PORT`: 3000

#### 3. Update Frontend
1. Update `API_URL` in `api.js` with your Railway URL
2. Deploy frontend to Netlify/Vercel

## Free Tier Limits

### MongoDB Atlas (Free):
- 512MB storage
- Shared RAM and vCPU
- No backup/restore
- **Estimated capacity**: ~2,000-5,000 listings with images

### Railway (Free):
- $5 credit per month
- 500 hours execution time
- 1GB RAM, 1 vCPU
- **Estimated usage**: Supports moderate traffic

### Netlify/Vercel (Free):
- 100GB bandwidth per month
- Unlimited sites
- Custom domains
- **Perfect for**: Frontend hosting

## Cost Optimization Tips

1. **Image Compression**:
   - Images automatically compressed to ~50KB
   - Reduces database storage by 90%

2. **Efficient Database Usage**:
   - Only essential data stored
   - Automatic cleanup of old listings

3. **CDN Benefits**:
   - Free CDN with Netlify/Vercel
   - Fast global loading

## Scaling Options

When you outgrow free tiers:

1. **MongoDB Atlas**: $9/month for 2GB
2. **Railway**: Pay-as-you-go after free credit
3. **Netlify Pro**: $19/month for advanced features

## Alternative Free Options

### Supabase (PostgreSQL):
- 500MB database
- 2GB bandwidth
- Real-time subscriptions
- Built-in authentication

### PlanetScale (MySQL):
- 5GB storage
- 1 billion row reads/month
- Branching workflow

### Firebase (Google):
- 1GB storage
- 10GB bandwidth
- Real-time database
- Authentication included

## Recommended Setup for Beginners

1. **Start with**: GitHub Pages + JSON file storage
2. **When ready to scale**: Move to Railway + MongoDB Atlas
3. **For production**: Consider paid tiers for reliability

This approach ensures your property listing website remains completely free while providing professional functionality.