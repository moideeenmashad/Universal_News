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
   NEXT_PUBLIC_NEWS_API_KEY=your_key
   NEXT_PUBLIC_NEWS_DATA_API_KEY=your_key
   ```

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

## 🔧 Technologies

- Next.js 15, React 19, TypeScript
- Tailwind CSS
- React Query
- Axios
