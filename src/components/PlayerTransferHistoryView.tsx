import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowRight, TrendUp, TrendDown, Minus, Trophy, Calendar, User, GameController, Clock } from '@phosphor-icons/react'
import { TRANSFER_HISTORY, getPlayerTransferHistory, getTeamTransfers, getTransfersByTitle, getRecentTransfers, getTransferStats } from '@/lib/transferData'
import { TransferTimeline } from '@/components/TransferTimeline'
import { useState } from 'react'
import { motion } from 'framer-motion'
import type { TransferRecord, GameTitle } from '@/lib/types'

interface PlayerTransferHistoryProps {
  players: Array<{ id: string; name: string; title?: GameTitle }>
}

function TransferTypeIcon({ type }: { type: TransferRecord['transferType'] }) {
  const iconProps = { size: 16, weight: 'duotone' as const }
  
  switch (type) {
    case 'promotion':
      return <TrendUp {...iconProps} className="text-success" />
    case 'demotion':
      return <TrendDown {...iconProps} className="text-destructive" />
    case 'return':
      return <ArrowRight {...iconProps} className="text-primary" />
    default:
      return <Minus {...iconProps} className="text-muted-foreground" />
  }
}

function TransferTypeBadge({ type }: { type: TransferRecord['transferType'] }) {
  const variants: Record<TransferRecord['transferType'], string> = {
    promotion: 'bg-success/20 text-success border-success/40',
    demotion: 'bg-destructive/20 text-destructive border-destructive/40',
    lateral: 'bg-warning/20 text-warning border-warning/40',
    return: 'bg-primary/20 text-primary border-primary/40',
    external: 'bg-accent/20 text-accent border-accent/40'
  }
  
  return (
    <Badge variant="outline" className={`${variants[type]} capitalize`}>
      {type}
    </Badge>
  )
}

