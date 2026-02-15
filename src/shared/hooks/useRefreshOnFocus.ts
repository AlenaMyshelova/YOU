/**
 * useRefreshOnFocus — refetch query when screen gains focus.
 */
import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import type { QueryKey } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

export function useRefreshOnFocus(queryKey: QueryKey) {
  const queryClient = useQueryClient();

  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey });
    }, [queryClient, queryKey]),
  );
}
