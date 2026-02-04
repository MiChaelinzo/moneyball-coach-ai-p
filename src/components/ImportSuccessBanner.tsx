import { motion } from 'framer-motion'
import { CheckCircle, X, Users, Trophy, GameController, CalendarBlank } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ImportSuccessBannerProps {
    entities: {
        players?: number
        teams?: number
        matches?: number
        tournaments?: number
    }
    onDismiss: () => void
}

export function ImportSuccessBanner({ entities, onDismiss }: ImportSuccessBannerProps) {
    const entityData = [
        { key: 'players', icon: Users, label: 'Players', color: 'text-primary' },
        { key: 'teams', icon: Trophy, label: 'Teams', color: 'text-success' },
        { key: 'matches', icon: GameController, label: 'Matches', color: 'text-accent' },
        { key: 'tournaments', icon: CalendarBlank, label: 'Tournaments', color: 'text-warning' }
    ]

    const importedEntities = entityData.filter(e => entities[e.key as keyof typeof entities])
    
    if (importedEntities.length === 0) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
        >
            <Card className="border-success/50 bg-gradient-to-r from-success/10 to-primary/10">
                <div className="p-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                            <div className="p-2 rounded-lg bg-success/20">
                                <CheckCircle size={24} weight="duotone" className="text-success" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg mb-1">Multi-Entity Import Successful!</h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Your data has been imported and is now available across the platform.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    {importedEntities.map(({ key, icon: Icon, label, color }) => (
                                        <div
                                            key={key}
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background border border-border"
                                        >
                                            <Icon size={16} weight="duotone" className={color} />
                                            <span className="text-sm font-semibold">
                                                {entities[key as keyof typeof entities]}
                                            </span>
                                            <span className="text-xs text-muted-foreground">{label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onDismiss}
                            className="flex-shrink-0"
                        >
                            <X size={18} />
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    )
}
