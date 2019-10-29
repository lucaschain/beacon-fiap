import { ReactNode } from 'react'

export interface BeaconProps {
  identifier: string,
  uuid: string,
  noBeaconMessage: string,
  children?: ReactNode
}
