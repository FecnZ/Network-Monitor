import { z } from 'zod'

const ScanStatusSchema = z.object({
  inProgress: z.boolean(),
})

export function parseScanStatus(data: unknown) {
  return ScanStatusSchema.parse(data)
}
