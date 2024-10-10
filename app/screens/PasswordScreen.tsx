import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { Pressable, TextStyle, useWindowDimensions, View, ViewStyle } from "react-native"
import { $presets, Button, Icon, Screen, Text, TextField } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing, typography } from "../theme"
import { SafeAreaView } from "react-native-safe-area-context"
import { useForm, Controller } from "react-hook-form"
import { passwordSchema } from "app/utils/schemas/loginSchemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigation } from "@react-navigation/native"
import Toast from "react-native-toast-message"
import { LoadingView } from "app/components/LoadingView"

interface PasswordScreenProps extends AppStackScreenProps<"Password"> {}

export const PasswordScreen: FC<PasswordScreenProps> = observer(function PasswordScreen(_props) {
  const { height, width } = useWindowDimensions()

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const [secureTextEntry, setSecureTextEntry] = useState(false)

  const navigation = useNavigation()

  const {
    authenticationStore: { login },
  } = useStores()

  const { handleSubmit, control } = useForm({
    resolver: zodResolver(passwordSchema),
  })

  const onSubmit = async (data: any) => {
    setIsSubmitted(true)
    setAttemptsCount(attemptsCount + 1)

    const { password } = data

    try {
      const res = await login(password)

      if (res.kind === "ok") {
        navigation.navigate("Stack")
      } else {
        Toast.show({
          type: "error",
          text1: "Password is incorrect",
          text2: res.message,
        })
      }
    } catch (e) {
      console.log(e)
      Toast.show({
        type: "error",
        text1: "Password is incorrect",
        text2: e.message,
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
              text="Enter your password"
              preset="heading"
              style={$logIn}
            />
            <Text
              text="If you forgot your password, good luck then!"
              preset="subheading"
              style={$enterDetails}
            />
            {attemptsCount > 2 && (
              <Text
                text="If you forgot your password, please contact our support team."
                size="sm"
                weight="light"
                style={$hint}
              />
            )}

            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <>
                  <TextField
                    placeholder="Password"
                    keyboardType="default"
                    secureTextEntry={secureTextEntry}
                    onChangeText={(text) => {
                      field.onChange(text)
                    }}
                    style={
                      {
                        color: colors.palette.neutral100,
                        fontSize: 18,
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
                    RightAccessory={() => (
                      <Pressable
                        onPress={() => {
                          setSecureTextEntry(!secureTextEntry)
                        }}
                        style={{
                          marginRight: spacing.md,
                          paddingHorizontal: spacing.sm,
                        }}
                      >
                        <Icon icon="ytl_eye" color={colors.palette.neutral100} size={20} />
                      </Pressable>
                    )}
                    autoFocus
                    {...field}
                  />

                  {error && (
                    <Text
                      text="Please input valid password."
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

const $hint: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.md,
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
