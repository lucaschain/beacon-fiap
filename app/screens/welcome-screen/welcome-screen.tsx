import * as React from "react"
import Geolocation from "@react-native-community/geolocation"
import { save } from "../../utils/storage"
import { View, Alert, Image, ViewStyle, TextStyle, ImageStyle, SafeAreaView } from "react-native"
import { request, PERMISSIONS, requestNotifications } from "react-native-permissions"
import { NavigationScreenProps } from "react-navigation"
import { Text } from "../../components/text"
import { Button } from "../../components/button"
import { Screen } from "../../components/screen"
import { Wallpaper } from "../../components/wallpaper"
import { Header } from "../../components/header"
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
const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[4] + spacing[1],
  paddingHorizontal: 0,
}
const HEADER_TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 12,
  lineHeight: 15,
  textAlign: "center",
  letterSpacing: 1.5,
}
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
const ALMOST: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 26,
  fontStyle: "italic",
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

  const askPermission = async () => {
    const locationStatus = await request(PERMISSIONS.IOS.LOCATION_ALWAYS)
    const notificationStatus = await requestNotifications([
      "alert",
      "sound",
      "badge",
      "lockScreen",
      "carPlay",
      "notificationCenter",
      "criticalAlert",
    ])

    if (locationStatus != "granted" || notificationStatus.status != "granted") {
      Alert.alert(
        "falha nas permissoes",
        "as permissoes sao obrigatorias para funcionamento do app, por favor verifique as permissoes de localizacao e notificao nas configuracoes do sistema",
      )
    } else {
      Geolocation.getCurrentPosition(
        position => {
          const location = JSON.stringify(position)
          saveLocation(location)
        },
        error => Alert.alert(error.message),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
      )
    }
  }

  const saveLocation = async location => {
    await save("LOCATION", location)
    nextScreen()
  }

  return (
    <View style={FULL}>
      <Wallpaper />
      <Screen style={CONTAINER} preset="scroll" backgroundColor={color.transparent}>
        <Text style={TITLE_WRAPPER}>
          <Text style={TITLE} text="bem vindo, " />
        </Text>
        <Text style={TITLE} preset="header" tx="welcomeScreen.readyForLaunch" />
        {/* <Image source={bowserLogo} style={BOWSER} /> */}
        <Text style={CONTENT}>
          antes de comecarmos vamos precisar que voce de permissao de localizacao e notificacao para
          o nosso app.
        </Text>
        <Text style={CONTENT}>
          nao se preocupe, nao compartilhamos suas informacoes com ninguem.
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
