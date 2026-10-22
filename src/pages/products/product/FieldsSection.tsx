import { FormGrid, FormSection, KeyValue } from '@/design-system'
import { canEditField, type AccessProduct } from '@/app/access/permissions'
import { useSession } from '@/app/access/session'
import { fieldsOf, type SectionDef, type FieldValue, type Values } from '@/app/products/schema'
import { FieldControl, visibleFields } from './FieldControl'
import { renderValue } from './value'
import type { Errors } from '@/app/products/validate'

export interface FieldsSectionProps {
  section: SectionDef
  values: Values
  editing: boolean
  errors: Errors
  onChange: (id: string, value: FieldValue) => void
  /** Produto aberto: define quais campos este usuário pode editar (a parte fiscal e o resto têm donos diferentes). */
  product: AccessProduct
}

/** Seção de campos do esquema: leitura (lista rótulo/valor) ou edição (controles). Some se nenhum campo se aplica. */
export function FieldsSection({ section, values, editing, errors, onChange, product }: FieldsSectionProps) {
  const user = useSession()
  const fields = visibleFields(fieldsOf(section.id), values)
  if (fields.length === 0) return null
  return (
    <FormSection title={section.title} description={section.description} headingLevel={2} id={`secao-${section.id}`}>
      {editing ? (
        <FormGrid>
          {fields.map((f) =>
            !canEditField(user, f, product) ? (
              // Sem permissão para este campo (ex.: Responsável, ou a parte fiscal para quem não é da Tributação): só o valor.
              <dl key={f.id} className={f.wide ? 'sm:col-span-2' : undefined}>
                <KeyValue label={f.label}>{renderValue(f, values)}</KeyValue>
              </dl>
            ) : (
              <FieldControl key={f.id} field={f} values={values} error={errors[f.id]} onChange={onChange} />
            ),
          )}
        </FormGrid>
      ) : (
        <dl className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
          {fields.map((f) => (
            <KeyValue key={f.id} label={f.label} mono={false} className={f.wide ? 'sm:col-span-2' : undefined}>
              {renderValue(f, values)}
            </KeyValue>
          ))}
        </dl>
      )}
    </FormSection>
  )
}
