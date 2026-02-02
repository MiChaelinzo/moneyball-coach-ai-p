import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MousePosition {
  x: number
  y: number
}

interface TrailPoint extends MousePosition {
  id: number
}

export function MouseTrail() {
  const [trail, setTrail] = useState<TrailPoint[]>([])
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 })
  const idCounterRef = useRef(0)
  const lastUpdateRef = useRef(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      
      if (now - lastUpdateRef.current < 16) return
      
      lastUpdateRef.current = now
      setMousePos({ x: e.clientX, y: e.clientY })
      
      const newPoint: TrailPoint = {
        x: e.clientX,
        y: e.clientY,
        id: idCounterRef.current++,
      }

      setTrail((prev) => {
        const updated = [...prev, newPoint]
        if (updated.length > 12) {
          return updated.slice(-12)
        }
        return updated
      })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setTrail((prev) => {
        if (prev.length > 0) {
          return prev.slice(1)
        }
        return prev
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {trail.map((point, index) => {
          const size = 8 + (index / trail.length) * 12
          const opacity = (index / trail.length) * 0.6

          return (
            <motion.div
              key={point.id}
              className="absolute rounded-full"
              style={{
                left: point.x,
                top: point.y,
                width: size,
                height: size,
                marginLeft: -size / 2,
                marginTop: -size / 2,
                background: `radial-gradient(circle, rgba(114, 207, 237, ${opacity}) 0%, rgba(114, 207, 237, 0) 70%)`,
                boxShadow: `0 0 ${size}px rgba(114, 207, 237, ${opacity * 0.5})`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: opacity }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )
        })}
      </AnimatePresence>

      <motion.div
        className="absolute rounded-full border-2 border-primary/40"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          width: 24,
          height: 24,
          marginLeft: -12,
          marginTop: -12,
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}
