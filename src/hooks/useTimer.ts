import { useEffect, useCallback, useState } from 'react'

interface UseTimerOptions {
  initialTime: number
  onComplete?: () => void
  autoStart?: boolean
}

export function useTimer({ initialTime, onComplete, autoStart = false }: UseTimerOptions) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime)
  const [isRunning, setIsRunning] = useState(autoStart)

  const start = useCallback(() => setIsRunning(true), [])
  const pause = useCallback(() => setIsRunning(false), [])
  const reset = useCallback((newTime?: number) => {
    setTimeRemaining(newTime ?? initialTime)
    setIsRunning(false)
  }, [initialTime])

  useEffect(() => {
    if (!isRunning || timeRemaining <= 0) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false)
          onComplete?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, timeRemaining, onComplete])

  const progress = (timeRemaining / initialTime) * 100

  return {
    timeRemaining,
    isRunning,
    progress,
    start,
    pause,
    reset,
    isComplete: timeRemaining === 0,
  }
}
