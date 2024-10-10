import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { ImageStyle, TextStyle, useWindowDimensions, View, ViewStyle } from "react-native"
import { Button, Icon, Screen, Text } from "../../components"
import { AppStackScreenProps } from "../../navigators"
import { colors, spacing, typography } from "../../theme"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Col, Grid, Row } from "react-native-easy-grid"

interface ConfirmationScreenrops extends AppStackScreenProps<"Login"> {}

export const ConfirmationScreen: FC<ConfirmationScreenrops> = observer(function ConfirmationScreen(
  _props,
) {
  const [completedTrxData, setCompletedTrxData] = useState<any>(null)

  const { height } = useWindowDimensions()
  const navigation = useNavigation()
  const route = useRoute()

  useEffect(() => {
    if (route.params && route.params?.trxData === undefined) return

    setCompletedTrxData(route.params.trxData)
  }, [route.params.trxData])

  return (
    <>
      <Screen preset="scroll" keyboardShouldPersistTaps="always" safeAreaEdges={["top"]}>
        <View
          style={{
            ...$innerScreenContentContainer,
            minHeight: height,
          }}
        >
          <View
            style={{
              width: "100%",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon icon="ytl_star" size={175} />

            <View
              style={{
                height: spacing.md,
              }}
            />

            <Text testID="login-heading" text="Transfer Complete" preset="heading" style={$logIn} />
            <Text
              text={`Tranferred a total of RM${completedTrxData?.amount || 0} to ${
                completedTrxData?.recipient?.firstName || ""
              }`}
              preset="subheading"
              style={$enterDetails}
            />

            <Grid
              style={{
                width: "100%",
              }}
            >
              <Row
                style={{
                  columnGap: spacing.md,
                }}
              >
                <Col size={1.5}>
                  <Button
                    text="Share"
                    style={$CTASecondaryButton}
                    textStyle={$CTASecondaryButtonText}
                    RightAccessory={() => (
                      <Icon
                        icon="ytl_share"
                        color={colors.palette.neutral100}
                        style={$CTAButtonIcon}
                        size={18}
                      />
                    )}
                    preset="reversed"
                    onPress={() => {
                      navigation.navigate("Accounts")
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
                        color={colors.palette.neutral100}
                        style={$CTAButtonIcon}
                      />
                    )}
                    preset="reversed"
                    onPress={() => {
                      navigation.navigate("Accounts")
                    }}
                  />
                </Col>
              </Row>
            </Grid>
          </View>

          <View
            style={{
              height: spacing.lg,
            }}
          />

          <View style={$DetailsContainer}>
            <Grid
              style={{
                rowGap: spacing.md,
              }}
            >
              <Row>
                <Col>
                  <Text style={$DetailsTitle}>To</Text>
                </Col>
                <Col>
                  <Text style={$DetailsValue}>{completedTrxData?.recipient?.firstName || ""}</Text>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Text style={$DetailsTitle}>Transaction ID</Text>
                </Col>
                <Col>
                  <Text style={$DetailsValue}>{completedTrxData?.transactionId || ""}</Text>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Text style={$DetailsTitle}>Date</Text>
                </Col>
                <Col>
                  <Text style={$DetailsValue}>{new Date().toLocaleDateString()}</Text>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Text style={$DetailsTitle}>Amount</Text>
                </Col>
                <Col>
                  <Text style={$DetailsValue}>RM{completedTrxData?.amount || ""}</Text>
                </Col>
              </Row>
            </Grid>
          </View>

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
            text="Go Home"
            style={$CTAPrimaryButton}
            textStyle={$CTAPrimaryButtonText}
            preset="reversed"
            onPress={() => {
              navigation.navigate("Accounts")
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

const $DetailsContainer: ViewStyle = {
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.lg,
  backgroundColor: "#59608B21",
  borderRadius: 10,
}

const $DetailsTitle: TextStyle = {
  color: colors.textDim,
  fontSize: 16,
  fontFamily: typography.primary.medium,
  fontWeight: "bold",
  textAlign: "left",
}

const $DetailsValue: TextStyle = {
  color: colors.palette.neutral100,
  fontSize: 18,
  fontFamily: typography.primary.medium,
  textAlign: "right",
}

const $CTASecondaryButton: ViewStyle = {
  borderRadius: 100,
  borderColor: "#59608B21",
  borderWidth: 2,
  borderStyle: "solid",
  paddingVertical: spacing.xs,
  paddingHorizontal: spacing.xs,
  backgroundColor: colors.transparent,
}

const $CTASecondaryButtonText: TextStyle = {
  color: colors.palette.neutral100,
  fontSize: 16,
}

const $CTAButtonIcon: ImageStyle = {
  marginLeft: spacing.xs,
}
