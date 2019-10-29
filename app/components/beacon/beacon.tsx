import * as React from 'react'
import { useState } from 'react'
import { Platform, View, DeviceEventEmitter } from 'react-native'
import { Text } from '../text'
import { BeaconProps } from './beacon.props'
import Beacons from 'react-native-beacons-manager'

const noBeacon = (props) => (
  <Text text={props.noBeaconMessage} />
)

export function Beacon(props: BeaconProps) {
  const { identifier, uuid } = props
  const [beacons, setBeacons] = useState([])

  if (Platform.OS === 'ios') {
    Beacons.requestWhenInUseAuthorization()
  }

  Beacons.detectIBeacons()

  const region = { identifier, uuid }
  Beacons
    .startRangingBeaconsInRegion(region)
    .catch((error) => {
      console.log(error)
    })

  DeviceEventEmitter.addListener('beaconsDidRange', (data) => {
    if (data.beacons) {
      setBeacons(data.beacons)
    }
  })

  return (
    <View>
      {beacons.length > 0 ? props.children : noBeacon(props)}
    </View>
  )
}
