import { useEffect, useRef, useState } from 'react'
import { Combobox, CurrencyInput, FormField, MaskedInput, NumberInput, Select, SwitchField, Textarea, Input } from '@/design-system'
import { applies, type FieldDef, type FieldValue, type Values } from '@/app/products/schema'
import { displayText, optionsOf } from './value'

/** Lista digitada em texto (tags por vírgula, destaques por linha). Guarda o texto cru enquanto se digita. */
function ListInput({ value, onValueChange, separator, ...props }: {
  value: string[]
  onValueChange: (v: string[]) => void
  separator: ',' | '\n'
  id: string
  'aria-describedby'?: string
  'aria-invalid'?: true
}) {
  const join = (v: string[]) => v.join(separator === ',' ? ', ' : '\n')
  const [text, setText] = useState(() => join(value))
  const focused = useRef(false)
  useEffect(() => {
    if (!focused.current) setText(join(value))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
  const parse = (t: string) => t.split(separator).map((s) => s.trim()).filter(Boolean)
  const handlers = {
    value: text,
    onFocus: () => { focused.current = true },
    onBlur: () => { focused.current = false; setText(join(value)) },
    onChange: (e: { target: { value: string } }) => { setText(e.target.value); onValueChange(parse(e.target.value)) },
  }
  return separator === ',' ? <Input {...props} {...handlers} autoComplete="off" /> : <Textarea {...props} {...handlers} rows={4} />
}

export interface FieldControlProps {
  field: FieldDef
  values: Values
  error?: string
  onChange: (id: string, value: FieldValue) => void
}

const COMBOBOX_FROM = 10

/** Um campo do esquema em modo de edição: rótulo, controle certo para o tipo, dica, contador e erro. */
export function FieldControl({ field: f, values, error, onChange }: FieldControlProps) {
  const value = values[f.id] ?? null
  const set = (v: FieldValue) => onChange(f.id, v)
  const text = typeof value === 'string' ? value : ''
  const showCount = f.maxLength !== undefined && f.maxLength >= 60 && (f.kind === 'text' || f.kind === 'textarea')
  const hint = showCount ? (
    <>
      {f.hint ? `${f.hint} ` : ''}
      <span className="tabular-nums">{text.length}/{f.maxLength}</span>
    </>
  ) : f.hint

  if (f.kind === 'boolean') {
    return (
      <div className={f.wide ? 'sm:col-span-2' : undefined}>
        <SwitchField
          id={`campo-${f.id}`}
          label={f.label}
          description={f.hint}
          checked={value === true}
          onCheckedChange={set}
          className="min-h-control-md rounded-md border border-line px-3 py-2"
        />
      </div>
    )
  }

  return (
    <FormField
      id={`campo-${f.id}`}
      label={f.label}
      required={f.importance === 'required'}
      hint={hint}
      error={error}
      className={f.wide ? 'sm:col-span-2' : undefined}
    >
      {(c) => {
        const invalid = Boolean(error)
        switch (f.kind) {
          case 'computed':
            return <p id={c.id} className="flex h-control-md items-center rounded-md bg-subtle px-3 text-sm font-medium tabular-nums">{displayText(f, value, values) || '—'}</p>
          case 'text': case 'url':
            return <Input {...c} value={text} maxLength={f.maxLength} type={f.kind === 'url' ? 'url' : 'text'} placeholder={f.placeholder} onChange={(e) => set(e.target.value)} />
          case 'textarea':
            return <Textarea {...c} value={text} maxLength={f.maxLength} rows={f.id.startsWith('descricao') ? 6 : 3} onChange={(e) => set(e.target.value)} />
          case 'lines':
            return <ListInput {...c} separator={'\n'} value={Array.isArray(value) ? value : []} onValueChange={set} />
          case 'tags':
            return <ListInput {...c} separator="," value={Array.isArray(value) ? value : []} onValueChange={set} />
          case 'ncm':
            return <MaskedInput {...c} mask="ncm" value={text} placeholder="0000.00.00" onValueChange={(masked) => set(masked)} />
          case 'cest':
            return <MaskedInput {...c} mask="cest" value={text} placeholder="00.000.00" onValueChange={(masked) => set(masked)} />
          case 'cnpj':
            return <MaskedInput {...c} mask="cnpj" value={text} placeholder="00.000.000/0000-00" onValueChange={(masked) => set(masked)} />
          case 'gtin':
            return <Input {...c} value={text} inputMode="numeric" maxLength={14} autoComplete="off" onChange={(e) => set(e.target.value.replace(/\D/g, ''))} className="font-mono" />
          case 'money':
            return <CurrencyInput {...c} value={typeof value === 'number' ? value : null} onValueChange={set} />
          case 'integer':
            return <NumberInput {...c} value={typeof value === 'number' ? value : null} onValueChange={set} unit={f.unit} min={0} />
          case 'decimal':
            return <NumberInput {...c} value={typeof value === 'number' ? value : null} onValueChange={set} decimals={3} unit={f.unit} min={0} />
          case 'percent':
            return <NumberInput {...c} value={typeof value === 'number' ? value : null} onValueChange={set} decimals={2} unit="%" min={0} max={100} />
          case 'date':
            return <Input {...c} type="date" value={text} onChange={(e) => set(e.target.value)} />
          case 'select': case 'combobox': {
            const options = optionsOf(f)
            return options.length > COMBOBOX_FROM || f.kind === 'combobox' ? (
              <Combobox {...c} options={options} value={text || null} onValueChange={(v) => set(v ?? '')} invalid={invalid} searchPlaceholder="Buscar…" />
            ) : (
              <Select {...c} options={options} value={text} onValueChange={set} invalid={invalid} />
            )
          }
        }
      }}
    </FormField>
  )
}

/** Campos da seção que se aplicam ao produto (departamento/tipo). */
export const visibleFields = (fields: FieldDef[], values: Values) => fields.filter((f) => applies(f, values))
