import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Trophy, MagnifyingGlass } from '@phosphor-icons/react'
import type { Tournament } from '@/lib/types'
import { motion } from 'framer-motion'

interface TournamentsViewProps {
  tournaments: Tournament[]
}

export function TournamentsView({ tournaments }: TournamentsViewProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTournaments = tournaments.filter((tournament) =>
    tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tournament.nameShortened.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Cloud9 Tournaments</h2>
          <p className="text-sm text-muted-foreground">
            View tournaments featuring Cloud9 teams
          </p>
        </div>
        <Badge variant="outline" className="gap-2 px-4 py-2">
          <Trophy size={18} weight="duotone" />
          {tournaments.length} Tournaments
        </Badge>
      </div>

      <div className="relative">
        <MagnifyingGlass
          size={20}
          weight="duotone"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="text"
          placeholder="Search tournaments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredTournaments.length === 0 ? (
        <Card className="glow-border">
          <CardContent className="py-12 text-center">
            <Trophy size={48} weight="duotone" className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchQuery ? 'No tournaments found matching your search' : 'No tournaments available'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTournaments.map((tournament, index) => (
            <motion.div
              key={tournament.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="glow-border hover:bg-card/80 transition-colors cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                      <Trophy size={24} weight="duotone" className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base leading-tight mb-1">
                        {tournament.nameShortened}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {tournament.name}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Tournament ID</span>
                    <span className="font-mono text-foreground">{tournament.id}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
