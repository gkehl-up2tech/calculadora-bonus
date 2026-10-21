import { Toaster as Sonner, toast, type ToasterProps } from 'sonner'
import { useTheme } from '@/lib/theme'

export { toast }

/** Monte uma única vez na raiz do app. Dispare mensagens com `toast.success('Salvo')`. */
export function Toaster(props: ToasterProps) {
  const { resolved } = useTheme()
  return (
    <Sonner
      theme={resolved}
      position="bottom-right"
      richColors
      closeButton
      offset={{ bottom: 16, right: 16 }}
      mobileOffset={{ bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))', left: 16, right: 16 }}
      style={
        {
          fontFamily: 'var(--font-sans)',
          '--normal-bg': 'var(--bg-raised)',
          '--normal-text': 'var(--fg)',
          '--normal-border': 'var(--line-subtle)',
          '--success-bg': 'var(--tone-success-soft)',
          '--success-text': 'var(--success)',
          '--success-border': 'var(--tone-success-soft)',
          '--error-bg': 'var(--tone-danger-soft)',
          '--error-text': 'var(--danger)',
          '--error-border': 'var(--tone-danger-soft)',
          '--warning-bg': 'var(--tone-warning-soft)',
          '--warning-text': 'var(--warning)',
          '--warning-border': 'var(--tone-warning-soft)',
          '--info-bg': 'var(--primary-soft)',
          '--info-text': 'var(--primary-soft-fg)',
          '--info-border': 'var(--primary-soft)',
          '--border-radius': 'var(--radius-lg)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}
