import { create } from 'zustand'
import type { Player, GameType, GameStatus, GameSession, WordChainState, QuickDrawState, EmojiCharadesState } from '@/types'

interface GameStore {
  // Players
  players: Player[]
  addPlayer: (name: string, avatar: string) => void
  removePlayer: (id: string) => void
  updatePlayerScore: (id: string, points: number) => void
  resetPlayers: () => void

  // Game session
  session: GameSession | null
  createSession: (gameType: GameType, maxRounds?: number) => void
  startGame: () => void
  nextTurn: () => void
  nextRound: () => void
  endGame: () => void
  resetSession: () => void

  // Game-specific state updates
  updateWordChainState: (updates: Partial<WordChainState>) => void
  updateQuickDrawState: (updates: Partial<QuickDrawState>) => void
  updateEmojiCharadesState: (updates: Partial<EmojiCharadesState>) => void

  // Player lives (Word Chain)
  decrementLife: (playerId: string) => void
}

const generateId = () => Math.random().toString(36).substring(2, 9)

const createInitialWordChainState = (): WordChainState => ({
  currentWord: '',
  usedWords: [],
  playerLives: {},
  timePerTurn: 15,
})

const createInitialQuickDrawState = (): QuickDrawState => ({
  currentPrompt: '',
  canvasData: '',
  guesses: [],
  roundTimeLimit: 60,
  hasCorrectGuess: false,
})

const createInitialEmojiCharadesState = (): EmojiCharadesState => ({
  currentPrompt: { text: '', category: 'movie' },
  emojiSequence: [],
  guesses: [],
  roundTimeLimit: 45,
  hasCorrectGuess: false,
})

export const useGameStore = create<GameStore>((set, get) => ({
  players: [],

  addPlayer: (name, avatar) => {
    const newPlayer: Player = {
      id: generateId(),
      name,
      avatar,
      score: 0,
      isActive: true,
    }
    set((state) => ({ players: [...state.players, newPlayer] }))
  },

  removePlayer: (id) => {
    set((state) => ({ players: state.players.filter((p) => p.id !== id) }))
  },

  updatePlayerScore: (id, points) => {
    set((state) => ({
      players: state.players.map((p) =>
        p.id === id ? { ...p, score: p.score + points } : p
      ),
    }))
  },

  resetPlayers: () => {
    set((state) => ({
      players: state.players.map((p) => ({ ...p, score: 0, isActive: true })),
    }))
  },

  session: null,

  createSession: (gameType, maxRounds = 3) => {
    const { players } = get()
    const id = generateId()

    let gameState: WordChainState | QuickDrawState | EmojiCharadesState

    switch (gameType) {
      case 'word-chain':
        gameState = {
          ...createInitialWordChainState(),
          playerLives: Object.fromEntries(players.map((p) => [p.id, 3])),
        }
        break
      case 'quick-draw':
        gameState = createInitialQuickDrawState()
        break
      case 'emoji-charades':
        gameState = createInitialEmojiCharadesState()
        break
    }

    const session: GameSession = {
      id,
      gameType,
      players,
      currentPlayerIndex: 0,
      round: 1,
      maxRounds,
      status: 'lobby',
      gameState,
    } as GameSession

    set({ session })
  },

  startGame: () => {
    set((state) => ({
      session: state.session
        ? { ...state.session, status: 'playing' as GameStatus }
        : null,
    }))
  },

  nextTurn: () => {
    set((state) => {
      if (!state.session) return state
      const nextIndex =
        (state.session.currentPlayerIndex + 1) % state.session.players.length
      return {
        session: { ...state.session, currentPlayerIndex: nextIndex },
      }
    })
  },

  nextRound: () => {
    set((state) => {
      if (!state.session) return state
      const newRound = state.session.round + 1
      if (newRound > state.session.maxRounds) {
        return { session: { ...state.session, status: 'finished' as GameStatus } }
      }
      return {
        session: {
          ...state.session,
          round: newRound,
          currentPlayerIndex: 0,
          status: 'playing' as GameStatus,
        },
      }
    })
  },

  endGame: () => {
    set((state) => ({
      session: state.session
        ? { ...state.session, status: 'finished' as GameStatus }
        : null,
    }))
  },

  resetSession: () => {
    set({ session: null })
  },

  updateWordChainState: (updates) => {
    set((state) => {
      if (!state.session || state.session.gameType !== 'word-chain') return state
      return {
        session: {
          ...state.session,
          gameState: { ...state.session.gameState, ...updates },
        },
      }
    })
  },

  updateQuickDrawState: (updates) => {
    set((state) => {
      if (!state.session || state.session.gameType !== 'quick-draw') return state
      return {
        session: {
          ...state.session,
          gameState: { ...state.session.gameState, ...updates },
        },
      }
    })
  },

  updateEmojiCharadesState: (updates) => {
    set((state) => {
      if (!state.session || state.session.gameType !== 'emoji-charades') return state
      return {
        session: {
          ...state.session,
          gameState: { ...state.session.gameState, ...updates },
        },
      }
    })
  },

  decrementLife: (playerId) => {
    set((state) => {
      if (!state.session || state.session.gameType !== 'word-chain') return state
      const newLives = { ...state.session.gameState.playerLives }
      if (newLives[playerId] > 0) {
        newLives[playerId]--
      }
      // Check if player is eliminated
      const activePlayers = Object.entries(newLives).filter(([, lives]) => lives > 0)
      if (activePlayers.length <= 1) {
        return {
          session: {
            ...state.session,
            status: 'finished' as GameStatus,
            gameState: { ...state.session.gameState, playerLives: newLives },
          },
        }
      }
      return {
        session: {
          ...state.session,
          gameState: { ...state.session.gameState, playerLives: newLives },
        },
      }
    })
  },
}))
