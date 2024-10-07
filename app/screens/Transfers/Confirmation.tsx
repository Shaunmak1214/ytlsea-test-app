import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
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

interface ConfirmationScreenrops extends AppStackScreenProps<"Login"> {}

export const ConfirmationScreen: FC<ConfirmationScreenrops> = observer(function ConfirmationScreen(
  _props,
) {
  const { height } = useWindowDimensions()
  const navigation = useNavigation()

  const route = useRoute()

  return (
    <>
      <Screen preset="scroll" keyboardShouldPersistTaps="always" safeAreaEdges={["top"]}>
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
          <Text testID="login-heading" text="Confirmation" preset="heading" style={$logIn} />
          <Text text="Tranferring to Shinly Eu" preset="subheading" style={$enterDetails} />

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
              navigation.navigate("Result")
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
