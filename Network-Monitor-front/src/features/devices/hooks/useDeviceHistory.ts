import { useQuery } from '@tanstack/react-query'
import { getDeviceHistory } from '../api/devices.api'

export function useDeviceHistory(deviceId: number | null, limit: number = 50) {
  return useQuery({
    queryKey: ['devices', deviceId, 'history', limit],
    queryFn: () => {
      if (deviceId === null) throw new Error('Device ID is required')
      return getDeviceHistory(deviceId, limit)
    },
    enabled: deviceId !== null,
  })
}
