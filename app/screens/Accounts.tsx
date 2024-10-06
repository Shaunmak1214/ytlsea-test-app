import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import {
  ImageStyle,
  TextStyle,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native"
import { Button, Icon, ListView, Screen, Text } from "../components"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import { SafeAreaView } from "react-native-safe-area-context"
import { Col, Grid } from "react-native-easy-grid"
import UserAvatar from "react-native-user-avatar"
import { useNavigation } from "@react-navigation/native"

export const AccountsScreen: FC<AppStackScreenProps<"Accounts">> = observer(function AccountsScreen(
  _props,
) {
  const { height, width } = useWindowDimensions()

  const navigation = useNavigation()

  const listData =
    `Tempor Id Ea Aliqua Pariatur Aliquip. Irure Minim Voluptate Consectetur Consequat Sint Esse Proident Irure. Nostrud Elit Veniam Nostrud Excepteur Minim Deserunt Quis Dolore Velit Nulla Irure Voluptate Tempor. Occaecat Amet Laboris Nostrud Qui Do Quis Lorem Ex Elit Fugiat Deserunt. In Pariatur Excepteur Exercitation Ex Incididunt Qui Mollit Dolor Sit Non. Culpa Officia Minim Cillum Exercitation Voluptate Proident Laboris Et Est Reprehenderit Quis Pariatur Nisi`
      .split(".")
      .map((item) => item.trim())

  return (
    <>
      <SafeAreaView style={$safeAreaView}>
        <Screen preset="scroll" keyboardShouldPersistTaps="always">
          <View
            style={{
              ...$innerScreenContentContainer,
              minHeight: height,
            }}
          >
            <View style={$headingViewContainer}>
              <View style={$headingRow}>
                <Text text="Good Morning 👋" preset="heading" style={$heading} />
                <TouchableOpacity
                  activeOpacity={1}
                  style={$headingRowRightIcon}
                  onPress={() => {
                    navigation.navigate("Settings")
                  }}
                >
                  <Icon icon="settings" color={colors.palette.primary500} size={24} />
                </TouchableOpacity>
              </View>
              <Text text="Shaun Mak." preset="subheading" style={$muted} />
            </View>

            <View style={$CTAContainerView}>
              <Text text="Total balance" preset="subheading" style={$containerHeading} />
              <View style={$balanceContainer}>
                <Text text="$100.00" preset="heading" style={$balance} />
                <TouchableOpacity activeOpacity={1} style={$balanceViewerToggle} onPress={() => {}}>
                  <Icon icon="view" color={colors.palette.primary600} size={20} />
                </TouchableOpacity>
              </View>

              <Grid style={$CTAButtonGroup}>
                <Col size={1.5}>
                  <Button
                    text="Reload"
                    style={$CTAPrimaryButton}
                    textStyle={$CTAPrimaryButtonText}
                    RightAccessory={() => (
                      <Icon
                        icon="ytl_add"
                        color={colors.palette.primary600}
                        style={$CTAButtonIcon}
                      />
                    )}
                    preset="reversed"
                    onPress={() => {
                      navigation.navigate("Transfer")
                    }}
                  />
                </Col>
                <Col size={1.5}>
                  <Button
                    text="Pay"
                    style={$CTASecondaryButton}
                    textStyle={$CTASecondaryButtonText}
                    RightAccessory={() => (
                      <Icon
                        icon="ytl_pay"
                        color={colors.palette.primary600}
                        style={$CTAButtonIcon}
                      />
                    )}
                    preset="reversed"
                    onPress={() => {}}
                  />
                </Col>
                <Col>
                  <Button
                    text="More"
                    style={$CTASecondaryButton}
                    textStyle={$CTASecondaryButtonText}
                    preset="reversed"
                    onPress={() => {}}
                  />
                </Col>
              </Grid>
            </View>

            <View style={$listContainerStyle}>
              <Text
                text="Recent Transactions"
                preset="heading"
                style={
                  {
                    ...$heading,
                    fontSize: 18,
                  } as TextStyle
                }
              />

              <View style={$listStyle}>
                <ListView<string>
                  data={listData}
                  estimatedItemSize={1}
                  renderItem={({ item, index }) => (
                    <View style={$RecentTransactionsItem}>
                      <View
                        style={
                          {
                            flexDirection: "row",
                            justifyContent: "space-between",
                          } as ViewStyle
                        }
                      >
                        <View style={$RecentTransactionsItemAvatar}>
                          <UserAvatar
                            size={45}
                            name="Avishay Bar"
                            bgColors={["#141414FF", "#3F3F3FFF"]}
                          />
                        </View>
                        <View style={$RecentTransactionsItemDetails}>
                          <Text
                            text="Avishay Bar"
                            preset="bold"
                            style={$RecentTransactionsItemDetailsText}
                          />
                          <Text
                            text="1 Jul 2024"
                            preset="subheading"
                            style={$RecentTransactionsItemDetailsSubText}
                          />
                        </View>
                      </View>

                      <Text
                        text="RM 400.40"
                        preset="subheading"
                        style={$RecentTransactionsItemHeadingText}
                      />
                    </View>
                  )}
                />
              </View>
            </View>

            <View style={$RecentTransactions}></View>
          </View>
        </Screen>
      </SafeAreaView>
    </>
  )
})

const $safeAreaView: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}

