// src/hooks/useUpdateFriendlyName.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateFriendlyName } from '../api/devices'

export function useUpdateFriendlyName() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, friendlyName }: { id: number; friendlyName: string }) =>
      updateFriendlyName(id, friendlyName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] })
    },
  })
}