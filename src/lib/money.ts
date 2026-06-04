import type { MoneyEntryType } from '@/types/money'

// ─── Entry types ──────────────────────────────────────────────────────────────

export const ENTRY_TYPE_LABELS: Record<MoneyEntryType, string> = {
  saving: 'saved',
  overspend: 'overspent',
  investment: 'invested',
}

export const ENTRY_TYPE_DESCRIPTIONS: Record<MoneyEntryType, string> = {
  saving: "money saved via coupon or discount",
  overspend: "unexpected spending you didn't plan",
  investment: 'saved money deployed as investment',
}

export const ENTRY_TYPE_COLORS: Record<
  MoneyEntryType,
  { bg: string; text: string; border: string }
> = {
  saving: { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' },
  overspend: { bg: '#fef2f2', text: '#ef4444', border: '#fecaca' },
  investment: { bg: '#f5f3ff', text: '#7c3aed', border: '#ddd6fe' },
}

export const ENTRY_TYPE_AMOUNT_COLOR: Record<MoneyEntryType, string> = {
  saving: '#059669',
  overspend: '#ef4444',
  investment: '#7c3aed',
}

export const ENTRY_TYPE_SIGN: Record<MoneyEntryType, '+' | '-'> = {
  saving: '+',
  overspend: '-',
  investment: '+',
}

// ─── Categories ───────────────────────────────────────────────────────────────

export const SAVING_CATEGORIES = [
  'grocery',
  'dining',
  'clothing',
  'electronics',
  'transport',
  'health',
  'entertainment',
  'subscription',
  'other',
] as const

export const OVERSPEND_CATEGORIES = [
  'coffee',
  'dining',
  'impulse buy',
  'transport',
  'entertainment',
  'grocery',
  'clothing',
  'subscription',
  'other',
] as const

export const INVESTMENT_CATEGORIES = [
  'stocks',
  'etf',
  'crypto',
  'savings account',
  'index fund',
  'real estate',
  'other',
] as const

export type SavingCategory = (typeof SAVING_CATEGORIES)[number]
export type OverspendCategory = (typeof OVERSPEND_CATEGORIES)[number]
export type InvestmentCategory = (typeof INVESTMENT_CATEGORIES)[number]

export const CATEGORIES_BY_TYPE: Record<MoneyEntryType, readonly string[]> = {
  saving: SAVING_CATEGORIES,
  overspend: OVERSPEND_CATEGORIES,
  investment: INVESTMENT_CATEGORIES,
}

// ─── Formatting helpers ───────────────────────────────────────────────────────

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDigitString(digits: string): string {
  if (!digits || digits === '0') return '0'
  const [int, dec] = digits.split('.')
  const formatted = Number(int || '0').toLocaleString('en-US')
  return dec !== undefined ? `${formatted}.${dec}` : formatted
}

export function parseDigitString(digits: string): number {
  return parseFloat(digits) || 0
}

export function groupEntriesByDate<T extends { recorded_at: string }>(
  entries: T[]
): Array<{ date: string; entries: T[] }> {
  const map = new Map<string, T[]>()
  for (const entry of entries) {
    const key = entry.recorded_at
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(entry)
  }
  return Array.from(map.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([date, entries]) => ({ date, entries }))
}

export function formatEntryDate(dateStr: string): string {
  const today = new Date()
  const date = new Date(dateStr + 'T00:00:00')
  const diff = Math.round((today.getTime() - date.getTime()) / 86_400_000)
  if (diff === 0) return 'today'
  if (diff === 1) return 'yesterday'
  if (diff < 7) return `${diff} days ago`
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function computeSummary(entries: { type: MoneyEntryType; amount: number }[]) {
  const totals = entries.reduce(
    (acc, e) => {
      const n = Number(e.amount)
      if (e.type === 'saving') acc.total_saved += n
      if (e.type === 'overspend') acc.total_overspent += n
      if (e.type === 'investment') acc.total_invested += n
      return acc
    },
    { total_saved: 0, total_overspent: 0, total_invested: 0 }
  )
  return {
    ...totals,
    investable_balance:
      totals.total_saved - totals.total_overspent - totals.total_invested,
  }
}
