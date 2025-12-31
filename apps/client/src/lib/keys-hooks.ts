import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listProviders, upsertKey, deleteKey } from "./keys-api";
import { useEffect } from "react";

export const keysQueryKey = ["keys", "providers"];

export function useProvidersQuery() {
  const query = useQuery({
    queryKey: keysQueryKey,
    queryFn: listProviders,
    select: (d) => {
      //   console.log("Raw response data:", d);
      //   console.log("Extracted providers:", d.providers);
      return d.providers;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh for 5 min
    gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache for 10 min
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
    refetchOnReconnect: false, // Don't refetch on network reconnect
    enabled: true,
  });
  // Log only when data actually changes
  useEffect(() => {
    if (query.data) {
      console.log("Available providers:", query.data);
    }
  }, [query.data]);

  return query;
}

export function useAddKeyMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: upsertKey,
    onSuccess: () => qc.invalidateQueries({ queryKey: keysQueryKey }),
  });
}

export function useDeleteKeyMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteKey,
    onSuccess: () => qc.invalidateQueries({ queryKey: keysQueryKey }),
  });
}
