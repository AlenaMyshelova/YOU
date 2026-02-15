/**
 * SearchScreen — search users and posts with debounced input.
 */
import React, { useState, useCallback } from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";

import { TextInput, Avatar, LoadingSpinner, EmptyState } from "@shared/ui";
import { useDebounce } from "@shared/hooks";
import { useSearchQuery } from "../api";
import type { User } from "@shared/types";

export function SearchScreen() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const { data, isLoading } = useSearchQuery(debouncedQuery);

  const handlePressUser = useCallback((_user: User) => {
    // TODO: navigate to profile
  }, []);

  const renderUserItem = useCallback(
    ({ item }: { item: User }) => (
      <TouchableOpacity
        onPress={() => handlePressUser(item)}
        className="flex-row items-center px-4 py-3 border-b border-border"
      >
        <Avatar uri={item.avatarUrl} name={item.displayName} size="md" />
        <View className="ml-3 flex-1">
          <Text className="font-semibold text-secondary text-sm">{item.username}</Text>
          <Text className="text-xs text-muted">{item.displayName}</Text>
        </View>
      </TouchableOpacity>
    ),
    [handlePressUser],
  );

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 pt-2">
        <TextInput
          placeholder="Search users..."
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          containerClassName="mb-0"
        />
      </View>

      {isLoading && debouncedQuery.length >= 2 ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={data?.users ?? []}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            debouncedQuery.length >= 2 ? (
              <EmptyState
                title="No results"
                description={`No users found for "${debouncedQuery}"`}
              />
            ) : (
              <EmptyState title="Search" description="Find people to follow" />
            )
          }
        />
      )}
    </View>
  );
}
