import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Trash2, Eye, EyeOff, Send } from 'lucide-react'
import { Button, Card, Input } from '@/components/ui'
import { Timer, TurnIndicator, ScoreBoard, GameOverModal } from '@/components/game'
import { useGameStore } from '@/stores'
import { useTimer } from '@/hooks'
import EmojiPicker from './EmojiPicker'
import { getRandomPrompt, CATEGORY_COLORS, CATEGORY_ICONS } from './prompts'

export default function EmojiCharadesGame() {
  const navigate = useNavigate()
  const {
    session,
    players,
    startGame,
    nextTurn,
    endGame,
    resetSession,
    updateEmojiCharadesState,
    updatePlayerScore,
  } = useGameStore()

  const [guessInput, setGuessInput] = useState('')
  const [showPrompt, setShowPrompt] = useState(false)
  const [showStartModal, setShowStartModal] = useState(true)
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null)

  // Get game state
  const gameState = session?.gameType === 'emoji-charades' ? session.gameState : null
  const currentPlayer = session ? session.players[session.currentPlayerIndex] : null

  // Handle round end
  const handleRoundEnd = useCallback(() => {
    if (!session || !gameState) return

    // Move to next player or end game
    const nextPlayerIndex = (session.currentPlayerIndex + 1) % players.length
    const nextRound = nextPlayerIndex === 0 ? session.round + 1 : session.round

    if (nextRound > session.maxRounds) {
      endGame()
    } else {
      const newPrompt = getRandomPrompt()
      updateEmojiCharadesState({
        currentPrompt: newPrompt,
        emojiSequence: [],
        guesses: [],
        hasCorrectGuess: false,
      })
      nextTurn()
    }
  }, [session, gameState, players, endGame, updateEmojiCharadesState, nextTurn])

  // Timer
  const timer = useTimer({
    initialTime: gameState?.roundTimeLimit || 45,
    onComplete: handleRoundEnd,
    autoStart: false,
  })

  // Start game
  const handleStart = () => {
    const prompt = getRandomPrompt()
    updateEmojiCharadesState({
      currentPrompt: prompt,
    })
    startGame()
    setShowStartModal(false)
    timer.start()
  }

  // Add emoji to sequence
  const handleAddEmoji = (emoji: string) => {
    if (!gameState || gameState.hasCorrectGuess) return
    updateEmojiCharadesState({
      emojiSequence: [...gameState.emojiSequence, emoji],
    })
  }

  // Clear emoji sequence
  const handleClearEmojis = () => {
    if (!gameState) return
    updateEmojiCharadesState({
      emojiSequence: [],
    })
  }

  // Remove last emoji
  const handleRemoveLastEmoji = () => {
    if (!gameState || gameState.emojiSequence.length === 0) return
    updateEmojiCharadesState({
      emojiSequence: gameState.emojiSequence.slice(0, -1),
    })
  }

  // Handle guess submission
  const handleGuess = () => {
    if (!guessInput.trim() || !gameState || !currentPlayer) return

    const guess = guessInput.trim().toLowerCase()
    const correct = guess === gameState.currentPrompt.text.toLowerCase()

    // Add guess to list
    updateEmojiCharadesState({
      guesses: [
        ...gameState.guesses,
        {
          playerId: currentPlayer.id,
          guess,
          correct,
          timestamp: Date.now(),
        },
      ],
    })

    setGuessInput('')

    if (correct) {
      // Guesser gets points based on time remaining
      const guesserPoints = Math.ceil(timer.timeRemaining / 5) + 5
      // Clue giver also gets points
      const giverPoints = 3

      // Find who guessed (any player not the current clue giver could guess)
      const clueGiver = session?.players[session.currentPlayerIndex]
      if (clueGiver) {
        updatePlayerScore(clueGiver.id, giverPoints)
      }
      // In local mode, we'll give points to a "guesser" - for simplicity, give to next player
      const guesserIndex = (session!.currentPlayerIndex + 1) % players.length
      updatePlayerScore(players[guesserIndex].id, guesserPoints)

      setFeedback({ correct: true, message: `Correct! +${guesserPoints} points!` })
      
      updateEmojiCharadesState({ hasCorrectGuess: true })

      // Short delay then move to next round
      setTimeout(() => {
        setFeedback(null)
        timer.reset()
        
        const nextPlayerIndex = (session!.currentPlayerIndex + 1) % players.length
        const nextRound = nextPlayerIndex === 0 ? session!.round + 1 : session!.round

        if (nextRound > session!.maxRounds) {
          endGame()
        } else {
          const newPrompt = getRandomPrompt()
          updateEmojiCharadesState({
            currentPrompt: newPrompt,
            emojiSequence: [],
            guesses: [],
            hasCorrectGuess: false,
          })
          nextTurn()
          timer.start()
        }
      }, 2000)
    } else {
      setFeedback({ correct: false, message: 'Not quite, try again!' })
      setTimeout(() => setFeedback(null), 1500)
    }
  }

  // Handle play again
  const handlePlayAgain = () => {
    resetSession()
    navigate('/lobby/emoji-charades')
  }

  // Handle go home
  const handleGoHome = () => {
    resetSession()
    navigate('/')
  }

  // Redirect if no session
  useEffect(() => {
    if (!session) {
      navigate('/lobby/emoji-charades')
    }
  }, [session, navigate])

  if (!session || !gameState || !currentPlayer) return null

  const isGameOver = session.status === 'finished'
  const clueGiver = session.players[session.currentPlayerIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-amber-500/5 to-surface-50 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl translate-x-1/2" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-3xl -translate-x-1/2" />
      </div>

      {/* Header */}
      <header className="relative bg-white/50 backdrop-blur-sm border-b border-surface-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={handleGoHome}
            className="flex items-center gap-2 text-surface-600 hover:text-surface-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Exit</span>
          </button>

          <h1 className="font-semibold font-[family-name:var(--font-display)] text-surface-900">
            Emoji Charades
          </h1>

          <div className="text-sm text-surface-600">
            Round {session.round}/{session.maxRounds}
          </div>
        </div>
      </header>

      <div className="relative max-w-4xl mx-auto px-4 py-6">
        {/* Turn & Timer */}
        <div className="flex items-center justify-between mb-6">
          <TurnIndicator currentPlayer={clueGiver} action="is describing" />
          <Timer timeRemaining={timer.timeRemaining} maxTime={gameState.roundTimeLimit} size="md" />
        </div>

        <div className="grid lg:grid-cols-[1fr_280px] gap-6">
          {/* Main area */}
          <div className="space-y-4">
            {/* Prompt card with category */}
            <Card variant="elevated" padding="sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`
                    px-3 py-1 rounded-full text-white text-sm font-medium
                    ${CATEGORY_COLORS[gameState.currentPrompt.category]}
                  `}>
                    {CATEGORY_ICONS[gameState.currentPrompt.category]} {gameState.currentPrompt.category}
                  </span>
                  <span className={`
                    text-xl font-bold font-[family-name:var(--font-display)]
                    ${showPrompt ? 'text-surface-900' : 'blur-md select-none'}
                  `}>
                    {gameState.currentPrompt.text}
                  </span>
                </div>
                <button
                  onClick={() => setShowPrompt(!showPrompt)}
                  className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
                >
                  {showPrompt ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </Card>

            {/* Emoji display area */}
            <Card variant="outlined" padding="lg" className="min-h-[120px]">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <AnimatePresence mode="popLayout">
                  {gameState.emojiSequence.length > 0 ? (
                    gameState.emojiSequence.map((emoji, index) => (
                      <motion.span
                        key={`${emoji}-${index}`}
                        initial={{ opacity: 0, scale: 0, rotate: -180 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="text-5xl"
                      >
                        {emoji}
                      </motion.span>
                    ))
                  ) : (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-surface-400 text-center"
                    >
                      Select emojis below to describe the {gameState.currentPrompt.category}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Clear/Undo buttons */}
              {gameState.emojiSequence.length > 0 && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveLastEmoji}
                    disabled={gameState.hasCorrectGuess}
                  >
                    Undo
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearEmojis}
                    disabled={gameState.hasCorrectGuess}
                  >
                    <Trash2 size={16} />
                    Clear
                  </Button>
                </div>
              )}
            </Card>

            {/* Emoji picker */}
            <Card variant="default">
              <EmojiPicker
                onSelect={handleAddEmoji}
                disabled={gameState.hasCorrectGuess}
              />
            </Card>

            {/* Guess input */}
            <Card variant="outlined" padding="md">
              <div className="flex gap-3">
                <Input
                  placeholder="Type your guess..."
                  value={guessInput}
                  onChange={(e) => setGuessInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
                  disabled={gameState.hasCorrectGuess}
                  className="flex-1"
                />
                <Button
                  onClick={handleGuess}
                  disabled={!guessInput.trim() || gameState.hasCorrectGuess}
                >
                  <Send size={18} />
                  Guess
                </Button>
              </div>

              {/* Recent guesses */}
              {gameState.guesses.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {gameState.guesses.slice(-10).map((g, i) => (
                    <span
                      key={i}
                      className={`
                        px-2 py-1 rounded text-sm
                        ${g.correct ? 'bg-success text-white' : 'bg-surface-100 text-surface-600'}
                      `}
                    >
                      {g.guess}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar - Scoreboard */}
          <div className="space-y-4">
            <Card variant="elevated">
              <ScoreBoard players={players} currentPlayerId={clueGiver.id} />
            </Card>
          </div>
        </div>

        {/* Feedback toast */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className={`
                fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full
                font-semibold font-[family-name:var(--font-display)] shadow-lg
                ${feedback.correct ? 'bg-success text-white' : 'bg-surface-800 text-white'}
              `}
            >
              {feedback.message}
            </motion.div>
          )}
        </AnimatePresence>
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
              <span className="text-5xl mb-4 block">🎭</span>
              <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-surface-900 mb-2">
                Emoji Charades
              </h2>
              <p className="text-surface-600 mb-6">
                Describe movies, songs, phrases, or books using only emojis!
                No words allowed - let the emojis do the talking.
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
