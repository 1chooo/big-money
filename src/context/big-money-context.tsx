import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { MoneyEntry, MoneySummary } from '@/types/money'
import { getMoneyEntries } from '@/lib/api'
import { computeSummary } from '@/lib/money'

interface BigMoneyContextValue {
  entries: MoneyEntry[]
  summary: MoneySummary
  loading: boolean
  handleCreated: (entry: MoneyEntry) => void
  handleDeleted: (id: string) => void
  refresh: () => Promise<void>
}

const BigMoneyContext = createContext<BigMoneyContextValue | null>(null)

export function useBigMoney() {
  const ctx = useContext(BigMoneyContext)
  if (!ctx) throw new Error('useBigMoney must be used within BigMoneyProvider')
  return ctx
}

export function BigMoneyProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<MoneyEntry[]>([])
  const [loading, setLoading] = useState(true)

  const summary = useMemo<MoneySummary>(() => computeSummary(entries), [entries])

  async function refresh() {
    try {
      const data = await getMoneyEntries()
      setEntries(data.entries)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  function handleCreated(entry: MoneyEntry) {
    setEntries(prev => [entry, ...prev])
  }

  function handleDeleted(id: string) {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  return (
    <BigMoneyContext.Provider
      value={{ entries, summary, loading, handleCreated, handleDeleted, refresh }}>
      {children}
    </BigMoneyContext.Provider>
  )
}
