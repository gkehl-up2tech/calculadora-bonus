import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  Badge, Button, Dialog, DialogContent, FieldMessage, FormField, Heading, Input, NativeSelect, SimpleTable, Switch, SwitchField, Text, toast,
} from '@/design-system'
import { useSession } from '@/app/access/session'
import {
  ROLES, ROLE_LABEL, ROLE_SUMMARY, USERS, addUser, updateUser, useUsersVersion, validateUser, type AppUser, type Role,
} from '@/app/access/users'
import { usePageTitle } from '@/lib/usePageTitle'

interface Draft {
  name: string
  email: string
  role: Role
  external: boolean
}

const blank: Draft = { name: '', email: '', role: 'manager', external: false }

/** Configurações › Usuários: criar, trocar o papel, ativar e desativar. Provisório: sem convite por e-mail nem login. */
export function UsersPage() {
  usePageTitle('Usuários · Configurações')
  useUsersVersion()
  const me = useSession()
  const [editing, setEditing] = useState<AppUser | 'new' | null>(null)
  const [draft, setDraft] = useState<Draft>(blank)
  const [errors, setErrors] = useState<Partial<Record<'name' | 'email', string>>>({})

  const activeAdmins = USERS.filter((u) => u.active && u.role === 'admin')
  /** O último Admin ativo e você mesmo não podem sair do papel nem ser desativados (o sistema ficaria sem gestão). */
  const locked = (u: AppUser) => (u.role === 'admin' && activeAdmins.length === 1 && u.active) || u.id === me.id

  function open(target: AppUser | 'new') {
    setEditing(target)
    setErrors({})
    setDraft(target === 'new' ? blank : { name: target.name, email: target.email, role: target.role, external: Boolean(target.external) })
  }

  function save() {
    const id = editing !== 'new' && editing ? editing.id : undefined
    const found = validateUser(draft, id)
    setErrors(found)
    if (Object.keys(found).length) {
      document.getElementById(found.name ? 'usuario-nome' : 'usuario-email')?.focus()
      return
    }
    if (id) {
      updateUser(id, draft)
      toast.success('Usuário atualizado')
    } else {
      addUser(draft)
      toast.success('Usuário criado', { description: 'Na versão de demonstração ele já aparece em “Entrar como”, no menu do usuário.' })
    }
    setEditing(null)
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="grid gap-1">
          <Heading level={2} size="lg">Usuários</Heading>
          <Text tone="muted">{USERS.filter((u) => u.active).length} ativos de {USERS.length}. O papel define o que cada pessoa pode fazer (veja em Papéis).</Text>
        </div>
        <Button leadingIcon={<Plus aria-hidden />} onClick={() => open('new')}>Novo usuário</Button>
      </div>

      <div className="rounded-lg bg-surface px-4 shadow-border">
        <SimpleTable<AppUser>
          caption="Usuários do sistema"
          rows={USERS}
          getRowId={(u) => u.id}
          columns={[
            {
              key: 'n',
              header: 'Nome',
              className: 'min-w-56',
              cell: (u) => (
                <div className="grid gap-0.5">
                  <span className="flex flex-wrap items-center gap-2 font-medium">
                    {u.name}
                    {u.external ? <Badge size="sm">Equipe externa</Badge> : null}
                    {u.id === me.id ? <Badge size="sm" tone="brand">Você</Badge> : null}
                  </span>
                  <span className="text-xs text-fg-muted">{u.email}</span>
                </div>
              ),
            },
            {
              key: 'r',
              header: 'Papel',
              cell: (u) => (
                <NativeSelect
                  size="sm"
                  aria-label={`Papel de ${u.name}`}
                  value={u.role}
                  disabled={locked(u)}
                  onChange={(e) => {
                    updateUser(u.id, { role: e.target.value as Role })
                    toast.success(`${u.name} agora é ${ROLE_LABEL[e.target.value as Role]}`)
                  }}
                  className="min-w-44"
                >
                  {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
                </NativeSelect>
              ),
            },
            {
              key: 's',
              header: 'Ativo',
              cell: (u) => (
                <Switch
                  aria-label={`${u.name}: ${u.active ? 'ativo' : 'inativo'}`}
                  checked={u.active}
                  disabled={locked(u) && u.active}
                  onCheckedChange={(on) => {
                    updateUser(u.id, { active: on })
                    toast.success(on ? `${u.name} foi reativado` : `${u.name} foi desativado`)
                  }}
                />
              ),
            },
            { key: 'a', header: <span className="sr-only">Ações</span>, align: 'right', cell: (u) => <Button size="sm" variant="ghost" onClick={() => open(u)} aria-label={`Editar ${u.name}`}>Editar</Button> },
          ]}
        />
      </div>
      <Text variant="small" tone="muted">Você e o último Admin ativo não podem trocar de papel nem ser desativados. Desativar tira a pessoa de “Entrar como” e das escolhas de responsável; os produtos dela continuam no catálogo.</Text>

      <Dialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent
          title={editing === 'new' ? 'Novo usuário' : 'Editar usuário'}
          description="Nome, e-mail e papel. Quem for de uma empresa parceira (como a Tributação) pode ser marcado como equipe externa."
          footer={<><Button variant="ghost" onClick={() => setEditing(null)}>Cancelar</Button><Button onClick={save}>{editing === 'new' ? 'Criar usuário' : 'Salvar'}</Button></>}
          onOpenAutoFocus={(e) => { e.preventDefault(); document.getElementById('usuario-nome')?.focus() }}
        >
          <div
            className="grid gap-4"
            onKeyDown={(e) => { if (e.key === 'Enter' && e.target instanceof HTMLInputElement) { e.preventDefault(); save() } }}
          >
            <FormField id="usuario-nome" label="Nome" required error={errors.name}>
              {(c) => <Input {...c} value={draft.name} maxLength={80} autoComplete="off" onChange={(e) => setDraft({ ...draft, name: e.target.value })} />}
            </FormField>
            <FormField id="usuario-email" label="E-mail" required error={errors.email}>
              {(c) => <Input {...c} type="email" value={draft.email} maxLength={120} autoComplete="off" onChange={(e) => setDraft({ ...draft, email: e.target.value })} />}
            </FormField>
            <FormField
              id="usuario-papel"
              label="Papel"
              required
              hint={ROLE_SUMMARY[draft.role]}
            >
              {(c) => (
                <NativeSelect {...c} value={draft.role} disabled={editing !== 'new' && editing !== null && locked(editing)} onChange={(e) => setDraft({ ...draft, role: e.target.value as Role })}>
                  {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
                </NativeSelect>
              )}
            </FormField>
            <SwitchField label="Equipe externa" description="Pessoa de uma empresa parceira, não da UP2Tech." checked={draft.external} onCheckedChange={(v) => setDraft({ ...draft, external: v })} />
            {editing !== 'new' && editing !== null && locked(editing) ? <FieldMessage kind="warning">O papel deste usuário não pode ser trocado agora (é você ou o último Admin ativo).</FieldMessage> : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
