import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listProviders, upsertKey, deleteKey } from './keys-api'

export const keysQueryKey = ['keys', 'providers']

export function useProvidersQuery() {
    return useQuery({
        queryKey: keysQueryKey,
        queryFn: listProviders,
        select: (d) => {
            console.log("Raw response data:", d);
            console.log("Extracted providers:", d.providers);
            return d.providers;
        },
    })
}

export function useAddKeyMutation() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: upsertKey,
        onSuccess: () => qc.invalidateQueries({ queryKey: keysQueryKey }),
    })
}

export function useDeleteKeyMutation() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: deleteKey,
        onSuccess: () => qc.invalidateQueries({ queryKey: keysQueryKey }),
    })
}