const $innerScreenContentContainer: ViewStyle = {
  paddingTop: spacing.lg,
  paddingHorizontal: spacing.lg,
  zIndex: 1,
  height: "100%",
}

const $headingViewContainer: ViewStyle = {
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  width: "100%",
}

const $headingRow: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",
  width: "100%",
}

const $headingRowRightIcon: ViewStyle = {
  marginTop: spacing.sm,
}

const $CTAContainerView: ViewStyle = {
  marginTop: spacing.md,
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "flex-start",
  width: "100%",
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  borderRadius: 10,
  backgroundColor: colors.palette.primary100,
}

const $RecentTransactions: ViewStyle = {
  marginTop: spacing.md,
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "flex-start",
  width: "100%",
}

const $balanceContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
}

const $balanceViewerToggle: ViewStyle = {
  marginLeft: spacing.xs,
  height: 30,
}

const $CTAButtonGroup: ViewStyle = {
  columnGap: spacing.sm,
}

const $CTAPrimaryButton: ViewStyle = {
  borderRadius: 100,
  paddingVertical: spacing.xxxs,
  paddingHorizontal: spacing.xs,
  backgroundColor: colors.palette.accent500,
}

const $CTAPrimaryButtonText: TextStyle = {
  color: colors.palette.primary600,
  fontSize: 16,
}

const $CTASecondaryButton: ViewStyle = {
  borderRadius: 100,
  borderColor: colors.palette.primary600,
  borderWidth: 2,
  borderStyle: "solid",
  paddingVertical: spacing.xs,
  paddingHorizontal: spacing.xs,
  backgroundColor: colors.transparent,
}

const $CTASecondaryButtonText: TextStyle = {
  color: colors.palette.primary600,
  fontSize: 16,
}

const $CTAButtonIcon: ImageStyle = {
  marginLeft: spacing.xs,
}

const $listContainerStyle: ViewStyle = {
  marginTop: spacing.xl,
}

const $listStyle: ViewStyle = {
  marginTop: spacing.md,
}

const $RecentTransactionsItemAvatar: ViewStyle = {
  marginRight: spacing.md,
  width: 45,
  height: 45,
  borderRadius: 8,
}

const $RecentTransactionsItem: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  backgroundColor: "#59608B21",
  borderRadius: 8,
  marginBottom: spacing.md,
  paddingVertical: spacing.md,
  paddingHorizontal: spacing.md,
  columnGap: spacing.md,
}

const $RecentTransactionsItemDetails: ViewStyle = {
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "flex-start",
}

const $heading: TextStyle = {
  fontSize: 24,
}

const $containerHeading: TextStyle = {
  fontSize: 16,
  color: colors.palette.secondary500,
}

const $RecentTransactionsItemDetailsText: TextStyle = {
  fontSize: 16,
  color: colors.palette.neutral100,
}

const $RecentTransactionsItemDetailsSubText: TextStyle = {
  fontSize: 14,
  color: colors.textDim,
}

const $RecentTransactionsItemHeadingText: TextStyle = {
  fontSize: 18,
  color: colors.palette.neutral100,
}

const $balance: TextStyle = {
  fontSize: 34,
  marginBottom: spacing.sm,
  color: colors.palette.primary600,
  fontWeight: "bold",
}

const $muted: TextStyle = {
  color: colors.textDim,
  marginBottom: spacing.md,
  fontSize: 16,
}
