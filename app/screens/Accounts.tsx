import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useRef, useState } from "react"
import {
  ActivityIndicator,
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
import { Col, Grid } from "react-native-easy-grid"
import UserAvatar from "react-native-user-avatar"
import { useIsFocused, useNavigation } from "@react-navigation/native"
import { useStores } from "app/models"
import { Api, IAccount, ITransaction } from "app/services/api"
import Toast from "react-native-toast-message"
import { LoadingView } from "app/components/LoadingView"
import * as LocalAuthentication from "expo-local-authentication"
import BottomSheet, { BottomSheetMethods } from "@devvie/bottom-sheet"
import * as Contacts from "expo-contacts"
import * as Haptics from "expo-haptics"

export const AccountsScreen: FC<AppStackScreenProps<"Stack">> = observer(function AccountsScreen(
  _props,
) {
  const { height } = useWindowDimensions()
  const isFocused = useIsFocused()
  const navigation = useNavigation()

  const {
    authenticationStore: {
      authToken,
      fullName,
      setAccountNumber,
      setTokenId,
      basicRoleLocalAuthenticated,
      setBasicRoleLocalAuthenticated,
      setBalance,
    },
  } = useStores()

  const [loading, setLoading] = useState(false)
  const [account, setAccount] = useState<IAccount | null>(null)
  const [transactions, setTransactions] = useState<ITransaction[] | null>(null)
  const [balanceVisible, setBalanceVisible] = useState(false)

  const [recipientSelected, setRecipientSelected] = useState<{
    to: string
  } | null>(null)

  const sheetRef = useRef<BottomSheetMethods>(null)

  const api = new Api()

  const getAccounts = async (authToken: string) => {
    setLoading(true)
    const result = await api.getAccount(authToken)
    if (result.kind === "ok") {
      setAccount(result.data.data)
      setAccountNumber(result.data?.data.accountNumber)
      setTokenId(result.data?.data.tokenId)
      setBalance(result.data?.data.balance)
      setLoading(false)
    } else {
      setLoading(false)
    }
  }

  const getTransactions = async (authToken: string) => {
    setLoading(true)
    const result = await api.getTransactions(authToken)
    if (result.kind === "ok") {
      let data = result.data.data as ITransaction[]

      data = data.filter((item) => item.status === "success" && item.transactionType === "transfer")

      setTransactions(data)

      setLoading(false)
    } else {
      setLoading(false)
    }
  }

  async function retrieveContactByPhoneNumber(to: string) {
    const { status: contactStatus } = await Contacts.requestPermissionsAsync()

    if (contactStatus === "granted") {
      const contactResponse = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
      })

      if (contactResponse.data.length > 0) {
        const contact = contactResponse.data.find((contact) =>
          contact.phoneNumbers?.some((phoneNumber) => phoneNumber.number === to),
        )

        if (contact) {
          return contact
        }
      }
    }

    setLoading(false)
  }

  async function handleAuthenticateForBalance() {
    if (basicRoleLocalAuthenticated) {
      setBalanceVisible(true)
      return
    }

    const supportedAuthTypes = await LocalAuthentication.supportedAuthenticationTypesAsync()

    // Check if Face ID is available
    const isFaceIDAvailable = supportedAuthTypes.includes(
      LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
    )

    const authOptions = {
      promptMessage: "Authenticate to transfer",
      fallbackLabel: "Use PIN",
      disableDeviceFallback: isFaceIDAvailable,
    }

    const auth = await LocalAuthentication.authenticateAsync(authOptions)

    if (auth.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      setBasicRoleLocalAuthenticated(true)
      setBalanceVisible(true)
    } else {
      Toast.show({
        type: "error",
        text1: "Authentication failed",
      })
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    }
  }

  useEffect(() => {
    if (authToken) {
      getAccounts(authToken)
      getTransactions(authToken)
    }

    sheetRef.current?.close()
  }, [authToken, isFocused])

  return (
    <>
      <Screen preset="scroll" keyboardShouldPersistTaps="always" safeAreaEdges={["top"]}>
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
            <Text text={fullName || ""} preset="subheading" style={$muted} />
          </View>

          <View style={$CTAContainerView}>
            <Text text="Total balance" preset="subheading" style={$containerHeading} />
            <View style={$balanceContainer}>
              {balanceVisible ? (
                <Text
                  text={account ? "RM" + account?.balance.toFixed(2) : "RM0.00"}
                  preset="heading"
                  style={$balance}
                />
              ) : (
                <Text text={"RM***"} preset="heading" style={$balance} />
              )}

              <TouchableOpacity
                activeOpacity={1}
                style={$balanceViewerToggle}
                onPress={() => {
                  if (balanceVisible) {
                    setBalanceVisible(false)
                  } else {
                    handleAuthenticateForBalance()
                  }
                }}
              >
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
                    <Icon icon="ytl_add" color={colors.palette.primary600} style={$CTAButtonIcon} />
                  )}
                  preset="reversed"
                  onPress={() => {
                    Toast.show({
                      type: "info",
                      text1: "Coming soon ...",
                      position: "bottom",
                    })
                  }}
                />
              </Col>
              <Col size={1.5}>
                <Button
                  text="Pay"
                  style={$CTASecondaryButton}
                  textStyle={$CTASecondaryButtonText}
                  RightAccessory={() => (
                    <Icon icon="ytl_pay" color={colors.palette.primary600} style={$CTAButtonIcon} />
                  )}
                  preset="reversed"
                  onPress={() => {
                    navigation.navigate("PaymentMethod")
                  }}
                />
              </Col>
              <Col>
                <Button
                  text="More"
                  style={$CTASecondaryButton}
                  textStyle={$CTASecondaryButtonText}
                  preset="reversed"
                  onPress={() => {
                    Toast.show({
                      type: "info",
                      text1: "Coming soon ...",
                      position: "bottom",
                    })
                  }}
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
              {transactions ? (
                <ListView<string>
                  data={transactions}
                  estimatedItemSize={5}
                  renderItem={({ item, index }: { item: ITransaction; index: number }) => (
                    <TouchableOpacity
                      style={$RecentTransactionsItem}
                      onLongPress={() => {
                        setRecipientSelected({
                          to: item.to,
                        })
                        sheetRef.current?.open()
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
                      }}
                    >
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
                            name={item.to}
                            bgColors={["#141414FF", "#3F3F3FFF"]}
                          />
                        </View>
                        <View style={$RecentTransactionsItemDetails}>
                          <Text
                            text={item.to}
                            preset="bold"
                            style={$RecentTransactionsItemDetailsText}
                          />
                          <Text
                            text={new Date(item.createdAt).toLocaleDateString()}
                            preset="subheading"
                            style={$RecentTransactionsItemDetailsSubText}
                          />
                        </View>
                      </View>

                      <Text
                        text={`RM${item.amount.toFixed(2)}`}
                        preset="subheading"
                        style={$RecentTransactionsItemHeadingText}
                      />
                    </TouchableOpacity>
                  )}
                />
              ) : (
                <ActivityIndicator size={"large"} />
              )}
            </View>
          </View>

          <View style={$RecentTransactions}></View>
        </View>
      </Screen>
      <LoadingView loading={loading} />
      {recipientSelected && (
        <BottomSheet
          ref={sheetRef}
          style={{
            backgroundColor: colors.palette.primary600,
            padding: 20,
          }}
          height={height * 0.2}
        >
          <View style={$QuickActionItem}>
            <View style={$QuickActionItemView}>
              <View style={$RecentTransactionsItemAvatar}>
                <UserAvatar
                  size={45}
                  name={recipientSelected.to}
                  bgColors={["#141414FF", "#3F3F3FFF"]}
                />
              </View>
              <View style={$RecentTransactionsItemDetails}>
                <Text
                  text={recipientSelected.to}
                  preset="bold"
                  style={$RecentTransactionsItemDetailsText}
                />
              </View>
            </View>

            <Button
              text="Quick Send"
              style={[
                $CTAPrimaryButton,
                {
                  paddingVertical: 0,
                },
              ]}
              textStyle={$CTAPrimaryButtonText}
              RightAccessory={() => (
                <Icon
                  icon="caretRight"
                  color={colors.palette.primary600}
                  style={$CTAButtonIcon}
                  size={14}
                />
              )}
              preset="reversed"
              onPress={async () => {
                const recipient = await retrieveContactByPhoneNumber(recipientSelected.to)
                if (!recipient) {
                  Toast.show({
                    type: "error",
                    text1: "Contact not found",
                  })
                  return
                }

                navigation.navigate("Transfer", {
                  recipient,
                })

                sheetRef.current?.close()
              }}
            />
          </View>
        </BottomSheet>
      )}
    </>
  )
})

const $innerScreenContentContainer: ViewStyle = {
  paddingTop: spacing.lg,
  paddingHorizontal: spacing.lg,
  zIndex: 1,
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

const $QuickActionItem: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: colors.transparent,
}

export const $QuickActionItemView: ViewStyle = {
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
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
