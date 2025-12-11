# Universal News - Next.js Application

A modern news application built with Next.js 15, React 19, TypeScript, and Tailwind CSS.

## 📁 Simple Project Structure

```
├── app/                    # Next.js pages (routing)
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── [category]/        # Category pages
│
├── src/
│   ├── components/        # All React components
│   │   ├── home/          # Home page components
│   │   ├── news/          # News components
│   │   └── layouts/       # Layout components (Navbar, Footer)
│   │
│   ├── lib/               # Shared utilities
│   │   ├── api/          # API services
│   │   ├── hooks/        # React hooks
│   │   └── utils/        # Helper functions
│   │
│   ├── types/             # TypeScript types
│   ├── constants/         # App constants
│   ├── styles/            # Global styles
│   └── assets/            # Static assets (fonts, images)
│
└── public/                # Public files
```

## 🎯 Simple Organization

- **Components** - All UI components organized by feature (home, news, layouts)
- **Lib** - Shared code (API, hooks, utilities)
- **Types** - TypeScript type definitions
- **Constants** - Configuration values
- **Styles** - Global CSS

## 🛠️ Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env.local`:**
   ```env
   NEXT_PUBLIC_NEWS_API_KEY=your_newsapi_org_key
   NEXT_PUBLIC_NEWS_DATA_API_KEY=your_newsdata_io_key
   ```

   **⚠️ IMPORTANT for Vercel Deployment:**
   - You MUST add these environment variables in Vercel Dashboard
   - Go to: Project Settings → Environment Variables
   - Add both variables for Production, Preview, and Development
   - **Redeploy** after adding variables
   - See [docs/VERCEL_SETUP.md](./docs/VERCEL_SETUP.md) for detailed instructions

3. **Run development:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## 📱 Routes

- `/` - Home
- `/world-news` - World news
- `/business` - Business news
- `/entertainment` - Entertainment
- `/general` - General news
- `/health` - Health news
- `/science` - Science news
- `/sports` - Sports news
- `/technology` - Technology news
- `/[category]/[title]` - Article pages

## 🚀 Deployment

### Deploy to Vercel (Free Forever)

**One command deploy:**
```bash
npx vercel
```

**Or via web interface:**
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_NEWS_API_KEY`
   - `NEXT_PUBLIC_NEWS_DATA_API_KEY`
5. Deploy! 🎉

**Free tier includes:**
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS & CDN
- ✅ Custom domains
- ✅ Preview deployments

📖 **See [docs/DEPLOY.md](./docs/DEPLOY.md) for detailed deployment guide**

## 🔧 Technologies

- Next.js 15, React 19, TypeScript
- Tailwind CSS
- Lenis (Smooth Scrolling)
- Date-fns
