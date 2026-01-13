import type { EmojiCategory } from '@/types'

interface Prompt {
  text: string
  category: EmojiCategory
}

export const EMOJI_PROMPTS: Prompt[] = [
  // Movies
  { text: 'Titanic', category: 'movie' },
  { text: 'Frozen', category: 'movie' },
  { text: 'The Lion King', category: 'movie' },
  { text: 'Jaws', category: 'movie' },
  { text: 'Star Wars', category: 'movie' },
  { text: 'Home Alone', category: 'movie' },
  { text: 'Finding Nemo', category: 'movie' },
  { text: 'The Godfather', category: 'movie' },
  { text: 'Jurassic Park', category: 'movie' },
  { text: 'Toy Story', category: 'movie' },
  { text: 'Spider-Man', category: 'movie' },
  { text: 'Harry Potter', category: 'movie' },
  { text: 'The Hunger Games', category: 'movie' },
  { text: 'Avatar', category: 'movie' },
  { text: 'Beauty and the Beast', category: 'movie' },

  // Songs
  { text: 'Let It Go', category: 'song' },
  { text: 'Happy Birthday', category: 'song' },
  { text: 'Dancing Queen', category: 'song' },
  { text: 'Thriller', category: 'song' },
  { text: 'Firework', category: 'song' },
  { text: 'Sunshine', category: 'song' },
  { text: 'Rolling in the Deep', category: 'song' },
  { text: 'Bad Romance', category: 'song' },
  { text: 'Shape of You', category: 'song' },
  { text: 'Call Me Maybe', category: 'song' },
  { text: 'Poker Face', category: 'song' },
  { text: 'Single Ladies', category: 'song' },
  { text: 'Crazy in Love', category: 'song' },
  { text: 'Umbrella', category: 'song' },
  { text: 'Heartbreaker', category: 'song' },

  // Phrases
  { text: 'Break a leg', category: 'phrase' },
  { text: 'Raining cats and dogs', category: 'phrase' },
  { text: 'Piece of cake', category: 'phrase' },
  { text: 'Love at first sight', category: 'phrase' },
  { text: 'Over the moon', category: 'phrase' },
  { text: 'Under the weather', category: 'phrase' },
  { text: 'Time flies', category: 'phrase' },
  { text: 'Butterflies in my stomach', category: 'phrase' },
  { text: 'Hit the road', category: 'phrase' },
  { text: 'Once in a blue moon', category: 'phrase' },
  { text: 'A fish out of water', category: 'phrase' },
  { text: 'The apple of my eye', category: 'phrase' },
  { text: 'Kill two birds with one stone', category: 'phrase' },
  { text: 'When pigs fly', category: 'phrase' },
  { text: 'Spill the beans', category: 'phrase' },

  // Books
  { text: 'The Little Mermaid', category: 'book' },
  { text: 'Alice in Wonderland', category: 'book' },
  { text: 'The Jungle Book', category: 'book' },
  { text: 'Little Red Riding Hood', category: 'book' },
  { text: 'Cinderella', category: 'book' },
  { text: 'Peter Pan', category: 'book' },
  { text: 'Snow White', category: 'book' },
  { text: 'The Wizard of Oz', category: 'book' },
  { text: 'Sleeping Beauty', category: 'book' },
  { text: 'Jack and the Beanstalk', category: 'book' },
]

export const getRandomPrompt = (): Prompt => {
  return EMOJI_PROMPTS[Math.floor(Math.random() * EMOJI_PROMPTS.length)]
}

export const CATEGORY_COLORS: Record<EmojiCategory, string> = {
  movie: 'bg-accent-500',
  song: 'bg-teal-500',
  phrase: 'bg-amber-500',
  book: 'bg-[#6b5b95]',
}

export const CATEGORY_ICONS: Record<EmojiCategory, string> = {
  movie: '🎬',
  song: '🎵',
  phrase: '💬',
  book: '📚',
}
