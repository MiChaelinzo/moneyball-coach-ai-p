import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Trophy, GameController, CalendarBlank, ArrowRight, Database } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

export function MultiEntityImportDemo() {
    const entities = [
        {
            icon: <Users size={20} weight="duotone" className="text-primary" />,
            name: 'Players',
            description: 'Roster with stats & bios',
            count: '5+ fields',
            color: 'primary'
        },
        {
            icon: <Trophy size={20} weight="duotone" className="text-success" />,
            name: 'Teams',
            description: 'Organizations & colors',
            count: '4+ fields',
            color: 'success'
        },
        {
            icon: <GameController size={20} weight="duotone" className="text-accent" />,
            name: 'Matches',
            description: 'Game results & stats',
            count: '8+ fields',
            color: 'accent'
        },
        {
            icon: <CalendarBlank size={20} weight="duotone" className="text-warning" />,
            name: 'Tournaments',
            description: 'Events & schedules',
            count: '5+ fields',
            color: 'warning'
        }
    ]

    return (
        <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-primary/5">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Database size={20} weight="duotone" className="text-accent" />
                        <CardTitle className="text-base">Multi-Entity Import</CardTitle>
                    </div>
                    <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/40">
                        All-in-One
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    Import everything in a single JSON file. Mix and match entities as needed.
                </p>

                <div className="grid grid-cols-2 gap-3">
                    {entities.map((entity, idx) => (
                        <motion.div
                            key={entity.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-3 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
                        >
                            <div className="flex items-start gap-2">
                                <div className="p-1.5 rounded bg-background">
                                    {entity.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-sm">{entity.name}</div>
                                    <div className="text-xs text-muted-foreground leading-tight">
                                        {entity.description}
                                    </div>
                                    <div className="text-xs text-muted-foreground/70 mt-0.5">
                                        {entity.count}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-border">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                            <span className="text-foreground font-semibold">JSON</span>
                            <ArrowRight size={12} weight="bold" />
                            <span className="text-primary">4 entities</span>
                            <ArrowRight size={12} weight="bold" />
                            <span className="text-success">One file</span>
                        </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                        See Guide
                    </Badge>
                </div>

                <div className="text-xs text-muted-foreground">
                    <span className="font-semibold">Pro Tip:</span> Each entity array is optional - include only what you need!
                </div>
            </CardContent>
        </Card>
    )
}
