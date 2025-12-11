# API Configuration Setup

## Required: News API Key

Your Universal News app requires API keys to fetch news data. Follow these steps:

### 1. Get Your News API Key

1. Go to [NewsAPI.org](https://newsapi.org/register)
2. Sign up for a **free account**
3. Copy your API key from the dashboard

### 2. Configure Environment Variables

1. Create a `.env.local` file in the root directory:
   ```bash
   # In PowerShell
   New-Item -Path .env.local -ItemType File
   ```

2. Add your API key to `.env.local`:
   ```env
   NEXT_PUBLIC_NEWS_API_KEY=your_actual_api_key_here
   ```

3. **(Optional)** For additional news sources, get a NewsData.io key:
   - Go to [NewsData.io](https://newsdata.io/register)
   - Add to `.env.local`:
     ```env
     NEXT_PUBLIC_NEWS_DATA_API_KEY=your_newsdata_key_here
     ```

### 3. Restart the Development Server

After adding your API keys, restart the dev server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Troubleshooting

### "News is not coming" or No Data Displayed

**Cause**: Missing or invalid API keys

**Solution**:
1. Check that `.env.local` exists in the root directory
2. Verify your API key is correct (no extra spaces)
3. Restart the dev server after adding keys
4. Check browser console for specific error messages

### API Rate Limits

The free NewsAPI plan has limits:
- **100 requests per day** for development
- **500 requests per day** with attribution

If you hit the limit, you'll need to:
- Wait 24 hours for reset
- Upgrade to a paid plan
- Use caching (already implemented in the app)

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_NEWS_API_KEY` | ✅ Yes | NewsAPI.org API key for fetching news |
| `NEXT_PUBLIC_NEWS_DATA_API_KEY` | ❌ Optional | NewsData.io API key for additional sources |

## Security Notes

- ✅ `.env.local` is already in `.gitignore` - your keys won't be committed
- ✅ Use `NEXT_PUBLIC_` prefix for client-side access
- ⚠️ Never commit API keys to version control
- ⚠️ Free tier keys have rate limits - monitor usage

## Next Steps

Once configured, your app will:
1. ✅ Fetch top headlines by category
2. ✅ Display latest news
3. ✅ Enable search functionality
4. ✅ Show article details
5. ✅ Cache responses to minimize API calls
