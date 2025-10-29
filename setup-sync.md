# Cross-Device Sync Setup

## Current Issue
Data is stored locally on each device. To sync across devices, you need to set up GitHub API sync.

## Setup Steps

### 1. Create GitHub Personal Access Token
1. Go to GitHub.com → Settings → Developer settings → Personal access tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo` (full repository access)
4. Copy the token (starts with `ghp_`)

### 2. Enable Auto-Sync
1. Login as MasterLogin on your website
2. Go to Admin page
3. Enter your GitHub token and repository name
4. Click "Enable Auto-Sync"

### 3. Test Sync
1. Add a listing on one device
2. Check if it appears on another device
3. Register a user on mobile
4. Login with that user on desktop

## Alternative: Manual Sync
If GitHub API doesn't work:
1. Admin → Export Listings JSON
2. Upload to GitHub repository at `data/listings.json`
3. Export Users JSON
4. Upload to GitHub repository at `data/users.json`

## Verification
- Open sync-test.html to verify all tests pass
- Check browser console for sync messages
- Ensure GitHub repository has data/ folder with JSON files

Without GitHub API setup, each device will only see its own local data.