import { useMutation, useQueryClient } from '@tanstack/react-query'
import { triggerScan } from '../api/scan.api'

export function useTriggerScan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: triggerScan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] })
    },
  })
}
