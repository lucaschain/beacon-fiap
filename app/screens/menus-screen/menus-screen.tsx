import * as React from "react"
import { Image, ImageStyle, Platform, TextStyle, View, ViewStyle, FlatList } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { Screen } from "../../components/screen"
import { Text } from "../../components/text"
import { Button } from "../../components/button"
import { Wallpaper } from "../../components/wallpaper"
import { Header } from "../../components/header"
import { color, spacing } from "../../theme"
import { logoIgnite, heart } from "./"
import { BulletItem } from "../../components/bullet-item"
import { Api } from "../../services/api"
import { save } from "../../utils/storage"
import { Checkbox } from "../../components/checkbox"
import Menus from "./menus"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
}
const DEMO: ViewStyle = {
  margin: spacing[4],
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  backgroundColor: "#5D2555",
}
const BOLD: TextStyle = { fontWeight: "bold" }
const DEMO_TEXT: TextStyle = {
  ...BOLD,
  fontSize: 13,
  letterSpacing: 2,
}
const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[5] - 1,
  paddingHorizontal: 0,
}
const HEADER_TITLE: TextStyle = {
  ...BOLD,
  fontSize: 12,
  lineHeight: 15,
  textAlign: "center",
  letterSpacing: 1.5,
}
const TITLE: TextStyle = {
  ...BOLD,
  fontSize: 28,
  lineHeight: 38,
  textAlign: "center",
  marginBottom: spacing[5],
}
const TAGLINE: TextStyle = {
  color: "#BAB6C8",
  fontSize: 15,
  lineHeight: 22,
  marginBottom: spacing[4] + spacing[1],
}
const IGNITE: ImageStyle = {
  marginVertical: spacing[6],
  alignSelf: "center",
}
const LOVE_WRAPPER: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  alignSelf: "center",
}
const LOVE: TextStyle = {
  color: "#BAB6C8",
  fontSize: 15,
  lineHeight: 22,
}
const HEART: ImageStyle = {
  marginHorizontal: spacing[2],
  width: 10,
  height: 10,
  resizeMode: "contain",
}
const HINT: TextStyle = {
  color: "#BAB6C8",
  fontSize: 12,
  lineHeight: 15,
  marginVertical: spacing[2],
}

export interface MenuScreen extends NavigationScreenProps<{}> {}

export const MenuScreen: React.FunctionComponent<MenuScreen> = props => {
  const [items, setItems] = React.useState({})
  const [currentMenu, setCurrentMenu] = React.useState(false)
  const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])
  const nextScreen = React.useMemo(
    () => obj => props.navigation.navigate("checkout", { data: obj }),
    [props.navigation],
  )

  const onToggle = (item, res) => {
    if (res) {
      setItems(items => ({
        ...items,
        [item.id]: item,
      }))
    } else {
      setItems(items => ({
        ...items,
        [item.id]: false,
      }))
    }
  }

  const checkIfSelected = item => {
    if (items[item.id]) {
      return true
    } else {
      return false
    }
  }

  const renderMenu = () => {
    if (currentMenu) {
      return (
        <>
          <FlatList
            data={Menus.menus[currentMenu]["menu-items"]}
            renderItem={({ item }) =>
              item["sub-items"].map(item => (
                <Checkbox
                  key={item.name}
                  value={checkIfSelected(item)}
                  onToggle={res => onToggle(item, res)}
                  text={`${item.name} - R$: ${item.price}`}
                />
              ))
            }
            keyExtractor={item => item.id}
          />
        </>
      )
    } else {
      const randomNumber = Math.floor(Math.random() * 8) + 1
      setCurrentMenu(randomNumber)
      return (
        <FlatList
          data={Menus.menus[randomNumber]["menu-items"]}
          renderItem={({ item }) => (
            <Checkbox
              key={item["sub-items"][0].name}
              value={true}
              onToggle={res => setItems(item["sub-items"][0])}
              text={`${item["sub-items"][0].name} - R$: ${item["sub-items"][0].price}`}
            />
          )}
          keyExtractor={item => item.id}
        />
      )
    }
  }

  const goToCheckOut = () => {
    nextScreen(items)
  }
  return (
    <View style={FULL}>
      <Wallpaper />
      <Screen style={CONTAINER} preset="scroll" backgroundColor={color.transparent}>
        <Header
          headerText={props.navigation.getParam("description")}
          leftIcon="back"
          onLeftPress={goBack}
          style={HEADER}
          titleStyle={HEADER_TITLE}
        />
        <Text style={TITLE} preset="header" text={props.navigation.getParam("name")} />
        {renderMenu()}
        <View>
          <Button style={DEMO} textStyle={DEMO_TEXT} text="continuar" onPress={goToCheckOut} />
        </View>
      </Screen>
    </View>
  )
}
