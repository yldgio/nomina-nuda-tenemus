import { motion } from 'framer-motion'

interface TimerProps {
  timeRemaining: number
  maxTime: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export default function Timer({
  timeRemaining,
  maxTime,
  size = 'md',
  showLabel = true,
}: TimerProps) {
  const progress = (timeRemaining / maxTime) * 100
  const isUrgent = progress < 25
  const isWarning = progress < 50 && !isUrgent

  const sizes = {
    sm: { width: 60, strokeWidth: 4, fontSize: 'text-sm' },
    md: { width: 80, strokeWidth: 5, fontSize: 'text-xl' },
    lg: { width: 120, strokeWidth: 6, fontSize: 'text-3xl' },
  }

  const { width, strokeWidth, fontSize } = sizes[size]
  const radius = (width - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  const getColor = () => {
    if (isUrgent) return 'var(--color-error)'
    if (isWarning) return 'var(--color-warning)'
    return 'var(--color-teal-500)'
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={width} height={width} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke="var(--color-surface-200)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress / 100)}
          initial={false}
          animate={{
            strokeDashoffset: circumference * (1 - progress / 100),
            stroke: getColor(),
          }}
          transition={{ duration: 0.3 }}
        />
      </svg>
      {showLabel && (
        <motion.span
          className={`absolute ${fontSize} font-bold font-[family-name:var(--font-display)]`}
          style={{ color: getColor() }}
          animate={isUrgent ? { scale: [1, 1.1, 1] } : {}}
          transition={{ repeat: isUrgent ? Infinity : 0, duration: 0.5 }}
        >
          {timeRemaining}
        </motion.span>
      )}
    </div>
  )
}
