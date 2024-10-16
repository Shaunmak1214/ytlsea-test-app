import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { TextStyle, useWindowDimensions, View, ViewStyle } from "react-native"
import { $presets, Button, Icon, Screen, Text } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing, typography } from "../theme"
import { SafeAreaView } from "react-native-safe-area-context"
import PhoneInput from "react-native-phone-number-input"
import { useForm, Controller } from "react-hook-form"
import { loginSchema } from "app/utils/schemas/loginSchemas"
import { zodResolver } from "@hookform/resolvers/zod"
import Toast from "react-native-toast-message"
import { useNavigation } from "@react-navigation/native"
import { LoadingView } from "app/components/LoadingView"

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const { height, width } = useWindowDimensions()

  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    authenticationStore: { checkPhoneNumber },
  } = useStores()

  const [value, setValue] = useState("")
  const [_, setFormattedValue] = useState("")

  const { handleSubmit, control } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const navigation = useNavigation()

  const onSubmit = async (data: any) => {
    setIsSubmitted(true)

    const { phoneNumber } = data

    try {
      const res = await checkPhoneNumber(phoneNumber)

      if (res.kind === "ok") {
        navigation.navigate("Password")
      } else {
        Toast.show({
          type: "error",
          text1: "No phone number found",
        })
      }
    } catch (e) {
      console.log(e)
      Toast.show({
        type: "error",
        text1: "No phone number found",
      })
    }

    setIsSubmitted(false)
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

            <Controller
              name="phoneNumber"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <>
                  <PhoneInput
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
                  handleSubmit(onSubmit)()
                }}
              />
            </View>
          </View>
        </Screen>
      </SafeAreaView>
      <LoadingView loading={isSubmitted} />
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

const $tapButton: ViewStyle = {
  marginTop: spacing.xs,
}

const $fontNumberTextStyle: TextStyle = {
  ...$presets.default,
  color: colors.palette.neutral100,
  fontSize: 22,
  fontFamily: typography.primary.medium,
}
