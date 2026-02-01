import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Users, Trophy, MagnifyingGlass } from '@phosphor-icons/react'
import type { Team } from '@/lib/types'

interface TeamsViewProps {
  teams: Team[]
  isLoading?: boolean
}

export function TeamsView({ teams, isLoading }: TeamsViewProps) {
  const [gameFilter, setGameFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const filteredTeams = useMemo(() => {
    let filtered = teams

    if (gameFilter !== 'all') {
      filtered = filtered.filter(team => 
        team.externalLinks?.some(link => 
          link.dataProvider.name.toLowerCase().includes(gameFilter.toLowerCase())
        )
      )
    }

    if (searchQuery) {
      filtered = filtered.filter(team =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }, [teams, gameFilter, searchQuery])

  const gameCounts = useMemo(() => {
    const counts = {
      all: teams.length,
      lol: 0,
      valorant: 0,
      cs2: 0,
      other: 0,
    }

    teams.forEach(team => {
      const games = team.externalLinks?.map(link => link.dataProvider.name.toLowerCase()) || []
      
      if (games.some(g => g.includes('league') || g === 'lol')) {
        counts.lol++
      }
      if (games.some(g => g.includes('valorant') || g === 'val')) {
        counts.valorant++
      }
      if (games.some(g => g.includes('cs') || g.includes('counter'))) {
        counts.cs2++
      }
    })

    return counts
  }, [teams])

  if (isLoading) {
    return (
      <Card className="glow-border">
        <CardContent className="py-12 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading teams data...</p>
        </CardContent>
      </Card>
    )
  }

  if (!teams || teams.length === 0) {
    return (
      <Card className="glow-border">
        <CardContent className="py-12 text-center">
          <Trophy size={48} weight="duotone" className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No teams data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Esports Teams</h2>
          <p className="text-sm text-muted-foreground">
            {filteredTeams.length} {filteredTeams.length === 1 ? 'team' : 'teams'} {gameFilter !== 'all' && `(filtered by ${gameFilter.toUpperCase()})`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glow-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
              League of Legends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-3xl font-bold text-primary">
              {gameCounts.lol}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Teams</p>
          </CardContent>
        </Card>

        <Card className="glow-border-success">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
              Valorant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-3xl font-bold text-success">
              {gameCounts.valorant}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Teams</p>
          </CardContent>
        </Card>

        <Card className="glow-border-warning">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
              Counter-Strike 2
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-3xl font-bold text-warning">
              {gameCounts.cs2}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Teams</p>
          </CardContent>
        </Card>

        <Card className="glow-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
              Total Teams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-3xl font-bold text-foreground">
              {gameCounts.all}
            </div>
            <p className="text-xs text-muted-foreground mt-1">All Games</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glow-border bg-card/50">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="relative">
              <MagnifyingGlass 
                size={18} 
                weight="bold" 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                type="text"
                placeholder="Search teams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Tabs value={gameFilter} onValueChange={setGameFilter}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">
                  All ({gameCounts.all})
                </TabsTrigger>
                <TabsTrigger value="league">
                  LoL ({gameCounts.lol})
                </TabsTrigger>
                <TabsTrigger value="valorant">
                  Valorant ({gameCounts.valorant})
                </TabsTrigger>
                <TabsTrigger value="cs">
                  CS2 ({gameCounts.cs2})
                </TabsTrigger>
                <TabsTrigger value="other">
                  Other
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeams.map((team) => {
          const isNATeam = ['Cloud9', 'Team Liquid', 'FlyQuest', '100 Thieves', 'TSM', 'Evil Geniuses', 
                            'Dignitas', 'Golden Guardians', 'Immortals', 'NRG', 'Sentinels', 'OpTic', 
                            'FaZe Clan', 'Complexity'].some(na => 
                              team.name.toLowerCase().includes(na.toLowerCase())
                            )
          
          return (
            <Card 
              key={team.id} 
              className={`${isNATeam ? 'glow-border-success' : 'glow-border'} hover:scale-105 transition-transform duration-200`}
              style={{
                borderColor: team.colorPrimary + '40',
                boxShadow: `0 0 15px ${team.colorPrimary}20`,
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  {team.logoUrl && (
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${team.colorPrimary}, ${team.colorSecondary})`,
                      }}
                    >
                      <img 
                        src={team.logoUrl} 
                        alt={team.name}
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                  )}
                  {!team.logoUrl && (
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${team.colorPrimary}, ${team.colorSecondary})`,
                      }}
                    >
                      <Trophy size={24} weight="duotone" className="text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg truncate">{team.name}</CardTitle>
                      {isNATeam && (
                        <Badge variant="outline" className="text-xs bg-success/20 border-success text-success">
                          NA
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground font-mono mt-1">
                      ID: {team.id}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2 flex-wrap">
                  <div 
                    className="flex items-center gap-2 px-2 py-1 rounded text-xs font-medium"
                    style={{
                      backgroundColor: team.colorPrimary + '20',
                      color: team.colorPrimary,
                    }}
                  >
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: team.colorPrimary }}
                    />
                    Primary
                  </div>
                  <div 
                    className="flex items-center gap-2 px-2 py-1 rounded text-xs font-medium"
                    style={{
                      backgroundColor: team.colorSecondary + '20',
                      color: team.colorSecondary === '#ffffff' || team.colorSecondary === '#fff' ? '#000000' : team.colorSecondary,
                    }}
                  >
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: team.colorSecondary }}
                    />
                    Secondary
                  </div>
                </div>

                {team.externalLinks && team.externalLinks.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                      Games
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {team.externalLinks.map((link, index) => {
                        const gameName = link.dataProvider.name
                        let badgeVariant: 'default' | 'secondary' | 'outline' = 'outline'
                        
                        if (gameName.toLowerCase().includes('league') || gameName.toLowerCase() === 'lol') {
                          badgeVariant = 'default'
                        } else if (gameName.toLowerCase().includes('valorant')) {
                          badgeVariant = 'default'
                        } else if (gameName.toLowerCase().includes('cs') || gameName.toLowerCase().includes('counter')) {
                          badgeVariant = 'default'
                        }
                        
                        return (
                          <Badge 
                            key={index} 
                            variant={badgeVariant}
                            className="text-xs"
                          >
                            {gameName}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredTeams.length === 0 && (
        <Card className="glow-border">
          <CardContent className="py-12 text-center">
            <Trophy size={48} weight="duotone" className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No teams found matching your filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
