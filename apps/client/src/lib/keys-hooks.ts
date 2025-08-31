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
        staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh for 5 min
        gcTime: 10 * 60 * 1000,   // 10 minutes - keep in cache for 10 min
        refetchOnWindowFocus: false, // Don't refetch when window regains focus
        refetchOnMount: false,      // Don't refetch on component mount if data exists
        refetchOnReconnect: false,  // Don't refetch on network reconnect
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