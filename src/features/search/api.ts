/**
 * Search API hooks.
 */
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@shared/lib";
import type { SearchResult } from "@shared/types";

export const searchKeys = {
  all: ["search"] as const,
  query: (q: string) => [...searchKeys.all, q] as const,
};

export function useSearchQuery(query: string) {
  return useQuery({
    queryKey: searchKeys.query(query),
    queryFn: () => apiClient.get<SearchResult>(`/search?q=${encodeURIComponent(query)}`),
    enabled: query.length >= 2,
    staleTime: 1000 * 30, // 30s — search results change often
  });
}
