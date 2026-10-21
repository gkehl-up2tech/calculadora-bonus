import type { ComponentProps } from 'react'
import { Accordion as AccordionPrimitive } from 'radix-ui'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

export const Accordion = AccordionPrimitive.Root

export function AccordionItem({ className, ...props }: ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item className={cn('border-b border-line-subtle last:border-b-0', className)} {...props} />
}

export interface AccordionTriggerProps extends ComponentProps<typeof AccordionPrimitive.Trigger> {
  /** Nível do título que envolve o gatilho (padrão h3, o do Radix). Ajuste à hierarquia da página. */
  headingLevel?: 2 | 3 | 4 | 5 | 6
}

export function AccordionTrigger({ className, children, headingLevel = 3, ...props }: AccordionTriggerProps) {
  const Heading = `h${headingLevel}` as 'h3'
  return (
    <AccordionPrimitive.Header asChild>
      <Heading className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          'group flex min-h-control-md flex-1 items-center justify-between gap-4 py-3 text-left text-sm font-semibold text-fg',
          'transition-colors duration-150 ease-out hover:text-primary-soft-fg',
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown aria-hidden className="size-4 shrink-0 text-fg-subtle transition-transform duration-200 ease-out group-data-[state=open]:rotate-180" />
      </AccordionPrimitive.Trigger>
      </Heading>
    </AccordionPrimitive.Header>
  )
}

export function AccordionContent({ className, children, ...props }: ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className="overflow-hidden [--radix-collapsible-content-height:var(--radix-accordion-content-height)] data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down"
      {...props}
    >
      <div className={cn('pb-4 text-sm text-fg-muted', className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}
