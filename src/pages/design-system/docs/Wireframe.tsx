import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

function Box({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <div className={cn('grid place-items-center rounded-md border border-dashed border-line-control bg-subtle p-1 text-center text-[0.6875rem] leading-tight font-medium text-fg-muted', className)}>
      {children}
    </div>
  )
}

/** Esquemas dos templates: onde ficam os slots. Puramente ilustrativo (aria-hidden). */
export function Wireframe({ kind }: { kind: 'app-shell' | 'settings' | 'list' | 'form' }) {
  return (
    <div aria-hidden className="h-56 w-full max-w-md">
      {kind === 'app-shell' ? (
        <div className="grid h-full grid-rows-[2.25rem_minmax(0,1fr)] gap-1.5">
          <Box className="bg-primary-soft text-primary-soft-fg">AppHeader</Box>
          <div className="grid grid-cols-[6rem_minmax(0,1fr)] gap-1.5">
            <Box>SidebarNav</Box>
            <Box className="bg-surface">main {'{children}'}</Box>
          </div>
        </div>
      ) : null}
      {kind === 'settings' ? (
        <div className="grid h-full grid-rows-[2.25rem_minmax(0,1fr)] gap-1.5">
          <Box>PageHeader</Box>
          <div className="grid grid-cols-[6rem_minmax(0,1fr)] gap-1.5">
            <Box>NavItem ×n</Box>
            <Box className="bg-surface">{'{children}'}</Box>
          </div>
        </div>
      ) : null}
      {kind === 'list' ? (
        <div className="grid h-full grid-rows-[2.5rem_2rem_minmax(0,1fr)] gap-1.5">
          <Box>PageHeader (título + ações)</Box>
          <Box>FilterBar</Box>
          <Box className="bg-surface">DataTable {'{children}'}</Box>
        </div>
      ) : null}
      {kind === 'form' ? (
        <div className="grid h-full grid-rows-[2.25rem_minmax(0,1fr)_2rem] gap-1.5">
          <Box>PageHeader</Box>
          <div className="grid gap-1.5">
            <Box className="bg-surface">FormSection</Box>
            <Box className="bg-surface">FormSection</Box>
          </div>
          <Box className="bg-primary-soft text-primary-soft-fg">StickyActionBar</Box>
        </div>
      ) : null}
    </div>
  )
}
