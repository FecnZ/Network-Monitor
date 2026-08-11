import { apiClient } from '../../../shared/api/client'
import { parseDevice, parseDevices } from './devices.schema'
import type { Device } from '../types/device.types'

export async function getDevices(): Promise<Device[]> {
  const response = await apiClient.get('/devices')
  return parseDevices(response.data)
}

export async function updateFriendlyName(
  id: number,
  friendlyName: string,
): Promise<Device> {
  const response = await apiClient.patch(`/devices/${id}`, { friendlyName })
  return parseDevice(response.data)
}
