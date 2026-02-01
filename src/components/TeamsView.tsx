import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Trophy } from '@phosphor-icons/react'
import type { Team } from '@/lib/types'

interface TeamsViewProps {
  teams: Team[]
  isLoading?: boolean
}

export function TeamsView({ teams, isLoading }: TeamsViewProps) {
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
          <h2 className="text-2xl font-semibold">Teams</h2>
          <p className="text-sm text-muted-foreground">
            {teams.length} {teams.length === 1 ? 'team' : 'teams'} from GRID API
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <Card 
            key={team.id} 
            className="glow-border hover:scale-105 transition-transform duration-200"
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
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{team.name}</CardTitle>
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
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                    Connected Games
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {team.externalLinks.map((link, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-xs"
                      >
                        {link.dataProvider.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
