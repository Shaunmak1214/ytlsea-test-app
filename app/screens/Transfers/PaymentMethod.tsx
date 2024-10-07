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
import { Header, Icon, Screen, Text } from "../../components"

import { AppStackScreenProps } from "../../navigators"
import { colors, spacing } from "../../theme"
import { useNavigation } from "@react-navigation/native"
import { Col, Grid } from "react-native-easy-grid"

interface PaymentMethodScreenProps extends AppStackScreenProps<"Login"> {}

export const PaymentMethodScreen: FC<PaymentMethodScreenProps> = observer(
  function PaymentMethodScreen(_props) {
    const { height } = useWindowDimensions()

    const navigation = useNavigation()

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
            <Text testID="login-heading" text="Payment Method" preset="heading" style={$logIn} />
            <Text
              text="Choose from duit now qr, mobile phone, or choose from contact list."
              preset="subheading"
              style={$enterDetails}
            />

            <View style={$PaymentMethodChooser}>
              <TouchableOpacity
                style={$PaymentMethodChooseItem()}
                onPress={() => {
                  navigation.navigate("ContactList")
                }}
              >
                <Grid>
                  <Col size={2}>
                    <View
                      style={
                        { flexDirection: "row", alignItems: "center", columnGap: 10 } as ViewStyle
                      }
                    >
                      <Icon icon="ytl_contact" color={colors.palette.neutral100} size={24} />
                      <Text
                        text="Contact List"
                        preset="heading"
                        style={$PaymentMethodChooseItemHeadingText()}
                      />
                    </View>
                    <Text
                      text="Choose from contact book"
                      preset="subheading"
                      style={$enterDetails}
                      weight="light"
                    />
                  </Col>

                  <Col
                    size={1}
                    style={{ justifyContent: "center", alignItems: "center" } as ViewStyle}
                  >
                    <Icon
                      icon="caretRight"
                      color={colors.palette.neutral100}
                      style={$PaymentMethodRightIcon}
                      size={20}
                    />
                  </Col>
                </Grid>
              </TouchableOpacity>

              <TouchableOpacity
                style={$PaymentMethodChooseItem()}
                onPress={() => {
                  // navigation.goBack()
                }}
              >
                <Grid>
                  <Col size={2}>
                    <View
                      style={
                        { flexDirection: "row", alignItems: "center", columnGap: 10 } as ViewStyle
                      }
                    >
                      <Icon icon="ytl_duitnow" size={20} />
                      <Text
                        text="Duit Now QR"
                        preset="heading"
                        style={$PaymentMethodChooseItemHeadingText()}
                      />
                    </View>
                    <Text
                      text="Pay with QR Code"
                      preset="subheading"
                      style={$enterDetails}
                      weight="light"
                    />
                  </Col>

                  <Col
                    size={1}
                    style={{ justifyContent: "center", alignItems: "center" } as ViewStyle}
                  >
                    <Icon
                      icon="caretRight"
                      color={colors.palette.neutral100}
                      style={$PaymentMethodRightIcon}
                      size={20}
                    />
                  </Col>
                </Grid>
              </TouchableOpacity>
            </View>
          </View>
        </Screen>
      </>
    )
  },
)

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

const $PaymentMethodChooser: ViewStyle = {
  marginTop: spacing.lg,
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "flex-start",
  width: "100%",
  rowGap: spacing.md,
}

const $PaymentMethodChooseItem = () => {
  return {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    paddingBottom: 0,
    zIndex: 1,
    borderRadius: 20,
    backgroundColor: "#0000008E",
    width: "100%",
  } as ViewStyle
}

const $PaymentMethodChooseItemHeadingText = () => {
  return {
    fontSize: 20,
    color: colors.palette.accent500,
  } as TextStyle
}

const $PaymentMethodRightIcon: ImageStyle = {
  marginLeft: spacing.lg,
}
