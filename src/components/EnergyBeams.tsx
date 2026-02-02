import { motion } from 'framer-motion'

export function EnergyBeams() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
      <motion.div
        className="absolute left-0 top-1/4 w-full h-0.5"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(114, 207, 237, 0.6) 50%, transparent 100%)',
        }}
        animate={{
          x: ['-100%', '200%'],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'linear',
          delay: 0,
        }}
      />
      
      <motion.div
        className="absolute left-0 top-1/2 w-full h-0.5"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(114, 207, 237, 0.4) 50%, transparent 100%)',
        }}
        animate={{
          x: ['200%', '-100%'],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'linear',
          delay: 1,
        }}
      />

      <motion.div
        className="absolute left-0 top-3/4 w-full h-0.5"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(114, 207, 237, 0.5) 50%, transparent 100%)',
        }}
        animate={{
          x: ['-100%', '200%'],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'linear',
          delay: 2,
        }}
      />

      <motion.div
        className="absolute top-0 left-1/4 h-full w-0.5"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(114, 207, 237, 0.3) 50%, transparent 100%)',
        }}
        animate={{
          y: ['-100%', '200%'],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'linear',
          delay: 0.5,
        }}
      />

      <motion.div
        className="absolute top-0 right-1/3 h-full w-0.5"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(114, 207, 237, 0.4) 50%, transparent 100%)',
        }}
        animate={{
          y: ['200%', '-100%'],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'linear',
          delay: 1.5,
        }}
      />
    </div>
  )
}
