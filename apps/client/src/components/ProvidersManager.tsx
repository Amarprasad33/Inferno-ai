import { useState } from 'react'
import { useProvidersQuery, useAddKeyMutation, useDeleteKeyMutation } from '@/lib/keys-hooks'

const PROVIDERS = ['openai', 'anthropic'] // keep in sync with server allowlist

export function ProvidersManager() {
    const { data: providers = [], isLoading } = useProvidersQuery()
    const addKey = useAddKeyMutation()
    const delKey = useDeleteKeyMutation()

    const [provider, setProvider] = useState(PROVIDERS[0])
    const [apiKey, setApiKey] = useState('')

    if (isLoading) return <div>Loading…</div>

    return (
        <div className="flex flex-col gap-3">
            <div className="flex gap-2">
                <select value={provider} onChange={(e) => setProvider(e.target.value)}>
                    {PROVIDERS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>
                <input
                    type="password"
                    placeholder="Enter API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                />
                <button
                    onClick={() => addKey.mutate({ provider, apiKey })}
                    disabled={!apiKey}
                >
                    Save
                </button>
            </div>

            <ul className="list-disc ml-6">
                {providers.map((p) => (
                    <li key={p}>
                        {p}
                        <button className="ml-2" onClick={() => delKey.mutate(p)}>
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}