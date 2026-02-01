import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { Download, FileCsv, FilePdf } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { ExportFormat } from '@/lib/exportUtils'

interface ExportButtonProps {
  onExport: (format: ExportFormat) => void
  disabled?: boolean
  label?: string
  size?: 'default' | 'sm' | 'lg' | 'icon'
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
}

export function ExportButton({
  onExport,
  disabled = false,
  label = 'Export',
  size = 'default',
  variant = 'outline'
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true)
    try {
      await onExport(format)
      toast.success(`Export successful! ${format.toUpperCase()} file ${format === 'pdf' ? 'ready to print' : 'downloaded'}`)
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export data. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          disabled={disabled || isExporting}
          className="gap-2"
        >
          <Download size={18} weight="duotone" />
          {size !== 'icon' && (isExporting ? 'Exporting...' : label)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-xs uppercase tracking-wide text-muted-foreground">
          Export Format
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleExport('csv')}
          className="gap-3 cursor-pointer"
        >
          <FileCsv size={20} weight="duotone" className="text-success" />
          <div className="flex flex-col">
            <span className="font-semibold">CSV File</span>
            <span className="text-xs text-muted-foreground">
              Excel compatible
            </span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport('pdf')}
          className="gap-3 cursor-pointer"
        >
          <FilePdf size={20} weight="duotone" className="text-destructive" />
          <div className="flex flex-col">
            <span className="font-semibold">PDF Report</span>
            <span className="text-xs text-muted-foreground">
              Print friendly
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
