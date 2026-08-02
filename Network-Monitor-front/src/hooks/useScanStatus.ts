// src/hooks/useScanStatus.ts
import { useQuery } from '@tanstack/react-query'
import { getScanStatus } from '../api/scaner'

export function useScanStatus(enabled: boolean) {
  return useQuery({
    queryKey: ['scan-status'],
    queryFn: getScanStatus,
    enabled,               // solo hace polling cuando se lo pedimos
    refetchInterval: 2000, // pregunta cada 2 segundos mientras esté activo
  })
}