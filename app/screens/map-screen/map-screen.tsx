import * as React from "react"
import Geolocation from "@react-native-community/geolocation"
import { NavigationScreenProps } from "react-navigation"
import { Api } from "../../services/api"
import MapView from "react-native-maps"
import { Marker } from "react-native-maps"
import { View, ViewStyle } from "react-native"
import { Screen } from "../../components/screen"
import { Beacon } from "../../components/beacon"
import { Checkbox } from "../../components/Checkbox"
import { color, spacing } from "../../theme"

const FULL: ViewStyle = { flex: 1, backgroundColor: "#20162D" }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingTop: spacing[4],
}

export interface MapScreen extends NavigationScreenProps<{}> {}
export const MapScreen: React.FunctionComponent<MapScreen> = props => {
  const nextScreen = React.useMemo(() => obj => props.navigation.navigate("menu", obj), [
    props.navigation,
  ])
  const [userLocation, setUserLocation] = React.useState(false)
  const [markers, setMarkers] = React.useState(false)
  console.disableYellowBox = true

  const getUserLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        })
      },
      error => console.log(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    )
  }

  React.useEffect(() => {
    getUserLocation()
  }, [])

  const getPlacesNearBy = async () => {
    const API = new Api()
    API.setup()
    const apiResponse = await API.getPlaces(userLocation.latitude, userLocation.longitude, "bar")
    setMarkers(apiResponse.results)
  }

  React.useEffect(() => {
    getPlacesNearBy()
  }, [userLocation])

  const renderMarkers = () => {
    if (markers) {
      return markers.map(marker => (
        <Marker
          onCalloutPress={() => nextScreen({ name: marker.name, description: marker.vicinity })}
          id={marker.id}
          coordinate={{
            latitude: marker.geometry.location.lat,
            longitude: marker.geometry.location.lng,
          }}
          title={marker.name}
          description={marker.vicinity}
        />
      ))
    }
  }

  return (
    <View style={FULL}>
      <Screen style={CONTAINER} backgroundColor={color.transparent}>
        <Beacon
          identifier="loja"
          uuid="123e4567-e89b-12d3-a456-426655440000"
          noBeaconMessage="Você precisa estar no restaurante pra pagar"
        >
          <MapView style={{ flex: 1 }} showsUserLocation initialRegion={userLocation}>
            {renderMarkers()}
          </MapView>
        </Beacon>
      </Screen>
    </View>
  )
}