function PerformanceComparison({ performance }: { performance: TransferRecord['performance'] }) {
  if (!performance) return null
  
  const { before, after } = performance
  
  const calculateChange = (beforeVal: number, afterVal?: number) => {
    if (!afterVal) return null
    const change = ((afterVal - beforeVal) / beforeVal) * 100
    return change
  }
  
  const winRateChange = calculateChange(before.winRate, after?.winRate)
  const kdaChange = calculateChange(before.kda, after?.kda)
  
  return (
    <div className="grid grid-cols-2 gap-4 mt-3 p-3 bg-muted/30 rounded-lg">
      <div>
        <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Before Transfer</div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Win Rate:</span>
            <span className="font-mono font-semibold">{before.winRate}%</span>
          </div>
          <div className="flex justify-between">
            <span>KDA:</span>
            <span className="font-mono font-semibold">{before.kda.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Games:</span>
            <span className="font-mono font-semibold">{before.gamesPlayed}</span>
          </div>
        </div>
      </div>
      
      {after && (
        <div>
          <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">After Transfer</div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between items-center">
              <span>Win Rate:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold">{after.winRate}%</span>
                {winRateChange !== null && (
                  <span className={`text-xs font-semibold ${winRateChange > 0 ? 'text-success' : winRateChange < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {winRateChange > 0 ? '+' : ''}{winRateChange.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>KDA:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold">{after.kda.toFixed(2)}</span>
                {kdaChange !== null && (
                  <span className={`text-xs font-semibold ${kdaChange > 0 ? 'text-success' : kdaChange < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {kdaChange > 0 ? '+' : ''}{kdaChange.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <span>Games:</span>
              <span className="font-mono font-semibold">{after.gamesPlayed}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function TransferCard({ transfer, index }: { transfer: TransferRecord; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <TransferTypeIcon type={transfer.transferType} />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">{transfer.playerName}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Calendar size={14} />
                  {new Date(transfer.transferDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </CardDescription>
              </div>
            </div>
            <TransferTypeBadge type={transfer.transferType} />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="font-semibold text-sm">{transfer.fromTeam}</div>
            </div>
            <ArrowRight size={20} weight="bold" className="text-primary" />
            <div className="flex items-center gap-2">
              <div className="font-semibold text-sm">{transfer.toTeam}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <GameController size={16} weight="duotone" />
            <Badge variant="secondary" className="font-mono text-xs">
              {transfer.gameTitle}
            </Badge>
          </div>
          
          {transfer.reason && (
            <div className="text-sm">
              <span className="text-muted-foreground">Reason: </span>
              <span>{transfer.reason}</span>
            </div>
          )}
          
          {transfer.notes && (
            <div className="text-sm text-muted-foreground italic border-l-2 border-primary/40 pl-3">
              {transfer.notes}
            </div>
          )}
          
          {transfer.performance && (
            <PerformanceComparison performance={transfer.performance} />
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function PlayerTransferHistoryView({ players }: PlayerTransferHistoryProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<string>('all')
  const [selectedTitle, setSelectedTitle] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  
  const stats = getTransferStats()
  
  let filteredTransfers = [...TRANSFER_HISTORY]
  
  if (selectedPlayer !== 'all') {
    filteredTransfers = getPlayerTransferHistory(selectedPlayer)
  }
  
  if (selectedTitle !== 'all') {
    filteredTransfers = filteredTransfers.filter(t => t.gameTitle === selectedTitle)
  }
  
  if (selectedType !== 'all') {
    filteredTransfers = filteredTransfers.filter(t => t.transferType === selectedType)
  }
  
  filteredTransfers.sort((a, b) => new Date(b.transferDate).getTime() - new Date(a.transferDate).getTime())
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Player Transfer History</h2>
        <p className="text-muted-foreground">
          Track player movements between Cloud9 teams and external organizations
        </p>
      </div>
      
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
              Total Transfers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-3xl font-bold text-foreground">
              {stats.totalTransfers}
            </div>
          </CardContent>
        </Card>
        
        <Card className="glow-border-success">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-3xl font-bold text-success">
              {stats.successRate.toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Improved win rate post-transfer</p>
          </CardContent>
        </Card>
        
        <Card className="glow-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
              Promotions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-3xl font-bold text-primary">
              {stats.byType.promotion || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Academy to main roster</p>
          </CardContent>
        </Card>
        
        <Card className="glow-border-warning">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
              External Signings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-3xl font-bold text-warning">
              {stats.byType.external || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">From other organizations</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <GameController size={16} weight="duotone" />
            Transfer List
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Clock size={16} weight="duotone" />
            Timeline View
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Filter Transfers</CardTitle>
                <div className="flex items-center gap-2">
                  <Trophy size={20} weight="duotone" className="text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                    Player
                  </label>
                  <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Players</SelectItem>
                      {players.map(player => (
                        <SelectItem key={player.id} value={player.id}>
                          {player.name} {player.title && `(${player.title})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                    Game Title
                  </label>
                  <Select value={selectedTitle} onValueChange={setSelectedTitle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Titles</SelectItem>
                      <SelectItem value="LoL">League of Legends</SelectItem>
                      <SelectItem value="Valorant">Valorant</SelectItem>
                      <SelectItem value="CS2">CS2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                    Transfer Type
                  </label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="promotion">Promotion</SelectItem>
                      <SelectItem value="demotion">Demotion</SelectItem>
                      <SelectItem value="lateral">Lateral</SelectItem>
                      <SelectItem value="return">Return</SelectItem>
                      <SelectItem value="external">External</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">
                {filteredTransfers.length} Transfer{filteredTransfers.length !== 1 ? 's' : ''}
              </h3>
            </div>
            
            {filteredTransfers.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <User size={48} weight="duotone" className="text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No transfers found matching the selected filters
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredTransfers.map((transfer, index) => (
                  <TransferCard key={transfer.id} transfer={transfer} index={index} />
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Filter Timeline</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                    Player
                  </label>
                  <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Players</SelectItem>
                      {players.map(player => (
                        <SelectItem key={player.id} value={player.id}>
                          {player.name} {player.title && `(${player.title})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                    Game Title
                  </label>
                  <Select value={selectedTitle} onValueChange={setSelectedTitle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Titles</SelectItem>
                      <SelectItem value="LoL">League of Legends</SelectItem>
                      <SelectItem value="Valorant">Valorant</SelectItem>
                      <SelectItem value="CS2">CS2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                    Transfer Type
                  </label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="promotion">Promotion</SelectItem>
                      <SelectItem value="demotion">Demotion</SelectItem>
                      <SelectItem value="lateral">Lateral</SelectItem>
                      <SelectItem value="return">Return</SelectItem>
                      <SelectItem value="external">External</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {filteredTransfers.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <User size={48} weight="duotone" className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No transfers found matching the selected filters
                </p>
              </CardContent>
            </Card>
          ) : (
            <TransferTimeline 
              transfers={filteredTransfers}
              playerName={selectedPlayer !== 'all' ? players.find(p => p.id === selectedPlayer)?.name : undefined}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
