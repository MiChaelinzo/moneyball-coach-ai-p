import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import type { Player } from '@/lib/types'
import { User } from '@phosphor-icons/react'

interface PlayerCardProps {
  player: Player
  isSelected?: boolean
  onClick?: () => void
}

export function PlayerCard({ player, isSelected, onClick }: PlayerCardProps) {
  const roleColors: Record<string, string> = {
    'Top': 'bg-chart-1/20 text-chart-1 border-chart-1/40',
    'Jungle': 'bg-chart-2/20 text-chart-2 border-chart-2/40',
    'Mid': 'bg-chart-3/20 text-chart-3 border-chart-3/40',
    'ADC': 'bg-chart-4/20 text-chart-4 border-chart-4/40',
    'Support': 'bg-chart-5/20 text-chart-5 border-chart-5/40',
    'Controller': 'bg-chart-2/20 text-chart-2 border-chart-2/40',
    'IGL/Controller': 'bg-chart-3/20 text-chart-3 border-chart-3/40',
    'Duelist': 'bg-chart-1/20 text-chart-1 border-chart-1/40',
    'Initiator': 'bg-chart-4/20 text-chart-4 border-chart-4/40',
    'Sentinel': 'bg-chart-5/20 text-chart-5 border-chart-5/40',
    'IGL/Sentinel': 'bg-chart-5/20 text-chart-5 border-chart-5/40',
    'IGL': 'bg-chart-3/20 text-chart-3 border-chart-3/40',
    'Rifler': 'bg-chart-1/20 text-chart-1 border-chart-1/40',
    'AWPer': 'bg-chart-4/20 text-chart-4 border-chart-4/40',
  }

  const titleColors: Record<string, string> = {
    'LoL': 'bg-primary/20 text-primary border-primary/40',
    'Valorant': 'bg-destructive/20 text-destructive border-destructive/40',
    'CS2': 'bg-warning/20 text-warning border-warning/40',
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className={`cursor-pointer transition-all ${
          isSelected ? 'glow-border' : 'border-border hover:border-primary/40'
        }`}
        onClick={onClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <User size={24} weight="duotone" className="text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">{player.name}</CardTitle>
                <div className="flex items-center gap-1.5 mt-1">
                  <Badge className={`${roleColors[player.role] || roleColors['Support']} text-xs`}>
                    {player.role}
                  </Badge>
                  {player.title && (
                    <Badge className={`${titleColors[player.title] || titleColors['LoL']} text-xs`}>
                      {player.title}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="font-mono text-2xl font-semibold text-primary">
                {player.kda.toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                KDA
              </div>
            </div>
            <div>
              <div className="font-mono text-2xl font-semibold text-success">
                {player.winRate}%
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Win Rate
              </div>
            </div>
            <div>
              <div className="font-mono text-2xl font-semibold text-foreground">
                {player.gamesPlayed}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Games
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
