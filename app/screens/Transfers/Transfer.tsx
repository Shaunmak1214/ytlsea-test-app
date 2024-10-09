import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useRef, useState } from "react"
import {
  ImageStyle,
  TextStyle,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native"
import { Button, Header, Icon, Screen, Text, TextField } from "../../components"
import { AppStackScreenProps } from "../../navigators"
import { colors, spacing, typography } from "../../theme"
import * as Contacts from "expo-contacts"
import { useNavigation, useRoute } from "@react-navigation/native"
import UserAvatar from "react-native-user-avatar"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "app/utils/schemas/loginSchemas"
import * as LocalAuthentication from "expo-local-authentication"
import { transferSchema } from "app/utils/schemas/transferSchemas"

interface TransferScreenProps extends AppStackScreenProps<"Login"> {}

export const TransferScreen: FC<TransferScreenProps> = observer(function TransferScreen(_props) {
  const [recipient, setRecipient] = useState<Contacts.Contact>()
  const [biometricAvailable, setBiometricAvailable] = useState(false)

  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")

  const { height } = useWindowDimensions()
  const navigation = useNavigation()
  const route = useRoute()

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(transferSchema),
  })

  const onSubmit = async (data: any) => {
    console.log("data: ", data)
    await handleBiometricAuth()
  }

  // Trigger biometric authentication
  async function handleBiometricAuth() {
    const supportedAuthTypes = await LocalAuthentication.supportedAuthenticationTypesAsync()

    // Check if Face ID is available
    const isFaceIDAvailable = supportedAuthTypes.includes(
      LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
    )

    const authOptions = {
      promptMessage: "Authenticate to login",
      fallbackLabel: "Use PIN",
      disableDeviceFallback: isFaceIDAvailable,
    }

    const auth = await LocalAuthentication.authenticateAsync(authOptions)

    if (auth.success) {
      console.log("transferring")

      navigation.navigate("Confirmation")
    } else {
      console.log("Authentication failed", auth)
    }
  }

  async function checkBiometricSupport() {
    const hasHardware = await LocalAuthentication.hasHardwareAsync()
    const supportedAuthTypes = await LocalAuthentication.supportedAuthenticationTypesAsync()
    setBiometricAvailable(hasHardware && supportedAuthTypes.length > 0)
  }

  useEffect(() => {
    checkBiometricSupport()

    if (route.params.recipient === undefined) return
    console.log(route.params.recipient)
    setRecipient(route.params.recipient)
  }, [route.params.recipient])

  return (
    <>
      <Screen preset="scroll" keyboardShouldPersistTaps="never" safeAreaEdges={["top"]}>
        <View
          style={{
            ...$innerScreenContentContainer,
            minHeight: height,
          }}
        >
          <Header
            LeftActionComponent={
              <TouchableOpacity
                style={$customLeftAction}
                onPress={() => {
                  navigation.goBack()
                }}
              >
                <Icon icon="back" color={colors.palette.neutral100} size={20} />
              </TouchableOpacity>
            }
            safeAreaEdges={[]}
          />
          <Text testID="login-heading" text="Transfer Money" preset="heading" style={$logIn} />
          <Text text="Transfer to" preset="subheading" style={$enterDetails} />

          <View
            style={{
              height: spacing.lg,
            }}
          />

          {recipient && (
            <View style={$recipientContainerStyle}>
              <UserAvatar
                size={80}
                name={recipient.firstName}
                bgColors={["#141414FF", "#3F3F3FFF"]}
              />

              <Text text={recipient.firstName} preset="bold" style={$recipientHeaingTextStyle} />
              <Text
                text={recipient.phoneNumbers[0].number}
                preset="subheading"
                style={$recipientPhoneNumberTextStyle}
                numberOfLines={1}
              />
            </View>
          )}

          <Controller
            name="amount"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <>
                <TextField
                  label="Amount"
                  labelTxOptions={{ prop: "label" }}
                  placeholder="10.00"
                  keyboardType="number-pad"
                  onChangeText={(text) => {
                    field.onChange(text)
                  }}
                  style={
                    {
                      color: colors.palette.neutral100,
                      fontSize: 24,
                    } as TextStyle
                  }
                  inputWrapperStyle={
                    {
                      backgroundColor: "#192D5777",
                      borderColor: colors.transparent,
                      paddingVertical: spacing.md,
                      borderRadius: 10,
                      alignItems: "center",
                    } as ViewStyle
                  }
                  LeftAccessory={() => (
                    <Text
                      text="RM"
                      preset="heading"
                      style={
                        {
                          color: colors.palette.neutral100,
                          fontSize: 24,
                          marginLeft: spacing.md,
                          marginTop: -2,
                        } as TextStyle
                      }
                    />
                  )}
                  {...field}
                />

                {error && (
                  <Text
                    text="Please input valid amount."
                    preset="formError"
                    style={{
                      ...$enterDetails,
                      marginTop: spacing.sm,
                    }}
                  />
                )}
              </>
            )}
          />

          <View
            style={{
              height: spacing.lg,
            }}
          />

          <Controller
            name="description"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <>
                <TextField
                  label="What's the transfer for?"
                  labelTxOptions={{ prop: "label" }}
                  placeholder="Fund Transfer"
                  keyboardType="default"
                  onChangeText={(text) => {
                    field.onChange(text)
                  }}
                  style={
                    {
                      color: colors.palette.neutral100,
                      fontSize: 16,
                    } as TextStyle
                  }
                  inputWrapperStyle={
                    {
                      backgroundColor: "#192D5777",
                      borderColor: colors.transparent,
                      paddingVertical: spacing.md,
                      borderRadius: 10,
                      alignItems: "center",
                    } as ViewStyle
                  }
                  {...field}
                />

                {error && (
                  <Text
                    text="Please input valid phone number."
                    preset="formError"
                    style={{
                      ...$enterDetails,
                      marginTop: spacing.sm,
                    }}
                  />
                )}
              </>
            )}
          />

          <View
            style={{
              height: spacing.lg,
            }}
          />

          <View
            style={{
              height: spacing.lg,
            }}
          />

          <Button
            text="Confirm Transfer"
            style={$CTAPrimaryButton}
            textStyle={$CTAPrimaryButtonText}
            preset="reversed"
            onPress={() => {
              handleSubmit(onSubmit)()
            }}
          />
        </View>
      </Screen>
    </>
  )
})

const $innerScreenContentContainer: ViewStyle = {
  paddingVertical: spacing.lg,
  paddingHorizontal: spacing.lg,
  zIndex: 1,
}

const $logIn: TextStyle = {
  marginBottom: spacing.sm,
  color: colors.palette.accent500,
}

const $enterDetails: TextStyle = {
  marginBottom: spacing.lg,
  fontSize: 16,
}

const $customLeftAction: ViewStyle = {
  height: "100%",
  flexDirection: "row",
}

const $recipientContainerStyle: ViewStyle = {
  marginTop: spacing.sm,
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
}

const $recipientHeaingTextStyle: TextStyle = {
  fontSize: 24,
  color: colors.palette.neutral100,
  fontFamily: typography.primary.medium,
  fontWeight: "bold",
  textAlign: "center",
  marginTop: spacing.lg,
}

const $recipientPhoneNumberTextStyle: TextStyle = {
  fontSize: 14,
  color: colors.palette.neutral100,
  marginBottom: spacing.sm,
  fontFamily: typography.primary.medium,
  textAlign: "center",
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

const $CTAButtonIcon: ImageStyle = {
  marginLeft: spacing.xs,
}
