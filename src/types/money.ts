export type MoneyEntryType = 'saving' | 'overspend' | 'investment'

export interface MoneyEntry {
  id: string
  user_id: string
  type: MoneyEntryType
  amount: number
  description: string | null
  category: string | null
  symbol: string | null
  recorded_at: string
  created_at: string
}

export interface MoneySummary {
  total_saved: number
  total_overspent: number
  total_invested: number
  /** total_saved - total_overspent - total_invested */
  investable_balance: number
}
