import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'outlined'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export default function Card({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
}: CardProps) {
  const variants = {
    default: 'bg-white/80 backdrop-blur-sm',
    elevated: 'bg-white shadow-[var(--shadow-medium)]',
    outlined: 'bg-transparent border-2 border-surface-200',
  }

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={`
        rounded-[var(--radius-card)]
        ${variants[variant]}
        ${paddings[padding]}
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}
