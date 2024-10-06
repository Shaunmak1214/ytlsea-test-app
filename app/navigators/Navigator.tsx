import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import React from "react"
import { TextStyle, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Icon } from "../components"
import { DemoDebugScreen } from "../screens"
import { colors, spacing, typography } from "../theme"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import { AccountsScreen } from "app/screens/Accounts"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { TransferScreen } from "app/screens/Transfer"

export type YTLTabParamList = {
  Accounts: undefined
  Settings: undefined
}

export type YTLStackParamList = {
  Accounts: undefined
  Transfer: undefined
}

export type DemoTabScreenProps<T extends keyof YTLTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<YTLTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<YTLTabParamList>()

const AccountsStack = createNativeStackNavigator<YTLStackParamList>()

function AccountsStackNavigator() {
  return (
    <AccountsStack.Navigator screenOptions={{ headerShown: false }}>
      <AccountsStack.Screen name="Accounts" component={AccountsScreen} />
      <AccountsStack.Screen name="Transfer" component={TransferScreen} />
    </AccountsStack.Navigator>
  )
}

export function StackNavigator() {
  const { bottom } = useSafeAreaInsets()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [$tabBar, { height: bottom + 70 }],
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: $tabBarLabel,
        tabBarItemStyle: $tabBarItem,
      }}
    >
      <Tab.Screen
        name="Accounts"
        component={AccountsStackNavigator}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) => (
            <Icon icon="home" color={!focused ? colors.palette.primary500 : undefined} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="Settings"
        component={DemoDebugScreen}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ focused }) => (
            <Icon
              icon="ytl_settings"
              color={!focused ? colors.palette.primary500 : undefined}
              size={30}
            />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const $tabBar: ViewStyle = {
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
}

const $tabBarItem: ViewStyle = {
  paddingTop: spacing.md,
}

const $tabBarLabel: TextStyle = {
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
}
