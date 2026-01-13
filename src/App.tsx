import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Home from '@/pages/Home'
import GameLobby from '@/pages/GameLobby'
import WordChainGame from '@/games/word-chain/WordChainGame'
import QuickDrawGame from '@/games/quick-draw/QuickDrawGame'
import EmojiCharadesGame from '@/games/emoji-charades/EmojiCharadesGame'

function App() {
  return (
    <div className="min-h-screen bg-surface-50">
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lobby/:gameType" element={<GameLobby />} />
          <Route path="/play/word-chain" element={<WordChainGame />} />
          <Route path="/play/quick-draw" element={<QuickDrawGame />} />
          <Route path="/play/emoji-charades" element={<EmojiCharadesGame />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App
