// src/api/devices.ts
import { apiClient } from './client'
import type { Device } from '../types/device'

export async function getDevices(): Promise<Device[]> {
  const response = await apiClient.get<Device[]>('/devices')
  return response.data
}



export async function updateFriendlyName(id: number, friendlyName: string): Promise<Device> {
  const response = await apiClient.patch<Device>(`/devices/${id}`, { friendlyName })
  return response.data
}


