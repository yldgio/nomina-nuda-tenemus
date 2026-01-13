export interface Player {
  id: string
  name: string
  avatar: string
  score: number
  isActive: boolean
}

export type GameType = 'word-chain' | 'quick-draw' | 'emoji-charades'

export type GameStatus = 'lobby' | 'playing' | 'round-end' | 'finished'

export interface BaseGameSession {
  id: string
  gameType: GameType
  players: Player[]
  currentPlayerIndex: number
  round: number
  maxRounds: number
  status: GameStatus
}

// Word Chain
export interface WordChainState {
  currentWord: string
  usedWords: string[]
  playerLives: Record<string, number>
  timePerTurn: number
}

export interface WordChainSession extends BaseGameSession {
  gameType: 'word-chain'
  gameState: WordChainState
}

// Quick Draw
export interface QuickDrawState {
  currentPrompt: string
  canvasData: string
  guesses: Array<{ playerId: string; guess: string; correct: boolean; timestamp: number }>
  roundTimeLimit: number
  hasCorrectGuess: boolean
}

export interface QuickDrawSession extends BaseGameSession {
  gameType: 'quick-draw'
  gameState: QuickDrawState
}

// Emoji Charades
export type EmojiCategory = 'movie' | 'song' | 'phrase' | 'book'

export interface EmojiCharadesState {
  currentPrompt: { text: string; category: EmojiCategory }
  emojiSequence: string[]
  guesses: Array<{ playerId: string; guess: string; correct: boolean; timestamp: number }>
  roundTimeLimit: number
  hasCorrectGuess: boolean
}

export interface EmojiCharadesSession extends BaseGameSession {
  gameType: 'emoji-charades'
  gameState: EmojiCharadesState
}

export type GameSession = WordChainSession | QuickDrawSession | EmojiCharadesSession

// Avatar options
export const AVATARS = ['🦊', '🐻', '🐼', '🐨', '🦁', '🐯', '🐸', '🐙', '🦋', '🌸', '🌟', '🔥'] as const
