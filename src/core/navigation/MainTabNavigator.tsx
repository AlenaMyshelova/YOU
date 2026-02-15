/**
 * Main tab navigator — Feed, Search, Create, Notifications, Profile.
 */
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";

import { FeedScreen } from "@features/feed";
import { SearchScreen } from "@features/search";
import { CreatePostScreen } from "@features/post";
import { NotificationsScreen } from "@features/notifications";
import { ProfileScreen } from "@features/profile";

export type MainTabParamList = {
  Feed: undefined;
  Search: undefined;
  CreatePost: undefined;
  Notifications: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Feed: "🏠",
    Search: "🔍",
    CreatePost: "➕",
    Notifications: "❤️",
    Profile: "👤",
  };
  return (
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>
      {icons[label] ?? "•"}
    </Text>
  );
}

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#DBDBDB",
          borderTopWidth: 0.5,
        },
        headerStyle: {
          backgroundColor: "#FFFFFF",
          shadowColor: "transparent",
          elevation: 0,
        },
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 18,
        },
      })}
    >
      <Tab.Screen name="Feed" component={FeedScreen} options={{ headerTitle: "YOU" }} />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ headerTitle: "Search" }}
      />
      <Tab.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{ headerTitle: "New Post" }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ headerTitle: "Activity" }}
      />
      <Tab.Screen name="Profile" options={{ headerTitle: "Profile" }}>
        {() => <ProfileScreen />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
