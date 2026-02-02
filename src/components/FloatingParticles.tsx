import { motion } from 'framer-motion'

interface FloatingParticle {
  id: number
  x: string
  delay: number
  duration: number
  size: number
}

const particles: FloatingParticle[] = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: `${Math.random() * 100}%`,
  delay: Math.random() * 5,
  duration: 15 + Math.random() * 10,
  size: 2 + Math.random() * 4,
}))

export function FloatingParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary/30"
          style={{
            left: particle.x,
            width: particle.size,
            height: particle.size,
            filter: 'blur(1px)',
            boxShadow: `0 0 ${particle.size * 2}px rgba(114, 207, 237, 0.4)`,
          }}
          initial={{ y: '100vh', opacity: 0 }}
          animate={{
            y: '-10vh',
            opacity: [0, 0.6, 0.8, 0.6, 0],
            x: [0, Math.random() * 100 - 50, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}
