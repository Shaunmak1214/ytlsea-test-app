import { observer } from "mobx-react-lite"
import React, { FC, useRef, useState } from "react"
import { TextStyle, useWindowDimensions, View, ViewStyle } from "react-native"
import { $presets, Button, Icon, Screen, Text } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing, typography } from "../theme"
import { SafeAreaView } from "react-native-safe-area-context"
import PhoneInput from "react-native-phone-number-input"

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const { height, width } = useWindowDimensions()

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const {
    authenticationStore: { setAuthToken, validationError },
  } = useStores()

  const [value, setValue] = useState("")
  const [formattedValue, setFormattedValue] = useState("")
  const [valid, setValid] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const phoneInput = useRef<PhoneInput>(null)

  const error = isSubmitted ? validationError : ""

  function login() {
    setIsSubmitted(true)
    setAttemptsCount(attemptsCount + 1)

    if (validationError) return

    // Make a request to your server to get an authentication token.
    // If successful, reset the fields and set the token.
    setIsSubmitted(false)

    // We'll mock this with a fake token.
    setAuthToken(String(Date.now()))
  }

  const videoStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height,
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

            <PhoneInput
              ref={phoneInput}
              defaultValue={value}
              defaultCode="MY"
              layout="second"
              onChangeText={(text) => {
                setValue(text)
              }}
              onChangeFormattedText={(text) => {
                setFormattedValue(text)
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

            <Text
              text="Please input valid phone number."
              preset="formError"
              style={$enterDetails}
            />

            <View
              style={{
                marginTop: spacing.xxl,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                width: "100%",
              }}
            >
              <Text
                text="By tapping the button below, you agree to our Terms of Service and Privacy Policy."
                preset="subheading"
                style={{
                  ...$enterDetails,
                  marginRight: spacing.lg,
                  width: (width - spacing.lg * 2) * 0.7,
                  fontSize: 12,
                  color: colors.textDim,
                }}
              />
              <Button
                testID="login-button"
                // tx="loginScreen.tapToLogIn"
                style={{
                  ...$tapButton,
                  width: (width - spacing.lg * 2) * 0.2,
                  borderRadius: 100,
                  borderColor: colors.palette.accent500,
                  borderWidth: 1,
                  borderStyle: "solid",
                }}
                RightAccessory={(props) => <Icon icon="caretRight" color={colors.text} />}
                preset="reversed"
                onPress={login}
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
  paddingVertical: spacing.xxl,
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
