import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substring(7)}`

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-surface-600 font-[family-name:var(--font-display)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-3
            bg-white border-2 border-surface-200
            rounded-[var(--radius-button)]
            text-surface-900 placeholder:text-surface-400
            font-[family-name:var(--font-body)]
            transition-all duration-200
            hover:border-surface-300
            focus:outline-none focus:border-accent-500 focus:ring-4 focus:ring-accent-500/10
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-error focus:border-error focus:ring-error/10' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <span className="text-sm text-error">{error}</span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
