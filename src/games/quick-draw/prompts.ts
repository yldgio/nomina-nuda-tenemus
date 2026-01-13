// Drawing prompts for Quick Draw game
export const DRAWING_PROMPTS = [
  // Animals
  'cat', 'dog', 'fish', 'bird', 'snake', 'rabbit', 'elephant', 'giraffe', 'lion', 'butterfly',
  // Objects
  'house', 'car', 'tree', 'flower', 'sun', 'moon', 'star', 'book', 'phone', 'clock',
  'key', 'umbrella', 'glasses', 'hat', 'shoe', 'cup', 'bottle', 'lamp', 'chair', 'table',
  // Food
  'pizza', 'apple', 'banana', 'cake', 'ice cream', 'hamburger', 'cookie', 'donut', 'egg', 'bread',
  // Nature
  'mountain', 'cloud', 'rain', 'rainbow', 'ocean', 'beach', 'volcano', 'island', 'river', 'forest',
  // Activities
  'running', 'swimming', 'sleeping', 'dancing', 'cooking', 'reading', 'singing', 'crying', 'laughing', 'thinking',
]

export const getRandomPrompt = (): string => {
  return DRAWING_PROMPTS[Math.floor(Math.random() * DRAWING_PROMPTS.length)]
}
