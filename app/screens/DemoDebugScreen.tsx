import React, { FC } from "react"
import * as Application from "expo-application"
import { Linking, TextStyle, View, ViewStyle } from "react-native"
import { Button, ListItem, Screen, Text } from "../components"
import { YTLTabParamList } from "../navigators/Navigator"
import { colors, spacing } from "../theme"
import { isRTL } from "../i18n"
import { useStores } from "../models"

/**
 * @param {string} url - The URL to open in the browser.
 * @returns {void} - No return value.
 */
function openLinkInBrowser(url: string) {
  Linking.canOpenURL(url).then((canOpen) => canOpen && Linking.openURL(url))
}

export const DemoDebugScreen: FC<YTLTabParamList<"DemoDebugScreen">> = function DemoDebugScreen(
  _props,
) {
  const {
    authenticationStore: { logout },
  } = useStores()

  const usingHermes = typeof HermesInternal === "object" && HermesInternal !== null
  // @ts-expect-error
  const usingFabric = global.nativeFabricUIManager != null

  const demoReactotron = React.useMemo(
    () => async () => {
      if (__DEV__) {
        console.tron.display({
          name: "DISPLAY",
          value: {
            appId: Application.applicationId,
            appName: Application.applicationName,
            appVersion: Application.nativeApplicationVersion,
            appBuildVersion: Application.nativeBuildVersion,
            hermesEnabled: usingHermes,
          },
          important: true,
        })
      }
    },
    [],
  )

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={$container}>
      <Text
        style={$reportBugsLink}
        tx="demoDebugScreen.reportBugs"
        onPress={() => openLinkInBrowser("https://github.com/infinitered/ignite/issues")}
      />
      <Text style={$title} preset="heading" tx="demoDebugScreen.title" />
      <View style={$itemsContainer}>
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold">App Id</Text>
              <Text>{Application.applicationId}</Text>
            </View>
          }
        />
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold">App Name</Text>
              <Text>{Application.applicationName}</Text>
            </View>
          }
        />
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold">App Version</Text>
              <Text>{Application.nativeApplicationVersion}</Text>
            </View>
          }
        />
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold">App Build Version</Text>
              <Text>{Application.nativeBuildVersion}</Text>
            </View>
          }
        />
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold">Hermes Enabled</Text>
              <Text>{String(usingHermes)}</Text>
            </View>
          }
        />
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold">Fabric Enabled</Text>
              <Text>{String(usingFabric)}</Text>
            </View>
          }
        />
      </View>
      <View style={$buttonContainer}>
        <Button
          style={$CTAPrimaryButton}
          textStyle={{
            color: colors.palette.primary600,
          }}
          tx="common.logOut"
          onPress={logout}
        />
      </View>
    </Screen>
  )
}

const $container: ViewStyle = {
  paddingTop: spacing.lg + spacing.xl,
  paddingBottom: spacing.xxl,
  paddingHorizontal: spacing.lg,
}

const $title: TextStyle = {
  marginBottom: spacing.xxl,
}

const $reportBugsLink: TextStyle = {
  color: colors.palette.neutral100,
  marginBottom: spacing.lg,
  alignSelf: isRTL ? "flex-start" : "flex-end",
}

const $item: ViewStyle = {
  marginBottom: spacing.md,
}

const $itemsContainer: ViewStyle = {
  marginBottom: spacing.xl,
}

const $CTAPrimaryButton: ViewStyle = {
  borderRadius: 100,
  paddingVertical: spacing.xxxs,
  paddingHorizontal: spacing.xs,
  backgroundColor: colors.palette.accent500,
}

const $buttonContainer: ViewStyle = {
  marginBottom: spacing.md,
}
