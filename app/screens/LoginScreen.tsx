import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { TextStyle, useWindowDimensions, View, ViewStyle } from "react-native"
import { $presets, Button, Icon, Screen, Text } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing, typography } from "../theme"
import { SafeAreaView } from "react-native-safe-area-context"
import PhoneInput from "react-native-phone-number-input"
import * as LocalAuthentication from "expo-local-authentication"
import * as Contacts from "expo-contacts"
import * as SecureStore from "expo-secure-store"
import { useForm, Controller } from "react-hook-form"
import { loginSchema } from "app/utils/schemas/loginSchemas"
import { zodResolver } from "@hookform/resolvers/zod"

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const { height, width } = useWindowDimensions()

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const [biometricAvailable, setBiometricAvailable] = useState(false)
  const {
    authenticationStore: { setAuthToken, setAuthPhoneNumber },
  } = useStores()

  const [value, setValue] = useState("")
  const [_, setFormattedValue] = useState("")

  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  useEffect(() => {
    console.log("errors", errors)
  }, [errors])

  const onSubmit = (data: any) => {
    console.log(data)
    login()
  }

  function login() {
    setIsSubmitted(true)
    setAttemptsCount(attemptsCount + 1)

    // Make a request to your server to get an authentication token.
    // If successful, reset the fields and set the token.
    setIsSubmitted(false)

    setAuthPhoneNumber(getValues("phoneNumber"))

    // We'll mock this with a fake token.
    setAuthToken(String(Date.now()))
  }

  async function save(key: string, value: string) {
    await SecureStore.setItemAsync(key, value)
  }

  async function getValueFor(key: string) {
    const result = await SecureStore.getItemAsync(key)
    if (result) {
      // alert("🔐 Here's your value 🔐 \n" + result)
    } else {
      // alert("No values stored under that key.")
    }
  }

  useEffect(() => {
    checkBiometricSupport()

    // Save the value
    save("key", "value")

    // Get the value
    // console.log(getValueFor("key"))
  }, [])

  async function checkBiometricSupport() {
    const hasHardware = await LocalAuthentication.hasHardwareAsync()
    const supportedAuthTypes = await LocalAuthentication.supportedAuthenticationTypesAsync()
    const { status: contactStatus } = await Contacts.requestPermissionsAsync()
    setBiometricAvailable(hasHardware && supportedAuthTypes.length > 0)

    if (contactStatus === "granted") {
      const contactResponse = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
      })

      if (contactResponse.data.length > 0) {
        // console.log(contactResponse.data[0])
      }
    }
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
      disableDeviceFallback: isFaceIDAvailable, // Disables fallback if Face ID is available
    }

    const auth = await LocalAuthentication.authenticateAsync(authOptions)

    if (auth.success) {
      login()
    } else {
      console.log("Authentication failed", auth)
    }
  }

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
            <Text
              testID="login-heading"
              text="Enter your mobile number"
              preset="heading"
              style={$logIn}
            />
            <Text
              text="We'll use this to check your eligibility, and to help you seetup your account."
              preset="subheading"
              style={$enterDetails}
            />
            {attemptsCount > 2 && (
              <Text tx="loginScreen.hint" size="sm" weight="light" style={$hint} />
            )}

            <Controller
              name="phoneNumber"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <>
                  <PhoneInput
                    // ref={phoneInput}
                    defaultValue={value}
                    defaultCode="MY"
                    layout="second"
                    onChangeText={(text) => {
                      setValue(text)
                    }}
                    onChangeFormattedText={(text) => {
                      setFormattedValue(text)
                      field.onChange(text)
                    }}
                    containerStyle={{
                      backgroundColor: colors.transparent,
                    }}
                    textContainerStyle={{
                      backgroundColor: colors.transparent,
                    }}
                    textInputStyle={
                      {
                        ...$fontNumberTextStyle,
                        marginLeft: -10,
                      } as TextStyle
                    }
                    codeTextStyle={$fontNumberTextStyle}
                    withDarkTheme
                    withShadow
                    autoFocus
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
              style={
                {
                  marginTop: spacing.xxl,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  width: "100%",
                } as ViewStyle
              }
            >
              <Text
                text="By tapping the button below, you agree to our Terms of Service and Privacy Policy."
                preset="subheading"
                style={
                  {
                    ...$enterDetails,
                    marginRight: spacing.lg,
                    width: (width - spacing.lg * 2) * 0.7,
                    fontSize: 12,
                    color: colors.textDim,
                  } as ViewStyle
                }
              />
              <Button
                testID="login-button"
                style={
                  {
                    ...$tapButton,
                    width: (width - spacing.lg * 2) * 0.2,
                    borderRadius: 100,
                    borderColor: colors.palette.accent500,
                    borderWidth: 1,
                    borderStyle: "solid",
                  } as ViewStyle
                }
                RightAccessory={() => <Icon icon="caretRight" color={colors.text} />}
                preset="reversed"
                onPress={() => {
                  // biometricAvailable ? handleBiometricAuth() : login()
                  handleSubmit(onSubmit)()
                }}
              />
            </View>
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
  paddingVertical: spacing.lg,
  paddingHorizontal: spacing.lg,
  zIndex: 1,
}

const $logIn: TextStyle = {
  marginBottom: spacing.sm,
  color: "#FCA311",
}

const $enterDetails: TextStyle = {
  marginBottom: spacing.lg,
  fontSize: 16,
}

const $hint: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.md,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.xs,
}

const $fontNumberTextStyle: TextStyle = {
  ...$presets.default,
  color: colors.text,
  fontSize: 22,
  fontFamily: typography.primary.medium,
}
