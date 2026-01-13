import { forwardRef, ReactNode } from 'react'
import { motion } from 'framer-motion'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  children?: ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, disabled, onClick, type = 'button' }, ref) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2
      font-[family-name:var(--font-display)] font-semibold
      rounded-[var(--radius-button)]
      transition-all duration-200
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
      cursor-pointer select-none
    `

    const variants = {
      primary: `
        bg-accent-500 text-white
        hover:bg-accent-600 active:bg-accent-600
        shadow-[var(--shadow-soft)]
        hover:shadow-[var(--shadow-medium)]
      `,
      secondary: `
        bg-surface-200 text-surface-800
        hover:bg-surface-300 active:bg-surface-400
        border border-surface-300
      `,
      ghost: `
        bg-transparent text-surface-700
        hover:bg-surface-100 active:bg-surface-200
      `,
      danger: `
        bg-error text-white
        hover:opacity-90 active:opacity-80
      `,
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-base',
      lg: 'px-7 py-3.5 text-lg',
    }

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled ? 1 : 0.97 }}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled}
        onClick={onClick}
        type={type}
      >
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export default Button
