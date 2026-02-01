import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Key, Database, Check, X, ArrowsClockwise, Sparkle } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface GridApiSetupProps {
  isInitialized: boolean
  hasApiKey: boolean
  isLoading: boolean
  error: string | null
  onInitialize: (apiKey: string) => void
  onFetchData: (forceRefresh?: boolean, enrichBiographies?: boolean) => void
  onClearKey: () => void
  hasCachedData: boolean
}

export function GridApiSetup({ 
  isInitialized, 
  hasApiKey,
  isLoading, 
  error, 
  onInitialize, 
  onFetchData,
  onClearKey,
  hasCachedData
}: GridApiSetupProps) {
  const [apiKey, setApiKey] = useState('')
  const [showSetup, setShowSetup] = useState(!isInitialized && !hasApiKey)

  const handleInitialize = () => {
    if (apiKey.trim()) {
      onInitialize(apiKey.trim())
      setShowSetup(false)
      setTimeout(() => {
        onFetchData(true)
      }, 500)
    }
  }

  const handleClearAndReset = () => {
    onClearKey()
    setApiKey('')
    setShowSetup(true)
  }

  if (isInitialized && !showSetup) {
    return (
      <Card className="glow-border-success bg-gradient-to-br from-success/10 to-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/20">
                <Database size={24} weight="duotone" className="text-success" />
              </div>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  GRID API Connected
                  <Check size={20} weight="bold" className="text-success" />
                </CardTitle>
                <CardDescription>
                  Using live Cloud9 esports data from GRID API
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => onFetchData(true, false)}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <ArrowsClockwise size={16} weight="bold" className={isLoading ? 'animate-spin' : ''} />
                {isLoading ? 'Refreshing...' : 'Refresh Data'}
              </Button>
              <Button
                onClick={() => onFetchData(true, true)}
                disabled={isLoading}
                variant="default"
                size="sm"
                className="gap-2"
              >
                <Sparkle size={16} weight="duotone" />
                {isLoading ? 'Enriching...' : 'Enrich Bios'}
              </Button>
              <Button
                onClick={() => setShowSetup(true)}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Key size={16} weight="bold" />
                Update Key
              </Button>
            </div>
          </div>
        </CardHeader>
        {error && (
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
        )}
      </Card>
    )
  }

  return (
    <>
      <Card className="glow-border-warning bg-gradient-to-br from-warning/10 to-accent/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/20">
                <Database size={24} weight="duotone" className="text-warning" />
              </div>
              <div>
                <CardTitle className="text-lg">GRID API Integration</CardTitle>
                <CardDescription>
                  {hasCachedData 
                    ? 'Using cached data - connect for live updates'
                    : 'Connect to access real Cloud9 esports data'}
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={() => setShowSetup(true)}
              className="gap-2"
            >
              <Key size={18} weight="duotone" />
              Configure API
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Dialog open={showSetup} onOpenChange={setShowSetup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key size={24} weight="duotone" className="text-primary" />
              GRID API Setup
            </DialogTitle>
            <DialogDescription>
              Enter your GRID API key to access real Cloud9 esports data
            </DialogDescription>
          </DialogHeader>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label htmlFor="api-key" className="text-sm font-semibold">
                API Key
              </label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your GRID API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleInitialize()}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold">How to get your API key:</p>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Visit the hackathon resources page</li>
                <li>Apply for GRID API access</li>
                <li>Copy your API key</li>
                <li>Paste it above</li>
              </ol>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleInitialize}
                disabled={!apiKey.trim() || isLoading}
                className="flex-1 gap-2"
              >
                {isLoading ? (
                  <>
                    <ArrowsClockwise size={18} weight="bold" className="animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Check size={18} weight="bold" />
                    Connect
                  </>
                )}
              </Button>
              <Button
                onClick={() => setShowSetup(false)}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  )
}
