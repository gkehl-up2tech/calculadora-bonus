import { Monitor, Moon, Sun } from 'lucide-react'
import { IconButton } from '../cells'
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from './DropdownMenu'
import { Tooltip } from './Tooltip'
import { useTheme, type ThemePreference } from '@/lib/theme'

/** Alterna entre claro, escuro e sistema. A escolha é lembrada neste navegador. */
export function ThemeToggle() {
  const { preference, resolved, setPreference } = useTheme()
  return (
    <DropdownMenu>
      <Tooltip content="Tema">
        <DropdownMenuTrigger asChild>
          <IconButton icon={resolved === 'dark' ? Moon : Sun} label="Alterar tema" />
        </DropdownMenuTrigger>
      </Tooltip>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={preference} onValueChange={(v) => setPreference(v as ThemePreference)}>
          <DropdownMenuRadioItem value="light"><Sun aria-hidden className="size-4" />Claro</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark"><Moon aria-hidden className="size-4" />Escuro</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system"><Monitor aria-hidden className="size-4" />Sistema</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
