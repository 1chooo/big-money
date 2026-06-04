import { Platform } from 'react-native'
import { supabase } from './supabase'

const DEFAULT_API_URL = 'https://1chooo.com'
const WEB_DEV_PROXY_URL = 'http://localhost:8081'

/** Route API calls through the local dev proxy to avoid CORS on web. */
export function getApiBaseUrl(): string {
  const configured = process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_API_URL
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const { hostname, port } = window.location
    if (hostname === 'localhost') {
      if (port === '8081') return ''
      if (port === '19007') return WEB_DEV_PROXY_URL
    }
  }
  return configured
}

async function getAccessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? null
}

async function fetchWithToken(
  path: string,
  token: string,
  options: RequestInit = {},
): Promise<Response> {
  return fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })
}

export async function fetchWithAuth(
  path: string,
  options: RequestInit = {},
  accessToken?: string | null,
): Promise<Response> {
  let token = accessToken ?? (await getAccessToken())
  if (!token) {
    throw new Error('Not signed in')
  }

  try {
    let res = await fetchWithToken(path, token, options)

    if (res.status === 401) {
      const { data: { session } } = await supabase.auth.refreshSession()
      const refreshed = session?.access_token
      if (refreshed && refreshed !== token) {
        res = await fetchWithToken(path, refreshed, options)
      }
    }

    return res
  } catch (error) {
    if (Platform.OS === 'web') {
      throw new Error(
        'Could not reach the API. On web, cross-origin requests are blocked unless the server sends CORS headers. Use `pnpm web` for local development.',
        { cause: error },
      )
    }
    throw error
  }
}

async function readApiError(res: Response, fallback: string): Promise<string> {
  const body = await res.json().catch(() => ({}))
  return (body as { error?: string }).error ?? `${fallback} (${res.status})`
}

// ─── Money API ────────────────────────────────────────────────────────────────

export async function getMoneyEntries(accessToken?: string | null) {
  const res = await fetchWithAuth('/api/money/entries', {}, accessToken)
  if (!res.ok) throw new Error(await readApiError(res, 'Failed to fetch entries'))
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
