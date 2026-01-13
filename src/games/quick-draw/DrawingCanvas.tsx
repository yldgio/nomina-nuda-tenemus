import { useRef, useEffect, useCallback, useState } from 'react'

interface Point {
  x: number
  y: number
}

interface DrawingCanvasProps {
  isDrawer: boolean
  brushColor: string
  brushSize: number
  onClear?: () => void
  clearTrigger?: number
}

export default function DrawingCanvas({
  isDrawer,
  brushColor,
  brushSize,
  clearTrigger,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const lastPoint = useRef<Point | null>(null)

  // Get canvas context
  const getContext = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return null
    return canvas.getContext('2d')
  }, [])

  // Set up canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas size to match display size
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.scale(dpr, dpr)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, rect.width, rect.height)
    }
  }, [])

  // Clear canvas when clearTrigger changes
  useEffect(() => {
    if (clearTrigger === undefined) return
    const canvas = canvasRef.current
    const ctx = getContext()
    if (!canvas || !ctx) return

    const rect = canvas.getBoundingClientRect()
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, rect.width, rect.height)
  }, [clearTrigger, getContext])

  // Get point from event
  const getPoint = useCallback((e: React.MouseEvent | React.TouchEvent): Point | null => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    
    if ('touches' in e) {
      const touch = e.touches[0]
      if (!touch) return null
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      }
    }

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }, [])

  // Draw line between two points
  const drawLine = useCallback((from: Point, to: Point) => {
    const ctx = getContext()
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.strokeStyle = brushColor
    ctx.lineWidth = brushSize
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
  }, [brushColor, brushSize, getContext])

  // Start drawing
  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawer) return
    e.preventDefault()

    const point = getPoint(e)
    if (!point) return

    setIsDrawing(true)
    lastPoint.current = point

    // Draw a dot for single clicks
    const ctx = getContext()
    if (ctx) {
      ctx.beginPath()
      ctx.arc(point.x, point.y, brushSize / 2, 0, Math.PI * 2)
      ctx.fillStyle = brushColor
      ctx.fill()
    }
  }, [isDrawer, getPoint, getContext, brushColor, brushSize])

  // Continue drawing
  const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawer || !isDrawing) return
    e.preventDefault()

    const point = getPoint(e)
    if (!point || !lastPoint.current) return

    drawLine(lastPoint.current, point)
    lastPoint.current = point
  }, [isDrawer, isDrawing, getPoint, drawLine])

  // Stop drawing
  const handleEnd = useCallback(() => {
    setIsDrawing(false)
    lastPoint.current = null
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`
        w-full aspect-[4/3] rounded-xl bg-white border-2
        ${isDrawer ? 'border-accent-500 cursor-crosshair' : 'border-surface-200'}
        touch-none
      `}
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    />
  )
}
