/**
 * Main tab navigator — Feed, Search, Create, Notifications, Profile.
 * Uses organic nature-inspired SVG icons.
 */
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { FeedScreen } from "@features/feed";
import { SearchScreen } from "@features/search";
import { CreatePostScreen } from "@features/post";
import { NotificationsScreen } from "@features/notifications";
import { ProfileScreen } from "@features/profile";
import {
  IconHome,
  IconSearch,
  IconCreate,
  IconHeartLeaf,
  IconProfile,
} from "@shared/ui/icons";
import { YouLogo } from "@shared/ui/logo/YouLogo";

export type MainTabParamList = {
  Feed: undefined;
  Search: undefined;
  CreatePost: undefined;
  Notifications: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Record<
  string,
  React.ComponentType<{ size?: number; color?: string; focused?: boolean }>
> = {
  Feed: IconHome,
  Search: IconSearch,
  CreatePost: IconCreate,
  Notifications: IconHeartLeaf,
  Profile: IconProfile,
};

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          const Icon = TAB_ICONS[route.name];
          return Icon ? <Icon size={26} color="#4A6741" focused={focused} /> : null;
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#FDFBF7",
          borderTopColor: "#D9D0C4",
          borderTopWidth: 0.5,
          height: 88,
          paddingBottom: 28,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: "#FDFBF7",
          shadowColor: "transparent",
          elevation: 0,
          borderBottomWidth: 0.5,
          borderBottomColor: "#D9D0C4",
        },
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 20,
          color: "#3B3226",
          letterSpacing: 1,
        },
      })}
    >
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          headerTitle: () => <YouLogo variant={3} width={70} />,
        }}
      />
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
