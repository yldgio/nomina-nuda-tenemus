import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Eraser, Trash2, Eye, EyeOff, Send } from 'lucide-react'
import { Button, Card, Input } from '@/components/ui'
import { Timer, TurnIndicator, ScoreBoard, GameOverModal } from '@/components/game'
import { useGameStore } from '@/stores'
import { useTimer } from '@/hooks'
import DrawingCanvas from './DrawingCanvas'
import { getRandomPrompt } from './prompts'

const COLORS = [
  '#1a1a2e', // Black
  '#e94560', // Red
  '#0f4c75', // Blue
  '#3fc1c9', // Cyan
  '#f9ed69', // Yellow
  '#6b5b95', // Purple
  '#88b04b', // Green
  '#ff6f61', // Coral
]

const BRUSH_SIZES = [4, 8, 16, 24]

export default function QuickDrawGame() {
  const navigate = useNavigate()
  const {
    session,
    players,
    startGame,
    nextTurn,
    endGame,
    resetSession,
    updateQuickDrawState,
    updatePlayerScore,
  } = useGameStore()

  const [brushColor, setBrushColor] = useState(COLORS[0])
  const [brushSize, setBrushSize] = useState(BRUSH_SIZES[1])
  const [isEraser, setIsEraser] = useState(false)
  const [clearTrigger, setClearTrigger] = useState(0)
  const [guessInput, setGuessInput] = useState('')
  const [showPrompt, setShowPrompt] = useState(false)
  const [showStartModal, setShowStartModal] = useState(true)
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null)

  // Get game state
  const gameState = session?.gameType === 'quick-draw' ? session.gameState : null
  const currentPlayer = session ? session.players[session.currentPlayerIndex] : null

  // Handle round end
  const handleRoundEnd = useCallback(() => {
    if (!session || !gameState) return

    // If no one guessed, drawer gets no points
    if (!gameState.hasCorrectGuess) {
      // Move to next drawer or end game
      const nextDrawerIndex = (session.currentPlayerIndex + 1) % players.length
      const nextRound = nextDrawerIndex === 0 ? session.round + 1 : session.round

      if (nextRound > session.maxRounds) {
        endGame()
      } else {
        // Set up next round
        updateQuickDrawState({
          currentPrompt: getRandomPrompt(),
          guesses: [],
          hasCorrectGuess: false,
        })
        setClearTrigger((prev) => prev + 1)
        nextTurn()
      }
    }
  }, [session, gameState, players, endGame, updateQuickDrawState, nextTurn])

  // Timer
  const timer = useTimer({
    initialTime: gameState?.roundTimeLimit || 60,
    onComplete: handleRoundEnd,
    autoStart: false,
  })

  // Start game
  const handleStart = () => {
    updateQuickDrawState({
      currentPrompt: getRandomPrompt(),
    })
    startGame()
    setShowStartModal(false)
    timer.start()
  }

  // Handle guess submission
  const handleGuess = () => {
    if (!guessInput.trim() || !gameState || !currentPlayer) return

    const guess = guessInput.trim().toLowerCase()
    const correct = guess === gameState.currentPrompt.toLowerCase()

    // Add guess to list
    updateQuickDrawState({
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
      const guesserPoints = Math.ceil(timer.timeRemaining / 10) + 5
      // Drawer also gets points
      const drawerPoints = 3

      // Find the guesser (for now, assume it's any player who's not the drawer)
      updatePlayerScore(currentPlayer.id, guesserPoints)
      const drawer = session?.players[session.currentPlayerIndex]
      if (drawer) {
        updatePlayerScore(drawer.id, drawerPoints)
      }

      setFeedback({ correct: true, message: `+${guesserPoints} points!` })
      
      // Mark round as complete
      updateQuickDrawState({ hasCorrectGuess: true })

      // Short delay then move to next round
      setTimeout(() => {
        setFeedback(null)
        timer.reset()
        
        const nextDrawerIndex = (session!.currentPlayerIndex + 1) % players.length
        const nextRound = nextDrawerIndex === 0 ? session!.round + 1 : session!.round

        if (nextRound > session!.maxRounds) {
          endGame()
        } else {
          updateQuickDrawState({
            currentPrompt: getRandomPrompt(),
            guesses: [],
            hasCorrectGuess: false,
          })
          setClearTrigger((prev) => prev + 1)
          nextTurn()
          timer.start()
        }
      }, 2000)
    } else {
      setFeedback({ correct: false, message: 'Nope, try again!' })
      setTimeout(() => setFeedback(null), 1500)
    }
  }

  // Handle clear canvas
  const handleClear = () => {
    setClearTrigger((prev) => prev + 1)
  }

  // Toggle eraser
  const toggleEraser = () => {
    setIsEraser(!isEraser)
  }

  // Handle play again
  const handlePlayAgain = () => {
    resetSession()
    navigate('/lobby/quick-draw')
  }

  // Handle go home
  const handleGoHome = () => {
    resetSession()
    navigate('/')
  }

  // Redirect if no session
  useEffect(() => {
    if (!session) {
      navigate('/lobby/quick-draw')
    }
  }, [session, navigate])

  if (!session || !gameState || !currentPlayer) return null

  const isGameOver = session.status === 'finished'
  const drawer = session.players[session.currentPlayerIndex]
  const isCurrentUserDrawer = true // In local multiplayer, we show both views

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-accent-500/5 to-surface-50 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
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
            Quick Draw
          </h1>

          <div className="text-sm text-surface-600">
            Round {session.round}/{session.maxRounds}
          </div>
        </div>
      </header>

      <div className="relative max-w-4xl mx-auto px-4 py-6">
        {/* Turn & Timer */}
        <div className="flex items-center justify-between mb-6">
          <TurnIndicator currentPlayer={drawer} action="is drawing" />
          <Timer timeRemaining={timer.timeRemaining} maxTime={gameState.roundTimeLimit} size="md" />
        </div>

        <div className="grid lg:grid-cols-[1fr_280px] gap-6">
          {/* Main drawing area */}
          <div className="space-y-4">
            {/* Prompt (visible only to drawer) */}
            {isCurrentUserDrawer && (
              <Card variant="elevated" padding="sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-surface-500">Draw:</span>
                    <span className={`
                      text-xl font-bold font-[family-name:var(--font-display)]
                      ${showPrompt ? 'text-surface-900' : 'blur-sm select-none'}
                    `}>
                      {gameState.currentPrompt}
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
            )}

            {/* Canvas */}
            <DrawingCanvas
              isDrawer={isCurrentUserDrawer}
              brushColor={isEraser ? '#ffffff' : brushColor}
              brushSize={isEraser ? 24 : brushSize}
              clearTrigger={clearTrigger}
            />

            {/* Drawing tools */}
            {isCurrentUserDrawer && (
              <Card variant="default" padding="sm">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  {/* Colors */}
                  <div className="flex items-center gap-1.5">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          setBrushColor(color)
                          setIsEraser(false)
                        }}
                        className={`
                          w-8 h-8 rounded-full transition-transform
                          ${brushColor === color && !isEraser ? 'scale-110 ring-2 ring-offset-2 ring-surface-400' : 'hover:scale-105'}
                        `}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  {/* Brush sizes */}
                  <div className="flex items-center gap-2">
                    {BRUSH_SIZES.map((size) => (
                      <button
                        key={size}
                        onClick={() => setBrushSize(size)}
                        className={`
                          flex items-center justify-center w-8 h-8 rounded-lg
                          ${brushSize === size ? 'bg-surface-200' : 'hover:bg-surface-100'}
                        `}
                      >
                        <div
                          className="rounded-full bg-surface-800"
                          style={{ width: size, height: size }}
                        />
                      </button>
                    ))}
                  </div>

                  {/* Eraser & Clear */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant={isEraser ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={toggleEraser}
                    >
                      <Eraser size={18} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleClear}>
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Guess input (for non-drawers, but in local mode everyone sees) */}
            <Card variant="outlined" padding="md">
              <div className="flex gap-3">
                <Input
                  placeholder="Type your guess..."
                  value={guessInput}
                  onChange={(e) => setGuessInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
                  className="flex-1"
                />
                <Button onClick={handleGuess} disabled={!guessInput.trim()}>
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
              <ScoreBoard players={players} currentPlayerId={drawer.id} />
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
              <span className="text-5xl mb-4 block">🎨</span>
              <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-surface-900 mb-2">
                Quick Draw
              </h2>
              <p className="text-surface-600 mb-6">
                One player draws the prompt while others guess. 
                Pass the device to the drawer when it's their turn!
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
