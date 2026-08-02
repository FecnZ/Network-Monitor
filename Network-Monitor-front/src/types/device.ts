// src/types/device.ts
export interface Port {
  portNumber: number
  protocol: string
  service: string
  state: string
}

export interface Device {
  id: number
  ipAddress: string
  macAddress: string | null
  hostname: string
  friendlyName: string | null
  vendor: string | null
  known: boolean
  online: boolean
  firstSeen: string
  lastSeen: string
  ports: Port[]
}