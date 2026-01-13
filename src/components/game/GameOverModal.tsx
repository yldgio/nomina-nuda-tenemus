import { motion } from 'framer-motion'
import { Trophy, RotateCcw, Home } from 'lucide-react'
import { Button, Modal } from '@/components/ui'
import type { Player } from '@/types'

interface GameOverModalProps {
  isOpen: boolean
  players: Player[]
  onPlayAgain: () => void
  onGoHome: () => void
}

export default function GameOverModal({
  isOpen,
  players,
  onPlayAgain,
  onGoHome,
}: GameOverModalProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)
  const winner = sortedPlayers[0]

  const podiumOrder = [1, 0, 2] // Silver, Gold, Bronze positions

  return (
    <Modal isOpen={isOpen} onClose={onGoHome} showClose={false}>
      <div className="text-center space-y-6 py-4">
        {/* Trophy animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="mx-auto w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center"
        >
          <Trophy className="w-10 h-10 text-amber-500" />
        </motion.div>

        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold font-[family-name:var(--font-display)] text-surface-900"
          >
            Game Over!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-surface-600 mt-1"
          >
            {winner.avatar} {winner.name} wins with {winner.score} points!
          </motion.p>
        </div>

        {/* Podium */}
        <div className="flex items-end justify-center gap-2 h-40 px-4">
          {podiumOrder.map((index) => {
            const player = sortedPlayers[index]
            if (!player) return null

            const heights = ['h-24', 'h-32', 'h-16']
            const delays = [0.6, 0.5, 0.7]
            const colors = ['bg-surface-300', 'bg-amber-400', 'bg-amber-700/50']
            const positions = ['2nd', '1st', '3rd']

            return (
              <motion.div
                key={player.id}
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                transition={{ delay: delays[index], duration: 0.4, ease: 'easeOut' }}
                className="flex flex-col items-center"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: delays[index] + 0.3 }}
                  className="mb-2 text-center"
                >
                  <span className="text-3xl">{player.avatar}</span>
                  <p className="text-xs font-medium text-surface-700 truncate max-w-[80px]">
                    {player.name}
                  </p>
                  <p className="text-sm font-bold text-surface-900">{player.score}</p>
                </motion.div>
                <div
                  className={`w-20 ${heights[index]} ${colors[index]} rounded-t-lg flex items-end justify-center pb-2`}
                >
                  <span className="text-sm font-bold text-white/80">{positions[index]}</span>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex gap-3 pt-2"
        >
          <Button variant="secondary" onClick={onGoHome} className="flex-1">
            <Home size={18} />
            Home
          </Button>
          <Button onClick={onPlayAgain} className="flex-1">
            <RotateCcw size={18} />
            Play Again
          </Button>
        </motion.div>
      </div>
    </Modal>
  )
}
