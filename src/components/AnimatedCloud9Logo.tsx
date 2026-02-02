import { motion } from 'framer-motion'

export function AnimatedCloud9Logo() {
  return (
    <div className="fixed top-10 right-10 pointer-events-none opacity-10 z-0">
      <motion.svg
        width="200"
        height="200"
        viewBox="0 0 100 100"
        initial={{ opacity: 0, rotate: 0 }}
        animate={{ 
          opacity: [0.1, 0.15, 0.1],
          rotate: [0, 5, 0, -5, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <defs>
          <linearGradient id="c9-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(114, 207, 237, 0.6)" />
            <stop offset="100%" stopColor="rgba(114, 207, 237, 0.2)" />
          </linearGradient>
        </defs>
        <motion.text
          x="50"
          y="70"
          fontSize="60"
          fontWeight="bold"
          fill="url(#c9-gradient)"
          textAnchor="middle"
          fontFamily="Space Grotesk, sans-serif"
          animate={{
            filter: [
              'drop-shadow(0 0 8px rgba(114, 207, 237, 0.4))',
              'drop-shadow(0 0 12px rgba(114, 207, 237, 0.6))',
              'drop-shadow(0 0 8px rgba(114, 207, 237, 0.4))',
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          C9
        </motion.text>
      </motion.svg>
    </div>
  )
}
