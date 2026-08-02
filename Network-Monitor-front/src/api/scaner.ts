
import { apiClient } from './client'


export async function triggerScan(): Promise<void> {
  await apiClient.post('/scan/trigger')
}
export async function getScanStatus(): Promise<{ inProgress: boolean }> {
  const response = await apiClient.get<{ inProgress: boolean }>('/scan/status')
  return response.data
}