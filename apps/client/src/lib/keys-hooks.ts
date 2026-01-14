import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listProviders, upsertKey, deleteKey } from "./keys-api";
import { standardizeApiError } from "./error";
import { toast } from "sonner";

export const keysQueryKey = ["keys", "providers"];

export function useProvidersQuery() {
  const query = useQuery({
    queryKey: keysQueryKey,
    queryFn: listProviders,
    select: (d) => {
      return d.providers;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh for 5 min
    gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache for 10 min
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
    refetchOnReconnect: false, // Don't refetch on network reconnect
    enabled: true,
  });

  return query;
}

export function useAddKeyMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: upsertKey,
    onError: (err) => {
      const apiErr = standardizeApiError(err);
      toast("Unable to load providers", { description: apiErr.message });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keysQueryKey }),
  });
}

export function useDeleteKeyMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteKey,
    onError: (err) => {
      const apiErr = standardizeApiError(err);
      toast("Unable to load providers", { description: apiErr.message });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keysQueryKey }),
  });
}
