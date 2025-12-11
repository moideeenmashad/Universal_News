# API Caching System

## Overview

This application includes a file-based caching system that saves API responses to JSON files. This ensures the app continues to work even when:

- API keys are missing in production
- External APIs are blocked or unavailable
- Network requests fail
- API rate limits are exceeded

## How It Works

1. **First Request**: Calls the external API → Saves response to `.cache/news/`
2. **Subsequent Requests**: 
   - If API works → Returns fresh data and updates cache
   - If API fails → Returns cached data (no error!)
3. **Cache Expiration**: Cache expires after 1 hour, then refreshes automatically

## Cache Location

All cache files are stored in: `.cache/news/`

Each cache file is named based on the request type:
- `headlines_general_us_20.json` - Headlines for general category
- `everything_technology_20.json` - Search results for "technology"
- `latest_worldnews.json` - Latest world news

## Automatic Fallback

The system automatically falls back to cached data when:

- ✅ API request fails (network error, timeout)
- ✅ API returns error status
- ✅ API key is missing or invalid
- ✅ API is blocked in production

**No errors are shown to users** - they just see cached data seamlessly.

## Manual Cache Pre-population (Optional)

To pre-populate cache with sample data:

```bash
# Install ts-node if needed
npm install --save-dev ts-node

# Run pre-population script
npm run prepopulate-cache
```

This creates sample cache files that can be committed to the repository for initial fallback data.

## Cache in Production

### Option 1: Let it build naturally
- First deployment will cache data when API works
- Subsequent requests use cached data if API fails

### Option 2: Commit cache files (Recommended)
1. Run the app locally with valid API keys
2. Let it cache real data
3. Commit the `.cache/` directory
4. Deploy - app will have real cached data even if API is blocked

### Option 3: Use pre-populated sample data
1. Run `npm run prepopulate-cache`
2. Commit the `.cache/` directory
3. Deploy - app will have sample data as fallback

## Cache Management

- **Auto-cleanup**: Cache files older than 1 hour are automatically ignored
- **Auto-update**: When API works again, cache is refreshed automatically
- **No manual intervention needed**: System handles everything automatically

## Benefits

✅ **No production errors** - App always has data to show  
✅ **Faster loading** - Cached data loads instantly  
✅ **Works offline** - Cached data available even without API  
✅ **Auto-recovery** - Automatically updates when API works again  
✅ **Zero configuration** - Works out of the box  

## File Structure

```
.cache/
└── news/
    ├── headlines_general_us_20.json
    ├── headlines_sports_us_20.json
    ├── everything_technology_20.json
    └── latest_worldnews.json
```

Each cache file contains:
```json
{
  "data": { /* API response */ },
  "timestamp": 1234567890
}
```

## Troubleshooting

**Cache not working?**
- Check that `.cache/` directory exists and is writable
- Verify file permissions on the server
- Check server logs for cache save/load messages

**Want to clear cache?**
- Delete `.cache/` directory
- Cache will rebuild automatically on next request

**Cache too old?**
- Cache auto-expires after 1 hour
- Or delete specific cache files to force refresh

