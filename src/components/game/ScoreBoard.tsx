import { motion } from 'framer-motion'
import type { Player } from '@/types'

interface ScoreBoardProps {
  players: Player[]
  currentPlayerId?: string
  compact?: boolean
}

export default function ScoreBoard({ players, currentPlayerId, compact = false }: ScoreBoardProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {sortedPlayers.map((player, index) => (
          <motion.div
            key={player.id}
            layout
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-full
              ${currentPlayerId === player.id ? 'bg-accent-500 text-white' : 'bg-surface-100 text-surface-700'}
            `}
          >
            <span>{player.avatar}</span>
            <span className="font-medium font-[family-name:var(--font-display)] text-sm">
              {player.name}
            </span>
            <span className={`
              text-sm font-bold
              ${currentPlayerId === player.id ? 'text-white/90' : 'text-surface-500'}
            `}>
              {player.score}
            </span>
            {index === 0 && player.score > 0 && (
              <span className="text-amber-500">👑</span>
            )}
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-surface-500 uppercase tracking-wider font-[family-name:var(--font-display)]">
        Scores
      </h3>
      <div className="space-y-1">
        {sortedPlayers.map((player, index) => (
          <motion.div
            key={player.id}
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`
              flex items-center justify-between p-3 rounded-lg
              ${currentPlayerId === player.id
                ? 'bg-accent-500/10 border-2 border-accent-500'
                : 'bg-surface-100'
              }
            `}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{player.avatar}</span>
              <div>
                <span className="font-medium font-[family-name:var(--font-display)] text-surface-900">
                  {player.name}
                </span>
                {index === 0 && player.score > 0 && (
                  <span className="ml-2 text-amber-500">👑</span>
                )}
              </div>
            </div>
            <motion.span
              key={player.score}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              className="text-xl font-bold font-[family-name:var(--font-display)] text-surface-900"
            >
              {player.score}
            </motion.span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
