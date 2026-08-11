import { useQuery } from '@tanstack/react-query'
import { getScanStatus } from '../api/scan.api'

export function useScanStatus(enabled: boolean) {
  return useQuery({
    queryKey: ['scan-status'],
    queryFn: getScanStatus,
    enabled,
    refetchInterval: 2000,
  })
}
