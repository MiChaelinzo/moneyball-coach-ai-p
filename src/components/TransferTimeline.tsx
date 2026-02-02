import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Circle } from '@phosphor-icons/react'
import type { TransferRecord } from '@/lib/types'
import { motion } from 'framer-motion'

interface TransferTimelineProps {
  transfers: TransferRecord[]
  playerName?: string
}

export function TransferTimeline({ transfers, playerName }: TransferTimelineProps) {
  const sortedTransfers = [...transfers].sort(
    (a, b) => new Date(a.transferDate).getTime() - new Date(b.transferDate).getTime()
  )

  const getTransferColor = (type: TransferRecord['transferType']) => {
    switch (type) {
      case 'promotion':
        return 'text-success'
      case 'demotion':
        return 'text-destructive'
      case 'return':
        return 'text-primary'
      case 'external':
        return 'text-accent'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {playerName ? `${playerName}'s Transfer Timeline` : 'Transfer Timeline'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-8">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
          
          {sortedTransfers.map((transfer, index) => (
            <motion.div
              key={transfer.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative flex gap-6"
            >
              <div className="relative z-10">
                <Circle
                  size={32}
                  weight="fill"
                  className={`${getTransferColor(transfer.transferType)} bg-background p-1`}
                />
              </div>
              
              <div className="flex-1 pb-8">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold text-lg">{transfer.playerName}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(transfer.transferDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {transfer.transferType}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-3 mb-3 p-3 bg-muted/30 rounded-lg">
                  <span className="font-semibold text-sm">{transfer.fromTeam}</span>
                  <ArrowRight size={20} weight="bold" className="text-primary" />
                  <span className="font-semibold text-sm">{transfer.toTeam}</span>
                </div>
                
                {transfer.reason && (
                  <p className="text-sm text-muted-foreground">{transfer.reason}</p>
                )}
                
                {transfer.performance && transfer.performance.after && (
                  <div className="mt-3 flex items-center gap-4 text-xs">
                    <div>
                      <span className="text-muted-foreground">Win Rate: </span>
                      <span className="font-mono font-semibold">
                        {transfer.performance.before.winRate}%
                      </span>
                      <span className="mx-1">→</span>
                      <span className="font-mono font-semibold text-success">
                        {transfer.performance.after.winRate}%
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">KDA: </span>
                      <span className="font-mono font-semibold">
                        {transfer.performance.before.kda.toFixed(2)}
                      </span>
                      <span className="mx-1">→</span>
                      <span className="font-mono font-semibold text-success">
                        {transfer.performance.after.kda.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
