# AGENTS.md - Coding Agent Guidelines

> Guidelines for AI coding agents operating in the Social Games codebase.

## Build & Development Commands

```bash
npm run dev          # Start Vite dev server (hot reload)
npm run build        # TypeScript check + Vite production build
npm run lint         # Run ESLint on entire codebase
npm run preview      # Preview production build locally
npx tsc --noEmit     # Type check only (no build)
```

**No test framework installed.** If tests are added, document commands here.

## Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI primitives (Button, Card, Input, Modal)
│   └── game/         # Shared game components (Timer, ScoreBoard, etc.)
├── games/            # Game implementations (each in own folder)
├── hooks/            # Custom React hooks (useTimer, etc.)
├── stores/           # Zustand state management
├── types/            # TypeScript type definitions
├── pages/            # Route-level page components
└── index.css         # Tailwind v4 theme configuration
```

## Code Style Guidelines

### Imports
Order with blank lines between groups:
1. React/framework imports
2. Third-party libraries (framer-motion, lucide-react, react-router-dom)
3. Internal aliases (`@/components`, `@/stores`, `@/types`)
4. Relative imports (same module)

```typescript
import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

import { Button, Card } from '@/components/ui'
import { useGameStore } from '@/stores'
import type { Player } from '@/types'

import { getRandomPrompt } from './prompts'
```

Use `@/*` path alias for all src imports.

### TypeScript
- **Strict mode enabled** - no implicit any, unused locals/params are errors
- Use `interface` for object shapes, `type` for unions/primitives
- Prefer `type` imports: `import type { Player } from '@/types'`
- Export types from barrel files (`index.ts`) in each directory
- Use discriminated unions for game-specific state

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  children?: ReactNode
}

type GameStatus = 'lobby' | 'playing' | 'round-end' | 'finished'
```

### React Components
- Function components with inferred return types
- Default export for pages/games, named exports for utilities
- Props interface defined above component, named `ComponentNameProps`
- Destructure props with defaults in function signature

```typescript
interface CardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'outlined'
}

export default function Card({ children, className = '', variant = 'default' }: CardProps) {
  // ...
}
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `GameOverModal.tsx` |
| Hooks | camelCase + `use` prefix | `useTimer.ts` |
| Stores | camelCase + `Store` suffix | `gameStore.ts` |
| Types/Interfaces | PascalCase | `PlayerState` |
| Constants | SCREAMING_SNAKE_CASE | `AVATARS` |
| CSS variables | kebab-case | `--color-accent-500` |

### Tailwind CSS v4
- CSS-first config via `@theme` in `src/index.css` (no tailwind.config.js)
- Use oklch color space for custom colors
- Reference tokens as Tailwind classes or `var(--token-name)`

```css
@theme {
  --color-accent-500: oklch(0.65 0.18 30);
  --radius-card: 1.25rem;
}
```

### State Management (Zustand)
- Single store in `src/stores/gameStore.ts`
- Define store interface before implementation
- Use `set` with callback for state updates

```typescript
const useGameStore = create<GameStore>((set) => ({
  players: [],
  addPlayer: (name, avatar) => {
    set((state) => ({ players: [...state.players, newPlayer] }))
  },
}))
```

### Animation (Framer Motion)
- Use `motion` components for animated elements
- Prefer `AnimatePresence` for enter/exit animations
- Keep animations subtle - focus on high-impact moments

```tsx
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
>
```

### Error Handling
- Use early returns for guard clauses
- Type-narrow with discriminated unions, not assertions

```typescript
if (!session || !gameState) return null

if (session.gameType === 'word-chain') {
  // TypeScript knows session.gameState is WordChainState
}
```

## Design Guidelines
Reference `.github/instructions/frontend-design.instructions.md`:
- **Typography**: Distinctive fonts (Sora, DM Sans) - avoid Inter/Roboto
- **Color**: Cohesive palettes with dominant + accent colors (oklch)
- **Motion**: High-impact transitions, not scattered micro-animations
- **Backgrounds**: Layer gradients and blur for depth

Avoid "AI slop": no purple gradients, no generic fonts, no cookie-cutter patterns.

## File Organization
- Create barrel exports (`index.ts`) for each directory
- Game implementations: `src/games/{game-name}/`
- Shared UI: `src/components/ui/`
- Game-specific components stay in their game folder
- Data files (prompts, emoji lists) alongside game components
