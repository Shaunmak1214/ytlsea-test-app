import React from "react"
import { ActivityIndicator, useWindowDimensions, View, ViewStyle } from "react-native"

export function LoadingView({ loading = false }) {
  const { height, width } = useWindowDimensions()

  if (!loading) return null

  return (
    <View style={$view(height, width)}>
      <ActivityIndicator size={"large"} />
    </View>
  )
}

const $view = (height: number, width: number) => {
  return {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#19101576",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height,
    width,
  } as ViewStyle
}
