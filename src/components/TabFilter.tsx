import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { MagnifyingGlass, X } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import type { TabItem } from './TabSearch'

interface TabFilterProps {
  tabs: TabItem[]
  onFilterChange: (filteredTabs: TabItem[]) => void
}

export function TabFilter({ tabs, onFilterChange }: TabFilterProps) {
  const [filterQuery, setFilterQuery] = useState('')

  const handleFilterChange = (query: string) => {
    setFilterQuery(query)
    
    if (!query.trim()) {
      onFilterChange(tabs)
      return
    }

    const filtered = tabs.filter(tab => {
      const q = query.toLowerCase()
      const labelMatch = tab.label.toLowerCase().includes(q)
      const keywordMatch = tab.keywords?.some(keyword => 
        keyword.toLowerCase().includes(q)
      )
      return labelMatch || keywordMatch
    })

    onFilterChange(filtered)
  }

  const clearFilter = () => {
    setFilterQuery('')
    onFilterChange(tabs)
  }

  return (
    <div className="relative w-full max-w-xs mb-4">
      <MagnifyingGlass 
        size={16} 
        weight="bold" 
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
      />
      <Input
        value={filterQuery}
        onChange={(e) => handleFilterChange(e.target.value)}
        placeholder="Filter tabs..."
        className="pl-9 pr-9 h-9 bg-card/50 border-border/50"
      />
      {filterQuery && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilter}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
        >
          <X size={14} weight="bold" />
        </Button>
      )}
    </div>
  )
}
