
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { triggerScan } from '../api/scaner'

export function useTriggerScan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: triggerScan,
    onSuccess: () => {
      // Cuando el escaneo termina, invalida la lista de dispositivos
      // para que React Query la vuelva a pedir inmediatamente
      queryClient.invalidateQueries({ queryKey: ['devices'] })
    },
  })
}