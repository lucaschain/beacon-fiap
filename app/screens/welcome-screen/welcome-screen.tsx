import * as React from "react"
import Geolocation from "@react-native-community/geolocation"
import { save } from "../../utils/storage"
import { Platform, View, Alert, Image, ViewStyle, TextStyle, ImageStyle, SafeAreaView } from "react-native"
import { request, RESULTS, PERMISSIONS, requestNotifications } from "react-native-permissions"
import { NavigationScreenProps } from "react-navigation"
import { Text } from "../../components/text"
import { Button } from "../../components/button"
import { Screen } from "../../components/screen"
import { Wallpaper } from "../../components/wallpaper"
import { color, spacing } from "../../theme"
import { bowserLogo } from "./"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
}
const TEXT: TextStyle = {
  color: color.palette.white,
  fontFamily: "Montserrat",
}
const BOLD: TextStyle = { fontWeight: "bold" }
const TITLE_WRAPPER: TextStyle = {
  ...TEXT,
  textAlign: "center",
}
const TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 28,
  lineHeight: 38,
  textAlign: "center",
}
const BOWSER: ImageStyle = {
  alignSelf: "center",
  marginVertical: spacing[5],
  maxWidth: "100%",
}
const CONTENT: TextStyle = {
  ...TEXT,
  color: "#BAB6C8",
  fontSize: 15,
  lineHeight: 22,
  marginBottom: spacing[5],
}
const CONTINUE: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  backgroundColor: "#5D2555",
}
const CONTINUE_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 13,
  letterSpacing: 2,
}
const FOOTER: ViewStyle = { backgroundColor: "#20162D" }
const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
}

export interface WelcomeScreenProps extends NavigationScreenProps<{}> {}

export const WelcomeScreen: React.FunctionComponent<WelcomeScreenProps> = props => {
  const nextScreen = React.useMemo(() => () => props.navigation.navigate("map"), [props.navigation])

  const saveLocation = async location => {
    await save("LOCATION", location)
    nextScreen()
  }

  const askPermission = async () => {
    const locationStatus = await request(Platform.OS === 'ios' ?
      PERMISSIONS.IOS.LOCATION_ALWAYS :
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
    )
    const notificationStatus = await requestNotifications([
      "alert",
      "sound",
      "badge",
      "lockScreen",
      "carPlay",
      "notificationCenter",
      "criticalAlert",
    ])

    if (locationStatus !== RESULTS.GRANTED || notificationStatus.status !== RESULTS.GRANTED) {
      Alert.alert(
        "Oops!",
        "As permissões de localização e notificação são obrigatórias pro funcionamento do APP",
      )
    } else {
      Geolocation.getCurrentPosition(
        position => {
          const location = JSON.stringify(position)
          saveLocation(location)
        },
        error => Alert.alert(error.message),
        { enableHighAccuracy: true, timeout: 1000 },
      )
    }
  }

  return (
    <View style={FULL}>
      <Wallpaper />
      <Screen style={CONTAINER} preset="scroll" backgroundColor={color.transparent}>
        <Text style={TITLE_WRAPPER}>
          <Text style={TITLE} text="Bem vindo!" />
        </Text>
        <Text style={TITLE} preset="header" tx="welcomeScreen.readyForLaunch" />
        <Image source={bowserLogo} style={BOWSER} />
        <Text style={CONTENT}>
          antes de começarmos, vamos precisar que você dê permissão de localização e notificação para o app
        </Text>
        <Text style={CONTENT}>
          não se preocupe, não compartilhamos suas informações com ninguém.
        </Text>
      </Screen>
      <SafeAreaView style={FOOTER}>
        <View style={FOOTER_CONTENT}>
          <Button
            style={CONTINUE}
            textStyle={CONTINUE_TEXT}
            tx="welcomeScreen.continue"
            onPress={askPermission}
          />
        </View>
      </SafeAreaView>
    </View>
  )
}
