import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { MagnifyingGlass, X } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

export interface TabItem {
  value: string
  label: string
  icon: React.ReactNode
  keywords?: string[]
}

interface TabSearchProps {
  tabs: TabItem[]
  currentTab: string
  onTabSelect: (tabValue: string) => void
}

export function TabSearch({ tabs, currentTab, onTabSelect }: TabSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredTabs = tabs.filter(tab => {
    const query = searchQuery.toLowerCase()
    const labelMatch = tab.label.toLowerCase().includes(query)
    const keywordMatch = tab.keywords?.some(keyword => 
      keyword.toLowerCase().includes(query)
    )
    return labelMatch || keywordMatch
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }

      if (isOpen) {
        if (e.key === 'Escape') {
          setIsOpen(false)
          setSearchQuery('')
        }

        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setSelectedIndex(prev => 
            prev < filteredTabs.length - 1 ? prev + 1 : prev
          )
        }

        if (e.key === 'ArrowUp') {
          e.preventDefault()
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0))
        }

        if (e.key === 'Enter' && filteredTabs[selectedIndex]) {
          e.preventDefault()
          handleSelectTab(filteredTabs[selectedIndex].value)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredTabs, selectedIndex])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    setSelectedIndex(0)
  }, [searchQuery])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSelectTab = (tabValue: string) => {
    onTabSelect(tabValue)
    setIsOpen(false)
    setSearchQuery('')
  }

  return (
    <div ref={containerRef} className="relative">
      <Button
        onClick={() => {
          setIsOpen(true)
        }}
        variant="outline"
        className="gap-2 w-64"
      >
        <MagnifyingGlass size={18} weight="bold" />
        <span className="flex-1 text-left text-muted-foreground">Search tabs...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 z-50 w-96 right-0"
          >
            <Card className="shadow-lg border-border/50 overflow-hidden">
              <div className="p-3 border-b border-border/50">
                <div className="relative">
                  <MagnifyingGlass 
                    size={18} 
                    weight="bold" 
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
                  />
                  <Input
                    ref={inputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tabs..."
                    className="pl-10 pr-10 bg-background/50"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                    >
                      <X size={14} weight="bold" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {filteredTabs.length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    No tabs found matching "{searchQuery}"
                  </div>
                ) : (
                  <div className="p-2">
                    {filteredTabs.map((tab, index) => (
                      <button
                        key={tab.value}
                        onClick={() => handleSelectTab(tab.value)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all ${
                          index === selectedIndex
                            ? 'bg-primary/20 text-primary'
                            : tab.value === currentTab
                            ? 'bg-accent/50 text-accent-foreground'
                            : 'hover:bg-accent/30 text-foreground'
                        }`}
                      >
                        <div className={`flex-shrink-0 ${
                          index === selectedIndex || tab.value === currentTab
                            ? 'text-primary'
                            : 'text-muted-foreground'
                        }`}>
                          {tab.icon}
                        </div>
                        <span className="text-sm font-medium">{tab.label}</span>
                        {tab.value === currentTab && (
                          <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                            Current
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {filteredTabs.length > 0 && (
                <div className="p-2 border-t border-border/50 bg-muted/30">
                  <div className="flex items-center justify-between text-xs text-muted-foreground px-2">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 rounded bg-background border">↑↓</kbd>
                        <span>Navigate</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 rounded bg-background border">↵</kbd>
                        <span>Select</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 rounded bg-background border">Esc</kbd>
                        <span>Close</span>
                      </div>
                    </div>
                    <span>{filteredTabs.length} results</span>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
