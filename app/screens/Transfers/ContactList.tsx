import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { TextStyle, TouchableOpacity, useWindowDimensions, View, ViewStyle } from "react-native"
import { $presets, Header, Icon, ListView, Screen, Text } from "../../components"
import { AppStackScreenProps } from "../../navigators"
import { colors, spacing, typography } from "../../theme"
import * as Contacts from "expo-contacts"
import { useIsFocused, useNavigation } from "@react-navigation/native"
import UserAvatar from "react-native-user-avatar"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "app/utils/schemas/loginSchemas"
import PhoneInput from "react-native-phone-number-input"
import { debounce } from "app/utils/debounce"
import { LoadingView } from "app/components/LoadingView"

interface ContactListScreenProps extends AppStackScreenProps<"Login"> {}

export const ContactListScreen: FC<ContactListScreenProps> = observer(function ContactListScreen(
  _props,
) {
  const [listData, setListData] = useState<Contacts.Contact[]>([])
  const [filteredListData, setFilteredListData] = useState<Contacts.Contact[]>([])
  const [value, setValue] = useState("")
  const [_, setFormattedValue] = useState("")
  const [loading, setLoading] = useState(true)

  const { height } = useWindowDimensions()
  const isFocused = useIsFocused()
  const navigation = useNavigation()

  const fetchSearchResults = async (term: string) => {
    try {
      const foundContacts = listData.filter((contact) => {
        return contact.phoneNumbers.some((phoneNumber) => {
          // remove +60 from phone number
          const cleanPhoneNumber = phoneNumber.number?.replace("+60", "").replace(/ /g, "")
          const cleanTerm = term.replace("+60", "").replace(/ /g, "")

          return (
            phoneNumber.number?.trim().includes(term.trim()) ||
            cleanTerm.trim().includes(cleanPhoneNumber)
          )
        })
      })

      setFilteredListData(foundContacts)
    } catch (error) {
      console.error("Error fetching data:", error)
      // Handle the error, e.g., show an error message to the user
    } finally {
      setLoading(false)
    }
  }

  const debouncedSearch = debounce(fetchSearchResults, 250)

  const handleSearch = (text: string) => {
    setLoading(true)
    debouncedSearch(text)
  }

  const {
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  async function checkContactList() {
    const { status: contactStatus } = await Contacts.requestPermissionsAsync()

    if (contactStatus === "granted") {
      const contactResponse = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
      })

      if (contactResponse.data.length > 0) {
        const filteredContact = contactResponse.data.filter((item) => {
          return item.phoneNumbers?.length > 0
        })

        setListData(filteredContact)
        setFilteredListData(filteredContact)
      }
    }

    setLoading(false)
  }

  useEffect(() => {
    checkContactList()
  }, [isFocused])

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
          <Text testID="login-heading" text="Pay to anyone" preset="heading" style={$logIn} />
          <Text
            text="Pay to anyone in your contact list."
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
                    handleSearch(text)
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

          <View style={$listContainerStyle}>
            <Text
              text="Recent contacts"
              preset="heading"
              style={
                {
                  ...$heading,
                  fontSize: 18,
                } as TextStyle
              }
            />

            {filteredListData.length === 0 && (
              <Text
                text="No contacts found."
                preset="subheading"
                style={
                  {
                    ...$heading,
                    fontSize: 18,
                  } as TextStyle
                }
              />
            )}

            {filteredListData && (
              <View style={$listStyle}>
                <ListView<string>
                  data={filteredListData}
                  estimatedItemSize={20}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      activeOpacity={1}
                      style={$RecentTransactionsItem}
                      onPress={() => {
                        navigation.navigate("Transfer", {
                          recipient: item,
                        })
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
                            name={item.firstName}
                            bgColors={["#141414FF", "#3F3F3FFF"]}
                          />
                        </View>
                        <View style={$RecentTransactionsItemDetails}>
                          <Text
                            text={item.firstName}
                            preset="bold"
                            style={$RecentTransactionsItemDetailsText}
                          />
                          <Text
                            text={item?.phoneNumbers?.[0]?.number || ""}
                            preset="subheading"
                            style={$RecentTransactionsItemDetailsSubText}
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>
        </View>
      </Screen>
      <LoadingView loading={loading} />
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

const $listContainerStyle: ViewStyle = {
  marginTop: spacing.sm,
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

const $heading: TextStyle = {
  fontSize: 24,
}

const $RecentTransactionsItemDetailsText: TextStyle = {
  fontSize: 16,
  color: colors.palette.neutral100,
}

const $RecentTransactionsItemDetailsSubText: TextStyle = {
  fontSize: 14,
  color: colors.textDim,
}

const $fontNumberTextStyle: TextStyle = {
  ...$presets.default,
  color: colors.text,
  fontSize: 18,
  fontFamily: typography.primary.medium,
}
