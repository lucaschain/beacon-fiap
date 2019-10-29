import * as React from "react"
import { Image, ImageStyle, Platform, TextStyle, View, ViewStyle, FlatList } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { Screen } from "../../components/screen"
import { Text } from "../../components/text"
import { Button } from "../../components/button"
import { Wallpaper } from "../../components/wallpaper"
import { Header } from "../../components/header"
import { TextField } from "../../components/text-field"
import { color, spacing } from "../../theme"
import { logoIgnite, heart } from "./"
import { BulletItem } from "../../components/bullet-item"
import { Api } from "../../services/api"
import { save } from "../../utils/storage"
import { Checkbox } from "../../components/checkbox"

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

const inputStyleArray: TextStyle[] = [
  {
    backgroundColor: "rebeccapurple",
    color: "white",
    padding: 1,
  },
  {
    borderWidth: 2,
    borderRadius: 6,
    borderColor: "#7fff00",
  },
]

export interface CheckoutScreen extends NavigationScreenProps<{}> {}

export const CheckoutScreen: React.FunctionComponent<CheckoutScreen> = props => {
  const [items, setItems] = React.useState(false)
  const [total, setTotal] = React.useState(0)
  const [card, setCard] = React.useState("")
  const [success, setSuccess] = React.useState(false)
  const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])

  React.useEffect(() => {
    setItems(props.navigation.getParam("data"))
  }, [])

  React.useEffect(() => {
    getTotal()
  }, [items])

  const getTotal = () => {
    let total = 0
    for (let key in items) {
      total = total + parseFloat(items[key].price)
    }
    setTotal(total)
  }

  const returnList = () => {
    return Object.keys(items).map(key => (
      <BulletItem text={`${items[key].name} - R$: ${items[key].price}`} />
    ))
  }

  const checkRender = () => {
    if (success) {
      return (
        <>
          <Text style={TITLE} preset="header" text={"Compra realizada com sucesso"} />
          <Text
            style={TAGLINE}
            text="obrigado pela compra, pressione o botao abaixo para voltar ao inicio"
          />
          <View>
            <Button
              style={DEMO}
              textStyle={DEMO_TEXT}
              text="inicio"
              onPress={() => props.navigation.popToTop()}
            />
          </View>
        </>
      )
    } else {
      return (
        <>
          <Text style={TITLE} preset="header" text={"Finalizar compra"} />
          {returnList()}
          <BulletItem text={`Total: R$ ${total}`} />
          <TextField
            inputStyle={inputStyleArray}
            onChangeText={value => setCard(value)}
            value={card}
            label="numero do cartao"
          />
          <View>
            <Button
              style={DEMO}
              textStyle={DEMO_TEXT}
              text="finalizar"
              onPress={() => setSuccess(true)}
            />
          </View>
        </>
      )
    }
  }

  return (
    <View style={FULL}>
      <Wallpaper />
      <Screen style={CONTAINER} preset="scroll" backgroundColor={color.transparent}>
        <Header
          headerText="Checkout"
          leftIcon="back"
          onLeftPress={goBack}
          style={{ color: "black" }}
          style={HEADER}
          titleStyle={HEADER_TITLE}
        />
        {checkRender()}
      </Screen>
    </View>
  )
}
