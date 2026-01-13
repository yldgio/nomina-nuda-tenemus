import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Plus, X, Play, Users } from 'lucide-react'
import { Button, Card, Input } from '@/components/ui'
import { useGameStore } from '@/stores'
import { AVATARS, type GameType } from '@/types'

const gameNames: Record<GameType, string> = {
  'word-chain': 'Word Chain',
  'quick-draw': 'Quick Draw',
  'emoji-charades': 'Emoji Charades',
}

const gameDescriptions: Record<GameType, string> = {
  'word-chain': 'Say a word starting with the last letter of the previous word. No repeats allowed!',
  'quick-draw': 'One player draws, others guess. Quick strokes, quick guesses!',
  'emoji-charades': 'Describe movies, songs, or phrases using only emojis!',
}

export default function GameLobby() {
  const { gameType } = useParams<{ gameType: GameType }>()
  const navigate = useNavigate()
  const { players, addPlayer, removePlayer, createSession, resetPlayers } = useGameStore()

  const [newPlayerName, setNewPlayerName] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState<string>(AVATARS[0])
  const [isAddingPlayer, setIsAddingPlayer] = useState(false)

  if (!gameType || !gameNames[gameType as GameType]) {
    navigate('/')
    return null
  }

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      addPlayer(newPlayerName.trim(), selectedAvatar)
      setNewPlayerName('')
      setSelectedAvatar(AVATARS[Math.floor(Math.random() * AVATARS.length)])
      setIsAddingPlayer(false)
    }
  }

  const handleStartGame = () => {
    createSession(gameType as GameType)
    navigate(`/play/${gameType}`)
  }

  const handleBack = () => {
    resetPlayers()
    navigate('/')
  }

  const canStart = players.length >= 2

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-surface-100 to-surface-50 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-surface-600 hover:text-surface-900 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          <h1 className="text-3xl font-bold font-[family-name:var(--font-display)] text-surface-900 mb-2">
            {gameNames[gameType as GameType]}
          </h1>
          <p className="text-surface-600">
            {gameDescriptions[gameType as GameType]}
          </p>
        </motion.div>

        {/* Players section */}
        <Card variant="elevated" className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users size={20} className="text-surface-500" />
              <h2 className="font-semibold font-[family-name:var(--font-display)] text-surface-900">
                Players ({players.length})
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAddingPlayer(true)}
              disabled={isAddingPlayer}
            >
              <Plus size={18} />
              Add
            </Button>
          </div>

          {/* Add player form */}
          <AnimatePresence>
            {isAddingPlayer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden"
              >
                <div className="p-4 bg-surface-100 rounded-xl space-y-4">
                  <Input
                    placeholder="Player name"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()}
                    autoFocus
                  />

                  {/* Avatar picker */}
                  <div>
                    <p className="text-sm text-surface-600 mb-2">Choose avatar</p>
                    <div className="flex flex-wrap gap-2">
                      {AVATARS.map((avatar) => (
                        <button
                          key={avatar}
                          onClick={() => setSelectedAvatar(avatar)}
                          className={`
                            w-10 h-10 text-xl rounded-lg flex items-center justify-center
                            transition-all duration-150
                            ${selectedAvatar === avatar
                              ? 'bg-accent-500 scale-110 shadow-lg'
                              : 'bg-white hover:bg-surface-200'
                            }
                          `}
                        >
                          {avatar}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsAddingPlayer(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleAddPlayer}
                      disabled={!newPlayerName.trim()}
                      className="flex-1"
                    >
                      Add Player
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Player list */}
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {players.map((player) => (
                <motion.div
                  key={player.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, x: -100 }}
                  className="flex items-center justify-between p-3 bg-surface-100 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{player.avatar}</span>
                    <span className="font-medium text-surface-900">{player.name}</span>
                  </div>
                  <button
                    onClick={() => removePlayer(player.id)}
                    className="p-1.5 text-surface-400 hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                  >
                    <X size={18} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {players.length === 0 && !isAddingPlayer && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-surface-500 py-8"
              >
                Add at least 2 players to start
              </motion.p>
            )}
          </div>
        </Card>

        {/* Start button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            size="lg"
            onClick={handleStartGame}
            disabled={!canStart}
            className="w-full"
          >
            <Play size={20} />
            Start Game {!canStart && `(Need ${2 - players.length} more)`}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
