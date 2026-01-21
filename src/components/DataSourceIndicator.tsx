import { Database, CloudCheck, HardDrives } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface DataSourceIndicatorProps {
  isLiveData: boolean
  hasCachedData: boolean
  isLoading: boolean
}

export function DataSourceIndicator({ isLiveData, hasCachedData, isLoading }: DataSourceIndicatorProps) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2 text-xs text-muted-foreground"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Database size={14} weight="duotone" />
        </motion.div>
        <span>Loading data...</span>
      </motion.div>
    )
  }

  if (isLiveData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2 text-xs"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <CloudCheck size={14} weight="duotone" className="text-success" />
        </motion.div>
        <span className="text-success font-medium">GRID API Connected</span>
      </motion.div>
    )
  }

  if (hasCachedData) {
    return (
      <div className="flex items-center gap-2 text-xs text-warning">
        <HardDrives size={14} weight="duotone" />
        <span className="font-medium">Cached Data</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <Database size={14} weight="duotone" />
      <span>Demo Data</span>
    </div>
  )
}
