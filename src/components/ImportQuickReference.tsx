import { Card } from '@/components/ui/card'
import { CheckCircle } from '@phosphor-icons/react'

export function ImportQuickReference() {
    return (
        <Card className="bg-gradient-to-br from-success/10 to-primary/10 border-success/30 p-4">
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <CheckCircle size={20} weight="duotone" className="text-success" />
                    <span className="font-semibold text-sm">Quick Import Guide</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                        <div className="font-semibold text-foreground mb-1">CSV Format</div>
                        <div className="text-muted-foreground">Single entity (players only)</div>
                    </div>
                    <div>
                        <div className="font-semibold text-foreground mb-1">JSON Array</div>
                        <div className="text-muted-foreground">Single entity with nested data</div>
                    </div>
                    <div className="col-span-2">
                        <div className="font-semibold text-success mb-1">JSON Multi-Entity ⭐</div>
                        <div className="text-muted-foreground">All entities in one file: players, teams, matches, tournaments</div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">Max file size: 10MB</span>
                    <span className="text-xs text-muted-foreground">Upload via AI Chat 💬</span>
                </div>
            </div>
        </Card>
    )
}
