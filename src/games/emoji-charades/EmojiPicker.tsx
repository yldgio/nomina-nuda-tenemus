import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { EMOJI_CATEGORIES, POPULAR_EMOJIS } from './emojis'

interface EmojiPickerProps {
  onSelect: (emoji: string) => void
  disabled?: boolean
}

export default function EmojiPicker({ onSelect, disabled }: EmojiPickerProps) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('Popular')

  const categories = ['Popular', ...Object.keys(EMOJI_CATEGORIES)]

  const getEmojis = () => {
    if (search) {
      // For search, we'd need a more sophisticated search - for now just show all
      return Object.values(EMOJI_CATEGORIES).flat().slice(0, 100)
    }
    if (activeCategory === 'Popular') {
      return POPULAR_EMOJIS
    }
    return EMOJI_CATEGORIES[activeCategory as keyof typeof EMOJI_CATEGORIES] || []
  }

  const emojis = getEmojis()

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <input
          type="text"
          placeholder="Search emojis..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-surface-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
          disabled={disabled}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Categories */}
      {!search && (
        <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              disabled={disabled}
              className={`
                px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors
                ${activeCategory === category
                  ? 'bg-accent-500 text-white'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Emoji grid */}
      <div className="h-48 overflow-y-auto rounded-lg bg-surface-50 p-2">
        <div className="grid grid-cols-8 gap-1">
          {emojis.map((emoji, index) => (
            <motion.button
              key={`${emoji}-${index}`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onSelect(emoji)}
              disabled={disabled}
              className="w-9 h-9 flex items-center justify-center text-xl rounded-lg hover:bg-surface-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {emoji}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
