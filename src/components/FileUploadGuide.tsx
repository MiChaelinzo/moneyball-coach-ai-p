import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileCsv, FileJs, Info, DownloadSimple, Database } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'

export function FileUploadGuide() {
    const handleDownloadSample = (filename: string) => {
        const link = document.createElement('a')
        link.href = `/${filename}`
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.success(`Downloading ${filename}`)
    }

    return (
        <Card className="border-primary/20">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Info size={20} weight="duotone" className="text-primary" />
                        <CardTitle className="text-base">Data Import Guide</CardTitle>
                    </div>
                    <Badge variant="secondary" className="gap-1">
                        <Database size={14} weight="duotone" />
                        Multi-Entity Support
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    Import comprehensive esports data including players, teams, matches, and tournaments. Use the AI Chat upload button or drag files directly.
                </p>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 space-y-2">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wide">Sample Files Available</p>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 h-8 text-xs"
                            onClick={() => handleDownloadSample('sample-multi-entity.json')}
                        >
                            <DownloadSimple size={14} weight="duotone" />
                            Multi-Entity JSON
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 h-8 text-xs"
                            onClick={() => handleDownloadSample('sample-players-teams.json')}
                        >
                            <DownloadSimple size={14} weight="duotone" />
                            Players + Teams
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 h-8 text-xs"
                            onClick={() => handleDownloadSample('sample-players.csv')}
                        >
                            <DownloadSimple size={14} weight="duotone" />
                            Players CSV
                        </Button>
                    </div>
                </div>

                <Separator />

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
                                <Badge variant="outline" className="bg-primary/10">Multi Entity</Badge>
                                <span className="text-xs text-muted-foreground">Import everything at once</span>
                            </div>
                            <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto font-mono">
{`{
  "players": [
    {
      "id": "p1",
      "name": "Faker",
      "role": "Mid Laner",
      "title": "LoL",
      "kda": 5.2,
      "winRate": 68,
      "gamesPlayed": 150,
      "biography": { "realName": "..." }
    }
  ],
  "teams": [
    {
      "id": "t1",
      "name": "T1",
      "colorPrimary": "#E4002B",
      "title": "LoL"
    }
  ],
  "matches": [...],
  "tournaments": [...]
}`}
                            </pre>
                        </div>

                        <div className="bg-accent/5 border border-accent/20 rounded p-3 space-y-2">
                            <p className="text-xs font-semibold text-accent">✨ Multi-Entity Benefits</p>
                            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                                <li>Import all data types in one file</li>
                                <li>Maintain relationships between entities</li>
                                <li>Include rich metadata (biographies, career history)</li>
                                <li>Mix and match: include only the entities you need</li>
                            </ul>
                        </div>

                        <div className="text-xs text-muted-foreground space-y-1">
                            <p><strong>Supports:</strong> Nested objects, biography data, career history, tournament details</p>
                            <p><strong>Optional fields:</strong> Any entity array can be omitted if not needed</p>
                            <p><strong>Max size:</strong> 10MB per file</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
