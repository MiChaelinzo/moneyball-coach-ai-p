import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/butto
import { MagnifyingGlass, X } from '@phosphor-i

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
  use
      if ((e.metaKey || e.ctrlKey) &&
    

      if (e.key ===
        setSearchQuery('')

        if (e.key === 'Arr
          setSelectedIn
          )
       

          )
        if (e.key === 'E
          handleSelectTab(
      }

    return () => window.removeEventListener('k

    setSelectedIndex(0)

    const handleClickOutside = (e: MouseEvent) => {
        set
    }
    if (isOpen) {
      return () => document.
  }, [isOpen])
  const handleSelectTab = (tabValue: string) => {
    setIsOp
  }
  return (
      <Button
        onClick={() => {
         
       
     

        <kbd className="pointer-events-none inline-fl
        </kbd>


            initial
            exit={{ opa
            classNa

                <di
                    size={18} 
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-fo
                  <Input
       
     

                 
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w
     
              

              <div className="max-h-[400px] overf
                  <div cl
                  </
                  <div
   

          
                            : tab.value === curre
             
                      >
                        
                            
                          {tab.icon}
          
                          <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-primary/20 t
       
                      </button>
                  </div>
              </div>
              
                  <div className="flex items-center justify-between text-xs text-muted-foreground px-2">
                      <div className="flex it
              
               

                      <
                    
                    <
                  </div>
              )}
          </motion.div>
      </AnimatePresence>
  )





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
