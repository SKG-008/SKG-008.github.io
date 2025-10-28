# GitHub Sync Setup Guide

## How It Works
- **Local Storage**: New listings saved to browser localStorage
- **GitHub Storage**: Shared listings loaded from `data/listings.json`
- **Automatic Merge**: Combines both sources for complete listing display

## Setup Steps

1. **Enable Auto-Sync** (Admin Panel):
   - Login as MasterLogin
   - Go to Admin page
   - Click "Enable Auto-Sync"

2. **Export Listings**:
   - Click "Export Listings JSON"
   - Downloads `listings.json` file

3. **Upload to GitHub**:
   - Go to your GitHub repository
   - Navigate to `data/` folder
   - Upload the downloaded `listings.json` file
   - Commit changes

4. **Deploy**:
   - GitHub Pages automatically updates
   - All users now see shared listings

## Benefits
- ✅ **Free Forever** - No hosting costs
- ✅ **Shared Data** - All users see same listings
- ✅ **Backup** - Listings stored on GitHub
- ✅ **Version Control** - Track all changes
- ✅ **Offline Support** - Works without internet

## Usage
- **Add Listings**: Saved locally + auto-exported
- **View Listings**: Loads from GitHub + local storage
- **Sync**: Manual export when needed

Your website now uses GitHub as free shared storage!