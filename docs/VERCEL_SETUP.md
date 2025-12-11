# Vercel Deployment Setup Guide

## 🔑 Environment Variables Setup

Your app requires API keys to fetch news. You **MUST** set these in Vercel for the app to work.

### Required Environment Variables

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project: `Universal_News`

2. **Navigate to Settings**
   - Click on your project
   - Go to **Settings** → **Environment Variables**

3. **Add Environment Variables**

   Add these two variables:

   ```
   NEXT_PUBLIC_NEWS_API_KEY = your_newsapi_org_key_here
   NEXT_PUBLIC_NEWS_DATA_API_KEY = your_newsdata_io_key_here
   ```

4. **Select Environments**
   - ✅ **Production**
   - ✅ **Preview**
   - ✅ **Development**

5. **Save and Redeploy**
   - Click **Save**
   - Go to **Deployments** tab
   - Click the **3 dots** (⋯) on the latest deployment
   - Click **Redeploy**

## 🔍 How to Get API Keys

### NewsAPI.org (Free Tier)
1. Visit: https://newsapi.org/register
2. Sign up for a free account
3. Get your API key from the dashboard
4. Free tier: 100 requests/day

### NewsData.io (Free Tier)
1. Visit: https://newsdata.io/register
2. Sign up for a free account
3. Get your API key from the dashboard
4. Free tier: 200 requests/day

## ⚠️ Troubleshooting 500 Errors

### Check 1: Environment Variables
- ✅ Go to Vercel Dashboard → Settings → Environment Variables
- ✅ Verify both variables are set
- ✅ Check they're enabled for Production environment
- ✅ Make sure there are no extra spaces in the values

### Check 2: Redeploy After Adding Variables
- Environment variables only take effect after redeployment
- After adding variables, **always redeploy**

### Check 3: Verify API Keys
- Test your API keys locally first
- Make sure they're valid and not expired
- Check API key usage limits

### Check 4: Check Vercel Logs
1. Go to Vercel Dashboard → Your Project → **Deployments**
2. Click on the failed deployment
3. Check **Function Logs** or **Build Logs**
4. Look for error messages about missing API keys

## 🧪 Test Locally First

Before deploying, test locally:

1. Create `.env.local` file:
   ```env
   NEXT_PUBLIC_NEWS_API_KEY=your_key_here
   NEXT_PUBLIC_NEWS_DATA_API_KEY=your_key_here
   ```

2. Run locally:
   ```bash
   npm run dev
   ```

3. Verify news loads correctly

4. Then deploy to Vercel with the same keys

## 📝 Quick Checklist

- [ ] API keys obtained from NewsAPI.org and NewsData.io
- [ ] Environment variables added in Vercel Dashboard
- [ ] Variables enabled for Production, Preview, and Development
- [ ] No extra spaces in variable values
- [ ] Project redeployed after adding variables
- [ ] Tested locally with `.env.local` first

## 🆘 Still Getting 500 Errors?

1. **Check Vercel Function Logs**
   - Look for specific error messages
   - Check if API keys are being read correctly

2. **Verify API Key Format**
   - NewsAPI keys usually start with specific format
   - NewsData keys have their own format
   - Make sure you copied the full key

3. **Check API Rate Limits**
   - Free tiers have daily limits
   - If exceeded, you'll get 429 errors (not 500)
   - Wait 24 hours or upgrade plan

4. **Test API Keys Directly**
   ```bash
   curl "https://newsapi.org/v2/top-headlines?country=us&apiKey=YOUR_KEY"
   ```

## 💡 Pro Tips

- **Use different keys for development and production** (optional)
- **Monitor API usage** in your API provider dashboards
- **Set up alerts** for rate limit warnings
- **Cache responses** to reduce API calls (already configured)

---

**Need help?** Check Vercel's documentation: https://vercel.com/docs/environment-variables

