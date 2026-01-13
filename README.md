# Social Games

A collection of fun, local multiplayer party games built with React, TypeScript, and Tailwind CSS v4.

## Games Included

### Word Chain
Players take turns saying words that start with the last letter of the previous word. Each player has 3 lives and 15 seconds per turn. No repeating words allowed!

### Quick Draw
One player draws a prompt while others try to guess what it is. Features a full drawing canvas with colors, brush sizes, and eraser. 60 seconds per round.

### Emoji Charades
Describe movies, songs, phrases, or books using only emojis. Other players race to guess correctly. 45 seconds per round.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd social-games
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory. Preview the production build locally:

```bash
npm run preview
```

## How to Play

1. **Select a Game** - Choose from Word Chain, Quick Draw, or Emoji Charades on the home screen

2. **Add Players** - Add at least 2 players with names and avatar emojis

3. **Start Playing** - Pass the device between players when it's their turn

4. **Score Points** - Points are awarded based on correct answers and speed

5. **Win!** - The player with the most points at the end wins

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite 6** - Build tool and dev server
- **Tailwind CSS v4** - Styling with CSS-first configuration
- **Zustand** - State management
- **Framer Motion** - Animations
- **React Router v7** - Navigation
- **Lucide React** - Icons

## Project Structure

```
src/
├── components/
│   ├── ui/           # Button, Card, Input, Modal
│   └── game/         # Timer, ScoreBoard, TurnIndicator, GameOverModal
├── games/
│   ├── word-chain/   # Word Chain game
│   ├── quick-draw/   # Quick Draw game with canvas
│   └── emoji-charades/ # Emoji Charades game
├── hooks/            # useTimer custom hook
├── stores/           # Zustand game store
├── types/            # TypeScript definitions
├── pages/            # Home and GameLobby pages
└── index.css         # Tailwind theme configuration
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Contributing

1. Follow the coding guidelines in `AGENTS.md`
2. Use conventional commits for commit messages
3. Run `npm run build` before submitting to ensure no type errors

## License

MIT
