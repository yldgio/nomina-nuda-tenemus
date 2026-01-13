import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Link2, Brush, MessageCircle, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui'
import type { GameType } from '@/types'

interface GameInfo {
  type: GameType
  name: string
  description: string
  icon: React.ReactNode
  color: string
  gradient: string
}

const games: GameInfo[] = [
  {
    type: 'word-chain',
    name: 'Word Chain',
    description: 'Chain words by their last letter. Quick thinking wins!',
    icon: <Link2 size={32} />,
    color: 'text-teal-500',
    gradient: 'from-teal-500/20 to-teal-600/5',
  },
  {
    type: 'quick-draw',
    name: 'Quick Draw',
    description: 'Draw fast, guess faster. Simple shapes, big laughs!',
    icon: <Brush size={32} />,
    color: 'text-accent-500',
    gradient: 'from-accent-500/20 to-accent-600/5',
  },
  {
    type: 'emoji-charades',
    name: 'Emoji Charades',
    description: 'Express with emojis. No words, just vibes!',
    icon: <MessageCircle size={32} />,
    color: 'text-amber-500',
    gradient: 'from-amber-500/20 to-amber-600/5',
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-surface-100 to-surface-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block mb-4"
          >
            <span className="text-6xl">🎮</span>
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold font-[family-name:var(--font-display)] text-surface-900 mb-4">
            Social Games
          </h1>
          <p className="text-lg text-surface-600 max-w-md mx-auto">
            Simple games, endless fun. Gather your friends and let the games begin!
          </p>
        </motion.div>

        {/* Game cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-1 gap-4"
        >
          {games.map((game) => (
            <motion.div key={game.type} variants={item}>
              <Card
                variant="elevated"
                padding="none"
                className="group cursor-pointer overflow-hidden hover:shadow-[var(--shadow-glow)] transition-shadow duration-300"
              >
                <button
                  onClick={() => navigate(`/lobby/${game.type}`)}
                  className="w-full p-6 flex items-center gap-6 text-left"
                >
                  {/* Icon */}
                  <div className={`
                    flex-shrink-0 w-16 h-16 rounded-2xl
                    bg-gradient-to-br ${game.gradient}
                    flex items-center justify-center
                    ${game.color}
                    group-hover:scale-110 transition-transform duration-300
                  `}>
                    {game.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-semibold font-[family-name:var(--font-display)] text-surface-900 mb-1">
                      {game.name}
                    </h2>
                    <p className="text-surface-600 text-sm">
                      {game.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight
                    size={24}
                    className="flex-shrink-0 text-surface-400 group-hover:text-accent-500 group-hover:translate-x-1 transition-all duration-200"
                  />
                </button>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-surface-400 text-sm mt-12"
        >
          Pass the device around for local multiplayer fun
        </motion.p>
      </div>
    </div>
  )
}
