import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { User, MapPin, Calendar, Trophy, Target, Star } from '@phosphor-icons/react'
import type { Player } from '@/lib/types'
import { motion } from 'framer-motion'

interface PlayerBiographyViewProps {
  player: Player
}

export function PlayerBiographyView({ player }: PlayerBiographyViewProps) {
  const biography = player.biography
  const careerHistory = player.careerHistory || []

  if (!biography && careerHistory.length === 0) {
    return (
      <Card className="glow-border">
        <CardContent className="py-12 text-center">
          <User size={48} weight="duotone" className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            No biography or career history available for this player
          </p>
        </CardContent>
      </Card>
    )
  }

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  return (
    <div className="space-y-6">
      {biography && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="glow-border bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <User size={24} weight="duotone" className="text-primary" />
                </div>
                Player Biography
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {biography.realName && (
                    <div className="flex items-start gap-3">
                      <User size={20} weight="duotone" className="text-primary mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-1">
                          Real Name
                        </div>
                        <div className="text-foreground font-medium">{biography.realName}</div>
                      </div>
                    </div>
                  )}

                  {biography.nationality && (
                    <div className="flex items-start gap-3">
                      <MapPin size={20} weight="duotone" className="text-primary mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-1">
                          Nationality
                        </div>
                        <div className="text-foreground font-medium">{biography.nationality}</div>
                      </div>
                    </div>
                  )}

                  {biography.birthDate && (
                    <div className="flex items-start gap-3">
                      <Calendar size={20} weight="duotone" className="text-primary mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-1">
                          Age
                        </div>
                        <div className="text-foreground font-medium">
                          {calculateAge(biography.birthDate)} years old
                        </div>
                      </div>
                    </div>
                  )}

                  {biography.hometown && (
                    <div className="flex items-start gap-3">
                      <MapPin size={20} weight="duotone" className="text-primary mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-1">
                          Hometown
                        </div>
                        <div className="text-foreground font-medium">{biography.hometown}</div>
                      </div>
                    </div>
                  )}

                  {biography.careerStart && (
                    <div className="flex items-start gap-3">
                      <Trophy size={20} weight="duotone" className="text-primary mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-1">
                          Career Start
                        </div>
                        <div className="text-foreground font-medium">
                          {biography.careerStart} ({new Date().getFullYear() - biography.careerStart} years pro)
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {biography.playstyle && (
                    <div className="flex items-start gap-3">
                      <Target size={20} weight="duotone" className="text-accent mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-1">
                          Playstyle
                        </div>
                        <div className="text-foreground">{biography.playstyle}</div>
                      </div>
                    </div>
                  )}

                  {biography.signature && (
                    <div className="flex items-start gap-3">
                      <Star size={20} weight="duotone" className="text-accent mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-1">
                          Signature
                        </div>
                        <div className="text-foreground">{biography.signature}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <div className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                  About
                </div>
                <p className="text-foreground leading-relaxed">{biography.bio}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {careerHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="glow-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/20">
                  <Trophy size={24} weight="duotone" className="text-accent" />
                </div>
                Career History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                <div className="space-y-6">
                  {careerHistory
                    .sort((a, b) => b.year - a.year)
                    .map((milestone, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="relative pl-12"
                      >
                        <div className="absolute left-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center border-4 border-background">
                          <Trophy size={16} weight="duotone" className="text-primary-foreground" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="font-mono text-xl font-bold text-primary">
                              {milestone.year}
                            </span>
                            {milestone.team && (
                              <Badge variant="outline" className="text-xs">
                                {milestone.team}
                              </Badge>
                            )}
                            {milestone.title && milestone.title !== 'All' && (
                              <Badge variant="secondary" className="text-xs">
                                {milestone.title}
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            {milestone.event}
                          </div>
                          <div className="text-foreground">{milestone.achievement}</div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
