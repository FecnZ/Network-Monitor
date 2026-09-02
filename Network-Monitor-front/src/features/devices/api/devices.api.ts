import { apiClient } from '../../../shared/api/client'
import type { Device, DeviceHistoryEntry } from '../types/device.types'
import { parseDevice, parseDevices, parseDeviceHistory } from './devices.schema'


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

export async function getDeviceHistory(
  id: number,
  limit: number = 50,
): Promise<DeviceHistoryEntry[]> {
  const response = await apiClient.get(`/devices/${id}/history`, {
    params: { limit },
  })
  return parseDeviceHistory(response.data)
}
