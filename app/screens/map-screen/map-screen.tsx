import * as React from "react"
import Geolocation from "@react-native-community/geolocation"
import { Api } from "../../services/api"
import MapView from "react-native-maps"
import { Marker } from "react-native-maps"
import { View, ViewStyle } from "react-native"
import { Screen } from "../../components/screen"
import { color, spacing } from "../../theme"

const FULL: ViewStyle = { flex: 1, backgroundColor: "#20162D" }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingTop: spacing[4],
}

export const MapScreen = () => {
  const [userLocation, setUserLocation] = React.useState(false)
  const [markers, setMarkers] = React.useState(false)
  console.disableYellowBox = true

  const getUserLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
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
    const markers = await API.getPlaces(userLocation.latitude, userLocation.longitude, "bar")
    setMarkers(markers)
  }

  React.useEffect(() => {
    getPlacesNearBy()
  }, [userLocation])

  const renderMarkers = () => {
    if (markers) {
      return markers.map(marker => (
        <Marker
          id={marker.id}
          coordinate={{
            latitude: marker.geometry.location.lat,
            longitude: marker.geometry.location.lng,
          }}
          title={marker.name}
          description={marker.vicinity}
        />
      ))
    } else {
      console.log("no markers")
    }
  }

  return (
    <View style={FULL}>
      <Screen style={CONTAINER} backgroundColor={color.transparent}>
        <MapView style={{ flex: 1 }} showsUserLocation initialRegion={userLocation}>
          {renderMarkers()}
        </MapView>
      </Screen>
    </View>
  )
}
