# Project Structure - Simple & Easy to Understand

## 📁 Folder Organization

```
src/
├── components/          # All React components
│   ├── home/          # Home page components
│   ├── news/          # News-related components
│   └── layouts/       # Layout components (Navbar, Footer)
│
├── lib/               # Shared utilities
│   ├── api/          # API services
│   ├── hooks/        # React hooks
│   └── utils/        # Helper functions
│
├── types/             # TypeScript types
├── constants/         # App constants (config, routes)
├── styles/            # Global CSS
└── assets/            # Static files (fonts, images)
```

## 🎯 Simple Rules

1. **Components** - Organized by feature (home, news, layouts)
2. **Lib** - Shared code that multiple features use
3. **Types** - All TypeScript interfaces
4. **Constants** - Configuration values
5. **Styles** - Global styles only

## 📝 Import Examples

```typescript
// Components
import { Hero } from '@/src/components/home/Hero';
import { News } from '@/src/components/news/News';

// Hooks
import { useTopHeadlines } from '@/src/lib/hooks/useNews';

// Utils
import { slugify } from '@/src/lib/utils/string';

// Types
import type { NewsArticle } from '@/src/types/news';

// Constants
import { ROUTES } from '@/src/constants/routes';
```

## ✅ Benefits

- **Simple** - Flat structure, easy to navigate
- **Clear** - Each folder has a clear purpose
- **Direct** - No complex barrel exports
- **Intuitive** - Find files where you expect them

