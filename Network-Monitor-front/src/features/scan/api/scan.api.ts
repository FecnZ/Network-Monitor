import { apiClient } from '../../../shared/api/client'
import { parseScanStatus } from './scan.schema'

export async function triggerScan(): Promise<void> {
  await apiClient.post('/scan/trigger')
}

export async function getScanStatus(): Promise<{ inProgress: boolean }> {
  const response = await apiClient.get('/scan/status')
  return parseScanStatus(response.data)
}
