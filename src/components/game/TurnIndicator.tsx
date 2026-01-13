import { motion } from 'framer-motion'
import type { Player } from '@/types'

interface TurnIndicatorProps {
  currentPlayer: Player
  action?: string
}

export default function TurnIndicator({ currentPlayer, action = 'turn' }: TurnIndicatorProps) {
  return (
    <motion.div
      key={currentPlayer.id}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="flex items-center justify-center gap-3 px-6 py-3 bg-surface-900 text-white rounded-full shadow-[var(--shadow-medium)]"
    >
      <motion.span
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-2xl"
      >
        {currentPlayer.avatar}
      </motion.span>
      <span className="font-[family-name:var(--font-display)] font-semibold">
        {currentPlayer.name}'s {action}
      </span>
    </motion.div>
  )
}
