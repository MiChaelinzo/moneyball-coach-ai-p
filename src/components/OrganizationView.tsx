import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Buildings, Users } from '@phosphor-icons/react'
import type { Organization } from '@/lib/gridApi'

interface OrganizationViewProps {
  organization: Organization | null
  isLoading?: boolean
}

export function OrganizationView({ organization, isLoading }: OrganizationViewProps) {
  if (isLoading) {
    return (
      <Card className="glow-border">
        <CardContent className="py-12 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading organization data...</p>
        </CardContent>
      </Card>
    )
  }

  if (!organization) {
    return (
      <Card className="glow-border">
        <CardContent className="py-12 text-center">
          <Buildings size={48} weight="duotone" className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No organization data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glow-border bg-gradient-to-br from-primary/5 to-accent/5">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary/20">
            <Buildings size={32} weight="duotone" className="text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">{organization.name}</CardTitle>
            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
              <Users size={16} weight="duotone" />
              {organization.teams.length} {organization.teams.length === 1 ? 'Team' : 'Teams'}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Teams in Organization
            </h3>
            <div className="flex flex-wrap gap-2">
              {organization.teams.map((team, index) => (
                <Badge
                  key={`${team.name}-${index}`}
                  variant="secondary"
                  className="px-3 py-1.5 text-sm font-medium"
                >
                  {team.name}
                </Badge>
              ))}
            </div>
          </div>
          
          {organization.teams.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users size={32} weight="duotone" className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No teams found for this organization</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
