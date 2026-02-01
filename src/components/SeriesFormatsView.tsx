import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ListBullets, Warning } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { fetchSeriesFormats, type SeriesFormat } from '@/lib/gridApi'
import { toast } from 'sonner'

export function SeriesFormatsView() {
  const [formats, setFormats] = useState<SeriesFormat[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadFormats = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const data = await fetchSeriesFormats()
      setFormats(data)
      toast.success(`Loaded ${data.length} series formats`)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load formats'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadFormats()
  }, [])

  if (error) {
    return (
      <Card className="glow-border-warning">
        <CardContent className="py-12 text-center">
          <Warning size={48} weight="duotone" className="text-warning mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={loadFormats} disabled={isLoading}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="glow-border">
        <CardContent className="py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading series formats...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Series Formats</h2>
          <p className="text-sm text-muted-foreground">
            Available match formats in the GRID API
          </p>
        </div>
        <Badge variant="outline" className="gap-2 px-4 py-2">
          <ListBullets size={18} weight="duotone" />
          {formats.length} Formats
        </Badge>
      </div>

      {formats.length === 0 ? (
        <Card className="glow-border">
          <CardContent className="py-12 text-center">
            <ListBullets size={48} weight="duotone" className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No series formats available</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {formats.map((format, index) => (
            <motion.div
              key={format.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="glow-border hover:bg-card/80 transition-colors group">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <ListBullets size={20} weight="duotone" className="text-primary" />
                    <Badge variant="secondary" className="text-xs font-mono">
                      {format.id}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm uppercase tracking-wide text-primary">
                    {format.nameShortened}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground capitalize">
                    {format.name.replace(/-/g, ' ')}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
