import { z } from 'zod'

const PortSchema = z.object({
  numberPort: z.number(),
  protocol: z.string(),
  service: z.string(),
  state: z.string(),
})

const DeviceSchema = z.object({
  id: z.number(),
  ipAddress: z.string(),
  macAddress: z.string().nullable(),
  hostname: z.string(),
  friendlyName: z.string().nullable(),
  vendor: z.string().nullable(),
  known: z.boolean(),
  online: z.boolean(),
  firstSeen: z.string(),
  lastSeen: z.string(),
  ports: z.array(PortSchema),
})

const DeviceListSchema = z.array(DeviceSchema)

export function parseDevices(data: unknown) {
  return DeviceListSchema.parse(data)
}

export function parseDevice(data: unknown) {
  return DeviceSchema.parse(data)
}

const DeviceHistorySchema = z.object({
  id: z.number(),
  timestamp: z.string(),
  online: z.boolean(),
})

const DeviceHistoryListSchema = z.array(DeviceHistorySchema)

export function parseDeviceHistory(data: unknown) {
  return DeviceHistoryListSchema.parse(data)
}
