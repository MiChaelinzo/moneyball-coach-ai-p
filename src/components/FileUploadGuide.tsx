import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileCsv, FileJs, Info } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'

export function FileUploadGuide() {
    return (
        <Card className="border-primary/20">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Info size={20} weight="duotone" className="text-primary" />
                    <CardTitle className="text-base">File Upload Guide</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    Upload player roster data, team information, match history, or tournament details via CSV or JSON files.
                </p>

                <Tabs defaultValue="csv" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="csv" className="gap-2">
                            <FileCsv size={16} weight="duotone" />
                            CSV Format
                        </TabsTrigger>
                        <TabsTrigger value="json" className="gap-2">
                            <FileJs size={16} weight="duotone" />
                            JSON Format
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="csv" className="space-y-3 mt-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline">Single Entity</Badge>
                                <span className="text-xs text-muted-foreground">Players roster CSV</span>
                            </div>
                            <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto font-mono">
{`id,name,role,title,kda,winRate,gamesPlayed
player-1,CoreJJ,Support,LoL,5.2,67,82
player-2,leaf,Duelist,Valorant,1.48,59,94`}
                            </pre>
                        </div>

                        <div className="text-xs text-muted-foreground space-y-1">
                            <p><strong>Required fields:</strong> id, name</p>
                            <p><strong>Numeric fields:</strong> kda, winRate, gamesPlayed (auto-converted)</p>
                            <p><strong>Supports:</strong> Quoted fields with commas, empty values</p>
                        </div>
                    </TabsContent>

                    <TabsContent value="json" className="space-y-3 mt-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline">Single Entity</Badge>
                                <span className="text-xs text-muted-foreground">Player array</span>
                            </div>
                            <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto font-mono">
{`[
  {
    "id": "player-1",
    "name": "Fudge",
    "role": "Top Lane",
    "title": "LoL",
    "kda": 3.2,
    "winRate": 58,
    "gamesPlayed": 45
  }
]`}
                            </pre>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline">Multi Entity</Badge>
                                <span className="text-xs text-muted-foreground">Players, teams, matches, tournaments</span>
                            </div>
                            <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto font-mono">
{`{
  "players": [...],
  "teams": [...],
  "matches": [...],
  "tournaments": [...]
}`}
                            </pre>
                        </div>

                        <div className="text-xs text-muted-foreground space-y-1">
                            <p><strong>Supports:</strong> Nested objects, biography data, career history</p>
                            <p><strong>Max size:</strong> 10MB per file</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
