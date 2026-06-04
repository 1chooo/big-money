import { supabase } from './supabase'

const BASE_URL = 'https://1chooo.com'

async function getAccessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? null
}

export async function fetchWithAuth(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getAccessToken()
  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
}

// ─── Money API ────────────────────────────────────────────────────────────────

export async function getMoneyEntries() {
  const res = await fetchWithAuth('/api/money/entries')
  if (!res.ok) throw new Error('Failed to fetch entries')
  return res.json() as Promise<{ entries: import('@/types/money').MoneyEntry[] }>
}

export async function createMoneyEntry(body: {
  type: import('@/types/money').MoneyEntryType
  amount: number
  description?: string | null
  category?: string | null
  symbol?: string | null
  recorded_at?: string
}) {
  const res = await fetchWithAuth('/api/money/entries', {
    method: 'POST',
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: string }).error ?? 'Failed to create entry')
  }
  return res.json() as Promise<{ entry: import('@/types/money').MoneyEntry }>
}

export async function deleteMoneyEntry(id: string) {
  const res = await fetchWithAuth(`/api/money/entries/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to delete entry')
}
