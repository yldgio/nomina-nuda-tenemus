import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Send, SkipForward, Heart } from 'lucide-react'
import { Button, Card, Input } from '@/components/ui'
import { Timer, TurnIndicator, ScoreBoard, GameOverModal } from '@/components/game'
import { useGameStore } from '@/stores'
import { useTimer } from '@/hooks'

// Simple word validation (in production, use a dictionary API)
const isValidWord = (word: string): boolean => {
  return word.length >= 2 && /^[a-zA-Z]+$/.test(word)
}

export default function WordChainGame() {
  const navigate = useNavigate()
  const {
    session,
    players,
    startGame,
    nextTurn,
    resetSession,
    updateWordChainState,
    updatePlayerScore,
    decrementLife,
  } = useGameStore()

  const [inputWord, setInputWord] = useState('')
  const [error, setError] = useState('')
  const [showStartModal, setShowStartModal] = useState(true)

  // Get game state
  const gameState = session?.gameType === 'word-chain' ? session.gameState : null
  const currentPlayer = session ? session.players[session.currentPlayerIndex] : null
  const lastLetter = gameState?.currentWord?.slice(-1).toLowerCase() || ''

  // Timer
  const handleTimeUp = useCallback(() => {
    if (!currentPlayer || !gameState) return
    decrementLife(currentPlayer.id)
    
    // Check if current player still has lives, if not skip to next alive player
    const updatedLives = { ...gameState.playerLives }
    updatedLives[currentPlayer.id] = Math.max(0, updatedLives[currentPlayer.id] - 1)
    
    // Find next player with lives
    let nextIndex = (session!.currentPlayerIndex + 1) % players.length
    let attempts = 0
    while (updatedLives[players[nextIndex].id] <= 0 && attempts < players.length) {
      nextIndex = (nextIndex + 1) % players.length
      attempts++
    }
    
    nextTurn()
  }, [currentPlayer, gameState, decrementLife, nextTurn, session, players])

  const timer = useTimer({
    initialTime: gameState?.timePerTurn || 15,
    onComplete: handleTimeUp,
    autoStart: false,
  })

  // Start game
  const handleStart = () => {
    startGame()
    setShowStartModal(false)
    timer.start()
  }

  // Submit word
  const handleSubmit = () => {
    if (!inputWord.trim() || !gameState || !currentPlayer) return

    const word = inputWord.trim().toLowerCase()
    setError('')

    // Validate word
    if (!isValidWord(word)) {
      setError('Invalid word! Letters only, minimum 2 characters.')
      return
    }

    // Check if word starts with correct letter (skip for first word)
    if (gameState.currentWord && word[0] !== lastLetter) {
      setError(`Word must start with "${lastLetter.toUpperCase()}"`)
      return
    }

    // Check if word was already used
    if (gameState.usedWords.includes(word)) {
      setError('This word was already used!')
      return
    }

    // Valid word - update state
    updateWordChainState({
      currentWord: word,
      usedWords: [...gameState.usedWords, word],
    })

    // Award points based on word length
    const points = Math.max(1, word.length - 2)
    updatePlayerScore(currentPlayer.id, points)

    // Clear input and move to next turn
    setInputWord('')
    timer.reset()
    timer.start()
    nextTurn()
  }

  // Skip turn (lose a life)
  const handleSkip = () => {
    if (!currentPlayer) return
    decrementLife(currentPlayer.id)
    timer.reset()
    timer.start()
    nextTurn()
  }

  // Handle play again
  const handlePlayAgain = () => {
    resetSession()
    navigate('/lobby/word-chain')
  }

  // Handle go home
  const handleGoHome = () => {
    resetSession()
    navigate('/')
  }

  // Redirect if no session
  useEffect(() => {
    if (!session) {
      navigate('/lobby/word-chain')
    }
  }, [session, navigate])

  if (!session || !gameState || !currentPlayer) return null

  // Check for game over
  const activePlayers = Object.entries(gameState.playerLives).filter(([, lives]) => lives > 0)
  const isGameOver = session.status === 'finished' || activePlayers.length <= 1

  // Get lives for current player
  const currentPlayerLives = gameState.playerLives[currentPlayer.id] || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-teal-500/5 to-surface-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Header */}
      <header className="relative bg-white/50 backdrop-blur-sm border-b border-surface-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={handleGoHome}
            className="flex items-center gap-2 text-surface-600 hover:text-surface-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Exit</span>
          </button>

          <h1 className="font-semibold font-[family-name:var(--font-display)] text-surface-900">
            Word Chain
          </h1>

          <div className="flex items-center gap-1 text-error">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                size={18}
                fill={i < currentPlayerLives ? 'currentColor' : 'none'}
                className={i < currentPlayerLives ? '' : 'opacity-30'}
              />
            ))}
          </div>
        </div>
      </header>

      <div className="relative max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Turn indicator & Timer */}
        <div className="flex items-center justify-between">
          <TurnIndicator currentPlayer={currentPlayer} />
          <Timer timeRemaining={timer.timeRemaining} maxTime={gameState.timePerTurn} size="md" />
        </div>

        {/* Word chain display */}
        <Card variant="elevated" className="text-center">
          <AnimatePresence mode="wait">
            {gameState.currentWord ? (
              <motion.div
                key={gameState.currentWord}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="space-y-2"
              >
                <p className="text-sm text-surface-500">Current word</p>
                <p className="text-4xl font-bold font-[family-name:var(--font-display)] text-surface-900">
                  {gameState.currentWord.slice(0, -1)}
                  <span className="text-teal-500">{gameState.currentWord.slice(-1)}</span>
                </p>
                <p className="text-surface-600">
                  Next word must start with{' '}
                  <span className="text-teal-500 font-bold text-lg">
                    {lastLetter.toUpperCase()}
                  </span>
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-4"
              >
                <p className="text-surface-600">Type any word to start the chain!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Input area */}
        <Card variant="outlined" padding="lg">
          <div className="space-y-4">
            <Input
              placeholder={lastLetter ? `Start with "${lastLetter.toUpperCase()}"...` : 'Enter any word...'}
              value={inputWord}
              onChange={(e) => {
                setInputWord(e.target.value)
                setError('')
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              error={error}
              autoFocus
            />

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={handleSkip}
                className="flex-1"
              >
                <SkipForward size={18} />
                Skip (-1 ❤️)
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!inputWord.trim()}
                className="flex-1"
              >
                <Send size={18} />
                Submit
              </Button>
            </div>
          </div>
        </Card>

        {/* Used words */}
        {gameState.usedWords.length > 0 && (
          <Card variant="default" padding="sm">
            <p className="text-sm text-surface-500 mb-2">
              Used words ({gameState.usedWords.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {gameState.usedWords.slice(-15).map((word, index) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="px-2 py-0.5 bg-surface-100 rounded text-sm text-surface-600"
                >
                  {word}
                </motion.span>
              ))}
            </div>
          </Card>
        )}

        {/* Scoreboard */}
        <ScoreBoard players={players} currentPlayerId={currentPlayer.id} compact />
      </div>

      {/* Start modal */}
      <AnimatePresence>
        {showStartModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-surface-950/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[var(--radius-card)] p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <span className="text-5xl mb-4 block">🔗</span>
              <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-surface-900 mb-2">
                Word Chain
              </h2>
              <p className="text-surface-600 mb-6">
                Say a word starting with the last letter of the previous word.
                Each player has 3 lives!
              </p>
              <Button onClick={handleStart} size="lg" className="w-full">
                Start Game
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game over modal */}
      <GameOverModal
        isOpen={isGameOver}
        players={players}
        onPlayAgain={handlePlayAgain}
        onGoHome={handleGoHome}
      />
    </div>
  )
}
