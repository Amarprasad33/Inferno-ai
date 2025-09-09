export const API_BASE = import.meta.env.API_URL ?? 'http://localhost:3000'
export const KEYS_BASE = `${API_BASE}/api/keys` // or `${API_BASE}/api/keys`

type ProvidersResponse = { providers: string[] }

export async function listProviders() {
    const res = await fetch(`${KEYS_BASE}`, {
        method: 'GET',
        credentials: 'include',
    })
    if (!res.ok) throw new Error('Failed to fetch providers')
    return (await res.json()) as ProvidersResponse
}

export async function upsertKey(input: { provider: string; apiKey: string }) {
    const res = await fetch(`${KEYS_BASE}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    })
    if (!res.ok) throw new Error('Failed to save key')
}

export async function deleteKey(provider: string) {
    const res = await fetch(`${KEYS_BASE}/${encodeURIComponent(provider)}`, {
        method: 'DELETE',
        credentials: 'include',
    })
    if (!res.ok) throw new Error('Failed to delete key')
}