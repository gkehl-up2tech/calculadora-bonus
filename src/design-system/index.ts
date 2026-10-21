/**
 * Design System — Atomic Design.
 *
 *   foundations → tokens de tom, overlays
 *   atoms       → elementos indivisíveis (Button, Input, Badge…)
 *   cells       → 2–3 átomos com uma única relação visual, sem lógica própria
 *   molecules   → unidades funcionais com comportamento (FormField, Select, Dialog…)
 *   organisms   → seções completas da interface (DataTable, AppHeader…)
 *   templates   → estruturas de página com slots (AppShell, ListPage…)
 *
 * Cada camada só importa das camadas abaixo (verificado pelo ESLint).
 */
export * from './atoms'
export * from './cells'
export * from './molecules'
export * from './organisms'
export * from './templates'
export * from './foundations'
