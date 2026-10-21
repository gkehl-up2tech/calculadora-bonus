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
          '--success-text': 'var(--tone-success-fg)',
          '--success-border': 'var(--tone-success-line)',
          '--error-bg': 'var(--tone-danger-soft)',
          '--error-text': 'var(--tone-danger-fg)',
          '--error-border': 'var(--tone-danger-line)',
          '--warning-bg': 'var(--tone-warning-soft)',
          '--warning-text': 'var(--tone-warning-fg)',
          '--warning-border': 'var(--tone-warning-line)',
          '--info-bg': 'var(--tone-info-soft)',
          '--info-text': 'var(--tone-info-fg)',
          '--info-border': 'var(--tone-info-line)',
          '--border-radius': 'var(--radius-lg)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}
